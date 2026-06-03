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
    const {
      propertyType, address, bedrooms, bathrooms,
      squareFootage, sizeUnit, features, tone,
      targetAudience, additionalDetails,
    } = body;

    const supabase = createServerSupabaseClient();
    const { data: profile } = await supabase
      .from("profiles")
      .select("id, subscription_tier, generation_count_this_month, generation_reset_date, market_location")
      .eq("clerk_user_id", userId)
      .single();

    if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });


    // Reset monthly count if new period started
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

    const prompt = `Create a professional MLS property listing description and a short teaser version.

PROPERTY DETAILS:
- Type: ${propertyType}
- Address/Location: ${address}
- Bedrooms: ${bedrooms}
- Bathrooms: ${bathrooms}
- Size: ${squareFootage} ${sizeUnit || "sq ft"}
- Key Features: ${Array.isArray(features) ? features.join(", ") : features || "None listed"}
- Tone: ${tone}
- Target Buyer: ${targetAudience}
- Additional Details: ${additionalDetails || "None"}
- Agent's market: ${profile.market_location || "US"}

OUTPUT FORMAT (return exactly this structure):
LISTING_DESCRIPTION:
[Full listing description, 150-280 words. Compelling, specific, no clichés.]

SHORT_TEASER:
[2-3 sentence teaser for portals and social media previews, max 60 words.]`;

    const { content, inputTokens, outputTokens } = await generateContent(prompt, 800);

    const listingMatch = content.match(/LISTING_DESCRIPTION:\n([\s\S]*?)(?=SHORT_TEASER:|$)/);
    const teaserMatch = content.match(/SHORT_TEASER:\n([\s\S]*?)$/);
    const listingDescription = listingMatch?.[1]?.trim() ?? content;
    const shortTeaser = teaserMatch?.[1]?.trim() ?? "";

    await supabase.from("generations").insert({
      profile_id: profile.id,
      tool_type: "listing_description",
      input_data: body,
      output_text: content,
      tokens_used: inputTokens + outputTokens,
    });

    await supabase.from("profiles").update({
      generation_count_this_month: currentCount + 1,
    }).eq("id", profile.id);

    return NextResponse.json({ listingDescription, shortTeaser, tokensUsed: inputTokens + outputTokens });
  } catch (error) {
    console.error("Listing generation error:", error);
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }
}
