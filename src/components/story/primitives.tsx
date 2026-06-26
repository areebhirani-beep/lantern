"use client";

import { useEffect } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useMotionValue,
  useTransform,
  useMotionTemplate,
} from "framer-motion";

// ---------------------------------------------------------------------------
// Cinematic story primitives for the Lantern landing.
// ---------------------------------------------------------------------------

/** Thin ember progress bar pinned to the top of the page. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 90, damping: 20, mass: 0.3 });
  return (
    <motion.div
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-ember via-flame to-ember"
    />
  );
}

/** Words rise and resolve from a blur as they scroll into view, story unfolding. */
export function StoryReveal({
  children,
  delay = 0,
  y = 28,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-12% 0px -12% 0px" }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** An inline foreign term with a quiet, always-legible gloss. Nobody gets lost. */
export function Gloss({
  term,
  meaning,
  className,
}: {
  term: ReactNode;
  meaning: string;
  className?: string;
}) {
  return (
    <span className={className}>
      <span
        className="border-b border-dotted border-ember/50 text-cream"
        title={meaning}
      >
        {term}
      </span>{" "}
      <span className="text-faint">({meaning})</span>
    </span>
  );
}

/** A single still warm light, like a lantern just off-frame, plus a vignette.
 *  No drifting colored blobs, that repeated-glow look is the AI-background tell. */
export function Atmosphere({ extra }: { extra?: ReactNode }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 6%, rgba(255,180,84,0.09), transparent 62%)",
        }}
      />
      {extra}
      {/* vignette for cinematic depth */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(130% 100% at 50% -5%, transparent 50%, rgba(0,0,0,0.62) 100%)",
        }}
      />
    </div>
  );
}

/** Sparks rising from the flame, deterministic positions (SSR-safe), no random. */
export function EmberField({ count = 22 }: { count?: number }) {
  const parts = Array.from({ length: count }, (_, i) => ({
    left: (i * 47 + 7) % 100,
    size: 2 + (i % 3),
    dur: 7 + (i % 6) * 1.4,
    delay: ((i * 1.7) % 9) * -1,
    drift: (((i * 3) % 5) - 2) * 24,
    jade: i % 5 === 0,
  }));
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {parts.map((p, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${p.left}%`,
            bottom: -12,
            width: p.size,
            height: p.size,
            background: p.jade ? "#34d8a6" : "#ffb454",
            boxShadow: `0 0 8px ${p.jade ? "#34d8a6" : "#ffb454"}`,
          }}
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: [-10, -640], x: [0, p.drift], opacity: [0, 0.85, 0] }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

/** A large, breathing lantern flame for the hero. */
export function HeroFlame({ size = 150 }: { size?: number }) {
  return (
    <motion.div
      style={{ width: size, height: size, position: "relative" }}
      animate={{ scale: [1, 1.06, 0.98, 1] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
    >
      <div
        className="absolute rounded-full"
        style={{
          inset: -size * 0.55,
          background:
            "radial-gradient(circle, rgba(255,180,84,0.45), rgba(255,180,84,0.12) 45%, transparent 70%)",
          filter: "blur(8px)",
        }}
      />
      <svg width={size} height={size} viewBox="0 0 24 24" style={{ position: "relative" }}>
        <path
          d="M12 2c1.5 3 4.5 5 4.5 9a4.5 4.5 0 0 1-9 0c0-1.5.7-2.6 1.5-3.5C9.8 8.8 11 7 12 2z"
          fill="#ffd488"
        />
        <path
          d="M12 8.5c.9 1.4 2 2.4 2 4.2a2 2 0 0 1-4 0c0-1 .7-1.8 1.2-2.4.3-.4.6-1 .8-1.8z"
          fill="#d98324"
        />
      </svg>
    </motion.div>
  );
}

/** Cursor-reactive 3D tilt: the element leans toward the pointer for real depth.
 *  ponytail: framer-motion only, no tilt library. */
export function Tilt({
  children,
  className,
  max = 7,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
}) {
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [max, -max]), {
    stiffness: 150,
    damping: 18,
  });
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-max, max]), {
    stiffness: 150,
    damping: 18,
  });
  return (
    <motion.div
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        px.set((e.clientX - r.left) / r.width - 0.5);
        py.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onPointerLeave={() => {
        px.set(0);
        py.set(0);
      }}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** The lantern's warm key-light, following the pointer so the scene feels lit by
 *  a physical flame. ponytail: a SINGLE warm light by design, not a drifting
 *  multicolor aurora — that blob look is the AI-background tell Atmosphere rejects. */
export function LanternLight() {
  const x = useSpring(50, { stiffness: 40, damping: 20 });
  const y = useSpring(12, { stiffness: 40, damping: 20 });
  useEffect(() => {
    function onMove(e: PointerEvent) {
      x.set((e.clientX / window.innerWidth) * 100);
      y.set((e.clientY / window.innerHeight) * 100);
    }
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [x, y]);
  const background = useMotionTemplate`radial-gradient(46% 42% at ${x}% ${y}%, rgba(255,180,84,0.16), transparent 60%)`;
  return <motion.div className="absolute inset-0" style={{ background }} />;
}

export const display = (size: string, color = "var(--color-cream)"): CSSProperties => ({
  fontFamily: "var(--font-fraunces), serif",
  fontSize: size,
  color,
  letterSpacing: "-0.02em",
  lineHeight: 1.08,
  fontWeight: 500,
});
