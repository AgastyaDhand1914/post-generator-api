import { log, logError } from "@/lib/logger";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-1.5-pro-latest";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1/models/${GEMINI_MODEL}:generateContent`;

if (!GEMINI_API_KEY) {
  console.warn("Warning: No GEMINI_API_KEY found in environment");
}

export async function queryGemini(prompt: string, retries = 1): Promise<any> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);    //20s timeout

  try {
    const res = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Gemini API error: ${text}`);
    }

    const data = await res.json();

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || JSON.stringify(data);

    log("Gemini response OK");

    return text;
  } 
  catch (err: any) {
    logError("Gemini request failed", err);
    if (retries > 0) {
      log(`Retrying Gemini request (${retries})`);
      return queryGemini(prompt, retries - 1);
    }
    
    throw new Error(`HF request failed: ${err.message}`);
  }
}