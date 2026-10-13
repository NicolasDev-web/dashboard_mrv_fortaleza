"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CidadeMapa, projetar, type DestinoMapa, type PinMapa } from "@/components/mapa/CidadeMapa";
import type { Imagem } from "@/lib/types";
import { Img } from "@/components/ui/Img";
import { TextoDesfoque } from "@/components/efeitos/TextoDesfoque";
import { AnelNota } from "@/components/efeitos/AnelNota";
import { soltarConfete } from "@/components/efeitos/confete";

/**
 * A revelação entre o quiz e o resultado (~5 s, pulável). Atos:
 * 1. o mapa apaga quem ficou de fora e numera do 5º ao 2º;
 * 2. o pino do 1º pulsa em ondas e a foto dele abre em círculo a partir do pino até cobrir a tela;
 * 3. sobre a foto, o nome sai do desfoque, o anel da compatibilidade se desenha e cai o confete;
 * 4. tudo some em fade sobre o topo do resultado, que mostra a mesma foto (sem corte seco).
 * Só aparece quando a pessoa chega do quiz; com prefers-reduced-motion, não aparece.
 */
// ms de cada etapa: apaga, #5, #4, #3, #2, #1 + ondas, portal, nome, nota + confete, saída, fim
const TEMPOS = [450, 800, 1050, 1300, 1550, 1900, 2350, 2950, 3350, 4500, 5000];
const ETAPA = { ondas: 6, portal: 7, nome: 8, nota: 9, saindo: 10 } as const;

export function Revelacao({ pins, top, destino, nome1, capa1, score1, faixa1, motivo1, onFim }: {
  pins: PinMapa[];
  /** slugs do top 5 na ordem */
  top: string[];
  destino?: DestinoMapa;
  nome1: string;
  /** a 1ª foto do topo do resultado: o portal abre nela para a troca não ter corte */
  capa1: Imagem;
  score1: number;
  faixa1: string;
  motivo1?: string;
  onFim: () => void;
}) {
  const [etapa, setEtapa] = useState(0);
  const mapa = useRef<HTMLDivElement>(null);
  // de onde o portal abre: o pino do 1º, medido na tela no momento do corte
  const [origem, setOrigem] = useState(() => ({ x: window.innerWidth / 2, y: window.innerHeight / 2 }));

  const p1 = pins.find((p) => p.slug === top[0]);
  const [x1, y1] = p1 ? projetar(p1.coord.lat, p1.coord.lon) : [0.5, 0.5];

  useEffect(() => {
    const ts = TEMPOS.map((t, k) => setTimeout(() => {
      const prox = k + 1;
      if (prox === TEMPOS.length) return onFim();
      if (prox === ETAPA.portal) {
        const r = mapa.current?.getBoundingClientRect();
        if (r) setOrigem({ x: r.left + x1 * r.width, y: r.top + y1 * r.height });
      }
      if (prox === ETAPA.nota) void soltarConfete();
      setEtapa(prox);
    }, t));
    const tecla = (e: KeyboardEvent) => { if (e.key === "Escape") onFim(); };
    window.addEventListener("keydown", tecla);
    return () => { ts.forEach(clearTimeout); window.removeEventListener("keydown", tecla); };
  }, [onFim, x1, y1]);

  const numeros = top.length;
  const comEstado = useMemo(() => pins.map((p) => {
    const pos = top.indexOf(p.slug);
    // etapa 1 apaga os de fora; as seguintes revelam do último colocado ao 1º
    const revelado = pos >= 0 && etapa >= 1 + (numeros - pos);
    return { ...p, apagado: etapa >= 1 && pos < 0, intensidade: pos >= 0 ? 1 : 0.4, numero: revelado ? pos + 1 : undefined };
  }), [pins, top, etapa, numeros]);

  const aberto = etapa >= ETAPA.portal;
  const mostra = (a: number) => `transition-[opacity,transform] duration-[600ms] ease-saida ${etapa >= a ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`;

  return (
    <div
      className="revelacao escuro fixed inset-0 z-50 overflow-hidden bg-green-950 text-white transition-opacity duration-500 ease-mrv"
      style={{ opacity: etapa >= ETAPA.saindo ? 0 : 1 }}
      role="status"
      aria-label={`Encontramos o seu MRV: ${nome1}, ${score1}% de compatibilidade`}
      onClick={onFim}
    >
      {/* Ato 1: o mapa */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-5 transition-opacity duration-500" style={{ opacity: aberto ? 0 : 1 }} aria-hidden>
        <p className="mb-4 text-center text-sm font-semibold uppercase tracking-[0.1em] text-green-300">
          {etapa < ETAPA.ondas ? `Comparando os ${pins.length} com as suas respostas` : "Encontramos o seu MRV"}
        </p>
        <div ref={mapa} className="relative w-full max-w-[640px]">
          <CidadeMapa pins={comEstado} destino={destino} somenteLeitura titulo="Revelação do ranking" />
          {etapa >= ETAPA.ondas && (
            <div className="pointer-events-none absolute" style={{ left: `${x1 * 100}%`, top: `${y1 * 100}%` }}>
              <span className="onda" /><span className="onda" /><span className="onda" />
            </div>
          )}
        </div>
      </div>

      {/* Ato 2: a foto do 1º abre em círculo a partir do pino (montada desde o início: já está baixada no corte) */}
      <div
        className="portal absolute inset-0"
        style={{ clipPath: `circle(${aberto ? "150%" : "0%"} at ${origem.x}px ${origem.y}px)` }}
        aria-hidden
      >
        <div className={aberto ? "kb kb-0" : "h-full w-full"} style={{ animationDuration: "7s" }}>
          <Img img={capa1} priority sizes="(min-width: 1024px) 1200px, 200vw" className="h-full w-full" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-green-950 via-green-950/60 to-green-950/10" />
      </div>

      {/* Ato 3: nome, motivo, nota */}
      <div className="absolute inset-x-0 bottom-0 px-5 pb-[calc(96px+env(safe-area-inset-bottom))] md:px-10" aria-hidden>
        <div className="mx-auto max-w-[1200px]">
          <p className={`text-sm font-semibold uppercase tracking-[0.12em] text-green-300 ${mostra(ETAPA.nome)}`}>Seu MRV é…</p>
          <p className="t-display mt-2 max-w-3xl">
            <TextoDesfoque texto={nome1} ativo={etapa >= ETAPA.nome} atraso={200} passo={90} />
          </p>
          {motivo1 && <p className={`mt-3 max-w-xl text-lg text-white/85 ${mostra(ETAPA.nome)}`} style={{ transitionDelay: "450ms" }}>{motivo1}</p>}
          <div className={`mt-6 ${mostra(ETAPA.nota)}`}>
            <AnelNota score={score1} faixa={faixa1} tamanho="xl" iniciar={etapa >= ETAPA.nota} />
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onFim}
        className="absolute bottom-[calc(24px+env(safe-area-inset-bottom))] left-1/2 h-11 -translate-x-1/2 rounded-full border border-white/25 bg-green-950/40 px-6 text-sm font-semibold text-white backdrop-blur-sm hover:bg-white/10"
      >
        Pular
      </button>
    </div>
  );
}
