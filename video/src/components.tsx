import type { CSSProperties, ReactNode } from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C, DISPLAY, SANS } from "./theme";

/** Dark canvas with a low lantern glow rising from the bottom. */
export const Backdrop: React.FC<{ glow?: string; intensity?: number }> = ({
  glow = C.ember,
  intensity = 0.16,
}) => {
  const frame = useCurrentFrame() / 2; // logical 30fps frame (composition runs at 60)
  const flicker = 0.92 + 0.08 * Math.sin(frame / 7);
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(55% 45% at 50% 112%, ${glow}${Math.round(
          intensity * 255 * flicker,
        )
          .toString(16)
          .padStart(2, "0")}, transparent 70%), ${C.ink}`,
      }}
    />
  );
};

/** Fade-and-rise entrance keyed to the local sequence frame. */
export const FadeUp: React.FC<{
  children: ReactNode;
  delay?: number;
  y?: number;
  style?: CSSProperties;
}> = ({ children, delay = 0, y = 26, style }) => {
  const frame = useCurrentFrame() / 2; // logical 30fps frame (composition runs at 60)
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps: fps / 2, config: { damping: 200 } });
  const opacity = interpolate(frame, [delay, delay + 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div style={{ opacity, transform: `translateY(${(1 - s) * y}px)`, ...style }}>
      {children}
    </div>
  );
};

/** A glowing lantern flame. */
export const Flame: React.FC<{ size?: number }> = ({ size = 64 }) => {
  const frame = useCurrentFrame() / 2; // logical 30fps frame (composition runs at 60)
  const flicker = 0.85 + 0.15 * Math.sin(frame / 5) + 0.05 * Math.sin(frame / 2.3);
  return (
    <div
      style={{
        width: size,
        height: size,
        position: "relative",
        display: "grid",
        placeItems: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: -size * 0.5,
          background: `radial-gradient(circle, ${C.ember}${Math.round(
            flicker * 90,
          )
            .toString(16)
            .padStart(2, "0")}, transparent 65%)`,
          filter: "blur(6px)",
        }}
      />
      <svg width={size} height={size} viewBox="0 0 24 24" style={{ position: "relative" }}>
        <path
          d="M12 2c1.5 3 4.5 5 4.5 9a4.5 4.5 0 0 1-9 0c0-1.5.7-2.6 1.5-3.5C9.8 8.8 11 7 12 2z"
          fill={C.flame}
          opacity={flicker}
        />
        <path
          d="M12 8.5c.9 1.4 2 2.4 2 4.2a2 2 0 0 1-4 0c0-1 .7-1.8 1.2-2.4.3-.4.6-1 .8-1.8z"
          fill={C.emberDeep}
        />
      </svg>
    </div>
  );
};

export const Logo: React.FC<{ size?: number }> = ({ size = 64 }) => (
  <div style={{ display: "flex", alignItems: "center", gap: size * 0.28 }}>
    <Flame size={size} />
    <span
      style={{
        fontFamily: DISPLAY,
        fontSize: size * 1.1,
        color: C.cream,
        letterSpacing: "-0.02em",
        fontWeight: 500,
      }}
    >
      Lantern
    </span>
  </div>
);

/** Count-up number keyed to the local frame. */
export const AnimatedNumber: React.FC<{
  value: number;
  durationInFrames?: number;
  suffix?: string;
  style?: CSSProperties;
}> = ({ value, durationInFrames = 40, suffix = "", style }) => {
  const frame = useCurrentFrame() / 2; // logical 30fps frame (composition runs at 60)
  const t = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const eased = 1 - Math.pow(1 - t, 3);
  const n = Math.round(eased * value);
  return (
    <span style={style}>
      {n.toLocaleString()}
      {suffix}
    </span>
  );
};

// Reusable text style presets.
export const display = (size: number, color: string = C.cream): CSSProperties => ({
  fontFamily: DISPLAY,
  fontSize: size,
  color,
  letterSpacing: "-0.02em",
  lineHeight: 1.05,
  fontWeight: 500,
  textAlign: "center",
});

export const sans = (size: number, color: string = C.muted): CSSProperties => ({
  fontFamily: SANS,
  fontSize: size,
  color,
  lineHeight: 1.5,
  textAlign: "center",
});

export const gradientText: CSSProperties = {
  background: `linear-gradient(120deg, ${C.flame}, ${C.ember} 45%, ${C.emberDeep})`,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
};

export const Center: React.FC<{ children: ReactNode; style?: CSSProperties }> = ({
  children,
  style,
}) => (
  <AbsoluteFill
    style={{
      justifyContent: "center",
      alignItems: "center",
      padding: 120,
      ...style,
    }}
  >
    {children}
  </AbsoluteFill>
);
