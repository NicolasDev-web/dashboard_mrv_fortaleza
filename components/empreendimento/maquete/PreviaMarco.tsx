"use client";

import { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { parqueMarista } from "@/lib/maquete/parque-marista";
import { criarFabrica } from "./Cena";
import { marcos } from "./marcos";

/**
 * Só para desenvolvimento: mostra um marco sozinho, de um ângulo fixo, para conferir a modelagem
 * contra as fotos. `az` é o azimute da câmera em graus (0 = vindo do norte), `el` a elevação e `d` a distância.
 */
export function PreviaMarco({ id, az, el, d }: { id: string; az: number; el: number; d: number }) {
  const fab = useMemo(() => criarFabrica(parqueMarista), []);
  const marco = marcos[id];
  const a = THREE.MathUtils.degToRad(az);
  const e = THREE.MathUtils.degToRad(el);
  const pos: [number, number, number] = [Math.sin(a) * Math.cos(e) * d, Math.sin(e) * d, -Math.cos(a) * Math.cos(e) * d];
  if (!marco) return <p>Marco desconhecido: {id}</p>;
  const { Modelo } = marco;
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      {/* leve de propósito: desenha só quando precisa, sem retina e com sombra pequena, para não pesar a máquina */}
      <Canvas
        shadows="percentage"
        frameloop="demand"
        dpr={1}
        gl={{ antialias: true, toneMapping: THREE.NeutralToneMapping }}
        camera={{ fov: 32, near: 1, far: 2000, position: pos }}
        onCreated={({ camera }) => {
          camera.lookAt(0, 8, 0);
          (window as unknown as { __previaPronta: boolean }).__previaPronta = true;
        }}
      >
        <color attach="background" args={["#dfe9ee"]} />
        <hemisphereLight args={["#e3efff", "#c8c2a8", 1.15]} />
        <directionalLight
          position={[70, 90, 40]}
          intensity={2.5}
          castShadow
          shadow-mapSize={[1024, 1024]}
          shadow-camera-left={-80}
          shadow-camera-right={80}
          shadow-camera-top={80}
          shadow-camera-bottom={-80}
          shadow-bias={-0.0004}
          shadow-normalBias={0.04}
        />
        <mesh rotation-x={-Math.PI / 2} receiveShadow>
          <circleGeometry args={[300, 48]} />
          <meshStandardMaterial color="#d8d5cd" />
        </mesh>
        <mesh position-y={0.25} receiveShadow material={fab.cor("#e9e6df", 0.95)}>
          <cylinderGeometry args={[33, 34, 0.5, 48]} />
        </mesh>
        {/* seta do norte na borda da base */}
        <mesh position={[0, 0.55, -36]} rotation-x={-Math.PI / 2}>
          <circleGeometry args={[2.5, 3, Math.PI / 2]} />
          <meshBasicMaterial color="#006b3f" />
        </mesh>
        <group position-y={0.5}>
          <Modelo fab={fab} />
        </group>
      </Canvas>
    </div>
  );
}
