import Anthropic from "@anthropic-ai/sdk";

// Opus for the deepest linguistic reasoning. Override with ANTHROPIC_MODEL.
export const ANTHROPIC_MODEL =
  process.env.ANTHROPIC_MODEL || "claude-opus-4-8";

export function hasAnthropicKey(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

let client: Anthropic | null = null;

/** Lazily-constructed singleton Anthropic client (server-only). */
export function getAnthropic(): Anthropic {
  if (!client) {
    client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return client;
}
