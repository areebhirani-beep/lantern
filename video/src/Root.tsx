import { Composition } from "remotion";
import { LanternPromo, PROMO_DURATION } from "./LanternPromo";

export const RemotionRoot: React.FC = () => (
  <Composition
    id="LanternPromo"
    component={LanternPromo}
    durationInFrames={PROMO_DURATION}
    fps={60}
    width={1920}
    height={1080}
  />
);
