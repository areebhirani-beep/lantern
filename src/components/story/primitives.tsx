"use client";

import type { CSSProperties, ReactNode } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

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

/** Words rise and resolve from a blur as they scroll into view — story unfolding. */
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

/** Slowly drifting warm light — the cinematic, alive atmosphere. */
export function Atmosphere({ extra }: { extra?: ReactNode }) {
  const blobs = [
    { c: "#ffb454", x: "20%", y: "30%", s: 620, dur: 18, dx: 60, dy: -40 },
    { c: "#34d8a6", x: "78%", y: "22%", s: 460, dur: 24, dx: -50, dy: 50 },
    { c: "#d98324", x: "55%", y: "78%", s: 720, dur: 22, dx: 40, dy: -30 },
  ];
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {blobs.map((b, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: b.x,
            top: b.y,
            width: b.s,
            height: b.s,
            background: `radial-gradient(circle, ${b.c}22, transparent 68%)`,
            filter: "blur(40px)",
            translateX: "-50%",
            translateY: "-50%",
          }}
          animate={{ x: [0, b.dx, 0], y: [0, b.dy, 0] }}
          transition={{ duration: b.dur, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
      {extra}
      {/* vignette for cinematic depth */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 0%, transparent 55%, rgba(0,0,0,0.55) 100%)",
        }}
      />
    </div>
  );
}

/** Sparks rising from the flame — deterministic positions (SSR-safe), no random. */
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

export const display = (size: string, color = "var(--color-cream)"): CSSProperties => ({
  fontFamily: "var(--font-fraunces), serif",
  fontSize: size,
  color,
  letterSpacing: "-0.02em",
  lineHeight: 1.08,
  fontWeight: 500,
});
