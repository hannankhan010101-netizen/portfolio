"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles, Stars } from "@react-three/drei";
import { useRef } from "react";
import type { Mesh } from "three";
import { SKILLS_THREE_CONFIG } from "@/constants/skills-three";

/**
 * Lightweight ambient field: stars + dual sparkles + slow wire torus for depth.
 */
function DriftTorus() {
  const meshRef = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (!meshRef.current) {
      return;
    }
    meshRef.current.rotation.x += delta * 0.06;
    meshRef.current.rotation.y += delta * 0.09;
  });

  return (
    <mesh ref={meshRef} position={[2.2, 0.4, -1]} rotation={[0.5, 0.7, 0]}>
      <torusGeometry args={[2.8, 0.04, 16, 80]} />
      <meshBasicMaterial
        color="#22d3ee"
        transparent
        opacity={0.12}
        wireframe
      />
    </mesh>
  );
}

interface SkillsThreeSceneProps {
  readonly className?: string;
}

/**
 * Full-bleed WebGL accent for the skills section only.
 */
export function SkillsThreeScene({ className }: SkillsThreeSceneProps) {
  const { canvas, sparkles, sparklesAccent, stars } = SKILLS_THREE_CONFIG;

  return (
    <div className={className}>
      <Canvas
        className="h-full w-full"
        camera={{
          position: [...canvas.cameraPosition],
          fov: canvas.fov,
        }}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
        }}
        dpr={[canvas.dprMin, canvas.dprMax]}
      >
        <ambientLight intensity={0.35} />
        <pointLight color="#22d3ee" intensity={0.6} position={[4, 2, 6]} />
        <pointLight color="#34d399" intensity={0.35} position={[-4, -1, 4]} />
        <Stars
          radius={stars.radius}
          depth={stars.depth}
          count={stars.count}
          factor={stars.factor}
          saturation={stars.saturation}
          fade={stars.fade}
          speed={stars.speed}
        />
        <Sparkles
          count={sparkles.count}
          scale={sparkles.scale}
          size={sparkles.size}
          speed={sparkles.speed}
          opacity={sparkles.opacity}
          color={sparkles.color}
        />
        <Sparkles
          count={sparklesAccent.count}
          scale={sparklesAccent.scale}
          size={sparklesAccent.size}
          speed={sparklesAccent.speed}
          opacity={sparklesAccent.opacity}
          color={sparklesAccent.color}
        />
        <DriftTorus />
      </Canvas>
    </div>
  );
}
