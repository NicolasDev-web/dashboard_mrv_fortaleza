"use client";

import { useRef } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { NumeroContando } from "./NumeroContando";

const RAIO = 44;
const VOLTA = 2 * Math.PI * RAIO;

const TAMANHO = {
  md: { anel: "size-16", numero: "text-lg" },
  lg: { anel: "size-20 md:size-24", numero: "text-2xl md:text-3xl" },
  xl: { anel: "size-28 md:size-32", numero: "text-3xl md:text-4xl" },
} as const;

/**
 * A compatibilidade como um anel que se desenha enquanto o número conta (inspirado no Animated Circular
 * Progress Bar do Magic UI). Para fundo escuro: trilho branco translúcido, progresso green-300.
 */
export function AnelNota({ score, faixa, tamanho = "lg", iniciar = true, atraso = 0, className = "" }: {
  score: number;
  faixa: string;
  tamanho?: keyof typeof TAMANHO;
  iniciar?: boolean;
  /** segundos */
  atraso?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const visto = useInView(ref, { once: true });
  const reduzir = useReducedMotion();
  const ativo = reduzir || (visto && iniciar);
  const t = TAMANHO[tamanho];

  return (
    <div ref={ref} role="img" aria-label={`${score}% de compatibilidade: ${faixa}`} className={`flex items-center gap-3 ${className}`}>
      <div className={`relative shrink-0 ${t.anel}`}>
        <svg viewBox="0 0 100 100" className="size-full -rotate-90" aria-hidden>
          <circle cx="50" cy="50" r={RAIO} fill="none" strokeWidth="8" className="stroke-white/15" />
          <circle
            cx="50" cy="50" r={RAIO} fill="none" strokeWidth="8" strokeLinecap="round"
            className="stroke-green-300"
            strokeDasharray={VOLTA}
            strokeDashoffset={ativo ? VOLTA * (1 - score / 100) : VOLTA}
            style={{ transition: reduzir ? "none" : `stroke-dashoffset 1.2s cubic-bezier(0.16, 1, 0.3, 1) ${atraso}s` }}
          />
        </svg>
        <span className={`absolute inset-0 flex items-center justify-center font-extrabold text-white ${t.numero}`}>
          <NumeroContando valor={score} sufixo="%" iniciar={iniciar} atraso={atraso} />
        </span>
      </div>
      <span className="leading-tight" aria-hidden>
        <span className="block font-semibold text-white">{faixa}</span>
        <span className="block text-sm text-white/75">com o que você respondeu</span>
      </span>
    </div>
  );
}
