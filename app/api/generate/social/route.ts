import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { generateContent } from "@/lib/anthropic";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { ensureProfile } from "@/lib/supabase/ensure-profile";
import { MONTHLY_LIMITS } from "@/types";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { propertyDescription, postType, platforms, includeHashtags } = body;

    const supabase = createServerSupabaseClient();
    const profile = await ensureProfile(userId);


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

    const platformList = Array.isArray(platforms) ? platforms : [platforms];
    const includeAll = platformList.includes("all") || platformList.includes("All Platforms");
    const targetPlatforms = includeAll ? ["Instagram", "Facebook", "LinkedIn"] : platformList;

    const prompt = `Write social media captions for a real estate post.

PROPERTY/POST DETAILS:
- Description: ${propertyDescription}
- Post Type: ${postType}
- Platforms: ${targetPlatforms.join(", ")}
- Include Hashtags: ${includeHashtags ? "Yes" : "No"}
- Agent Market: ${profile.market_location || "US"}

OUTPUT FORMAT (include only the platforms listed above):
${targetPlatforms.includes("Instagram") ? `
INSTAGRAM:
[Caption, conversational, visual language, 150-200 chars, strong hook first line]${includeHashtags ? "\n[line break]\n[10-15 relevant hashtags]" : ""}` : ""}
${targetPlatforms.includes("Facebook") ? `
FACEBOOK:
[Caption, storytelling style, 80-130 words, ends with a question or CTA]` : ""}
${targetPlatforms.includes("LinkedIn") ? `
LINKEDIN:
[Professional tone, market insight angle, 100-150 words, professional CTA]` : ""}`;

    const { content, inputTokens, outputTokens } = await generateContent(prompt, 800);

    // Parse platform sections
    const instagramMatch = content.match(/INSTAGRAM:\n([\s\S]*?)(?=FACEBOOK:|LINKEDIN:|$)/);
    const facebookMatch = content.match(/FACEBOOK:\n([\s\S]*?)(?=INSTAGRAM:|LINKEDIN:|$)/);
    const linkedinMatch = content.match(/LINKEDIN:\n([\s\S]*?)(?=INSTAGRAM:|FACEBOOK:|$)/);

    const captions: Record<string, string> = {};
    if (instagramMatch) captions.instagram = instagramMatch[1].trim();
    if (facebookMatch) captions.facebook = facebookMatch[1].trim();
    if (linkedinMatch) captions.linkedin = linkedinMatch[1].trim();

    await supabase.from("generations").insert({
      profile_id: profile.id,
      tool_type: "social_caption",
      input_data: body,
      output_text: content,
      tokens_used: inputTokens + outputTokens,
    });

    await supabase.from("profiles").update({
      generation_count_this_month: currentCount + 1,
    }).eq("id", profile.id);

    return NextResponse.json({ captions, rawContent: content, tokensUsed: inputTokens + outputTokens });
  } catch (error) {
    console.error("Social caption generation error:", error);
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }
}
