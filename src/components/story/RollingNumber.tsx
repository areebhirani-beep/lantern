"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import { AnimatedNumber } from "@/components/vengeance/animated-number";

/**
 * Rolls an integer up from 0 to `value` the first time it scrolls into view,
 * driving the vendored Vengeance `AnimatedNumber` odometer. Static figures keep
 * their meaning (`prefix`/`suffix` carry units, denominators, tildes), only the
 * numeral animates.
 *
 * The displayed value is derived straight from `useInView` (no effect/state):
 * SSR and first paint render 0, and the single 0 -> value transition once the
 * element enters the viewport produces a clean digit roll. The surrounding prose
 * always carries the underlying fact, so 0 before scroll is never misleading.
 */
export function RollingNumber({
  value,
  className,
  prefix,
  suffix,
}: {
  value: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px" });

  return (
    <span ref={ref} className={cn("inline-flex items-baseline tabular-nums", className)}>
      {prefix}
      <AnimatedNumber value={inView ? value : 0} className={className} />
      {suffix}
    </span>
  );
}

export default RollingNumber;
