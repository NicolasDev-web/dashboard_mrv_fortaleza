"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, LazyMotion, m, useReducedMotion } from "motion/react";
import type { EmpreendimentoResumo } from "@/lib/data";
import type { RegiaoSlug, Status } from "@/lib/types";
import { REGIAO_NOME, STATUS_ROTULO } from "@/lib/rotulos";
import { PropertyCard } from "@/components/empreendimento/PropertyCard";
import { CidadeMapa } from "@/components/mapa/CidadeMapa";
import { LayoutGrid, Map as IconeMapa } from "lucide-react";

type Filtros = { regiao: RegiaoSlug | null; status: Status | null; vaga: boolean; suite: boolean };
const VAZIO: Filtros = { regiao: null, status: null, vaga: false, suite: false };
/** "Vaga para quase todos": a partir de 0,8 vaga por apartamento. */
const VAGA_BOA = 0.8;
/** domMax (layout animation) chega depois da página: os filtros funcionam desde o início, o reposicionamento entra quando carregar. */
const recursos = () => import("@/lib/motion-layout").then((r) => r.default);

function Chip({ ativo, onClick, children }: { ativo: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={ativo}
      onClick={onClick}
      className="inline-flex h-10 shrink-0 items-center rounded-full border border-line-strong bg-white px-4 text-[15px] font-semibold text-ink transition-[background-color,border-color,color,transform] duration-[var(--t-fast)] ease-mrv active:scale-[0.97] hover:border-green-900 aria-pressed:border-green-900 aria-pressed:bg-green-900 aria-pressed:text-white"
    >
      {children}
    </button>
  );
}

export function Explorar({ lista }: { lista: EmpreendimentoResumo[] }) {
  const [f, setF] = useState<Filtros>(VAZIO);
  const [modo, setModo] = useState<"lista" | "mapa">("lista");
  // Só depois da 1ª troca a visualização entra com fade: no carregamento, a lista (e a foto do LCP) aparece direto.
  const [trocou, setTrocou] = useState(false);
  const reduzir = useReducedMotion();
  const visiveis = useMemo(
    () =>
      lista.filter(
        (e) =>
          (!f.regiao || e.regiao === f.regiao) &&
          (!f.status || e.status === f.status) &&
          (!f.vaga || e.vagasPorUnidade >= VAGA_BOA) &&
          (!f.suite || e.suite),
      ),
    [lista, f],
  );
  const alterna = <K extends keyof Filtros>(k: K, v: Filtros[K]) => setF((x) => ({ ...x, [k]: x[k] === v ? VAZIO[k] : v }));
  const algum = f.regiao || f.status || f.vaga || f.suite;
  const regioes = (Object.keys(REGIAO_NOME) as RegiaoSlug[]).filter((r) => lista.some((e) => e.regiao === r));
  const status = (Object.keys(STATUS_ROTULO) as Status[]).filter((s) => lista.some((e) => e.status === s));

  return (
    <LazyMotion features={recursos} strict>
      <div className="space-y-3" role="group" aria-label="Filtros">
        <div className="trilho -mx-5 gap-2 px-5 md:mx-0 md:flex-wrap md:px-0">
          {regioes.map((r) => (
            <Chip key={r} ativo={f.regiao === r} onClick={() => alterna("regiao", r)}>{REGIAO_NOME[r]}</Chip>
          ))}
        </div>
        <div className="trilho -mx-5 gap-2 px-5 md:mx-0 md:flex-wrap md:px-0">
          {status.map((s) => (
            <Chip key={s} ativo={f.status === s} onClick={() => alterna("status", s)}>{STATUS_ROTULO[s]}</Chip>
          ))}
          <Chip ativo={f.vaga} onClick={() => alterna("vaga", true)}>Vaga para quase todos</Chip>
          <Chip ativo={f.suite} onClick={() => alterna("suite", true)}>Com suíte</Chip>
        </div>
      </div>

      <div className="mt-6 flex min-h-11 flex-wrap items-center justify-between gap-3">
        <p className="text-muted" aria-live="polite">
          {visiveis.length} empreendimento{visiveis.length === 1 ? "" : "s"}
          {algum && (
            <button type="button" onClick={() => setF(VAZIO)} className="ml-2 h-11 rounded-md px-2 text-sm font-semibold text-green-900 hover:bg-selected">
              Limpar filtros
            </button>
          )}
        </p>
        <div className="inline-flex rounded-full border border-line-strong p-1" role="group" aria-label="Ver como">
          {([["lista", "Lista", LayoutGrid], ["mapa", "Mapa", IconeMapa]] as const).map(([v, rotulo, I]) => (
            <button key={v} type="button" aria-pressed={modo === v} onClick={() => { if (v !== modo) { setModo(v); setTrocou(true); } }}
              className="inline-flex h-9 items-center gap-1.5 rounded-full px-4 text-sm font-semibold text-ink transition-colors duration-[var(--t-base)] aria-pressed:bg-green-900 aria-pressed:text-white">
              <I className="size-4" aria-hidden /> {rotulo}
            </button>
          ))}
        </div>
      </div>

      {modo === "mapa" ? (
        <div className="funde mt-4 rounded-xl bg-green-950 p-3 md:p-5">
          <CidadeMapa
            className="mx-auto max-w-[760px]"
            pins={lista.map((e) => ({ ...e, apagado: !visiveis.includes(e) }))}
            acesos={[...new Set(visiveis.map((e) => e.bairroId).filter((id): id is number => id != null))]}
            titulo="Mapa dos empreendimentos filtrados"
          />
        </div>
      ) : visiveis.length === 0 ? (
        <div className="desdobra mt-4 rounded-lg border border-line p-6 text-muted">Nenhum empreendimento com esses filtros. Tente tirar um deles.</div>
      ) : (
        <ul className={`relative mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 ${trocou ? "funde" : ""}`}>
          <AnimatePresence initial={false} mode="popLayout">
            {visiveis.map((e, i) => (
              <m.li
                key={e.slug}
                layout={!reduzir}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
                transition={{ duration: 0.24, ease: [0.2, 0.8, 0.2, 1] }}
              >
                <PropertyCard e={e} priority={i < 2} sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw" titulo="h2" />
              </m.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </LazyMotion>
  );
}
