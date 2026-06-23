import { getAnthropic } from "./anthropic";
import {
  INDUCTION_JSON_HINT,
  INDUCTION_TOOL_NAME,
  INDUCTION_TOOL_SCHEMA,
} from "./engine/prompts";

// ---------------------------------------------------------------------------
// Provider-agnostic LLM access. Lantern's value is the honest amplification
// mechanism, not any single vendor, so the engine runs on whatever key is
// present: Gemini (free tier), Anthropic (Claude), or neither (fixtures).
// ---------------------------------------------------------------------------

export type Provider = "anthropic" | "gemini" | "openai";

export function activeProvider(): Provider | null {
  if (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY) return "gemini";
  if (process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY) return "openai";
  if (process.env.ANTHROPIC_API_KEY) return "anthropic";
  return null;
}

// Any OpenAI-compatible endpoint: Groq, OpenRouter, Cerebras, Together, GitHub
// Models, or OpenAI itself. Groq is the easiest free, no-card option.
function openaiConfig() {
  const isGroq = Boolean(process.env.GROQ_API_KEY);
  return {
    key: process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY || "",
    baseUrl:
      process.env.OPENAI_BASE_URL ||
      (isGroq ? "https://api.groq.com/openai/v1" : "https://api.openai.com/v1"),
    model:
      process.env.OPENAI_MODEL ||
      (isGroq ? "llama-3.3-70b-versatile" : "gpt-4o-mini"),
  };
}

export function hasLLMKey(): boolean {
  return activeProvider() !== null;
}

export function activeModel(): string {
  switch (activeProvider()) {
    case "gemini":
      return process.env.GEMINI_MODEL || "gemini-2.0-flash";
    case "openai":
      return openaiConfig().model;
    case "anthropic":
      return process.env.ANTHROPIC_MODEL || "claude-opus-4-8";
    default:
      return "none";
  }
}

/** Run the induction prompt on the active provider; return the raw parsed object. */
export async function callInduction(
  system: string,
  user: string,
): Promise<unknown> {
  switch (activeProvider()) {
    case "anthropic":
      return callAnthropic(system, user);
    case "gemini":
      return callGemini(system, user);
    case "openai":
      return callOpenAI(system, user);
    default:
      throw new Error("No LLM provider configured");
  }
}

async function callOpenAI(system: string, user: string): Promise<unknown> {
  const { key, baseUrl, model } = openaiConfig();
  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      max_tokens: 8000,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: `${system}\n\n${INDUCTION_JSON_HINT}` },
        { role: "user", content: user },
      ],
    }),
  });
  if (!res.ok) {
    throw new Error(`OpenAI-compatible ${res.status}: ${await res.text()}`);
  }
  const data = await res.json();
  const text: string = data?.choices?.[0]?.message?.content ?? "";
  if (!text) throw new Error("OpenAI-compatible returned empty content");
  return JSON.parse(text);
}

async function callAnthropic(system: string, user: string): Promise<unknown> {
  const client = getAnthropic();
  const res = await client.messages.create({
    model: activeModel(),
    max_tokens: 8000,
    temperature: 0.2,
    system,
    tools: [
      {
        name: INDUCTION_TOOL_NAME,
        description:
          "Report the vocabulary, grammatical patterns, and beginner lesson induced strictly from the provided corpus.",
        input_schema: INDUCTION_TOOL_SCHEMA,
      },
    ],
    tool_choice: { type: "tool", name: INDUCTION_TOOL_NAME },
    messages: [{ role: "user", content: user }],
  });
  const block = res.content.find((b) => b.type === "tool_use");
  if (!block || block.type !== "tool_use") {
    throw new Error("Anthropic returned no tool_use block");
  }
  return block.input;
}

async function callGemini(system: string, user: string): Promise<unknown> {
  const key = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  const model = activeModel();
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: `${system}\n\n${INDUCTION_JSON_HINT}` }] },
      contents: [{ role: "user", parts: [{ text: user }] }],
      generationConfig: {
        temperature: 0.2,
        responseMimeType: "application/json",
        maxOutputTokens: 8192,
      },
    }),
  });

  if (!res.ok) {
    throw new Error(`Gemini ${res.status}: ${await res.text()}`);
  }

  const data = await res.json();
  const text: string =
    data?.candidates?.[0]?.content?.parts
      ?.map((p: { text?: string }) => p.text ?? "")
      .join("") ?? "";
  if (!text) throw new Error("Gemini returned empty content");
  return JSON.parse(text);
}
