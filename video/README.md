# 🏮 Lantern, promo video (Remotion)

A 61-second animated promo for Lantern, built in [Remotion](https://remotion.dev). Brand-matched to the app (Fraunces + Inter, ember + pounamu). Drop in your screen recording and voiceover, then render.

## Preview / edit

```bash
npm run dev        # opens Remotion Studio, scrub, edit, hot-reload
```

## Render

```bash
npm run render     # → out/lantern-promo.mp4  (1920×1080, 30fps)
npm run still      # → out/still.png  (single frame, for thumbnails)
```

## The timeline (sync your voiceover to these)

| # | Scene | Frames | ~Time | Beat |
|---|---|---|---|---|
| 1 | Cold open | 0–120 | 0:00–0:04 | "A language falls silent every two weeks." |
| 2 | The stakes | 120–360 | 0:04–0:12 | 7,000 / 3,000+ / 1 · "The bottleneck was time." |
| 3 | Meet Lantern | 360–510 | 0:12–0:17 | logo + "Carry the light forward." |
| 4 | The mechanism | 510–930 | 0:17–0:31 | Seed → Induce → Learn → Grow |
| 5 | The honest engine | 930–1140 | 0:31–0:38 | "We never invent a word." |
| 6 | **Demo slot** | 1140–1440 | 0:38–0:48 | **your screen recording goes here** |
| 7 | The vision | 1440–1650 | 0:48–0:55 | the Ark · "Room for 3,000 more." |
| 8 | Close | 1650–1830 | 0:55–1:01 | the closing line + logo |

## Add your screen recording (scene 6)

1. Record the app (the workspace, the induced grammar, the contribute → re-induce flywheel). Aim for ~10s, 1920×1080.
2. Save it to `public/demo-workspace.mp4`.
3. In `src/scenes.tsx`, in `DemoSlot`, replace the dashed placeholder box with:

```tsx
import { OffthreadVideo, staticFile } from "remotion";
// ...inside <Center>:
<OffthreadVideo
  src={staticFile("demo-workspace.mp4")}
  style={{ width: 1500, borderRadius: 28 }}
/>
```

## Add a voiceover

1. Save your narration to `public/voiceover.mp3`.
2. In `src/LanternPromo.tsx`, add inside `<AbsoluteFill>` (above `<Series>`):

```tsx
import { Audio, staticFile } from "remotion";
<Audio src={staticFile("voiceover.mp3")} />
```

If your VO runs longer or shorter than 61s, adjust the per-scene `frames` in `src/LanternPromo.tsx` to match your pacing.

## Add background music (optional)

Same pattern as voiceover, with a lower volume:

```tsx
<Audio src={staticFile("music.mp3")} volume={0.18} />
```
