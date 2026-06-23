"use client";

import type { MouseEvent, ReactNode } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";

/**
 * A card with an ember spotlight that follows the cursor (adapted from the
 * Aceternity / 21st.dev "card spotlight" pattern, recolored to the Lantern
 * palette, dependency-light).
 */
export function SpotlightCard({
  children,
  className = "",
  radius = 340,
}: {
  children: ReactNode;
  className?: string;
  radius?: number;
}) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function onMove({ currentTarget, clientX, clientY }: MouseEvent<HTMLDivElement>) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      onMouseMove={onMove}
      className={`group relative overflow-hidden rounded-2xl border border-line bg-surface/40 ${className}`}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px z-0 opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(circle at center, rgba(255,180,84,0.18), transparent 70%)",
          maskImage: useMotionTemplate`radial-gradient(${radius}px circle at ${mouseX}px ${mouseY}px, white, transparent 80%)`,
          WebkitMaskImage: useMotionTemplate`radial-gradient(${radius}px circle at ${mouseX}px ${mouseY}px, white, transparent 80%)`,
        }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}
