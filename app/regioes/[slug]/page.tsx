import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BusFront, Check, ChevronLeft, Clock } from "lucide-react";
import { RegionMap } from "@/components/regiao/RegionMap";
import { PropertyCard } from "@/components/empreendimento/PropertyCard";
import { Rodape } from "@/components/layout/Rodape";
import { Revela } from "@/components/ui/Revela";
import { bairros, contagensPorRegiao, dadosScoring, daRegiao, polos, regiaoPorSlug, regioes } from "@/lib/data";
import { minutosTexto, tempoAte } from "@/lib/scoring/score";
import type { NotaBairro } from "@/lib/types";

export const dynamicParams = false;

export function generateStaticParams() {
  return regioes.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/regioes/[slug]">): Promise<Metadata> {
  const r = regiaoPorSlug((await params).slug);
  return r ? { title: `Região ${r.nome}`, description: r.resumo } : {};
}

const mediana = (l: number[]) => {
  const s = [...l].sort((a, b) => a - b);
  return s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2;
};

const FORTE: Record<NotaBairro, string> = {
  saude: "Hospitais e postos de saúde por perto",
  escolas: "Muitas escolas por perto",
  comercio: "Bom comércio do dia a dia",
  lazer: "Praças, parques e lazer",
  mobilidade: "Muitas opções de ônibus e metrô",
};

/** Pontos fortes do entorno: só temas em que os bairros da região ficam entre os 30% melhores da cidade. */
function pontosFortes(ids: number[]): string[] {
  const bs = bairros.filter((b) => ids.includes(b.id));
  if (!bs.length) return [];
  return (Object.keys(FORTE) as NotaBairro[])
    .map((t) => ({ t, n: bs.reduce((s, b) => s + (b.notas[t] ?? 0), 0) / bs.length }))
    .filter((x) => x.n >= 70)
    .sort((a, b) => b.n - a.n)
    .map((x) => FORTE[x.t]);
}

export default async function RegiaoPage({ params }: PageProps<"/regioes/[slug]">) {
  const regiao = regiaoPorSlug((await params).slug);
  if (!regiao) notFound();
  const lista = daRegiao(regiao.slug);
  const dados = dadosScoring();
  const tempos = polos
    .map((p) => {
      const ts = lista.map((e) => tempoAte(e, p.id, dados)).filter((t) => t != null);
      return { polo: p, min: mediana(ts.map((t) => t!.minutos)), estimado: ts.some((t) => t!.estimado) };
    })
    .sort((a, b) => a.min - b.min)
    .slice(0, 4);
  const fortes = pontosFortes([...new Set(lista.map((e) => e.bairroId).filter((id): id is number => id != null))]);
  const nomesBairros = [...new Set(lista.map((e) => e.bairroNome))];

  return (
    <>
      <section className="bg-green-900 text-white">
        <div className="contem grid gap-8 py-8 md:py-12 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <Link href="/regioes" className="inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-green-300 hover:underline">
              <ChevronLeft className="size-4" aria-hidden /> Todas as regiões
            </Link>
            <h1 className="t-display mt-2">{regiao.nome}</h1>
            <p className="mt-4 max-w-md text-lg text-white/85">{regiao.resumo}</p>
            <p className="mt-3 text-white/70">
              {lista.length} empreendimento{lista.length > 1 ? "s" : ""} em {nomesBairros.join(", ").replace(/, ([^,]*)$/, " e $1")}
            </p>
          </div>
          <div className="rounded-xl bg-white p-3">
            <RegionMap destaque={regiao.slug} contagens={contagensPorRegiao()} className="w-full" />
          </div>
        </div>
      </section>

      <div className="contem grid gap-10 py-10 lg:grid-cols-2">
        <section aria-labelledby="tempos">
          <h2 id="tempos" className="t-h2 text-green-900">Tempo típico de ônibus</h2>
          <ul className="mt-5 divide-y divide-line rounded-lg border border-line">
            {tempos.map(({ polo, min }) => (
              <li key={polo.id} className="flex items-center justify-between gap-4 px-4 py-3">
                <span className="flex items-center gap-2.5"><BusFront className="size-5 text-green-900" strokeWidth={1.75} aria-hidden /> {polo.nome}</span>
                <span className="flex items-center gap-1.5 font-semibold tabular-nums"><Clock className="size-4 text-muted" aria-hidden /> ~{minutosTexto(min)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-sm text-muted">
            {tempos.some((t) => t.estimado) ? "Estimativa pela distância (fora de Fortaleza não calculamos as linhas)." : "Mediana entre os empreendimentos da região, em dia útil, sem trânsito."}
          </p>
        </section>
        {fortes.length > 0 && (
          <section aria-labelledby="fortes">
            <h2 id="fortes" className="t-h2 text-green-900">Pontos fortes do entorno</h2>
            <ul className="mt-5 space-y-3">
              {fortes.map((f) => (
                <li key={f} className="flex gap-2 text-ink"><Check className="mt-1 size-4 shrink-0 text-green-700" strokeWidth={2.5} aria-hidden /> {f}</li>
              ))}
            </ul>
            <p className="mt-3 text-sm text-muted">Comparado aos 121 bairros de Fortaleza, com dados do OpenStreetMap.</p>
          </section>
        )}
      </div>

      <section className="contem pb-12" aria-labelledby="lista">
        <h2 id="lista" className="t-h2 text-green-900">Empreendimentos na região</h2>
        <Revela as="ul" className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {lista.map((e) => (
            <li key={e.slug}><PropertyCard e={e} sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw" /></li>
          ))}
        </Revela>
      </section>
      <Rodape />
    </>
  );
}
