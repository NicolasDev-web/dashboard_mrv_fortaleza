"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { ArrowLeft, Check, Info } from "lucide-react";
import type { Bairro, Destino, Polo } from "@/lib/types";
import type { EmpreendimentoResumo } from "@/lib/data";
import { pontuar } from "@/lib/scoring/score";
import { codificar, decodificar, respondeuAlgo } from "@/lib/quiz/url";

/** Aparece só quando a pessoa chega pelo resultado do quiz (respostas na URL). */
export function PorQueCombina({ e, bairros, polos, destinos }: { e: EmpreendimentoResumo; bairros: Bairro[]; polos: Polo[]; destinos: Destino[] }) {
  const params = useSearchParams();
  const r = useMemo(() => decodificar(params), [params]);
  const rec = useMemo(() => (respondeuAlgo(r) ? pontuar(e, r, { empreendimentos: [e], bairros, polos, destinos }) : null), [e, r, bairros, polos, destinos]);
  if (!rec) return null;
  return (
    <section aria-labelledby="por-que" className="rounded-lg bg-bg-subtle p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="por-que" className="t-card text-green-900">Por que combina com você</h2>
        <span className="text-sm font-semibold text-green-700">
          {rec.faixa} · {rec.score} de 100
        </span>
      </div>
      <ul className="mt-3 space-y-2">
        {rec.motivos.map((m) => (
          <li key={m} className="flex gap-2 text-ink">
            <Check className="mt-1 size-4 shrink-0 text-green-700" strokeWidth={2.5} aria-hidden /> {m}
          </li>
        ))}
        {rec.atencoes.map((a) => (
          <li key={a} className="flex gap-2 text-muted">
            <Info className="mt-1 size-4 shrink-0 text-orange-500" aria-hidden /> {a}
          </li>
        ))}
      </ul>
      <Link href={`/descobrir/resultado?${codificar(r)}`} className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-green-900 hover:underline">
        <ArrowLeft className="size-4" aria-hidden /> Voltar ao meu resultado
      </Link>
    </section>
  );
}
