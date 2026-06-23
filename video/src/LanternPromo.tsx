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

const SCENES: { c: React.FC; frames: number }[] = [
  { c: ColdOpen, frames: 120 },
  { c: Stakes, frames: 240 },
  { c: MeetLantern, frames: 150 },
  { c: Mechanism, frames: 420 },
  { c: HonestEngine, frames: 210 },
  { c: DemoSlot, frames: 1180 },
  { c: Vision, frames: 210 },
  { c: Close, frames: 180 },
];

export const PROMO_DURATION = SCENES.reduce((n, s) => n + s.frames, 0); // 1830 = 61s

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
