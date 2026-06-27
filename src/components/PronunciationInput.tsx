"use client";

import { useRef, useState } from "react";
import { Mic, Square, Upload, Trash2, Volume2 } from "lucide-react";

// Optional speaker-pronunciation capture: record from the mic, or upload a clip.
// Hands the captured Blob up to the parent, which stores it on submit.
export function PronunciationInput({ onAudio }: { onAudio: (clip: Blob | null) => void }) {
  const [recording, setRecording] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const recRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const fileRef = useRef<HTMLInputElement | null>(null);

  function setClip(blob: Blob | null) {
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return blob ? URL.createObjectURL(blob) : null;
    });
    onAudio(blob);
  }

  async function startRec() {
    setNote(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      chunksRef.current = [];
      rec.ondataavailable = (e) => e.data.size && chunksRef.current.push(e.data);
      rec.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        setClip(new Blob(chunksRef.current, { type: rec.mimeType || "audio/webm" }));
      };
      rec.start();
      recRef.current = rec;
      setRecording(true);
    } catch {
      setNote("Mic unavailable — you can upload a clip instead.");
    }
  }

  function stopRec() {
    recRef.current?.stop();
    setRecording(false);
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) {
      setNote(null);
      setClip(f);
    }
  }

  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-muted">
        Pronunciation <span className="text-faint">(optional — let learners hear it)</span>
      </label>

      {previewUrl ? (
        <div className="flex items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3">
          <Volume2 className="h-4 w-4 shrink-0 text-ember" />
          <audio src={previewUrl} controls className="h-9 w-full" />
          <button
            type="button"
            onClick={() => setClip(null)}
            aria-label="Remove recording"
            className="shrink-0 text-faint transition-colors hover:text-rose-300"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={recording ? stopRec : startRec}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors ${
              recording
                ? "border-rose-400/50 bg-rose-400/10 text-rose-300"
                : "border-line text-muted hover:border-ember/50 hover:text-cream"
            }`}
          >
            {recording ? <Square className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
            {recording ? "Stop" : "Record"}
          </button>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-muted transition-colors hover:border-ember/50 hover:text-cream"
          >
            <Upload className="h-3.5 w-3.5" /> Upload
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="audio/*"
            onChange={onFile}
            className="hidden"
          />
        </div>
      )}
      {note && <p className="mt-1.5 text-xs text-faint">{note}</p>}
    </div>
  );
}
