import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";
import { Shape } from "@/components/ui/Shape";
import { PropertyCard } from "@/components/empreendimento/PropertyCard";
import { Rodape } from "@/components/layout/Rodape";
import { Revela } from "@/components/ui/Revela";
import { CidadeMapa, type PinMapa } from "@/components/mapa/CidadeMapa";
import { daRegiao, empreendimentos, regioes } from "@/lib/data";

// Só o que o mapa precisa: o resto dos dados fica no servidor.
const pins: PinMapa[] = empreendimentos.map(({ slug, nome, bairroNome, cidade, status, coord, coordAproximada, imagens }) => ({
  slug, nome, bairroNome, cidade, status, coord, coordAproximada, imagens: { capa: imagens.capa },
}));
const acesos = [...new Set(empreendimentos.map((e) => e.bairroId).filter((id): id is number => id != null))];

export default function Home() {
  return (
    <>
      <section className="contem grid items-center gap-10 pb-12 pt-8 md:pt-14 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:pb-20">
        <div className="max-w-xl">
          <p className="entra mb-4 text-sm font-semibold uppercase tracking-[0.08em] text-green-700">Grande Fortaleza · 16 empreendimentos</p>
          <h1 className="entra t-display text-green-900">Vamos descobrir qual MRV combina com você</h1>
          <p className="entra mt-5 text-lg text-muted" style={{ "--atraso": "90ms" } as CSSProperties}>
            7 perguntas rápidas sobre a sua rotina. No fim, você vê os 3 empreendimentos que mais combinam e o porquê de cada um.
          </p>
          <div className="entra mt-8 flex flex-col gap-3 sm:flex-row" style={{ "--atraso": "180ms" } as CSSProperties}>
            <LinkButton href="/descobrir" className="w-full sm:w-auto">
              Começar agora <ArrowRight className="seta size-5" aria-hidden />
            </LinkButton>
            <LinkButton href="/empreendimentos" variante="ghost" className="w-full sm:w-auto">
              Ver todos os empreendimentos
            </LinkButton>
          </div>
          <p className="entra mt-4 text-sm text-muted" style={{ "--atraso": "240ms" } as CSSProperties}>Leva cerca de 2 minutos. Não pedimos nenhum dado pessoal.</p>
        </div>

        <div className="relative">
          <Shape className="entra-forma pointer-events-none absolute -left-12 -top-12 hidden w-36 lg:block" />
          <div className="relative overflow-hidden rounded-xl bg-green-950 p-3 text-white md:p-5">
            <div className="flex items-baseline justify-between gap-3 px-1 pb-2">
              <p className="font-semibold">Onde estão os 16 MRV</p>
              <p className="text-sm text-white/70">Toque num ponto</p>
            </div>
            <CidadeMapa pins={pins} acesos={acesos} />
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1 px-1 pt-2 text-[13px] text-white/75">
              <span className="inline-flex items-center gap-1.5"><span aria-hidden className="inline-block size-3 rounded-[3px] border-2 border-green-300 bg-white" /> Empreendimento</span>
              <span className="inline-flex items-center gap-1.5"><span aria-hidden className="inline-block size-2.5 bg-green-300" /> Bairros com MRV</span>
              <span className="inline-flex items-center gap-1.5"><span aria-hidden className="inline-block size-2.5 bg-sage-200/40" /> Caucaia e Eusébio</span>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-bg-subtle py-12 md:py-16" aria-labelledby="como-funciona">
        <div className="contem">
          <h2 id="como-funciona" className="t-h2 text-green-900">Como funciona</h2>
          <Revela as="ol" className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              ["Conte sua rotina", "Para onde você vai, quem mora com você e o que não pode faltar."],
              ["Veja quem combina", "Comparamos as respostas com os 16 empreendimentos e o entorno de cada um."],
              ["Conheça de perto", "Fotos, plantas, lazer e o caminho até o seu dia a dia."],
            ].map(([t, d], i) => (
              <li key={t} className="flex gap-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-green-900 text-base font-extrabold text-white">{i + 1}</span>
                <div>
                  <h3 className="t-card text-ink">{t}</h3>
                  <p className="mt-1 text-muted">{d}</p>
                </div>
              </li>
            ))}
          </Revela>
        </div>
      </section>

      <section className="py-12 md:py-20" aria-labelledby="empreendimentos">
        <div className="contem flex items-end justify-between gap-4">
          <h2 id="empreendimentos" className="t-h2 text-green-900">Empreendimentos na Grande Fortaleza</h2>
          <Link href="/empreendimentos" className="hidden shrink-0 items-center gap-1 font-semibold text-green-900 hover:underline md:inline-flex">
            Ver todos <ChevronRight className="seta size-4" aria-hidden />
          </Link>
        </div>
        <Revela as="ul" className="trilho mt-6 scroll-pl-5 gap-4 px-5 pb-2 md:scroll-pl-8 md:px-8 lg:contem lg:grid lg:grid-cols-3 lg:overflow-visible">
          {empreendimentos.slice(0, 6).map((e) => (
            <li key={e.slug} className="w-[78%] shrink-0 sm:w-[46%] lg:w-auto">
              <PropertyCard e={e} sizes="(min-width: 1024px) 380px, (min-width: 480px) 46vw, 78vw" />
            </li>
          ))}
        </Revela>
        <div className="contem mt-6 md:hidden">
          <LinkButton href="/empreendimentos" variante="secondary" className="w-full">Ver os 16 empreendimentos</LinkButton>
        </div>
      </section>

      <section className="bg-green-900 py-12 text-white md:py-16" aria-labelledby="regioes">
        <div className="contem">
          <h2 id="regioes" className="t-h2">Escolha pela região</h2>
          <Revela as="ul" className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {regioes.map((r) => (
              <li key={r.slug}>
                <Link
                  href={`/regioes/${r.slug}`}
                  className="flex h-full items-center justify-between gap-3 rounded-lg border border-white/25 px-4 py-4 transition-colors duration-[var(--t-fast)] hover:bg-white/10"
                >
                  <span>
                    <span className="block font-semibold">{r.nome}</span>
                    <span className="text-sm text-white/75">{daRegiao(r.slug).length} empreendimento{daRegiao(r.slug).length > 1 ? "s" : ""}</span>
                  </span>
                  <ChevronRight className="seta size-5 shrink-0 text-green-300" aria-hidden />
                </Link>
              </li>
            ))}
          </Revela>
        </div>
      </section>
      <Rodape />
    </>
  );
}
