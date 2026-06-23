import { AbsoluteFill, Series } from "remotion";
import { C } from "./theme";
import {
  Close,
  ColdOpen,
  DemoSlot,
  HonestEngine,
  Mechanism,
  MeetLantern,
  Stakes,
  Vision,
} from "./scenes";

// Durations are at 60fps. Each scene's internal animation timings are authored
// in logical 30fps frames (useCurrentFrame() / 2), so these are simply doubled.
const SCENES: { c: React.FC; frames: number }[] = [
  { c: ColdOpen, frames: 240 },
  { c: Stakes, frames: 480 },
  { c: MeetLantern, frames: 300 },
  { c: Mechanism, frames: 840 },
  { c: HonestEngine, frames: 420 },
  { c: DemoSlot, frames: 2100 },
  { c: Vision, frames: 420 },
  { c: Close, frames: 360 },
];

export const PROMO_DURATION = SCENES.reduce((n, s) => n + s.frames, 0); // 5160 = 86s at 60fps

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
