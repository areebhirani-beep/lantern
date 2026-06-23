import { AbsoluteFill, Series } from "remotion";
import { C } from "./theme";
import {
  Close,
  ColdOpen,
  DemoSlot,
  HonestEngine,
  Mechanism,
  MeetLantern,
  SiteOutro,
  Stakes,
  Vision,
} from "./scenes";

// Durations are at 60fps. Each scene's internal animation timings are authored
// in logical 30fps frames (useCurrentFrame() / 2), so these are simply doubled.
const SCENES: { c: React.FC; frames: number }[] = [
  { c: ColdOpen, frames: 360 },     // 6s
  { c: Stakes, frames: 660 },       // 11s
  { c: MeetLantern, frames: 780 },  // 13s
  { c: Mechanism, frames: 1080 },   // 18s
  { c: HonestEngine, frames: 660 }, // 11s
  { c: DemoSlot, frames: 2100 },    // 35s (length of the recording)
  { c: Vision, frames: 600 },       // 10s
  { c: Close, frames: 540 },        // 9s
  { c: SiteOutro, frames: 420 },    // 7s, the live site + URL
];

export const PROMO_DURATION = SCENES.reduce((n, s) => n + s.frames, 0); // 7200 = 120s at 60fps

export const LanternPromo: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.ink }}>
    <Series>
      {SCENES.map(({ c: Scene, frames }, i) => (
        <Series.Sequence key={i} durationInFrames={frames}>
          <Scene />
        </Series.Sequence>
      ))}
    </Series>
  </AbsoluteFill>
);
