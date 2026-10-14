"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { MapPin, Sunrise, Sunset } from "lucide-react";
import type { Construcao, Maquete, Ponto, Referencia, Ret, TipoPiso, Torre } from "@/lib/maquete/tipos";
import { marcos } from "./marcos";

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
  /** câmera entra voando na primeira vez que a maquete aparece */
  intro: boolean;
  visivel: boolean;
  rotulos: boolean;
  /** hora solar da luz e do sol no caminho (8, 12 ou 16) */
  hora: number;
  referencias: Referencia[];
  /** rosa dos ventos da interface, girada a cada quadro conforme a câmera */
  bussolaRef: RefObject<HTMLDivElement | null>;
  controleRef: RefObject<ControleMaquete | null>;
  aoInteragir(): void;
  aoCarregar(): void;
};

const EIXO_Y = new THREE.Vector3(0, 1, 0);
const COR = {
  ceuTopo: "#b9d9ef",
  horizonte: "#e7ede8",
  chaoCidade: "#d8d5cd",
  asfalto: "#5c5f61",
  faixa: "#f5f3ee",
  muro: "#f2f0eb",
  cercaViva: "#4f7f3a",
  agua: "#3fb2dd",
  borda: "#f4efe4",
  parede: "#f4f2ed",
  teto: "#d6d2ca",
  concreto: "#c9c5be",
  tanque: "#5fa8dc",
};
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
const CORES_COPA = ["#5d8a3c", "#6e9a45", "#4f7d38", "#668f3f", "#78a44c"];
const CORES_CASA = ["#efe9df", "#e8dfcf", "#f3efe6", "#e2d6c3", "#d9e0e3", "#f0e2c8"];
const CORES_TELHADO = ["#c8693f", "#b85a35", "#d47a4a", "#a9532f", "#c27350"];
const CORES_PREDIO = ["#d9d6d0", "#c9c4ba", "#e6e1d7", "#b9bec2"];

/** Pixels da planta para metros, com a origem no centro do lote (z cresce para baixo na planta) */
function fazConversor(m: Maquete) {
  const xs = m.lote.map((p) => p[0]);
  const ys = m.lote.map((p) => p[1]);
  const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  const cx = (x0 + x1) / 2;
  const cy = (y0 + y1) / 2;
  const k = 1 / m.escala;
  return {
    x: (px: number) => (px - cx) * k,
    z: (py: number) => (py - cy) * k,
    m: (px: number) => px * k,
    /** meia diagonal do lote, em metros */
    raio: (Math.hypot(x1 - x0, y1 - y0) * k) / 2,
    alturaMax: Math.max(8, ...m.torres.map((t) => t.andares * m.peDireito)),
  };
}
type Conversor = ReturnType<typeof fazConversor>;

/** Alvo, direção e distâncias da câmera proporcionais ao tamanho do lote e à altura das torres */
function enquadramento(m: Maquete, c: Conversor) {
  const az = THREE.MathUtils.degToRad(m.vista ?? 35);
  const el = THREE.MathUtils.degToRad(34);
  // folga para o anel dos pontos cardeais e as referências caberem no primeiro enquadramento
  const dist = c.raio * 1.8 + 30 + c.alturaMax * 0.9;
  return {
    alvo: new THREE.Vector3(0, Math.min(12, c.alturaMax * 0.25), 0),
    dir: new THREE.Vector3(Math.sin(az) * Math.cos(el), Math.sin(el), -Math.cos(az) * Math.cos(el)),
    dist,
    min: Math.max(35, dist * 0.32),
    max: dist * 1.6,
  };
}
type Enquadramento = ReturnType<typeof enquadramento>;

const LATITUDE = THREE.MathUtils.degToRad(-3.73);

/** Norte e leste verdadeiros na cena, a partir do ângulo do norte na planta */
function eixos(norte: number) {
  const t = THREE.MathUtils.degToRad(norte);
  return { norte: new THREE.Vector3(Math.sin(t), 0, -Math.cos(t)), leste: new THREE.Vector3(Math.cos(t), 0, Math.sin(t)) };
}

/**
 * Direção do sol em Fortaleza no equinócio (março e setembro), para a hora solar dada: nasce no leste,
 * passa quase a pino ao meio-dia (3,7° ao norte) e se põe no oeste.
 */
function direcaoSol(hora: number, norte: number) {
  const h = THREE.MathUtils.degToRad((hora - 12) * 15);
  const { norte: n, leste: l } = eixos(norte);
  return n
    .multiplyScalar(-Math.sin(LATITUDE) * Math.cos(h))
    .addScaledVector(l, -Math.sin(h))
    .setY(Math.cos(LATITUDE) * Math.cos(h))
    .normalize();
}

/** Direção horizontal de um rumo em graus a partir do norte */
function direcaoRumo(rumo: number, norte: number) {
  const t = THREE.MathUtils.degToRad(norte + rumo);
  return new THREE.Vector3(Math.sin(t), 0, -Math.cos(t));
}

const retParaPontos = ([x1, y1, x2, y2]: Ret): Ponto[] => [[x1, y1], [x2, y1], [x2, y2], [x1, y2]];
const ehPoligono = (r: Ret | Ponto[]): r is Ponto[] => Array.isArray(r[0]);
/** pontos de uma rua, seja retângulo ou polígono */
const pontosDaRua = (r: Ret | Ponto[]): Ponto[] => (ehPoligono(r) ? r : retParaPontos(r));

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
const sorteia = <T,>(rnd: () => number, lista: T[]) => lista[Math.floor(rnd() * lista.length)];

/** Afasta cada lado do polígono `d` pixels para fora (borda da piscina) */
function expandir(p: Ponto[], d: number): Ponto[] {
  const n = p.length;
  let area = 0;
  for (let i = 0; i < n; i++) area += p[i][0] * p[(i + 1) % n][1] - p[(i + 1) % n][0] * p[i][1];
  const s = Math.sign(area) || 1;
  const normal = (a: Ponto, b: Ponto): Ponto => {
    const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    return [(s * (b[1] - a[1])) / l, (-s * (b[0] - a[0])) / l];
  };
  return p.map((pt, i) => {
    const n1 = normal(p[(i - 1 + n) % n], pt);
    const n2 = normal(pt, p[(i + 1) % n]);
    const f = d / (1 + n1[0] * n2[0] + n1[1] * n2[1]);
    return [pt[0] + (n1[0] + n2[0]) * f, pt[1] + (n1[1] + n2[1]) * f];
  });
}

/** Distância de um ponto a um polígono (zero se estiver dentro) */
function distanciaAoPoligono([x, y]: Ponto, p: Ponto[]) {
  let dentro = false;
  let menor = Infinity;
  for (let i = 0, j = p.length - 1; i < p.length; j = i++) {
    const [xi, yi] = p[i];
    const [xj, yj] = p[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) dentro = !dentro;
    const dx = xj - xi;
    const dy = yj - yi;
    const t = THREE.MathUtils.clamp(((x - xi) * dx + (y - yi) * dy) / (dx * dx + dy * dy || 1), 0, 1);
    menor = Math.min(menor, Math.hypot(x - (xi + t * dx), y - (yi + t * dy)));
  }
  return dentro ? 0 : menor;
}

const centroide = (p: Ponto[]): Ponto => [p.reduce((s, q) => s + q[0], 0) / p.length, p.reduce((s, q) => s + q[1], 0) / p.length];

// ——— Texturas desenhadas em canvas ———

type TipoFace = "longa" | "ponta" | "nucleo";

function novoCanvas(w: number, h: number) {
  const cv = document.createElement("canvas");
  cv.width = Math.max(8, Math.round(w));
  cv.height = Math.max(8, Math.round(h));
  return [cv, cv.getContext("2d")!] as const;
}

/** Fachada: janelas por andar com o painel colorido ao lado, como nos renders da MRV */
function desenharFachada(largura: number, andares: number, peDireito: number, f: Maquete["fachada"], tipo: TipoFace, semente: number) {
  const ppm = 16;
  const andarPx = peDireito * ppm;
  const [cv, g] = novoCanvas(largura * ppm, andares * andarPx);
  const W = cv.width;
  const H = cv.height;
  const rnd = aleatorio(semente);
  g.fillStyle = tipo === "nucleo" ? f.faixa : f.parede;
  g.fillRect(0, 0, W, H);
  if (tipo === "ponta") {
    g.fillStyle = f.faixa;
    g.fillRect(W / 2 - 0.9 * ppm, 0, 1.8 * ppm, H);
  }
  // térreo um pouco mais escuro, como o embasamento dos prédios
  g.fillStyle = "rgba(60,50,40,0.08)";
  g.fillRect(0, H - andarPx, W, andarPx);

  const janela = (cx: number, base: number, painel: boolean) => {
    const w = 1.3 * ppm;
    const h = 1.2 * ppm;
    const y = base - (0.95 * ppm + h);
    g.fillStyle = "#ffffff";
    g.fillRect(cx - w / 2 - 2, y - 2, w + 4, h + 4);
    g.fillStyle = "#46525d";
    g.fillRect(cx - w / 2, y, w, h);
    g.fillStyle = "rgba(255,255,255,0.22)";
    g.fillRect(cx - w / 2, y, w, h * 0.22);
    if (painel) {
      g.fillStyle = sorteia(rnd, f.paineis);
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
  return cv;
}

/** Edifício-garagem: lajes de concreto com os vãos abertos de cada pavimento */
function desenharGaragem(largura: number, altura: number) {
  const ppm = 12;
  const [cv, g] = novoCanvas(largura * ppm, altura * ppm);
  g.fillStyle = COR.concreto;
  g.fillRect(0, 0, cv.width, cv.height);
  const andar = 3 * ppm;
  for (let y = cv.height; y > andar * 0.5; y -= andar) {
    g.fillStyle = "#3a3f44";
    g.fillRect(ppm * 0.6, y - andar + 0.9 * ppm, cv.width - 1.2 * ppm, andar - 1.5 * ppm);
    g.fillStyle = COR.concreto;
    for (let x = 0; x < cv.width; x += 7.5 * ppm) g.fillRect(x, y - andar, 0.5 * ppm, andar);
  }
  return cv;
}

function desenharPlaca(texto: string) {
  const [cv, g] = novoCanvas(1024, 160);
  g.fillStyle = "#006b3f";
  g.fillRect(0, 0, 1024, 160);
  g.fillStyle = "#ffffff";
  g.textAlign = "center";
  g.textBaseline = "middle";
  let tamanho = 84;
  g.font = `700 ${tamanho}px system-ui, sans-serif`;
  while (g.measureText(texto.toUpperCase()).width > 960 && tamanho > 30) g.font = `700 ${(tamanho -= 4)}px system-ui, sans-serif`;
  g.fillText(texto.toUpperCase(), 512, 84);
  return cv;
}

function desenharQuadra() {
  const [cv, g] = novoCanvas(512, 256);
  g.fillStyle = "#5fa98a";
  g.fillRect(0, 0, 512, 256);
  g.fillStyle = "#79b79a";
  g.fillRect(24, 24, 464, 208);
  g.strokeStyle = "#ffffff";
  g.lineWidth = 5;
  g.strokeRect(24, 24, 464, 208);
  g.beginPath();
  g.moveTo(256, 24);
  g.lineTo(256, 232);
  g.stroke();
  g.beginPath();
  g.arc(256, 128, 38, 0, Math.PI * 2);
  g.stroke();
  g.strokeRect(24, 78, 60, 100);
  g.strokeRect(428, 78, 60, 100);
  return cv;
}

function desenharCeu() {
  const [cv, g] = novoCanvas(4, 256);
  const grad = g.createLinearGradient(0, 0, 0, 256);
  grad.addColorStop(0, COR.ceuTopo);
  grad.addColorStop(0.62, COR.horizonte);
  grad.addColorStop(1, COR.horizonte);
  g.fillStyle = grad;
  g.fillRect(0, 0, 4, 256);
  return cv;
}

/** Materiais e texturas compartilhados pela cena inteira, descartados juntos quando ela sai */
export function criarFabrica(m: Maquete) {
  const cache = new Map<string, THREE.Material>();
  const texturas: THREE.Texture[] = [];
  const material = (chave: string, criar: () => THREE.Material) => {
    let mat = cache.get(chave);
    if (!mat) cache.set(chave, (mat = criar()));
    return mat;
  };
  const textura = (cv: HTMLCanvasElement) => {
    const t = new THREE.CanvasTexture(cv);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    texturas.push(t);
    return t;
  };
  const comTextura = (cv: HTMLCanvasElement, roughness = 0.85) => new THREE.MeshStandardMaterial({ map: textura(cv), roughness });
  return {
    cor: (hex: string, roughness = 0.9) => material(`c${hex}${roughness}`, () => new THREE.MeshStandardMaterial({ color: hex, roughness })),
    fachada(largura: number, andares: number, tipo: TipoFace) {
      const l = Math.max(1, Math.round(largura * 2) / 2);
      return material(`f${tipo}${l}x${andares}`, () => comTextura(desenharFachada(l, andares, m.peDireito, m.fachada, tipo, Math.round(l * 31 + andares))));
    },
    garagem(largura: number, altura: number) {
      const l = Math.max(1, Math.round(largura));
      return material(`g${l}x${altura}`, () => comTextura(desenharGaragem(l, altura), 0.95));
    },
    placa: () => material("placa", () => comTextura(desenharPlaca(m.nome), 0.6)),
    quadra: () => material("quadra", () => comTextura(desenharQuadra(), 0.9)),
    ceu: () => {
      const t = textura(desenharCeu());
      return t;
    },
    agua: () =>
      material("agua", () => new THREE.MeshStandardMaterial({ color: COR.agua, roughness: 0.08, metalness: 0.05, emissive: "#0b4f6c", emissiveIntensity: 0.18 })),
    dispose() {
      cache.forEach((mat) => mat.dispose());
      texturas.forEach((t) => t.dispose());
    },
  };
}
export type Fabrica = ReturnType<typeof criarFabrica>;

// ——— Cena ———

export function Cena(props: Props) {
  const { visivel, girando } = props;
  return (
    <Canvas
      shadows="percentage"
      dpr={[1, 1.75]}
      frameloop={!visivel ? "never" : girando ? "always" : "demand"}
      gl={{ antialias: true, toneMapping: THREE.NeutralToneMapping }}
      camera={{ fov: 32, near: 1, far: 3000, position: [0, 200, -300] }}
      onCreated={() => props.aoCarregar()}
      className="!absolute inset-0"
    >
      <Conteudo {...props} />
    </Canvas>
  );
}

function Conteudo({ m, interativo, zoomLivre, girando, intro, rotulos, hora, referencias, bussolaRef, controleRef, aoInteragir }: Props) {
  const c = useMemo(() => fazConversor(m), [m]);
  const e = useMemo(() => enquadramento(m, c), [m, c]);
  const fab = useMemo(() => criarFabrica(m), [m]);
  useEffect(() => () => fab.dispose(), [fab]);
  const ceu = useMemo(() => fab.ceu(), [fab]);
  const torres = useRef<THREE.Group>(null!);
  const topo = 0.2 + m.pisos.length * 0.02;
  const lugares = useMemo(() => posicionarMarcos(referencias, m.norte, c.raio), [referencias, m.norte, c.raio]);
  const clareiras = useMemo(() => lugares.map((l) => l.pos), [lugares]);
  // sol baixo de manhã e à tarde: sombras compridas pedem uma área de sombra maior; as miniaturas também entram
  const sombra = Math.max(c.raio + 60, ...lugares.map((l) => l.pos.length() + 40));
  const sol = useMemo(() => direcaoSol(hora, m.norte).multiplyScalar(c.raio + 200), [hora, m.norte, c.raio]);

  return (
    <>
      <primitive attach="background" object={ceu} />
      <fog attach="fog" args={[COR.horizonte, e.dist * 1.4, e.dist * 4]} />
      <hemisphereLight args={["#e3efff", "#c8c2a8", 1.15]} />
      <directionalLight
        position={sol}
        color={hora === 12 ? "#fff6e8" : "#ffe2bf"}
        intensity={hora === 12 ? 2.6 : 2.4}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-sombra}
        shadow-camera-right={sombra}
        shadow-camera-top={sombra}
        shadow-camera-bottom={-sombra}
        shadow-camera-near={10}
        shadow-camera-far={c.raio * 2 + 500}
        shadow-bias={-0.0004}
        shadow-normalBias={0.04}
      />

      <Chao m={m} c={c} fab={fab} />
      <Vizinhanca m={m} c={c} clareiras={clareiras} />
      <Postes m={m} c={c} />
      {m.piscinas.map((p, i) => (
        <Piscina key={i} pontos={p} m={m} c={c} chao={topo} fab={fab} />
      ))}
      <Muros m={m} c={c} chao={topo} fab={fab} />
      <group ref={torres}>
        {m.torres.map((t) => (
          <TorreMRV key={t.nome} t={t} m={m} c={c} chao={topo} fab={fab} />
        ))}
      </group>
      {m.construcoes.map((k, i) => (
        <ConstrucaoApoio key={i} k={k} c={c} chao={topo} fab={fab} />
      ))}
      {m.reservatorios.map((r, i) => (
        <Reservatorio key={i} r={r} c={c} chao={topo} fab={fab} />
      ))}
      {m.pisos
        .filter((p) => p.tipo === "playground")
        .map((p, i) => (
          <Brinquedos key={i} ret={p.ret} c={c} chao={topo} fab={fab} />
        ))}
      {(m.guardaSois ?? []).map((p, i) => (
        <GuardaSol key={i} em={p} c={c} chao={topo} fab={fab} cor={i % 2 ? "#ff8b22" : "#ffffff"} />
      ))}
      <Arvores m={m} c={c} chao={topo} fab={fab} />
      <Carros m={m} c={c} chao={topo} />
      {rotulos && <Rotulos m={m} c={c} chao={topo} torres={torres} />}
      <RosaNoChao m={m} c={c} rotulos={rotulos} />
      {rotulos && <PontosDeReferencia lista={referencias.filter((r) => !(r.marco && marcos[r.marco]))} m={m} c={c} torres={torres} />}
      <MarcosDaCidade lugares={lugares} norte={m.norte} fab={fab} rotulos={rotulos} torres={torres} />
      <GiroDaBussola alvo={e.alvo} norte={m.norte} bussolaRef={bussolaRef} />

      {interativo && (
        <OrbitControls
          makeDefault
          target={e.alvo}
          enablePan={false}
          enableZoom={zoomLivre}
          enableDamping
          dampingFactor={0.08}
          rotateSpeed={0.6}
          minDistance={e.min}
          maxDistance={e.max}
          minPolarAngle={0.15}
          maxPolarAngle={1.35}
          onStart={aoInteragir}
        />
      )}
      <Rig e={e} controleRef={controleRef} girando={girando} intro={intro} />
    </>
  );
}

/** Voo de entrada, giro automático, zoom pelos botões e enquadramento conforme a proporção da tela */
function Rig({ e, controleRef, girando, intro }: { e: Enquadramento; controleRef: RefObject<ControleMaquete | null>; girando: boolean; intro: boolean }) {
  const { camera, invalidate, size } = useThree();
  // em tela estreita a maquete precisa de mais distância para caber de lado a lado
  const afastar = Math.round(THREE.MathUtils.clamp(1.5 / (size.width / size.height), 1, 1.8) * 20) / 20;
  const voo = useRef<{ t: number; de: THREE.Vector3 } | null>(null);

  useEffect(() => {
    const inicial = () => e.alvo.clone().addScaledVector(e.dir, e.dist * afastar);
    if (intro && !voo.current) {
      // começa mais alto, mais longe e girado: a maquete "pousa" no enquadramento
      const de = e.dir.clone().applyAxisAngle(EIXO_Y, -0.9);
      de.y += 0.5;
      voo.current = { t: 0, de: e.alvo.clone().addScaledVector(de.normalize(), e.dist * afastar * 1.9) };
      camera.position.copy(voo.current.de);
    } else if (!voo.current || voo.current.t >= 1) {
      camera.position.copy(inicial());
    }
    camera.lookAt(e.alvo);
    invalidate();
    controleRef.current = {
      zoom(fator) {
        if (voo.current) voo.current.t = 1;
        const offset = camera.position.clone().sub(e.alvo);
        const d = THREE.MathUtils.clamp(offset.length() * fator, e.min, e.max * afastar);
        camera.position.copy(e.alvo).addScaledVector(offset.normalize(), d);
        camera.lookAt(e.alvo);
        invalidate();
      },
      resetar() {
        if (voo.current) voo.current.t = 1;
        camera.position.copy(inicial());
        camera.lookAt(e.alvo);
        invalidate();
      },
    };
    return () => {
      controleRef.current = null;
    };
  }, [camera, controleRef, afastar, invalidate, e, intro]);

  useFrame((_, dt) => {
    const passo = Math.min(dt, 0.1);
    const v = voo.current;
    if (v && v.t < 1) {
      if (!girando) {
        v.t = 1;
        return;
      }
      v.t = Math.min(1, v.t + passo / 2.6);
      const k = 1 - Math.pow(1 - v.t, 3);
      camera.position.lerpVectors(v.de, e.alvo.clone().addScaledVector(e.dir, e.dist * afastar), k);
      camera.lookAt(e.alvo);
      return;
    }
    if (!girando) return;
    const offset = camera.position.clone().sub(e.alvo).applyAxisAngle(EIXO_Y, passo * 0.06);
    camera.position.copy(e.alvo).add(offset);
    camera.lookAt(e.alvo);
  });
  return null;
}

// ——— Chão, rua e entorno ———

function Superficie({ pontos, c, y, material }: { pontos: Ponto[]; c: Conversor; y: number; material: THREE.Material }) {
  const geo = useMemo(() => new THREE.ShapeGeometry(new THREE.Shape(pontos.map(([px, py]) => new THREE.Vector2(c.x(px), -c.z(py))))), [pontos, c]);
  useEffect(() => () => geo.dispose(), [geo]);
  return <mesh geometry={geo} material={material} rotation-x={-Math.PI / 2} position-y={y} receiveShadow />;
}

/** Retângulo com textura esticada de ponta a ponta, deitado no chão e com o lado longo na horizontal da textura */
function PlanoTexturizado({ ret, c, y, material }: { ret: Ret; c: Conversor; y: number; material: THREE.Material }) {
  const [x1, y1, x2, y2] = ret;
  const w = c.m(x2 - x1);
  const d = c.m(y2 - y1);
  const deitado = d > w;
  return (
    <mesh position={[c.x((x1 + x2) / 2), y, c.z((y1 + y2) / 2)]} rotation={[-Math.PI / 2, 0, deitado ? Math.PI / 2 : 0]} material={material} receiveShadow>
      <planeGeometry args={deitado ? [d, w] : [w, d]} />
    </mesh>
  );
}

function Chao({ m, c, fab }: { m: Maquete; c: Conversor; fab: Fabrica }) {
  const d = 4 * m.escala;
  return (
    <>
      <mesh rotation-x={-Math.PI / 2} position-y={-0.08} receiveShadow material={fab.cor(COR.chaoCidade, 1)}>
        <circleGeometry args={[2500, 48]} />
      </mesh>
      {m.ruas.map((r, i) =>
        ehPoligono(r) ? (
          <group key={i}>
            <Superficie pontos={expandir(r, d)} c={c} y={-0.01} material={fab.cor(CORES_PISO.calcada)} />
            <Superficie pontos={r} c={c} y={0} material={fab.cor(COR.asfalto)} />
          </group>
        ) : (
          <group key={i}>
            {/* calçada do outro lado da rua */}
            <Superficie pontos={retParaPontos([r[0] - d, r[1] - d, r[2] + d, r[3] + d])} c={c} y={-0.01} material={fab.cor(CORES_PISO.calcada)} />
            <Superficie pontos={retParaPontos(r)} c={c} y={0} material={fab.cor(COR.asfalto)} />
          </group>
        ),
      )}
      <FaixasRua m={m} c={c} />
      <Superficie pontos={m.lote} c={c} y={0.12} material={fab.cor(CORES_PISO.calcada)} />
      <Superficie pontos={m.interno} c={c} y={0.16} material={fab.cor(CORES_PISO[m.chao ?? "grama"])} />
      {m.pisos.map((p, i) =>
        p.tipo === "quadra" ? (
          <PlanoTexturizado key={i} ret={p.ret} c={c} y={0.2 + i * 0.02} material={fab.quadra()} />
        ) : (
          <Superficie key={i} pontos={retParaPontos(p.ret)} c={c} y={0.2 + i * 0.02} material={fab.cor(CORES_PISO[p.tipo], p.tipo === "madeira" ? 0.7 : 0.95)} />
        ),
      )}
      <FaixasVagas m={m} c={c} y={0.2 + m.pisos.length * 0.02 + 0.005} />
    </>
  );
}

/** Instâncias de um plano fino deitado no chão: faixas da rua e das vagas */
function Faixas({ lista, y, cor }: { lista: { x: number; z: number; w: number; d: number }[]; y: number; cor: string }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    if (!ref.current) return;
    const o = new THREE.Object3D();
    lista.forEach((f, i) => {
      o.position.set(f.x, y, f.z);
      o.rotation.set(-Math.PI / 2, 0, 0);
      o.scale.set(f.w, f.d, 1);
      o.updateMatrix();
      ref.current!.setMatrixAt(i, o.matrix);
    });
    ref.current!.instanceMatrix.needsUpdate = true;
  }, [lista, y]);
  if (!lista.length) return null;
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, lista.length]} receiveShadow>
      <planeGeometry args={[1, 1]} />
      <meshStandardMaterial color={cor} roughness={0.9} />
    </instancedMesh>
  );
}

/** Faixa tracejada no meio de cada trecho de rua, ao longo do lado comprido */
function FaixasRua({ m, c }: { m: Maquete; c: Conversor }) {
  const lista = useMemo(() => {
    const out: { x: number; z: number; w: number; d: number }[] = [];
    for (const r of m.ruas) {
      if (ehPoligono(r)) continue;
      const [x1, y1, x2, y2] = r;
      const [a, b, p, q] = [c.x(x1), c.x(x2), c.z(y1), c.z(y2)];
      const horizontal = b - a >= q - p;
      // só desenha onde o trecho tem largura de rua de verdade
      if ((horizontal ? q - p : b - a) < 6) continue;
      if (horizontal) for (let s = a + 2; s < b - 3; s += 7) out.push({ x: s + 1.5, z: (p + q) / 2, w: 3, d: 0.18 });
      else for (let s = p + 2; s < q - 3; s += 7) out.push({ x: (a + b) / 2, z: s + 1.5, w: 0.18, d: 3 });
    }
    return out;
  }, [m, c]);
  return <Faixas lista={lista} y={0.02} cor="#f2d36b" />;
}

function FaixasVagas({ m, c, y }: { m: Maquete; c: Conversor; y: number }) {
  const lista = useMemo(() => {
    const passo = 2.5 * m.escala;
    const out: { x: number; z: number; w: number; d: number }[] = [];
    for (const f of m.vagas) {
      for (let p = f.de; p <= f.ate + 0.5; p += passo) {
        out.push(f.sentido === "h" ? { x: c.x(p), z: c.z(f.em), w: 0.12, d: 4.8 } : { x: c.x(f.em), z: c.z(p), w: 4.8, d: 0.12 });
      }
    }
    return out;
  }, [m, c]);
  return <Faixas lista={lista} y={y} cor={COR.faixa} />;
}

/**
 * Bairro genérico em volta: quadras de casas térreas com telhado de barro, alguns prédios mais
 * longe e árvores. Só dá escala e contexto; não representa o entorno real.
 */
function Vizinhanca({ m, c, clareiras }: { m: Maquete; c: Conversor; clareiras: THREE.Vector3[] }) {
  const dados = useMemo(() => {
    // área livre: o lote e as ruas desenhadas, com uma folga (em metros, já convertidos)
    const livres = [m.lote, ...m.ruas.map(pontosDaRua)].map((p) => p.map(([px, py]): Ponto => [c.x(px), c.z(py)]));
    // praça sem casas em volta de cada miniatura de lugar da cidade
    for (const v of clareiras) livres.push(Array.from({ length: 16 }, (_, i): Ponto => [v.x + 36 * Math.cos((i * Math.PI) / 8), v.z + 36 * Math.sin((i * Math.PI) / 8)]));
    const pts = [...m.lote, ...m.ruas.flatMap(pontosDaRua)];
    const xs = pts.map((p) => p[0]);
    const ys = pts.map((p) => p[1]);
    const r = { x1: c.x(Math.min(...xs)) - 6, x2: c.x(Math.max(...xs)) + 6, z1: c.z(Math.min(...ys)) - 6, z2: c.z(Math.max(...ys)) + 6 };
    const ext = THREE.MathUtils.clamp(c.raio * 1.4, 110, 230);
    const cel = 13;
    const rnd = aleatorio(Math.round(c.raio * 100));
    const casas: { x: number; z: number; w: number; d: number; h: number; parede: string; telhado: string }[] = [];
    const predios: { x: number; z: number; w: number; d: number; h: number; cor: string }[] = [];
    const copas: { x: number; z: number; s: number; cor: string }[] = [];
    const ruas: { x: number; z: number; w: number; d: number }[] = [];
    const x0 = r.x1 - ext;
    const z0 = r.z1 - ext;
    const nx = Math.ceil((r.x2 - r.x1 + 2 * ext) / cel);
    const nz = Math.ceil((r.z2 - r.z1 + 2 * ext) / cel);
    for (let i = 0; i < nx; i++) if (i % 5 === 4) ruas.push({ x: x0 + (i + 0.5) * cel, z: z0 + (nz * cel) / 2, w: cel - 4, d: nz * cel });
    for (let j = 0; j < nz; j++) if (j % 5 === 4) ruas.push({ x: x0 + (nx * cel) / 2, z: z0 + (j + 0.5) * cel, w: nx * cel, d: cel - 4 });
    for (let i = 0; i < nx; i++) {
      for (let j = 0; j < nz; j++) {
        if (i % 5 === 4 || j % 5 === 4) continue;
        const x = x0 + (i + 0.5) * cel;
        const z = z0 + (j + 0.5) * cel;
        const longe = Math.min(...livres.map((p) => distanciaAoPoligono([x, z], p)));
        if (longe < cel / 2 + 7) continue;
        const sorte = rnd();
        if (sorte < 0.12) copas.push({ x: x + (rnd() - 0.5) * 4, z: z + (rnd() - 0.5) * 4, s: 2.4 + rnd() * 1.8, cor: sorteia(rnd, CORES_COPA) });
        else if (sorte < 0.86 || longe < 80) {
          if (sorte >= 0.86 && rnd() < 0.5) continue;
          casas.push({ x, z, w: 8 + rnd() * 3.5, d: 9 + rnd() * 3, h: 3 + (rnd() < 0.3 ? 3 : 0) + rnd(), parede: sorteia(rnd, CORES_CASA), telhado: sorteia(rnd, CORES_TELHADO) });
        } else if (sorte < 0.93) predios.push({ x, z, w: 11 + rnd() * 2, d: 11 + rnd() * 2, h: 10 + rnd() * 16, cor: sorteia(rnd, CORES_PREDIO) });
      }
    }
    return { casas, predios, copas, ruas };
  }, [m, c, clareiras]);

  const paredes = useRef<THREE.InstancedMesh>(null);
  const telhados = useRef<THREE.InstancedMesh>(null);
  const predios = useRef<THREE.InstancedMesh>(null);
  const copas = useRef<THREE.InstancedMesh>(null);

  useLayoutEffect(() => {
    const o = new THREE.Object3D();
    const cor = new THREE.Color();
    dados.casas.forEach((k, i) => {
      o.rotation.set(0, 0, 0);
      o.position.set(k.x, k.h / 2, k.z);
      o.scale.set(k.w, k.h, k.d);
      o.updateMatrix();
      paredes.current!.setMatrixAt(i, o.matrix);
      paredes.current!.setColorAt(i, cor.set(k.parede));
      // pirâmide de 4 faces girada 45°: base quadrada de lado √2 com raio 1
      o.rotation.set(0, Math.PI / 4, 0);
      o.position.set(k.x, k.h + 1, k.z);
      o.scale.set((k.w / Math.SQRT2) * 1.08, 2, (k.d / Math.SQRT2) * 1.08);
      o.updateMatrix();
      telhados.current!.setMatrixAt(i, o.matrix);
      telhados.current!.setColorAt(i, cor.set(k.telhado));
    });
    dados.predios.forEach((k, i) => {
      o.rotation.set(0, 0, 0);
      o.position.set(k.x, k.h / 2, k.z);
      o.scale.set(k.w, k.h, k.d);
      o.updateMatrix();
      predios.current!.setMatrixAt(i, o.matrix);
      predios.current!.setColorAt(i, cor.set(k.cor));
    });
    dados.copas.forEach((k, i) => {
      o.rotation.set(0, 0, 0);
      o.position.set(k.x, k.s * 1.4, k.z);
      o.scale.set(k.s, k.s * 0.85, k.s);
      o.updateMatrix();
      copas.current!.setMatrixAt(i, o.matrix);
      copas.current!.setColorAt(i, cor.set(k.cor));
    });
    for (const im of [paredes, telhados, predios, copas]) {
      im.current!.instanceMatrix.needsUpdate = true;
      if (im.current!.instanceColor) im.current!.instanceColor.needsUpdate = true;
    }
  }, [dados]);

  return (
    <>
      <Faixas lista={dados.ruas} y={-0.04} cor="#9b9a96" />
      <instancedMesh ref={paredes} args={[undefined, undefined, dados.casas.length]} castShadow receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial roughness={0.95} />
      </instancedMesh>
      <instancedMesh ref={telhados} args={[undefined, undefined, dados.casas.length]} castShadow>
        <coneGeometry args={[1, 1, 4, 1]} />
        <meshStandardMaterial roughness={0.85} flatShading />
      </instancedMesh>
      <instancedMesh ref={predios} args={[undefined, undefined, dados.predios.length]} castShadow receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial roughness={0.9} />
      </instancedMesh>
      <instancedMesh ref={copas} args={[undefined, undefined, dados.copas.length]} castShadow>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial roughness={0.9} flatShading />
      </instancedMesh>
    </>
  );
}

/** Postes de iluminação na calçada, a cada ~20 m do contorno do lote */
function Postes({ m, c }: { m: Maquete; c: Conversor }) {
  const lista = useMemo(() => {
    const [cx, cy] = centroide(m.lote);
    const out: { x: number; z: number }[] = [];
    const n = m.lote.length;
    for (let i = 0; i < n; i++) {
      const [ax, ay] = m.lote[i];
      const [bx, by] = m.lote[(i + 1) % n];
      const comp = c.m(Math.hypot(bx - ax, by - ay));
      for (let s = 6; s < comp - 4; s += 20) {
        const t = s / comp;
        let px = ax + (bx - ax) * t;
        let py = ay + (by - ay) * t;
        // 1,2 m para dentro da calçada
        const l = Math.hypot(cx - px, cy - py) || 1;
        px += ((cx - px) / l) * 1.2 * m.escala;
        py += ((cy - py) / l) * 1.2 * m.escala;
        out.push({ x: c.x(px), z: c.z(py) });
      }
    }
    return out;
  }, [m, c]);
  const hastes = useRef<THREE.InstancedMesh>(null);
  const luminarias = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    if (!hastes.current || !luminarias.current) return;
    const o = new THREE.Object3D();
    lista.forEach((p, i) => {
      o.position.set(p.x, 3.6, p.z);
      o.updateMatrix();
      hastes.current!.setMatrixAt(i, o.matrix);
      o.position.set(p.x, 7.2, p.z);
      o.updateMatrix();
      luminarias.current!.setMatrixAt(i, o.matrix);
    });
    hastes.current!.instanceMatrix.needsUpdate = true;
    luminarias.current!.instanceMatrix.needsUpdate = true;
  }, [lista]);
  if (!lista.length) return null;
  return (
    <>
      <instancedMesh ref={hastes} args={[undefined, undefined, lista.length]} castShadow>
        <cylinderGeometry args={[0.08, 0.12, 7.2, 6]} />
        <meshStandardMaterial color="#5d6166" roughness={0.6} />
      </instancedMesh>
      <instancedMesh ref={luminarias} args={[undefined, undefined, lista.length]}>
        <boxGeometry args={[0.5, 0.22, 0.5]} />
        <meshStandardMaterial color="#fff6dc" emissive="#fff1c4" emissiveIntensity={0.4} />
      </instancedMesh>
    </>
  );
}

/** Muro no limite do lote com uma cerca-viva encostada pelo lado de dentro */
function Muros({ m, c, chao, fab }: { m: Maquete; c: Conversor; chao: number; fab: Fabrica }) {
  const [cx, cy] = useMemo(() => centroide(m.interno), [m.interno]);
  const muros = useMemo(
    () => m.muros ?? m.interno.map((p, i) => [...p, ...m.interno[(i + 1) % m.interno.length]] as [number, number, number, number]),
    [m.muros, m.interno],
  );
  return (
    <>
      {muros.map(([x1, y1, x2, y2], i) => {
        const dx = c.m(x2 - x1);
        const dz = c.m(y2 - y1);
        const comp = Math.hypot(dx, dz);
        const ang = Math.atan2(-dz, dx);
        // normal apontando para o centro do lote
        let nx = -dz / comp;
        let nz = dx / comp;
        const mx = c.x((x1 + x2) / 2);
        const mz = c.z((y1 + y2) / 2);
        if (nx * (c.x(cx) - mx) + nz * (c.z(cy) - mz) < 0) {
          nx = -nx;
          nz = -nz;
        }
        return (
          <group key={i}>
            <mesh position={[mx, chao + 1.1, mz]} rotation-y={ang} castShadow receiveShadow material={fab.cor(COR.muro)}>
              <boxGeometry args={[comp, 2.2, 0.25]} />
            </mesh>
            {comp > 4 && (
              <mesh position={[mx + nx * 0.7, chao + 0.65, mz + nz * 0.7]} rotation-y={ang} castShadow receiveShadow material={fab.cor(COR.cercaViva)}>
                <boxGeometry args={[comp - 1.5, 1.3, 0.9]} />
              </mesh>
            )}
          </group>
        );
      })}
    </>
  );
}

function Piscina({ pontos, m, c, chao, fab }: { pontos: Ponto[]; m: Maquete; c: Conversor; chao: number; fab: Fabrica }) {
  const borda = useMemo(() => expandir(pontos, 0.6 * m.escala), [pontos, m.escala]);
  return (
    <>
      <Superficie pontos={borda} c={c} y={chao + 0.01} material={fab.cor(COR.borda, 0.8)} />
      <Superficie pontos={pontos} c={c} y={chao + 0.04} material={fab.agua()} />
    </>
  );
}

// ——— Prédios ———

function Caixa({ ret, c, y, altura, material }: { ret: Ret; c: Conversor; y: number; altura: number; material: THREE.Material | THREE.Material[] }) {
  const [x1, y1, x2, y2] = ret;
  return (
    <mesh position={[c.x((x1 + x2) / 2), y + altura / 2, c.z((y1 + y2) / 2)]} material={material} castShadow receiveShadow>
      <boxGeometry args={[c.m(x2 - x1), altura, c.m(y2 - y1)]} />
    </mesh>
  );
}

/** Platibanda: mureta em volta da cobertura */
function Platibanda({ ret, c, y, fab, cor }: { ret: Ret; c: Conversor; y: number; fab: Fabrica; cor: string }) {
  const [x1, y1, x2, y2] = ret;
  const w = c.m(x2 - x1);
  const d = c.m(y2 - y1);
  const cx = c.x((x1 + x2) / 2);
  const cz = c.z((y1 + y2) / 2);
  const e = 0.3;
  const lados: [number, number, number, number][] = [
    [cx, cz - d / 2 + e / 2, w, e],
    [cx, cz + d / 2 - e / 2, w, e],
    [cx - w / 2 + e / 2, cz, e, d],
    [cx + w / 2 - e / 2, cz, e, d],
  ];
  return (
    <>
      {lados.map(([px, pz, lw, ld], i) => (
        <mesh key={i} position={[px, y + 0.5, pz]} material={fab.cor(cor)} castShadow>
          <boxGeometry args={[lw, 1, ld]} />
        </mesh>
      ))}
    </>
  );
}

function TorreMRV({ t, m, c, chao, fab }: { t: Torre; m: Maquete; c: Conversor; chao: number; fab: Fabrica }) {
  const altura = t.andares * m.peDireito;
  const comElevador = t.andares > 6;
  const extra = comElevador ? 3.2 : 1.4;
  const faces = (ret: Ret, tipoFixo?: TipoFace) => {
    const w = c.m(ret[2] - ret[0]);
    const d = c.m(ret[3] - ret[1]);
    const face = (l: number) => fab.fachada(l, t.andares, tipoFixo ?? (l >= 9 ? "longa" : "ponta"));
    const teto = fab.cor(COR.teto, 0.95);
    // ordem das faces do BoxGeometry: +x, -x, +y, -y, +z, -z
    return [face(d), face(d), teto, teto, face(w), face(w)];
  };
  const [n1, ny1, n2, ny2] = t.nucleo;
  const caixaDagua: Ret = [n1 + (n2 - n1) * 0.12, ny1 + (ny2 - ny1) * 0.22, n2 - (n2 - n1) * 0.12, ny2 - (ny2 - ny1) * 0.22];
  return (
    <group>
      {t.partes.map((p, i) => (
        <group key={i}>
          <Caixa ret={p} c={c} y={chao} altura={altura} material={faces(p)} />
          <Platibanda ret={p} c={c} y={chao + altura} fab={fab} cor={m.fachada.parede} />
        </group>
      ))}
      <Caixa ret={t.nucleo} c={c} y={chao} altura={altura + extra} material={faces(t.nucleo, "nucleo")} />
      {comElevador && <Caixa ret={caixaDagua} c={c} y={chao + altura + extra} altura={1.8} material={fab.cor("#e9e6e0")} />}
    </group>
  );
}

function ConstrucaoApoio({ k, c, chao, fab }: { k: Construcao; c: Conversor; chao: number; fab: Fabrica }) {
  const [x1, y1, x2, y2] = k.ret;
  const w = c.m(x2 - x1);
  const d = c.m(y2 - y1);
  const cx = c.x((x1 + x2) / 2);
  const cz = c.z((y1 + y2) / 2);

  if (k.tipo === "pergolado") {
    const pilares: [number, number][] = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
    const ripas = Math.max(2, Math.floor(w / 0.6));
    return (
      <group position={[cx, chao, cz]}>
        {pilares.map(([sx, sz]) => (
          <mesh key={`${sx}${sz}`} position={[sx * (w / 2 - 0.2), k.altura / 2, sz * (d / 2 - 0.2)]} castShadow material={fab.cor("#6f5644")}>
            <boxGeometry args={[0.25, k.altura, 0.25]} />
          </mesh>
        ))}
        {Array.from({ length: ripas }, (_, i) => (
          <mesh key={i} position={[-w / 2 + (i + 0.5) * (w / ripas), k.altura, 0]} castShadow material={fab.cor("#8a6a4f", 0.8)}>
            <boxGeometry args={[0.16, 0.22, d]} />
          </mesh>
        ))}
      </group>
    );
  }

  if (k.tipo === "garagem") {
    const g = fab.garagem(Math.max(w, d), k.altura);
    const lado = fab.garagem(Math.min(w, d), k.altura);
    const faces = w >= d ? [lado, lado, fab.cor("#9b9893"), fab.cor("#9b9893"), g, g] : [g, g, fab.cor("#9b9893"), fab.cor("#9b9893"), lado, lado];
    return <Caixa ret={k.ret} c={c} y={chao} altura={k.altura} material={faces} />;
  }

  const parede = fab.cor(COR.parede);
  const teto = fab.cor(COR.teto, 0.95);
  return (
    <group>
      <Caixa ret={k.ret} c={c} y={chao} altura={k.altura} material={[parede, parede, teto, teto, parede, parede]} />
      {/* beiral da laje, um pouco maior que as paredes */}
      <mesh position={[cx, chao + k.altura + 0.12, cz]} castShadow receiveShadow material={fab.cor("#ebe7df")}>
        <boxGeometry args={[w + 0.6, 0.24, d + 0.6]} />
      </mesh>
      {k.placa && (
        <mesh position={[cx, chao + k.altura + 1.05, cz]} castShadow material={fab.placa()}>
          <boxGeometry args={[Math.max(w, d) * 1.1, 1.3, 0.25]} />
        </mesh>
      )}
    </group>
  );
}

function Reservatorio({ r, c, chao, fab }: { r: Maquete["reservatorios"][number]; c: Conversor; chao: number; fab: Fabrica }) {
  const raio = c.m(r.raio);
  const pos: [number, number, number] = [c.x(r.em[0]), chao, c.z(r.em[1])];
  if (r.castelo) {
    return (
      <group position={pos}>
        <mesh position-y={r.altura / 2} castShadow receiveShadow material={fab.cor(COR.concreto, 0.85)}>
          <cylinderGeometry args={[raio, raio, r.altura, 24]} />
        </mesh>
        <mesh position-y={r.altura + 0.3} castShadow material={fab.cor("#9d9a94")}>
          <cylinderGeometry args={[raio * 1.05, raio * 1.05, 0.6, 24]} />
        </mesh>
      </group>
    );
  }
  return (
    <group position={pos}>
      <mesh position-y={r.altura / 2} castShadow receiveShadow material={fab.cor(COR.tanque, 0.5)}>
        <cylinderGeometry args={[raio, raio, r.altura, 20]} />
      </mesh>
      <mesh position-y={r.altura + 0.2} castShadow material={fab.cor("#8cc4ea", 0.5)}>
        <cylinderGeometry args={[raio * 0.3, raio, 0.4, 20]} />
      </mesh>
    </group>
  );
}

// ——— Lazer, árvores e carros ———

/** Escorregador e balanço no centro de cada área de playground */
function Brinquedos({ ret, c, chao, fab }: { ret: Ret; c: Conversor; chao: number; fab: Fabrica }) {
  const cx = c.x((ret[0] + ret[2]) / 2);
  const cz = c.z((ret[1] + ret[3]) / 2);
  const pequeno = Math.min(c.m(ret[2] - ret[0]), c.m(ret[3] - ret[1])) < 6;
  return (
    <group position={[cx, chao, cz]} scale={pequeno ? 0.7 : 1}>
      <mesh position={[-1.2, 1, 0]} castShadow material={fab.cor("#ffb719", 0.6)}>
        <boxGeometry args={[1.4, 2, 1.4]} />
      </mesh>
      <mesh position={[-1.2, 2.25, 0]} castShadow material={fab.cor("#ba4726", 0.6)}>
        <coneGeometry args={[1.1, 0.9, 4]} />
      </mesh>
      <mesh position={[0.4, 1, 0]} rotation-z={-0.62} castShadow material={fab.cor("#00d38d", 0.5)}>
        <boxGeometry args={[2.6, 0.12, 0.8]} />
      </mesh>
      {[-0.6, 0.6].map((dz) => (
        <mesh key={dz} position={[2.2, 1.1, dz * 2]} castShadow material={fab.cor("#793f98", 0.6)}>
          <boxGeometry args={[0.14, 2.2, 0.14]} />
        </mesh>
      ))}
      <mesh position={[2.2, 2.2, 0]} castShadow material={fab.cor("#793f98", 0.6)}>
        <boxGeometry args={[0.14, 0.14, 2.6]} />
      </mesh>
    </group>
  );
}

function GuardaSol({ em, c, chao, fab, cor }: { em: Ponto; c: Conversor; chao: number; fab: Fabrica; cor: string }) {
  return (
    <group position={[c.x(em[0]), chao, c.z(em[1])]}>
      <mesh position-y={1.2} material={fab.cor("#8a8a8a")}>
        <cylinderGeometry args={[0.04, 0.04, 2.4, 6]} />
      </mesh>
      <mesh position-y={2.45} castShadow material={fab.cor(cor, 0.7)}>
        <coneGeometry args={[1.4, 0.55, 8, 1, true]} />
      </mesh>
      <mesh position={[1.1, 0.25, 0]} castShadow material={fab.cor("#ffffff", 0.7)}>
        <boxGeometry args={[0.7, 0.18, 1.9]} />
      </mesh>
    </group>
  );
}

function Arvores({ m, c, chao, fab }: { m: Maquete; c: Conversor; chao: number; fab: Fabrica }) {
  const variacoes = useMemo(() => {
    const rnd = aleatorio(11);
    return m.arvores.map(() => ({
      cores: [sorteia(rnd, CORES_COPA), sorteia(rnd, CORES_COPA)],
      giro: rnd() * Math.PI * 2,
      folhas: 6 + Math.floor(rnd() * 3),
    }));
  }, [m.arvores]);
  return (
    <>
      {m.arvores.map((a, i) => {
        const p = a.porte ?? 1;
        const v = variacoes[i];
        const pos: [number, number, number] = [c.x(a.em[0]), chao, c.z(a.em[1])];
        if (a.tipo === "palmeira") {
          return (
            <group key={i} position={pos} rotation-y={v.giro}>
              <mesh position-y={3.5 * p} castShadow material={fab.cor("#8b7355")}>
                <cylinderGeometry args={[0.14, 0.24, 7 * p, 6]} />
              </mesh>
              {Array.from({ length: v.folhas }, (_, f) => (
                <mesh key={f} position-y={7 * p} rotation={[0, (f / v.folhas) * Math.PI * 2, 0.45]} castShadow material={fab.cor("#6b9b3f")}>
                  <boxGeometry args={[0.5, 0.08, 3.4 * p]} />
                </mesh>
              ))}
            </group>
          );
        }
        const copa = a.tipo === "ipe" ? ["#b48ad0", "#c79be0"] : v.cores;
        return (
          <group key={i} position={pos} rotation-y={v.giro}>
            <mesh position-y={1.2 * p} castShadow material={fab.cor("#7a6249")}>
              <cylinderGeometry args={[0.2 * p, 0.3 * p, 2.4 * p, 6]} />
            </mesh>
            <mesh position-y={4 * p} scale={[1, 0.85, 1]} castShadow receiveShadow material={fab.cor(copa[0])}>
              <icosahedronGeometry args={[2.5 * p, 1]} />
            </mesh>
            <mesh position={[1.3 * p, 4.9 * p, 0.6 * p]} castShadow material={fab.cor(copa[1])}>
              <icosahedronGeometry args={[1.6 * p, 1]} />
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
        const cor = sorteia(rnd, CORES_CARRO);
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
    if (!lista.length) return;
    const o = new THREE.Object3D();
    const cor = new THREE.Color();
    lista.forEach((v, i) => {
      o.rotation.set(0, v.rot, 0);
      o.position.set(v.x, chao + 0.45, v.z);
      o.updateMatrix();
      corpo.current!.setMatrixAt(i, o.matrix);
      corpo.current!.setColorAt(i, cor.set(v.cor));
      o.position.set(v.x, chao + 1.05, v.z);
      o.updateMatrix();
      cabine.current!.setMatrixAt(i, o.matrix);
    });
    corpo.current!.instanceMatrix.needsUpdate = true;
    if (corpo.current!.instanceColor) corpo.current!.instanceColor.needsUpdate = true;
    cabine.current!.instanceMatrix.needsUpdate = true;
  }, [lista, chao]);

  if (!lista.length) return null;
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

/** Nomes dos espaços; um nome atrás de uma torre some, em vez de flutuar por cima dela */
function Rotulos({ m, c, chao, torres }: { m: Maquete; c: Conversor; chao: number; torres: RefObject<THREE.Group> }) {
  // no celular os nomes secundários se sobrepõem: ficam só as torres e os destaques
  const estreito = useThree((s) => s.size.width < 560);
  const lista = [
    ...(m.rotularTorres === false ? [] : m.torres).map((t) => {
      const xs = t.partes.flatMap((p) => [p[0], p[2]]);
      const ys = t.partes.flatMap((p) => [p[1], p[3]]);
      return {
        texto: t.nome,
        pos: [c.x((Math.min(...xs) + Math.max(...xs)) / 2), chao + t.andares * m.peDireito + 6, c.z((Math.min(...ys) + Math.max(...ys)) / 2)],
      };
    }),
    ...m.rotulos.filter((r) => !estreito || !r.secundario).map((r) => ({ texto: r.texto, pos: [c.x(r.em[0]), chao + (r.altura ?? 2.5), c.z(r.em[1])] })),
  ];
  return (
    <>
      {lista.map((r) => (
        <Html key={r.texto} position={r.pos as [number, number, number]} center occlude={[torres]} zIndexRange={[5, 0]} style={{ pointerEvents: "none" }}>
          <span className="block whitespace-nowrap rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-green-900 shadow-e2">{r.texto}</span>
        </Html>
      ))}
    </>
  );
}

// ——— Orientação: sol, pontos cardeais e referências da cidade ———

/** Círculo no chão em volta do lote com os pontos cardeais, o nascente e o poente e uma seta verde para o norte */
function RosaNoChao({ m, c, rotulos }: { m: Maquete; c: Conversor; rotulos: boolean }) {
  const raio = c.raio + 14;
  const { norte, leste } = eixos(m.norte);
  const pontos: [string, THREE.Vector3, string?][] = [
    ["N", norte.clone()],
    ["L", leste.clone(), "Nascente"],
    ["S", norte.clone().negate()],
    ["O", leste.clone().negate(), "Poente"],
  ];
  // triângulo deitado no chão: a ponta (eixo +y do círculo de 3 lados) gira para o norte
  const giroSeta = Math.atan2(-norte.x, -norte.z);
  return (
    <>
      <mesh rotation-x={-Math.PI / 2} position-y={0.3}>
        <ringGeometry args={[raio - 0.35, raio + 0.35, 160]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.85} depthWrite={false} />
      </mesh>
      <group position={norte.clone().multiplyScalar(raio + 4).setY(0.32)} rotation-y={giroSeta}>
        <mesh rotation-x={-Math.PI / 2}>
          <circleGeometry args={[3.2, 3, Math.PI / 2]} />
          <meshBasicMaterial color="#006b3f" />
        </mesh>
      </group>
      {rotulos &&
        pontos.map(([letra, d, sol]) => (
          <Html key={letra} position={d.multiplyScalar(raio + 8).setY(2)} center zIndexRange={[5, 0]} style={{ pointerEvents: "none" }}>
            {sol ? (
              <span className="flex items-center gap-1.5 whitespace-nowrap rounded-full bg-white/95 py-1 pl-1 pr-2.5 text-xs font-semibold text-ink shadow-e2">
                <span className="flex size-5 items-center justify-center rounded-full bg-green-900 text-[11px] font-bold text-white">{letra}</span>
                {sol === "Nascente" ? <Sunrise className="size-4 text-orange-500" aria-hidden /> : <Sunset className="size-4 text-orange-500" aria-hidden />}
                {sol}
              </span>
            ) : (
              <span
                className={`flex size-7 items-center justify-center rounded-full text-xs font-bold shadow-e2 ${letra === "N" ? "bg-green-900 text-white" : "bg-white/95 text-green-900"}`}
              >
                {letra}
              </span>
            )}
          </Html>
        ))}
    </>
  );
}

/**
 * Pontos conhecidos da cidade num anel em volta do lote, na direção real de cada um, com a distância
 * em linha reta. Rumos próximos sobem em degraus para os nomes não se sobreporem.
 */
function PontosDeReferencia({ lista, m, c, torres }: { lista: Referencia[]; m: Maquete; c: Conversor; torres: RefObject<THREE.Group> }) {
  const estreito = useThree((s) => s.size.width < 560);
  const raio = c.raio + 30;
  const norte = m.norte;
  const pinos = useMemo(() => {
    const visiveis = estreito ? [...lista].sort((a, b) => a.km - b.km).slice(0, 2) : lista;
    const ordem = [...visiveis].sort((a, b) => a.rumo - b.rumo);
    const niveis: number[] = [];
    for (let i = 0; i < ordem.length; i++) niveis.push(i > 0 && ordem[i].rumo - ordem[i - 1].rumo < 18 ? (niveis[i - 1] + 1) % 3 : 0);
    return ordem.map((r, i) => ({ ...r, altura: 14 + niveis[i] * 9, base: direcaoRumo(r.rumo, norte).multiplyScalar(raio) }));
  }, [lista, estreito, norte, raio]);
  return (
    <>
      {pinos.map((r) => (
        <group key={r.nome}>
          <mesh position={[r.base.x, r.altura / 2, r.base.z]}>
            <cylinderGeometry args={[0.22, 0.22, r.altura, 6]} />
            <meshBasicMaterial color="#793f98" />
          </mesh>
          <mesh position={[r.base.x, 0.35, r.base.z]} rotation-x={-Math.PI / 2}>
            <circleGeometry args={[1.6, 20]} />
            <meshBasicMaterial color="#793f98" />
          </mesh>
          <Html position={[r.base.x, r.altura + 1.5, r.base.z]} center occlude={[torres]} zIndexRange={[5, 0]} style={{ pointerEvents: "none" }}>
            <span className="flex items-center gap-1 whitespace-nowrap rounded-full bg-purple-700 px-2.5 py-1 text-xs font-semibold text-white shadow-e2">
              <MapPin className="size-3.5" aria-hidden />
              {r.nome} · {r.km.toLocaleString("pt-BR")} km
            </span>
          </Html>
        </group>
      ))}
    </>
  );
}

/** Gira a rosa dos ventos da interface para o norte apontar para o norte real na tela */
function GiroDaBussola({ alvo, norte, bussolaRef }: { alvo: THREE.Vector3; norte: number; bussolaRef: RefObject<HTMLDivElement | null> }) {
  const ultimo = useRef(NaN);
  const n = useMemo(() => eixos(norte).norte, [norte]);
  useFrame(({ camera }) => {
    const el = bussolaRef.current;
    if (!el) return;
    const f = alvo.clone().sub(camera.position).setY(0).normalize();
    // ângulo da frente da câmera até o norte, positivo no sentido horário visto de cima
    const ang = THREE.MathUtils.radToDeg(Math.atan2(f.x * n.z - f.z * n.x, f.x * n.x + f.z * n.z));
    if (Math.abs(ang - ultimo.current) < 0.2) return;
    ultimo.current = ang;
    el.style.transform = `rotate(${ang.toFixed(1)}deg)`;
  });
  return null;
}

/**
 * Onde cada miniatura fica: na direção real do lugar, num anel além dos pinos. Lugares que dividem o
 * mesmo modelo (lagoa e centro de Messejana) viram uma miniatura só; se duas caem perto demais, a
 * segunda vai para um anel mais longe.
 */
function posicionarMarcos(lista: Referencia[], norte: number, raioLote: number) {
  const grupos = new Map<string, Referencia[]>();
  for (const r of lista) if (r.marco && marcos[r.marco]) grupos.set(r.marco, [...(grupos.get(r.marco) ?? []), r]);
  const itens = [...grupos]
    .map(([id, refs]) => {
      const ordem = [...refs].sort((a, b) => a.km - b.km);
      return { id, refs: ordem, rumo: ordem[0].rumo };
    })
    .sort((a, b) => a.rumo - b.rumo);
  const postos: { id: string; refs: Referencia[]; pos: THREE.Vector3 }[] = [];
  for (const it of itens) {
    const dir = direcaoRumo(it.rumo, norte);
    let raio = raioLote + 75;
    while (postos.some((o) => o.pos.distanceTo(dir.clone().multiplyScalar(raio)) < 66) && raio < raioLote + 400) raio += 66;
    postos.push({ id: it.id, refs: it.refs, pos: dir.multiplyScalar(raio) });
  }
  return postos;
}

/** Miniaturas dos lugares da cidade, cada uma sobre uma base redonda, com o nome e a distância real */
function MarcosDaCidade({
  lugares,
  norte,
  fab,
  rotulos,
  torres,
}: {
  lugares: ReturnType<typeof posicionarMarcos>;
  norte: number;
  fab: Fabrica;
  rotulos: boolean;
  torres: RefObject<THREE.Group>;
}) {
  const estreito = useThree((s) => s.size.width < 560);
  const n = eixos(norte).norte;
  // o modelo tem o próprio norte em −z: gira para coincidir com o norte da cena
  const giro = Math.atan2(-n.x, -n.z);
  return (
    <>
      {lugares.map(({ id, refs, pos }) => {
        const { Modelo, altura } = marcos[id];
        const nomes = estreito ? refs.slice(0, 1) : refs;
        return (
          <group key={id} position={[pos.x, 0, pos.z]}>
            <mesh position-y={0.25} receiveShadow material={fab.cor("#e9e6df", 0.95)}>
              <cylinderGeometry args={[33, 34, 0.5, 48]} />
            </mesh>
            <group position-y={0.5} rotation-y={giro}>
              <Modelo fab={fab} />
            </group>
            {rotulos && (
              <Html position={[0, altura + 6, 0]} center occlude={[torres]} zIndexRange={[5, 0]} style={{ pointerEvents: "none" }}>
                <span className="flex flex-col items-center gap-1">
                  {nomes.map((r) => (
                    <span key={r.nome} className="flex items-center gap-1 whitespace-nowrap rounded-full bg-purple-700 px-2.5 py-1 text-xs font-semibold text-white shadow-e2">
                      <MapPin className="size-3.5" aria-hidden />
                      {r.nome} · {r.km.toLocaleString("pt-BR")} km
                    </span>
                  ))}
                </span>
              </Html>
            )}
          </group>
        );
      })}
    </>
  );
}
