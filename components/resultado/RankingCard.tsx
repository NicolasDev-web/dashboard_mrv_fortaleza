"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { GitCompareArrows } from "lucide-react";
import type { Imagem } from "@/lib/types";
import { Img } from "@/components/ui/Img";

const TROCA_MS = 2600;

type Props = {
  posicao: number;
  slug: string;
  nome: string;
  local: string;
  score: number;
  faixa: string;
  diferenca: string;
  fotos: Imagem[];
  query: string;
  /** slug do 1º lugar, para "Comparar com o 1º" */
  slug1: string;
};

/** Do 2º ao 5º: fotos alternando só enquanto o card está visível, barra de compatibilidade e a diferença para o 1º. */
export function RankingCard({ posicao, slug, nome, local, score, faixa, diferenca, fotos, query, slug1 }: Props) {
  const raiz = useRef<HTMLElement>(null);
  const reduzir = useReducedMotion();
  const [visto, setVisto] = useState(false);
  const [visivel, setVisivel] = useState(false);
  const [i, setI] = useState(0);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      setVisivel(e.isIntersecting);
      if (e.isIntersecting) setVisto(true);
    }, { threshold: 0.5 });
    if (raiz.current) io.observe(raiz.current);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!visivel || reduzir || fotos.length < 2) return;
    const t = setInterval(() => setI((n) => (n + 1) % fotos.length), TROCA_MS);
    return () => clearInterval(t);
  }, [visivel, reduzir, fotos.length]);

  const href = `/empreendimentos/${slug}${query ? `?${query}` : ""}`;
  return (
    <article ref={raiz} className="group relative flex gap-4 rounded-lg border border-line bg-white p-3 transition-shadow duration-[var(--t-base)] lg:hover:shadow-e2">
      <div className="relative aspect-[4/3] w-32 shrink-0 overflow-hidden rounded-md bg-ink sm:w-44">
        {fotos.map((f, k) => (
          <div key={f.id} className="absolute inset-0 transition-opacity duration-[600ms] ease-mrv" style={{ opacity: k === i ? 1 : 0 }} aria-hidden={k !== i}>
            <Img img={f} sizes="(min-width: 640px) 176px, 128px" className="h-full w-full" />
          </div>
        ))}
        <span className="absolute left-1.5 top-1.5 flex size-7 items-center justify-center rounded-[7px] bg-white text-[13px] font-extrabold text-green-950 shadow-e1">{posicao}</span>
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <h3 className="t-card text-ink">
          <Link href={href} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:rounded-lg focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:outline-green-500">
            {nome}
          </Link>
        </h3>
        <p className="truncate text-sm text-muted">{local}</p>
        <div className="mt-2 flex items-center gap-2">
          <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-line" aria-hidden>
            <span
              className="block h-full origin-left rounded-full bg-green-700 transition-transform duration-[900ms] ease-saida"
              style={{ transform: `scaleX(${visto || reduzir ? score / 100 : 0})` }}
            />
          </span>
          <span className="text-sm font-semibold tabular-nums text-green-900">{score}%</span>
        </div>
        <p className="sr-only">{faixa}</p>
        <p className="mt-1.5 text-[14px] leading-snug text-ink">{diferenca}</p>
        <Link href={`/comparar?ids=${slug1},${slug}${query ? `&${query}` : ""}`} className="relative z-10 mt-auto inline-flex min-h-10 items-center gap-1.5 self-start pt-1 text-sm font-semibold text-green-900 hover:underline">
          <GitCompareArrows className="size-4" aria-hidden /> Comparar com o 1º
        </Link>
      </div>
    </article>
  );
}
