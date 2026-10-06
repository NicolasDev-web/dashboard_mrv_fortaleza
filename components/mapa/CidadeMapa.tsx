"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { ArrowRight, House, X } from "lucide-react";
import grade from "@/data/grade.json";
import type { Empreendimento } from "@/lib/types";
import { STATUS_ROTULO } from "@/lib/rotulos";
import { Img } from "@/components/ui/Img";

/**
 * Fortaleza em pixels, como no "Onde morar" do dashboard de bairros: cada pixel pertence a um bairro
 * (grade pré-calculada em scripts/build-grade.ts) e muda de tamanho e brilho numa onda que parte de um
 * ponto da cidade. Quando o brilho muda (uma resposta do quiz), os pixels vão do estado atual ao novo,
 * sem recomeçar. Por cima, os empreendimentos como marcadores. O canvas é decorativo (aria-hidden);
 * quem informa são os marcadores, que são botões com nome.
 */

export type PinMapa = Pick<Empreendimento, "slug" | "nome" | "bairroNome" | "cidade" | "status" | "coord" | "coordAproximada"> & {
  imagens: { capa: Empreendimento["imagens"]["capa"] };
  /** 0 a 1: tamanho e presença do marcador (nota parcial no quiz); padrão 1 */
  intensidade?: number;
  /** fora do filtro da pessoa: marcador apagado */
  apagado?: boolean;
  /** posição no ranking, mostrada no lugar do ícone */
  numero?: number;
};

export type DestinoMapa = { lat: number; lon: number; rotulo: string };

type Props = {
  pins: PinMapa[];
  /** bairros acesos (ids da malha), por padrão os que têm empreendimento; o resto da cidade fica a meia luz */
  acesos?: number[];
  /** brilho fino por bairro, de 0 a 1 (vence `acesos`) */
  brilho?: Record<number, number>;
  /** brilho de Caucaia e do Eusébio (padrão 0,2) */
  vizinhos?: { caucaia: number; eusebio: number };
  /** ponto de onde a onda parte, em fração do mapa [x, y]; memoize ou use constante */
  origem?: [number, number];
  /** para onde a pessoa vai todo dia: alvo pulsando */
  destino?: DestinoMapa;
  /** linha tracejada do marcador com este slug até o destino, com o texto ao lado (ex.: "~35 min") */
  linha?: { slug: string; texto: string };
  /** sem seleção nem cartão: só mostra (faixa do quiz) */
  somenteLeitura?: boolean;
  className?: string;
  titulo?: string;
};

const { bbox, ids, cod, grades } = grade;
const DUR = 620;
const ORIGEM_PADRAO: [number, number] = [0.5, 0.45];
const VIZINHOS_PADRAO = { caucaia: 0.2, eusebio: 0.2 };
const ESPALHAR = 900; // tempo para a onda atravessar o mapa numa mudança
const ESPALHAR_ENTRADA = 1300; // primeira entrada, mais cerimoniosa

// Paleta MRV sobre verde profundo #00331F: apagado = verde médio, aceso = verde claro.
const APAGADO: [number, number, number] = [7, 157, 86];
const ACESO: [number, number, number] = [130, 234, 91];
const VIZINHO: [number, number, number] = [205, 225, 179];

function decodificar(b64: string) {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

/** Posição do ponto no mapa, em fração [0..1] da largura e da altura. */
export function projetar(lat: number, lon: number): [number, number] {
  return [(lon - bbox.lonMin) / (bbox.lonMax - bbox.lonMin), (bbox.latMax - lat) / (bbox.latMax - bbox.latMin)];
}

/** Empreendimentos quase no mesmo ponto (Farol e Brisa, Lisboa e Porto) se afastam num pequeno leque. */
function espalhar(pins: PinMapa[], proporcao: number) {
  const pos = pins.map((p) => projetar(p.coord.lat, p.coord.lon));
  const RAIO = 0.028;
  const usados = new Set<number>();
  const saida = pos.map((p) => [...p] as [number, number]);
  pos.forEach((p, i) => {
    if (usados.has(i)) return;
    const grupo = pos.map((q, j) => ({ j, d: Math.hypot(q[0] - p[0], (q[1] - p[1]) * proporcao) })).filter((x) => x.d < RAIO).map((x) => x.j);
    if (grupo.length < 2) return;
    const cx = grupo.reduce((s, j) => s + pos[j][0], 0) / grupo.length;
    const cy = grupo.reduce((s, j) => s + pos[j][1], 0) / grupo.length;
    grupo.forEach((j, k) => {
      usados.add(j);
      const a = (2 * Math.PI * k) / grupo.length - Math.PI / 2;
      saida[j] = [cx + Math.cos(a) * RAIO * 0.75, cy + (Math.sin(a) * RAIO * 0.75) / proporcao];
    });
  });
  return saida;
}

type Motor = {
  /** define o novo brilho de cada célula e dispara a onda a partir de `origem` */
  alvo: (alvo: Float32Array, origem: [number, number], espalhar: number) => void;
};

export function CidadeMapa({
  pins, acesos, brilho, vizinhos = VIZINHOS_PADRAO, origem = ORIGEM_PADRAO, destino, linha,
  somenteLeitura = false, className = "", titulo = "Mapa de Fortaleza com os empreendimentos MRV",
}: Props) {
  const caixa = useRef<HTMLDivElement>(null);
  const tela = useRef<HTMLCanvasElement>(null);
  const motor = useRef<Motor | null>(null);
  const primeira = useRef(true);
  const [selecionado, setSelecionado] = useState<string | null>(null);
  // Tamanho do mapa: "mini" (faixa do quiz no celular), "estreito" (celular) ou cheio (desktop).
  const [tamanho, setTamanho] = useState<"mini" | "estreito" | "cheio">("cheio");
  const estreito = tamanho !== "cheio";
  const mini = tamanho === "mini";
  const g = mini ? grades[0] : estreito ? grades[1] : grades[2];
  const proporcao = g.lins / g.cols;
  const celulas = useMemo(() => decodificar(g.celulas), [g]);
  const posicoes = useMemo(() => espalhar(pins, proporcao), [pins, proporcao]);

  // Brilho de destino de cada célula (-1 = fora do mapa).
  const alvo = useMemo(() => {
    const out = new Float32Array(celulas.length);
    const lit = new Set(acesos ?? []);
    for (let k = 0; k < celulas.length; k++) {
      const v = celulas[k];
      if (v === cod.vazio) out[k] = -1;
      else if (v === cod.caucaia) out[k] = vizinhos.caucaia;
      else if (v === cod.eusebio) out[k] = vizinhos.eusebio;
      else {
        const id = ids[v];
        out[k] = brilho?.[id] ?? (lit.has(id) ? 0.85 : 0.3);
      }
    }
    return out;
  }, [celulas, acesos, brilho, vizinhos]);

  useEffect(() => {
    const el = caixa.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => {
      const w = e.contentRect.width;
      setTamanho(w < 260 ? "mini" : w < 520 ? "estreito" : "cheio");
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Motor: um laço de desenho por grade; o estado (t de cada célula) sobrevive às mudanças de brilho.
  useEffect(() => {
    const canvas = tela.current, el = caixa.current;
    if (!canvas || !el) return;
    const ctx = canvas.getContext("2d")!;
    const reduzir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const n = celulas.length;
    const t = new Float32Array(n), de = new Float32Array(n), para = new Float32Array(n).fill(-1), inicio = new Float32Array(n), ruido = new Float32Array(n);
    for (let k = 0; k < n; k++) ruido[k] = Math.random();
    let largura = 0, altura = 0, lado = 0, visivel = true, raf = 0;

    const medir = () => {
      const r = el.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      largura = r.width; altura = r.width * proporcao; lado = largura / g.cols;
      canvas.width = Math.round(largura * dpr); canvas.height = Math.round(altura * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const suave = (x: number) => 1 - Math.pow(1 - x, 3);
    const desenhar = (agora: number) => {
      ctx.clearRect(0, 0, largura, altura);
      const varre = reduzir ? -1e9 : ((agora / 7000) % 1) * (largura + 240) - 120;
      let pendente = false;
      for (let k = 0; k < n; k++) {
        const a = para[k];
        if (a < 0) continue;
        if (reduzir) t[k] = a;
        else {
          const p = Math.min(1, Math.max(0, (agora - inicio[k]) / DUR));
          if (p < 1) pendente = true;
          t[k] = de[k] + (a - de[k]) * suave(p);
        }
        const x = (k % g.cols) * lado, y = ((k / g.cols) | 0) * lado;
        const luz = Math.exp(-(((x - varre) / 46) ** 2));
        const v = t[k];
        const tam = lado * (0.3 + 0.56 * v + 0.14 * luz);
        if (tam < 0.6) continue;
        const fora = celulas[k] === cod.caucaia || celulas[k] === cod.eusebio;
        const [r0, g0, b0] = fora ? VIZINHO : APAGADO;
        const [r1, g1, b1] = fora ? VIZINHO : ACESO;
        const m = Math.min(1, v + 0.2 * luz);
        const alfa = fora ? 0.1 + 0.9 * v + 0.15 * luz : Math.min(1, 0.5 + 0.5 * v + 0.2 * luz);
        ctx.fillStyle = `rgba(${(r0 + (r1 - r0) * m) | 0},${(g0 + (g1 - g0) * m) | 0},${(b0 + (b1 - b0) * m) | 0},${Math.min(1, alfa)})`;
        const off = (lado - tam) / 2;
        ctx.fillRect(x + off, y + off, tam, tam);
      }
      return pendente;
    };
    const laco = (agora: number) => {
      if (!visivel || document.hidden) { raf = 0; return; }
      const pendente = desenhar(agora);
      if (reduzir && !pendente) { raf = 0; return; }
      raf = requestAnimationFrame(laco);
    };
    const iniciar = () => { if (!raf) raf = requestAnimationFrame(laco); };

    motor.current = {
      alvo(novo, [ox, oy], espalharMs) {
        const agora = performance.now();
        const diag = Math.hypot(g.cols, g.lins);
        for (let k = 0; k < n; k++) {
          de[k] = para[k] < 0 ? 0 : t[k];
          para[k] = novo[k];
          const i = k % g.cols, j = (k / g.cols) | 0;
          inicio[k] = reduzir ? 0 : agora + (Math.hypot(i - ox * g.cols, j - oy * g.lins) / diag) * espalharMs + ruido[k] * 160;
        }
        if (reduzir) desenhar(agora);
        iniciar();
      },
    };

    medir();
    const io = new IntersectionObserver(([e]) => { visivel = e.isIntersecting; if (visivel) iniciar(); });
    io.observe(canvas);
    const ro = new ResizeObserver(() => { medir(); if (reduzir) desenhar(performance.now()); });
    ro.observe(el);
    const aoVoltar = () => { if (!document.hidden) iniciar(); };
    document.addEventListener("visibilitychange", aoVoltar);
    primeira.current = true;
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", aoVoltar);
      motor.current = null;
    };
  }, [celulas, g, proporcao]);

  // Cada mudança de brilho vira uma onda a partir da origem (a resposta que acabou de ser dada).
  useEffect(() => {
    motor.current?.alvo(alvo, origem, primeira.current ? ESPALHAR_ENTRADA : ESPALHAR);
    primeira.current = false;
  }, [alvo, origem]);

  const fechar = useCallback(() => setSelecionado(null), []);
  useEffect(() => {
    if (!selecionado) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && fechar();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [selecionado, fechar]);

  const atual = pins.find((p) => p.slug === selecionado);
  const posDestino = destino ? projetar(destino.lat, destino.lon) : null;
  const iLinha = linha ? pins.findIndex((p) => p.slug === linha.slug) : -1;
  const posLinha = iLinha >= 0 ? posicoes[iLinha] : null;

  return (
    <div className={`relative ${className}`}>
      <div ref={caixa} className="relative w-full select-none" style={{ aspectRatio: `${g.cols} / ${g.lins}` }} role="group" aria-label={titulo}>
        <canvas ref={tela} aria-hidden className="absolute inset-0 h-full w-full" />

        {posDestino && posLinha && (
          <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
            <line
              x1={posLinha[0] * 100} y1={posLinha[1] * 100} x2={posDestino[0] * 100} y2={posDestino[1] * 100}
              stroke="var(--color-green-300)" strokeWidth={2} strokeDasharray="5 4" vectorEffect="non-scaling-stroke" className="linha-destino"
            />
          </svg>
        )}
        {posDestino && posLinha && linha && (
          <span
            className="pointer-events-none absolute z-[1] -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-green-950/85 px-2 py-0.5 text-[12px] font-semibold text-green-300"
            style={{ left: `${((posLinha[0] + posDestino[0]) / 2) * 100}%`, top: `${((posLinha[1] + posDestino[1]) / 2) * 100}%` }}
          >
            {linha.texto}
          </span>
        )}
        {posDestino && destino && (
          <div className="pointer-events-none absolute z-[1]" style={{ left: `${posDestino[0] * 100}%`, top: `${posDestino[1] * 100}%` }} aria-hidden>
            <span className="pulso-destino absolute -left-3 -top-3 size-6 rounded-full border-2 border-white" />
            <span className="absolute -left-[5px] -top-[5px] size-2.5 rounded-full bg-white" />
            {!mini && <span className="absolute left-3 top-1 whitespace-nowrap rounded-full bg-white px-2 py-0.5 text-[12px] font-semibold text-green-950 shadow-e2">{destino.rotulo}</span>}
          </div>
        )}

        <ul className="absolute inset-0">
          {pins.map((p, i) => {
            const [x, y] = posicoes[i];
            const ativo = selecionado === p.slug;
            const k = p.intensidade ?? 1;
            const escala = p.apagado ? 0.6 : 0.7 + 0.4 * k;
            const conteudo = p.numero != null ? <span className="text-[11px] font-extrabold leading-none">{p.numero}</span> : <House className={ativo ? "size-4" : "size-3"} strokeWidth={2.5} aria-hidden />;
            // No mapa mini, cada empreendimento é só um ponto: 16 ícones não cabem em 150 px.
            const marcador = mini ? (
              <span
                className="block size-2 rounded-[2px] bg-white shadow-[0_0_0_2px_rgb(0_51_31)] transition-[transform,opacity] duration-[var(--t-emph)] ease-saida"
                style={{ transform: `scale(${p.apagado ? 0.6 : 0.8 + 0.6 * k})`, opacity: p.apagado ? 0.2 : 0.45 + 0.55 * k }}
              />
            ) : (
              <span
                className={`flex items-center justify-center rounded-[7px] border-2 shadow-[0_2px_6px_rgb(0_0_0/0.35)] transition-[transform,background-color,border-color,opacity] duration-[var(--t-emph)] ease-saida ${
                  ativo || p.numero === 1
                    ? "size-7 border-white bg-green-300 text-green-950"
                    : `${estreito ? "size-[18px]" : "size-[22px]"} border-green-300 bg-white text-green-900`
                } ${somenteLeitura ? "" : "group-focus-visible:ring-2 group-focus-visible:ring-green-500 group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-green-950"}`}
                style={{ transform: `scale(${ativo ? 1.1 : escala})`, opacity: p.apagado ? 0.25 : 0.45 + 0.55 * k }}
              >
                {conteudo}
              </span>
            );
            return (
              <li key={p.slug} className="absolute" style={{ left: `${x * 100}%`, top: `${y * 100}%`, zIndex: p.numero === 1 ? 3 : p.numero ? 2 : undefined } as CSSProperties}>
                {somenteLeitura ? (
                  <span className="pino absolute -left-[14px] -top-[14px] flex size-7 items-center justify-center" style={{ animationDelay: `${700 + i * 45}ms` }}>
                    {marcador}
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setSelecionado(ativo ? null : p.slug)}
                    onMouseEnter={() => window.matchMedia("(hover: hover)").matches && setSelecionado(p.slug)}
                    aria-label={`${p.numero ? `${p.numero}º lugar: ` : ""}${p.nome}, ${p.bairroNome}, ${p.cidade}`}
                    aria-pressed={ativo}
                    className="pino group absolute -left-[22px] -top-[22px] flex size-11 items-center justify-center rounded-full outline-none"
                    // os pinos caem em sequência depois que a onda de pixels passa
                    style={{ animationDelay: `${700 + i * 45}ms` } as CSSProperties}
                  >
                    {marcador}
                    {ativo && <span aria-hidden className="pulso absolute inset-0 rounded-full border-2 border-green-300" />}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {atual && !somenteLeitura && (
        <div className="cartao-pino relative z-10 mt-3 md:absolute md:bottom-4 md:right-4 md:mt-0 md:w-80" role="dialog" aria-label={atual.nome}>
          <div className="flex items-stretch overflow-hidden rounded-lg bg-white text-ink shadow-e3">
            <Img img={atual.imagens.capa} sizes="112px" className="w-28 shrink-0" />
            <div className="min-w-0 flex-1 p-3">
              <p className="text-[12px] font-semibold uppercase tracking-[0.04em] text-green-700">
                {atual.numero ? `${atual.numero}º para você · ` : ""}{STATUS_ROTULO[atual.status]}
              </p>
              <p className="mt-0.5 truncate font-semibold leading-snug">{atual.nome}</p>
              <p className="truncate text-sm text-muted">{atual.bairroNome} · {atual.cidade}{atual.coordAproximada ? " · local aproximado" : ""}</p>
              <Link href={`/empreendimentos/${atual.slug}`} className="mt-1.5 inline-flex min-h-9 items-center gap-1 text-sm font-semibold text-green-900 hover:underline">
                Conhecer <ArrowRight className="seta size-4" aria-hidden />
              </Link>
            </div>
            <button type="button" onClick={fechar} aria-label="Fechar" className="flex w-10 shrink-0 items-start justify-center pt-2 text-muted hover:text-ink">
              <X className="size-5" aria-hidden />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
