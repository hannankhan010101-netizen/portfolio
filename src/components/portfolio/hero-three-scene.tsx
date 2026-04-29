"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles, Stars } from "@react-three/drei";
import { useRef } from "react";
import type { Group, Mesh } from "three";
import * as THREE from "three";
import { HERO_THREE_CONFIG } from "@/constants/hero-three";
import type { HeroThreeSceneProps } from "@/types/hero-three.types";

/**
 * Lit wireframe meshes, sparkles, and a slow starfield for the hero background.
 */
function AnimatedWireframes() {
  const groupRef = useRef<Group>(null);
  const primaryRef = useRef<Mesh>(null);
  const secondaryRef = useRef<Mesh>(null);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    if (groupRef.current) {
      groupRef.current.rotation.z = Math.sin(t * 0.08) * 0.04;
    }
    if (primaryRef.current) {
      primaryRef.current.rotation.x +=
        delta * HERO_THREE_CONFIG.rotation.primary.x;
      primaryRef.current.rotation.y +=
        delta * HERO_THREE_CONFIG.rotation.primary.y;
      primaryRef.current.position.y = Math.sin(t * 0.55) * 0.06;
    }
    if (secondaryRef.current) {
      secondaryRef.current.rotation.x +=
        delta * HERO_THREE_CONFIG.rotation.secondary.x;
      secondaryRef.current.rotation.y +=
        delta * HERO_THREE_CONFIG.rotation.secondary.y;
      secondaryRef.current.position.y = Math.cos(t * 0.62) * 0.05;
    }
  });

  const wp = HERO_THREE_CONFIG.wireframePrimary;
  const ws = HERO_THREE_CONFIG.wireframeSecondary;

  return (
    <group ref={groupRef}>
      <Float
        speed={HERO_THREE_CONFIG.float.speed}
        rotationIntensity={HERO_THREE_CONFIG.float.rotationIntensity}
        floatIntensity={HERO_THREE_CONFIG.float.floatIntensity}
      >
        <mesh ref={primaryRef}>
          <icosahedronGeometry args={wp.icosahedronArgs} />
          <meshStandardMaterial
            color={wp.color}
            wireframe
            transparent
            opacity={wp.opacity}
            metalness={wp.metalness}
            roughness={wp.roughness}
            emissive={wp.emissive}
            emissiveIntensity={wp.emissiveIntensity}
          />
        </mesh>
        <mesh ref={secondaryRef} rotation={[THREE.MathUtils.degToRad(18), 0, 0]}>
          <torusKnotGeometry args={ws.torusKnotArgs} />
          <meshStandardMaterial
            color={ws.color}
            wireframe
            transparent
            opacity={ws.opacity}
            metalness={ws.metalness}
            roughness={ws.roughness}
            emissive={ws.emissive}
            emissiveIntensity={ws.emissiveIntensity}
          />
        </mesh>
      </Float>
    </group>
  );
}

/**
 * Full-bleed WebGL layer; keep pointer-events disabled on the parent wrapper.
 */
export function HeroThreeScene({ className }: HeroThreeSceneProps) {
  const { canvas, stars, sparkles, lights } = HERO_THREE_CONFIG;

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
        <ambientLight intensity={lights.ambient} />
        <pointLight
          color={lights.key.color}
          intensity={lights.key.intensity}
          position={[...lights.key.position]}
        />
        <pointLight
          color={lights.fill.color}
          intensity={lights.fill.intensity}
          position={[...lights.fill.position]}
        />
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
        <AnimatedWireframes />
      </Canvas>
    </div>
  );
}
