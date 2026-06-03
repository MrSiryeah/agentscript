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
    const { buyerNames, propertyAddress, offerPrice, buyerStrengths, personalConnection, tone } = body;

    const supabase = createServerSupabaseClient();
    const { data: profile } = await supabase
      .from("profiles")
      .select("id, subscription_tier, generation_count_this_month, generation_reset_date")
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

    const prompt = `Write a compelling offer letter / cover letter to accompany a property purchase offer.

DETAILS:
- Buyer Names: ${buyerNames}
- Property Address: ${propertyAddress}
- Offer Price: ${offerPrice}
- Buyer Strengths: ${Array.isArray(buyerStrengths) ? buyerStrengths.join(", ") : buyerStrengths || "None specified"}
- Personal Connection: ${personalConnection || "None provided"}
- Tone: ${tone}

Write the letter from the buyer's perspective (the agent is helping draft it).
Make it human, genuine, and persuasive without being desperate.
Highlight financial strength early. End with a confident, warm close.

OUTPUT FORMAT:
[Full letter, 250-380 words. No letter header/address block needed — just the body.]`;

    const { content, inputTokens, outputTokens } = await generateContent(prompt, 700);

    await supabase.from("generations").insert({
      profile_id: profile.id,
      tool_type: "offer_letter",
      input_data: body,
      output_text: content,
      tokens_used: inputTokens + outputTokens,
    });

    await supabase.from("profiles").update({
      generation_count_this_month: currentCount + 1,
    }).eq("id", profile.id);

    return NextResponse.json({ offerLetter: content, tokensUsed: inputTokens + outputTokens });
  } catch (error) {
    console.error("Offer letter generation error:", error);
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }
}
