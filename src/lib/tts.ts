// Client-side pronunciation via the Web Speech API. Free, no key, in-browser.
// Voices for endangered languages rarely exist, so we match the closest
// available voice and fall back gracefully — pronunciation is a guide, and the
// UI says so honestly.

export function ttsSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

// Chrome loads voices asynchronously; getVoices() is [] on the first call, which
// used to make the very first click silent. Warm the list once on the client.
let warmed = false;
export function primeTTS(): void {
  if (warmed || !ttsSupported()) return;
  warmed = true;
  window.speechSynthesis.getVoices();
  try {
    window.speechSynthesis.addEventListener("voiceschanged", () => {
      window.speechSynthesis.getVoices();
    });
  } catch {
    /* older browsers: onvoiceschanged isn't an EventTarget; getVoices above suffices */
  }
}

function pickVoice(lang?: string): SpeechSynthesisVoice | undefined {
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return undefined;
  if (lang) {
    const l = lang.toLowerCase();
    const exact = voices.find((v) => v.lang?.toLowerCase() === l);
    if (exact) return exact;
    const base = l.split("-")[0];
    const near = voices.find((v) => v.lang?.toLowerCase().startsWith(base));
    if (near) return near;
  }
  // No voice for this (usually unsupported) endangered-language tag → use the
  // default voice so the word is still spoken aloud, as an honest guide.
  return voices.find((v) => v.default) ?? voices[0];
}

export function speak(text: string, lang?: string): void {
  if (!ttsSupported() || !text) return;
  primeTTS();
  const synth = window.speechSynthesis;
  synth.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  const voice = pickVoice(lang);
  if (voice) {
    utter.voice = voice;
    // Align the utterance lang to the chosen voice. Setting an unsupported lang
    // (e.g. "mi") with no matching voice is exactly what made Chrome stay silent.
    utter.lang = voice.lang;
  }
  // If no voice resolved yet (voices still loading), leave lang unset so the
  // browser's default voice speaks rather than failing silently.
  utter.rate = 0.82;
  utter.pitch = 1;
  synth.speak(utter);
}
