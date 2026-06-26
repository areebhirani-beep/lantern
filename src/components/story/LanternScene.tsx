"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles, MeshDistortMaterial } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useRef } from "react";
import type { Mesh, PointLight } from "three";

/**
 * The flame core in real geometry: an emissive orb that distorts and pulses like
 * fire, lit by a warm key + cool rim so it reads as a dimensional ember (not a flat
 * fill), and leans toward the pointer. Bloom (below) makes it bleed light.
 */
function Flame() {
  const mesh = useRef<Mesh>(null);
  const light = useRef<PointLight>(null);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    // two sine layers → organic, non-mechanical flicker
    const pulse = 1 + Math.sin(t * 2.1) * 0.05 + Math.sin(t * 5.3) * 0.02;
    if (mesh.current) {
      mesh.current.scale.setScalar(pulse);
      mesh.current.rotation.y = state.pointer.x * 0.6;
      mesh.current.rotation.x = -state.pointer.y * 0.35;
    }
    if (light.current) light.current.intensity = 22 + Math.sin(t * 3) * 6;
  });
  return (
    <group>
      <mesh ref={mesh}>
        <icosahedronGeometry args={[0.95, 8]} />
        <MeshDistortMaterial
          color="#ffb152"
          emissive="#ff5e0a"
          emissiveIntensity={1.1}
          distort={0.4}
          speed={2}
          roughness={0.45}
          metalness={0}
        />
      </mesh>
      {/* warm key + cool rim → dimensional form, not a flat disc */}
      <pointLight ref={light} color="#ffd9a0" intensity={22} distance={12} position={[2.5, 2, 3]} />
      <pointLight color="#bfe0ff" intensity={5} distance={12} position={[-3, 1.5, -2.5]} />
    </group>
  );
}

/**
 * The hero's real-3D lantern. Transparent canvas so it sits over near-black.
 * Dimensional rising embers (real 3D Sparkles) replace the flat CSS ember field.
 */
export function LanternScene({ className }: { className?: string }) {
  return (
    <div
      className={className}
      aria-hidden
      // feather the canvas edges so the bloom never shows a hard square
      style={{
        maskImage: "radial-gradient(circle at 50% 46%, #000 46%, transparent 72%)",
        WebkitMaskImage: "radial-gradient(circle at 50% 46%, #000 46%, transparent 72%)",
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 42 }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.12} />
        <Float speed={1.3} rotationIntensity={0.4} floatIntensity={0.8}>
          <Flame />
        </Float>
        <Sparkles count={50} scale={6.5} size={2.2} speed={0.4} color="#ffb454" opacity={0.7} />
        <EffectComposer>
          <Bloom intensity={1.4} luminanceThreshold={0.2} luminanceSmoothing={0.9} mipmapBlur radius={0.75} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
