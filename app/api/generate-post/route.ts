import { NextResponse } from "next/server";
import { log, logError } from "@/lib/logger";
import { queryGemini } from "@/lib/gemini";
import { allowRequest } from "@/lib/ratelimiter";
import { RequestSchema } from "@/schemas/postSchemas";
import { validateTextFields } from "@/lib/inputValidator";
import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const { allowed, retryAfter } = allowRequest(ip);

    if (!allowed && retryAfter) {
      logError(`Rate limit exceeded for ${ip}`);

      return NextResponse.json(
        {
          success: false,
          error: `Rate limit exceeded. Try again in ${Math.ceil(
            retryAfter / 1000
          )} seconds.`,
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    let parsed;

    try {
      parsed = RequestSchema.parse(body);
      validateTextFields(parsed, [
        "topic",
        "tone",
        "platform",
        "audience",
        "goal",
        "postType",
      ]);
    } 
    catch (err: any) {
      logError("Validation failed", err.errors || err);

      return NextResponse.json(
        {
          success: false,
          error: "Invalid request body.",
          details: JSON.parse(err),
        },
        { status: 400 }
      );
    }

    const { topic, tone, platform, count = 1, audience, postType, goal } =
      parsed;

    const prompt = `
You are a professional social media strategist and input validator.

You will receive a user prompt that might contain spam, random, or vague input. 
First, validate all fields, especially the "topic". If the topic is meaningless, spammy, or nonsensical (e.g. random characters or irrelevant words), respond with:

{
  "valid": false,
  "reason": "Invalid or nonsensical topic."
}

Otherwise, if the topic makes sense:
1. Clean all other fields using sensible defaults where needed.
2. Then generate ${count} post ideas based on the corrected input.

Default corrections:
- tone → "engaging"
- platform → "social media"
- audience → "general users"
- postType → "general"
- goal → "engagement"

Return only valid JSON in this format:
{
  "valid": true,
  "corrected_inputs": {
    "topic": "string",
    "count": number,
    "tone": "string",
    "platform": "string",
    "audience": "string",
    "postType": "string",
    "goal": "string"
  },
  "ideas": [
    {
      "caption": "string",
      "hashtags": ["string", "string", ...],
      "image_keywords": ["string", "string", ...]
    }
  ]
}

Do not include markdown, code blocks, or explanations.

User input:
{
  "topic": "${topic}",
  "count": ${count},
  "tone": "${tone}",
  "platform": "${platform}",
  "audience": "${audience}",
  "postType": "${postType}",
  "goal": "${goal}"
}
`;

    log("Sending prompt...");

    const responseText = await queryGemini(prompt);

    const cleanedResponse = responseText
      .trim()
      .replace(/^```json/i, "")
      .replace(/^```/, "")
      .replace(/```$/, "")
      .trim();

    let parsedResponse: any = null;

    try {
      parsedResponse = JSON.parse(cleanedResponse);
    } catch (err) {
      logError("Failed to parse Gemini output", err);
      return NextResponse.json(
        {
          success: false,
          error: "Invalid AI response format",
          raw: responseText,
        },
        { status: 500 }
      );
    }

    if (parsedResponse.valid === false) {
      logError("Rejected spam or nonsensical topic");
      return NextResponse.json(
        {
          success: false,
          error: parsedResponse.reason || "Invalid or nonsensical topic.",
        },
        { status: 400 }
      );
    }

    const correctedInputs = parsedResponse.corrected_inputs || {};
    const ideas = parsedResponse.ideas || [];

    return NextResponse.json({
      success: true,
      ...correctedInputs,
      ideas,
    });
  } 
  
  catch (error: any) {
    logError("Error in /api/generate-post", error);

    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}