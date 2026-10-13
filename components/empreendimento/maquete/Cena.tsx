"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import type { Maquete, Ponto, Ret, TipoPiso } from "@/lib/maquete/tipos";

/** O que a interface de fora (botões) pode pedir à câmera */
export interface ControleMaquete {
  zoom(fator: number): void;
  resetar(): void;
}

type Props = {
  m: Maquete;
  /** monta os controles de arrastar; no toque só depois que a pessoa ativa, para não prender a rolagem */
  interativo: boolean;
  /** pinça e roda do mouse aproximam; fica desligado no desktop para a roda continuar rolando a página */
  zoomLivre: boolean;
  girando: boolean;
  visivel: boolean;
  rotulos: boolean;
  controle: RefObject<ControleMaquete | null>;
  aoInteragir(): void;
  aoCarregar(): void;
};

const ALVO = new THREE.Vector3(0, 10, 0);
/** câmera inicial a nordeste, olhando o lazer de frente e as torres ao fundo */
const DIRECAO_INICIAL = new THREE.Vector3(0.5, 0.55, -0.67).normalize();
const DISTANCIA = { inicial: 215, min: 70, max: 340 };
const EIXO_Y = new THREE.Vector3(0, 1, 0);

const CORES_PISO: Record<TipoPiso, string> = {
  grama: "#8bab5f",
  calcada: "#dcd7cc",
  pavimento: "#aaa5a1",
  piso: "#e4ddd2",
  deck: "#eee6d8",
  madeira: "#b88a62",
  quadra: "#79b79a",
  playground: "#4b7a57",
  pista: "#c99282",
};
const CORES_CARRO = ["#f4f4f2", "#f4f4f2", "#c9cccf", "#9a9ea3", "#2b2e33", "#2b2e33", "#3c4f6b", "#8c2f2f"];
const CORES_COPA = ["#5d8a3c", "#6e9a45", "#4f7d38", "#668f3f"];

/** Pixels da planta para metros, com a origem no centro do lote (z cresce para o sul) */
function fazConversor(m: Maquete) {
  const xs = m.lote.map((p) => p[0]);
  const ys = m.lote.map((p) => p[1]);
  const cx = (Math.min(...xs) + Math.max(...xs)) / 2;
  const cy = (Math.min(...ys) + Math.max(...ys)) / 2;
  const k = 1 / m.escala;
  return { x: (px: number) => (px - cx) * k, z: (py: number) => (py - cy) * k, m: (px: number) => px * k };
}
type Conversor = ReturnType<typeof fazConversor>;

const retParaPontos = ([x1, y1, x2, y2]: Ret): Ponto[] => [[x1, y1], [x2, y1], [x2, y2], [x1, y2]];

/** Gerador determinístico: a mesma maquete sai igual em toda visita */
function aleatorio(semente: number) {
  let s = semente >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function Cena(props: Props) {
  const { visivel, girando } = props;
  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      frameloop={!visivel ? "never" : girando ? "always" : "demand"}
      gl={{ antialias: true, toneMapping: THREE.NeutralToneMapping }}
      camera={{ fov: 32, near: 1, far: 1500, position: ALVO.clone().addScaledVector(DIRECAO_INICIAL, DISTANCIA.inicial) }}
      onCreated={() => props.aoCarregar()}
      className="!absolute inset-0"
    >
      <Conteudo {...props} />
    </Canvas>
  );
}

function Conteudo({ m, interativo, zoomLivre, girando, rotulos, controle, aoInteragir }: Props) {
  const c = useMemo(() => fazConversor(m), [m]);
  const topo = 0.2 + m.pisos.length * 0.02;

  return (
    <>
      <color attach="background" args={["#eef2ec"]} />
      <fog attach="fog" args={["#eef2ec", 320, 900]} />
      <hemisphereLight args={["#ffffff", "#b9c2a8", 1.1]} />
      <directionalLight
        position={[90, 140, -70]}
        intensity={2.4}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-95}
        shadow-camera-right={95}
        shadow-camera-top={95}
        shadow-camera-bottom={-95}
        shadow-camera-near={10}
        shadow-camera-far={450}
        shadow-bias={-0.0004}
        shadow-normalBias={0.04}
      />

      <Chao m={m} c={c} />
      {m.piscinas.map((p, i) => (
        <Superficie key={i} pontos={p} c={c} y={topo + 0.01} cor="#4fb4d8" rugosidade={0.15} />
      ))}
      <Muros m={m} c={c} chao={topo} />
      {m.torres.map((t) => (
        <TorreMRV key={t.nome} t={t} m={m} c={c} chao={topo} />
      ))}
      {m.construcoes.map((k, i) =>
        k.tipo === "pergolado" ? <Pergolado key={i} ret={k.ret} altura={k.altura} c={c} chao={topo} /> : <Edificio key={i} ret={k.ret} altura={k.altura} c={c} chao={topo} />,
      )}
      {m.reservatorios.map((r, i) => (
        <mesh key={i} position={[c.x(r.em[0]), topo + r.altura / 2, c.z(r.em[1])]} castShadow receiveShadow>
          <cylinderGeometry args={[c.m(r.raio), c.m(r.raio), r.altura, 20]} />
          <meshStandardMaterial color="#6fb3e3" roughness={0.5} />
        </mesh>
      ))}
      <Arvores m={m} c={c} chao={topo} />
      <Carros m={m} c={c} chao={topo} />
      {rotulos && <Rotulos m={m} c={c} chao={topo} />}

      {interativo && (
        <OrbitControls
          makeDefault
          target={ALVO}
          enablePan={false}
          enableZoom={zoomLivre}
          enableDamping
          dampingFactor={0.08}
          rotateSpeed={0.6}
          minDistance={DISTANCIA.min}
          maxDistance={DISTANCIA.max}
          minPolarAngle={0.15}
          maxPolarAngle={1.35}
          onStart={aoInteragir}
        />
      )}
      <Rig controle={controle} girando={girando} />
    </>
  );
}

/** Giro automático, zoom pelos botões e enquadramento conforme a proporção da tela */
function Rig({ controle, girando }: { controle: RefObject<ControleMaquete | null>; girando: boolean }) {
  const { camera, invalidate, size } = useThree();
  const estreito = size.width / size.height < 1;

  useEffect(() => {
    // em tela estreita a maquete precisa de mais distância para caber de lado a lado
    const inicial = () => ALVO.clone().addScaledVector(DIRECAO_INICIAL, DISTANCIA.inicial * (estreito ? 1.45 : 1));
    camera.position.copy(inicial());
    camera.lookAt(ALVO);
    invalidate();
    controle.current = {
      zoom(fator) {
        const offset = camera.position.clone().sub(ALVO);
        const d = THREE.MathUtils.clamp(offset.length() * fator, DISTANCIA.min, DISTANCIA.max);
        camera.position.copy(ALVO).addScaledVector(offset.normalize(), d);
        camera.lookAt(ALVO);
        invalidate();
      },
      resetar() {
        camera.position.copy(inicial());
        camera.lookAt(ALVO);
        invalidate();
      },
    };
    return () => {
      controle.current = null;
    };
  }, [camera, controle, estreito, invalidate]);

  useFrame((_, dt) => {
    if (!girando) return;
    const offset = camera.position.clone().sub(ALVO).applyAxisAngle(EIXO_Y, Math.min(dt, 0.1) * 0.07);
    camera.position.copy(ALVO).add(offset);
    camera.lookAt(ALVO);
  });
  return null;
}

function Superficie({ pontos, c, y, cor, rugosidade = 0.95 }: { pontos: Ponto[]; c: Conversor; y: number; cor: string; rugosidade?: number }) {
  const geo = useMemo(() => new THREE.ShapeGeometry(new THREE.Shape(pontos.map(([px, py]) => new THREE.Vector2(c.x(px), -c.z(py))))), [pontos, c]);
  useEffect(() => () => geo.dispose(), [geo]);
  return (
    <mesh geometry={geo} rotation-x={-Math.PI / 2} position-y={y} receiveShadow>
      <meshStandardMaterial color={cor} roughness={rugosidade} />
    </mesh>
  );
}

function Chao({ m, c }: { m: Maquete; c: Conversor }) {
  const rua = useMemo(() => retParaPontos(m.rua), [m.rua]);
  return (
    <>
      <mesh rotation-x={-Math.PI / 2} position-y={-0.05} receiveShadow>
        <circleGeometry args={[900, 48]} />
        <meshStandardMaterial color="#e3e2da" roughness={1} />
      </mesh>
      <Superficie pontos={rua} c={c} y={0} cor="#5c5f61" />
      <Superficie pontos={m.lote} c={c} y={0.12} cor={CORES_PISO.calcada} />
      <Superficie pontos={m.interno} c={c} y={0.16} cor={CORES_PISO.grama} />
      {m.pisos.map((p, i) => (
        <Superficie key={i} pontos={retParaPontos(p.ret)} c={c} y={0.2 + i * 0.02} cor={CORES_PISO[p.tipo]} rugosidade={p.tipo === "madeira" ? 0.7 : 0.95} />
      ))}
    </>
  );
}

function Muros({ m, c, chao }: { m: Maquete; c: Conversor; chao: number }) {
  return (
    <>
      {m.muros.map(([x1, y1, x2, y2], i) => {
        const dx = c.m(x2 - x1);
        const dz = c.m(y2 - y1);
        return (
          <mesh key={i} position={[c.x((x1 + x2) / 2), chao + 1.1, c.z((y1 + y2) / 2)]} rotation-y={Math.atan2(-dz, dx)} castShadow receiveShadow>
            <boxGeometry args={[Math.hypot(dx, dz), 2.2, 0.25]} />
            <meshStandardMaterial color="#f2f0eb" roughness={0.9} />
          </mesh>
        );
      })}
    </>
  );
}

type TipoFace = "longa" | "ponta" | "nucleo";

/** Desenha a fachada num canvas: janelas por andar com o painel colorido ao lado, como nos renders da MRV */
function texturaFachada(largura: number, andares: number, peDireito: number, f: Maquete["fachada"], tipo: TipoFace, semente: number) {
  const ppm = 16;
  const W = Math.max(8, Math.round(largura * ppm));
  const andarPx = peDireito * ppm;
  const H = Math.round(andares * andarPx);
  const cv = document.createElement("canvas");
  cv.width = W;
  cv.height = H;
  const g = cv.getContext("2d")!;
  const rnd = aleatorio(semente);
  g.fillStyle = tipo === "nucleo" ? f.faixa : f.parede;
  g.fillRect(0, 0, W, H);
  if (tipo === "ponta") {
    g.fillStyle = f.faixa;
    g.fillRect(W / 2 - 0.9 * ppm, 0, 1.8 * ppm, H);
  }

  const janela = (cx: number, base: number, painel: boolean) => {
    const w = 1.3 * ppm;
    const h = 1.2 * ppm;
    const y = base - (0.95 * ppm + h);
    g.fillStyle = "#46525d";
    g.fillRect(cx - w / 2, y, w, h);
    g.fillStyle = "rgba(255,255,255,0.18)";
    g.fillRect(cx - w / 2, y, w, h * 0.22);
    if (painel) {
      g.fillStyle = f.paineis[Math.floor(rnd() * f.paineis.length)];
      g.fillRect(cx + w / 2 + 0.1 * ppm, y, 0.55 * ppm, h);
    }
  };

  for (let a = 0; a < andares; a++) {
    const base = H - a * andarPx;
    g.fillStyle = "rgba(0,0,0,0.07)";
    g.fillRect(0, base - 2, W, 2);
    if (tipo === "nucleo") {
      g.fillStyle = "#3d4650";
      g.fillRect(W / 2 - 0.4 * ppm, base - 1.9 * ppm, 0.8 * ppm, 0.9 * ppm);
    } else if (tipo === "ponta") {
      janela(W * 0.22, base, false);
      janela(W * 0.78, base, false);
    } else {
      const n = Math.max(1, Math.floor(largura / 3.1));
      for (let i = 0; i < n; i++) janela(((i + 0.5) * W) / n - 0.3 * ppm, base, true);
    }
  }
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

function useMateriaisCaixa(largura: number, altura: number, prof: number, andares: number, m: Maquete, lados: TipoFace, pontas: TipoFace, semente: number) {
  const materiais = useMemo(() => {
    const longa = texturaFachada(largura, andares, m.peDireito, m.fachada, lados, semente);
    const ponta = texturaFachada(prof, andares, m.peDireito, m.fachada, pontas, semente + 1);
    // o núcleo sobe além da última laje: a textura estica um pouco, imperceptível nessa escala
    const face = (map: THREE.Texture) => new THREE.MeshStandardMaterial({ map, roughness: 0.85 });
    const teto = new THREE.MeshStandardMaterial({ color: "#d4d0c9", roughness: 0.95 });
    // ordem das faces do BoxGeometry: +x, -x, +y, -y, +z, -z
    return [face(ponta), face(ponta), teto, teto, face(longa), face(longa)];
  }, [largura, altura, prof, andares, m, lados, pontas, semente]);
  useEffect(
    () => () =>
      materiais.forEach((mat) => {
        mat.map?.dispose();
        mat.dispose();
      }),
    [materiais],
  );
  return materiais;
}

function TorreMRV({ t, m, c, chao }: { t: Maquete["torres"][number]; m: Maquete; c: Conversor; chao: number }) {
  const [x1, y1, x2, y2] = t.ret;
  const [n1, n2] = t.nucleo;
  const altura = t.andares * m.peDireito;
  const prof = c.m(y2 - y1);
  const zc = c.z((y1 + y2) / 2);
  const larguraAla = (c.m(n1 - x1) + c.m(x2 - n2)) / 2;
  const semente = Math.round(x1 + y1);
  const ala = useMateriaisCaixa(larguraAla, altura, prof, t.andares, m, "longa", "ponta", semente);
  const nucleo = useMateriaisCaixa(c.m(n2 - n1), altura + 3, prof + 1.2, t.andares, m, "nucleo", "nucleo", semente + 7);

  return (
    <group>
      {[[x1, n1], [n2, x2]].map(([a, b]) => (
        <mesh key={a} position={[c.x((a + b) / 2), chao + altura / 2, zc]} material={ala} castShadow receiveShadow>
          <boxGeometry args={[c.m(b - a), altura, prof]} />
        </mesh>
      ))}
      <mesh position={[c.x((n1 + n2) / 2), chao + (altura + 3) / 2, zc]} material={nucleo} castShadow receiveShadow>
        <boxGeometry args={[c.m(n2 - n1), altura + 3, prof + 1.2]} />
      </mesh>
    </group>
  );
}

function Edificio({ ret, altura, c, chao }: { ret: Ret; altura: number; c: Conversor; chao: number }) {
  const [x1, y1, x2, y2] = ret;
  return (
    <mesh position={[c.x((x1 + x2) / 2), chao + altura / 2, c.z((y1 + y2) / 2)]} castShadow receiveShadow>
      <boxGeometry args={[c.m(x2 - x1), altura, c.m(y2 - y1)]} />
      <meshStandardMaterial color="#f3f1ec" roughness={0.9} />
    </mesh>
  );
}

function Pergolado({ ret, altura, c, chao }: { ret: Ret; altura: number; c: Conversor; chao: number }) {
  const [x1, y1, x2, y2] = ret;
  const w = c.m(x2 - x1);
  const d = c.m(y2 - y1);
  const cx = c.x((x1 + x2) / 2);
  const cz = c.z((y1 + y2) / 2);
  const pilares: [number, number][] = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
  return (
    <group position={[cx, chao, cz]}>
      {pilares.map(([sx, sz]) => (
        <mesh key={`${sx}${sz}`} position={[sx * (w / 2 - 0.2), altura / 2, sz * (d / 2 - 0.2)]} castShadow>
          <boxGeometry args={[0.25, altura, 0.25]} />
          <meshStandardMaterial color="#6f5644" />
        </mesh>
      ))}
      <mesh position-y={altura} castShadow receiveShadow>
        <boxGeometry args={[w, 0.18, d]} />
        <meshStandardMaterial color="#8a6a4f" roughness={0.8} />
      </mesh>
    </group>
  );
}

function Arvores({ m, c, chao }: { m: Maquete; c: Conversor; chao: number }) {
  const cores = useMemo(() => {
    const rnd = aleatorio(11);
    return m.arvores.map(() => CORES_COPA[Math.floor(rnd() * CORES_COPA.length)]);
  }, [m.arvores]);
  return (
    <>
      {m.arvores.map((a, i) => {
        const p = a.porte ?? 1;
        const pos: [number, number, number] = [c.x(a.em[0]), chao, c.z(a.em[1])];
        if (a.tipo === "palmeira") {
          return (
            <group key={i} position={pos}>
              <mesh position-y={3.5 * p} castShadow>
                <cylinderGeometry args={[0.14, 0.22, 7 * p, 6]} />
                <meshStandardMaterial color="#8b7355" />
              </mesh>
              <mesh position-y={7 * p} scale={[2.6 * p, 0.7 * p, 2.6 * p]} castShadow>
                <icosahedronGeometry args={[1, 0]} />
                <meshStandardMaterial color="#6b9b3f" flatShading />
              </mesh>
            </group>
          );
        }
        return (
          <group key={i} position={pos}>
            <mesh position-y={1.2 * p} castShadow>
              <cylinderGeometry args={[0.2 * p, 0.28 * p, 2.4 * p, 6]} />
              <meshStandardMaterial color="#7a6249" />
            </mesh>
            <mesh position-y={4 * p} scale={[1, 0.85, 1]} castShadow receiveShadow>
              <icosahedronGeometry args={[2.7 * p, 1]} />
              <meshStandardMaterial color={a.tipo === "ipe" ? "#b48ad0" : cores[i]} flatShading roughness={0.9} />
            </mesh>
          </group>
        );
      })}
    </>
  );
}

function Carros({ m, c, chao }: { m: Maquete; c: Conversor; chao: number }) {
  const lista = useMemo(() => {
    const rnd = aleatorio(7);
    const passo = 2.5 * m.escala;
    const out: { x: number; z: number; rot: number; cor: string }[] = [];
    for (const f of m.vagas) {
      for (let p = f.de + passo / 2; p < f.ate; p += passo) {
        const ocupada = rnd() < f.ocupacao;
        const cor = CORES_CARRO[Math.floor(rnd() * CORES_CARRO.length)];
        if (!ocupada) continue;
        const [px, py] = f.sentido === "h" ? [p, f.em] : [f.em, p];
        out.push({ x: c.x(px), z: c.z(py), rot: f.sentido === "h" ? 0 : Math.PI / 2, cor });
      }
    }
    return out;
  }, [m, c]);
  const corpo = useRef<THREE.InstancedMesh>(null);
  const cabine = useRef<THREE.InstancedMesh>(null);

  useLayoutEffect(() => {
    const o = new THREE.Object3D();
    const cor = new THREE.Color();
    lista.forEach((v, i) => {
      o.rotation.set(0, v.rot, 0);
      o.position.set(v.x, chao + 0.45, v.z);
      o.updateMatrix();
      corpo.current!.setMatrixAt(i, o.matrix);
      corpo.current!.setColorAt(i, cor.set(v.cor));
      o.position.set(v.x, chao + 1.05, v.z + (v.rot ? 0 : 0.2));
      o.updateMatrix();
      cabine.current!.setMatrixAt(i, o.matrix);
    });
    corpo.current!.instanceMatrix.needsUpdate = true;
    if (corpo.current!.instanceColor) corpo.current!.instanceColor.needsUpdate = true;
    cabine.current!.instanceMatrix.needsUpdate = true;
  }, [lista, chao]);

  return (
    <>
      <instancedMesh ref={corpo} args={[undefined, undefined, lista.length]} castShadow>
        <boxGeometry args={[1.8, 0.7, 4.3]} />
        <meshStandardMaterial roughness={0.35} />
      </instancedMesh>
      <instancedMesh ref={cabine} args={[undefined, undefined, lista.length]} castShadow>
        <boxGeometry args={[1.6, 0.55, 2.2]} />
        <meshStandardMaterial color="#2f3a44" roughness={0.2} />
      </instancedMesh>
    </>
  );
}

function Rotulos({ m, c, chao }: { m: Maquete; c: Conversor; chao: number }) {
  const lista = [
    ...m.torres.map((t) => ({ texto: t.nome, pos: [c.x((t.ret[0] + t.ret[2]) / 2), chao + t.andares * m.peDireito + 6, c.z((t.ret[1] + t.ret[3]) / 2)] })),
    ...m.rotulos.map((r) => ({ texto: r.texto, pos: [c.x(r.em[0]), chao + (r.altura ?? 2.5), c.z(r.em[1])] })),
  ];
  return (
    <>
      {lista.map((r) => (
        <Html key={r.texto} position={r.pos as [number, number, number]} center zIndexRange={[5, 0]} style={{ pointerEvents: "none" }}>
          <span className="block whitespace-nowrap rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-green-900 shadow-e2">{r.texto}</span>
        </Html>
      ))}
    </>
  );
}
