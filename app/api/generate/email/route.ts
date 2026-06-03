import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { generateContent } from "@/lib/anthropic";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { MONTHLY_LIMITS } from "@/types";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { leadName, howWeMet, propertyInterest, leadSituation, followUpType, tone } = body;

    const supabase = createServerSupabaseClient();
    const { data: profile } = await supabase
      .from("profiles")
      .select("id, subscription_tier, generation_count_this_month, generation_reset_date, market_location, full_name, agency_name")
      .eq("clerk_user_id", userId)
      .single();

    if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

    const now = new Date();
    let currentCount = profile.generation_count_this_month;
    if (now >= new Date(profile.generation_reset_date)) {
      await supabase.from("profiles").update({
        generation_count_this_month: 0,
        generation_reset_date: new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString(),
      }).eq("id", profile.id);
      currentCount = 0;
    }

    const limit = MONTHLY_LIMITS[profile.subscription_tier] ?? 10;
    if (currentCount >= limit) {
      return NextResponse.json({ error: "Monthly limit reached", upgrade: true }, { status: 429 });
    }

    const prompt = `Write a follow-up email from a real estate agent to a lead.

DETAILS:
- Lead Name: ${leadName}
- How We Met: ${howWeMet}
- Property Interest: ${propertyInterest || "Not specified"}
- Their Situation: ${leadSituation}
- Follow-up Type: ${followUpType}
- Tone: ${tone}
- Agent's Name: ${profile.full_name || "Your Agent"}
- Agency: ${profile.agency_name || ""}
- Market: ${profile.market_location || "US"}

OUTPUT FORMAT:
SUBJECT: [email subject line]

BODY:
[Full email body. Personal, direct, ends with a clear and easy next step. No generic openers like "I hope this email finds you well." Max 180 words.]`;

    const { content, inputTokens, outputTokens } = await generateContent(prompt, 600);

    const subjectMatch = content.match(/SUBJECT:\s*(.+)/);
    const bodyMatch = content.match(/BODY:\n([\s\S]*?)$/);
    const subject = subjectMatch?.[1]?.trim() ?? "Following up";
    const emailBody = bodyMatch?.[1]?.trim() ?? content;

    await supabase.from("generations").insert({
      profile_id: profile.id,
      tool_type: "follow_up_email",
      input_data: body,
      output_text: content,
      tokens_used: inputTokens + outputTokens,
    });

    await supabase.from("profiles").update({
      generation_count_this_month: currentCount + 1,
    }).eq("id", profile.id);

    return NextResponse.json({ subject, emailBody, tokensUsed: inputTokens + outputTokens });
  } catch (error) {
    console.error("Email generation error:", error);
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }
}
