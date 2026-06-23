"use client";

import { useEffect, useRef } from "react";
import createGlobe, { type COBEOptions } from "cobe";
import { useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

// Magic UI / 21st.dev Globe (cobe), recolored to a dark sphere with amber
// markers placed on the homelands of the languages in the Ark.
const MOVEMENT_DAMPING = 1400;

const GLOBE_CONFIG: COBEOptions = {
  width: 800,
  height: 800,
  onRender: () => {},
  devicePixelRatio: 2,
  phi: 0,
  theta: 0.3,
  dark: 1,
  diffuse: 1.2,
  mapSamples: 16000,
  mapBrightness: 5,
  baseColor: [0.28, 0.28, 0.34],
  markerColor: [1, 0.706, 0.33], // #ffb454 ember
  glowColor: [1, 0.6, 0.25],
  markers: [
    { location: [-41.0, 174.0], size: 0.1 }, // Māori
    { location: [35.5, -83.3], size: 0.08 }, // Cherokee
    { location: [20.8, -156.3], size: 0.07 }, // Hawaiian
    { location: [43.2, 142.8], size: 0.09 }, // Ainu
    { location: [54.2, -4.5], size: 0.06 }, // Manx
    { location: [50.3, -5.0], size: 0.06 }, // Cornish
    { location: [36.1, -109.0], size: 0.07 }, // Navajo
    { location: [52.2, 21.0], size: 0.06 }, // Yiddish
  ],
};

export function Globe({
  className,
  config = GLOBE_CONFIG,
}: {
  className?: string;
  config?: COBEOptions;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phiRef = useRef(0);
  const widthRef = useRef(0);
  const pointerInteracting = useRef<number | null>(null);

  const r = useMotionValue(0);
  const rs = useSpring(r, { mass: 1, damping: 30, stiffness: 100 });

  const updatePointerInteraction = (value: number | null) => {
    pointerInteracting.current = value;
    if (canvasRef.current) {
      canvasRef.current.style.cursor = value !== null ? "grabbing" : "grab";
    }
  };

  const updateMovement = (clientX: number) => {
    if (pointerInteracting.current !== null) {
      const delta = clientX - pointerInteracting.current;
      r.set(r.get() + delta / MOVEMENT_DAMPING);
    }
  };

  useEffect(() => {
    let globe: ReturnType<typeof createGlobe> | undefined;
    const onResize = () => {
      if (canvasRef.current) widthRef.current = canvasRef.current.offsetWidth;
    };
    window.addEventListener("resize", onResize);
    onResize();

    try {
      globe = createGlobe(canvasRef.current!, {
        ...config,
        width: widthRef.current * 2,
        height: widthRef.current * 2,
        onRender: (state) => {
          if (!pointerInteracting.current) phiRef.current += 0.005;
          state.phi = phiRef.current + rs.get();
          state.width = widthRef.current * 2;
          state.height = widthRef.current * 2;
        },
      });
      setTimeout(() => {
        if (canvasRef.current) canvasRef.current.style.opacity = "1";
      }, 0);
    } catch (err) {
      // WebGL unavailable in this environment; skip the globe without crashing.
      console.warn("Globe: WebGL unavailable, skipping.", err);
    }

    return () => {
      globe?.destroy();
      window.removeEventListener("resize", onResize);
    };
  }, [rs, config]);

  return (
    <div className={cn("mx-auto aspect-square w-full max-w-150", className)}>
      <canvas
        className="size-full opacity-0 transition-opacity duration-500"
        ref={canvasRef}
        onPointerDown={(e) => updatePointerInteraction(e.clientX)}
        onPointerUp={() => updatePointerInteraction(null)}
        onPointerOut={() => updatePointerInteraction(null)}
        onMouseMove={(e) => updateMovement(e.clientX)}
        onTouchMove={(e) => e.touches[0] && updateMovement(e.touches[0].clientX)}
      />
    </div>
  );
}
