import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const SYSTEM_PROMPT = `You are an expert real estate copywriter with 15+ years of experience writing property listings, agent emails, offer letters, and social media content.

You write in a professional yet approachable tone that is:
- Specific and detail-rich (never vague or generic)
- Emotionally compelling without being cheesy
- Action-oriented (every piece should drive a response)
- Free of clichés like "gem", "must-see", "nestled", "boasting", "charming"

You understand property markets globally and can adapt language for UK, US, Australian, Maltese, and European markets.

When given property details, you create content that makes the property sound desirable, accurate, and worth viewing — without fabricating details.

Always output ONLY the requested content. No preamble, no explanation, no "Here is your listing description:". Just the content itself.`;

export interface GenerationResult {
  content: string;
  inputTokens: number;
  outputTokens: number;
}

export async function generateContent(
  userPrompt: string,
  maxTokens: number = 800
): Promise<GenerationResult> {
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: maxTokens,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userPrompt }],
  });

  const content = response.content[0];
  if (content.type !== "text") throw new Error("Unexpected response type from Claude API");

  return {
    content: content.text,
    inputTokens: response.usage.input_tokens,
    outputTokens: response.usage.output_tokens,
  };
}
