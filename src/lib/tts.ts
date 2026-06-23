// Client-side pronunciation via the Web Speech API. Free, no key, in-browser.
// Voices for endangered languages rarely exist, so we match the closest
// available voice and fall back gracefully, pronunciation is a guide, and the
// UI says so honestly.

export function ttsSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function pickVoice(lang?: string): SpeechSynthesisVoice | undefined {
  if (!lang) return undefined;
  const voices = window.speechSynthesis.getVoices();
  const exact = voices.find((v) => v.lang?.toLowerCase() === lang.toLowerCase());
  if (exact) return exact;
  const base = lang.split("-")[0].toLowerCase();
  return voices.find((v) => v.lang?.toLowerCase().startsWith(base));
}

export function speak(text: string, lang?: string): void {
  if (!ttsSupported() || !text) return;
  const synth = window.speechSynthesis;
  synth.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  if (lang) utter.lang = lang;
  const voice = pickVoice(lang);
  if (voice) utter.voice = voice;
  utter.rate = 0.82;
  utter.pitch = 1;
  synth.speak(utter);
}
