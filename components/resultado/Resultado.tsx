"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { ArrowRight, ChevronDown, Info, RefreshCcw } from "lucide-react";
import type { EmpreendimentoResumo } from "@/lib/data";
import type { Bairro, Destino, Polo } from "@/lib/types";
import type { Capitulo } from "@/lib/filme";
import { recomendar, minutosTexto } from "@/lib/scoring/score";
import { diferencaPara1, motivosPorCapitulo } from "@/lib/scoring/apresentacao";
import { CHAVE_REVELAR, codificar, decodificar, respondeuAlgo } from "@/lib/quiz/url";
import { frasePerfil } from "@/lib/quiz/perfil";
import { destinoAte, destinoNome, ehBairro, idBairro } from "@/lib/quiz/destino";
import { REGIAO_NOME, quartosTexto } from "@/lib/rotulos";
import { Filme } from "@/components/filme/Filme";
import { CidadeMapa, type DestinoMapa, type PinMapa } from "@/components/mapa/CidadeMapa";
import { ContactCTA } from "@/components/empreendimento/ContactCTA";
import { LinkButton } from "@/components/ui/Button";
import { Revela } from "@/components/ui/Revela";
import { Revelacao } from "./Revelacao";
import { RankingCard } from "./RankingCard";
import { PreviaFlutuante } from "./PreviaFlutuante";

type Props = {
  dados: { empreendimentos: EmpreendimentoResumo[]; bairros: Bairro[]; polos: Polo[]; destinos: Destino[] };
  /** capítulos do filme de cada empreendimento */
  filmes: Record<string, Capitulo[]>;
  pins: PinMapa[];
};

export function Resultado({ dados, filmes, pins }: Props) {
  const params = useSearchParams();
  const respostas = useMemo(() => decodificar(params), [params]);
  const query = codificar(respostas);
  const { top, ranking, regiao } = useMemo(() => recomendar(respostas, dados), [respostas, dados]);
  const porSlug = useMemo(() => new Map(dados.empreendimentos.map((e) => [e.slug, e])), [dados]);
  const [completo, setCompleto] = useState(false);

  // Revelação só para quem acabou de terminar o quiz (não para um link compartilhado ou recarregado).
  // Começa em false, como no servidor (ler o sessionStorage no useState quebrava a hidratação), e liga
  // no useLayoutEffect, que roda antes da primeira pintura: o resultado não aparece por baixo antes da hora.
  const [revelando, setRevelando] = useState(false);
  useLayoutEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- valor só existe no navegador; ver acima
      if (sessionStorage.getItem(CHAVE_REVELAR) === query && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) setRevelando(true);
    } catch { /* sem storage: sem revelação */ }
    // só na chegada: a query não muda enquanto a revelação acontece
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    try { sessionStorage.removeItem(CHAVE_REVELAR); } catch { /* sem storage: sem revelação */ }
  }, []);
  const fimRevelacao = useCallback(() => setRevelando(false), []);

  const destino = useMemo<DestinoMapa | undefined>(() => {
    const d = respostas.destino;
    if (!d || d === "casa") return undefined;
    const alvo = ehBairro(d) ? dados.destinos.find((x) => x.id === idBairro(d)) : dados.polos.find((p) => p.id === d);
    return alvo ? { lat: alvo.lat, lon: alvo.lon, rotulo: destinoNome(d, dados.destinos) } : undefined;
  }, [respostas.destino, dados]);

  const ate = respostas.destino && respostas.destino !== "casa" ? destinoAte(respostas.destino, dados.destinos) : undefined;

  if (!respondeuAlgo(respostas)) {
    return (
      <div className="contem py-16 text-center">
        <h1 className="t-h2 text-green-900">Ainda não sabemos o que você procura</h1>
        <p className="mt-3 text-muted">Responda 7 perguntas rápidas e mostramos os empreendimentos que combinam com você.</p>
        <LinkButton href="/descobrir" className="mt-8">Começar o quiz</LinkButton>
      </div>
    );
  }

  if (!top.length) {
    return (
      <div className="contem py-16">
        <h1 className="t-h2 text-green-900">Nenhum empreendimento nessas regiões</h1>
        <p className="mt-3 text-muted">Nenhum dos 16 fica nas regiões escolhidas.</p>
        <LinkButton href={`/descobrir?${query}&passo=1`} variante="secondary" className="mt-6">Escolher outras regiões</LinkButton>
      </div>
    );
  }

  const r1 = top[0];
  const e1 = porSlug.get(r1.slug)!;
  const caps1 = filmes[r1.slug] ?? [];
  const motivos1 = motivosPorCapitulo(r1, respostas, caps1.map((c) => c.id));
  const resto = top.slice(1);
  const foraDoTop = ranking.filter((x) => !top.some((t) => t.slug === x.slug));
  const pinsRanking = pins.map((p) => {
    const pos = top.findIndex((t) => t.slug === p.slug);
    const nota = ranking.find((x) => x.slug === p.slug)?.score;
    return { ...p, numero: pos >= 0 ? pos + 1 : undefined, apagado: nota == null, intensidade: pos >= 0 ? 1 : 0.35 };
  });

  return (
    <>
      {revelando && <Revelacao pins={pins} top={top.map((t) => t.slug)} destino={destino} nome1={e1.nome} onFim={fimRevelacao} />}

      {/* 1º lugar: o filme em tela cheia */}
      <section aria-labelledby="seu-mrv" className="lg:contem lg:pt-6">
        <Filme
          slug={e1.slug}
          nome={e1.nome}
          capitulos={caps1}
          motivos={motivos1}
          autoplay={!revelando}
          priority
          galeria={caps1.flatMap((c) => c.fotos)}
          sizes="(min-width: 1024px) 1200px, 200vw"
          className="h-[calc(100svh-56px-56px)] max-h-[860px] min-h-[540px] lg:h-[min(80vh,760px)] lg:rounded-xl"
          topo={
            <span className="inline-flex h-8 items-center gap-1.5 rounded-full bg-green-300 px-3 text-[14px] font-extrabold text-green-950 shadow-e2">
              #1 para você
            </span>
          }
        >
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.08em] text-green-300">Seu MRV</p>
            <h1 id="seu-mrv" className="t-display mt-1 text-white">{e1.nome}</h1>
            <p className="mt-2 text-white/85">
              {e1.bairroNome} · {e1.cidade} · {quartosTexto(e1.quartos)}
              {r1.tempo && ate && !r1.tempo.mesmoBairro && <> · ~{minutosTexto(r1.tempo.minutos)} até {ate}</>}
            </p>
            <p className="mt-3 flex items-baseline gap-2">
              <span className="text-4xl font-extrabold tabular-nums text-green-300">{r1.score}%</span>
              <span className="font-semibold text-white">{r1.faixa}</span>
            </p>
            <div className="mt-4 flex gap-2">
              <div className="min-w-0 flex-1 sm:w-64 sm:flex-none"><ContactCTA nome={e1.nome} bairro={e1.bairroNome} urlOficial={e1.urlOficial} /></div>
              <LinkButton href={`/empreendimentos/${e1.slug}?${query}`} variante="inverse" className="shrink-0 px-4">
                Detalhes <ArrowRight className="seta size-5" aria-hidden />
              </LinkButton>
            </div>
          </div>
        </Filme>
      </section>

      {/* o perfil, devolvido em uma frase */}
      <section className="contem flex flex-col gap-3 border-b border-line py-6 md:flex-row md:items-center md:justify-between">
        <p className="max-w-2xl text-lg text-ink">{frasePerfil(respostas, dados.destinos)}</p>
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
          {regiao && (
            <Link href={`/regioes/${regiao}`} className="inline-flex min-h-11 items-center gap-1.5 text-green-900 hover:underline">
              Região {REGIAO_NOME[regiao]} <ArrowRight className="seta size-4" aria-hidden />
            </Link>
          )}
          <Link href={`/descobrir?${query}&passo=1`} className="inline-flex min-h-11 items-center gap-1.5 text-muted hover:text-green-900 hover:underline">
            <RefreshCcw className="size-4" aria-hidden /> Ajustar respostas
          </Link>
        </div>
      </section>

      {/* onde ficam */}
      <section aria-labelledby="onde-ficam" className="contem py-10 md:py-14">
        <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr] lg:items-center lg:gap-12">
          <div>
            <h2 id="onde-ficam" className="t-h2 text-green-900">Onde ficam</h2>
            <p className="mt-3 text-muted">
              Os 5 que mais combinam com você, numerados.{ate ? ` O alvo é ${ate}, para onde você vai todo dia.` : ""} Toque num número para ver.
            </p>
          </div>
          <div className="rounded-xl bg-green-950 p-3 md:p-5">
            <CidadeMapa
              pins={pinsRanking}
              destino={destino}
              linha={destino && r1.tempo && !r1.tempo.mesmoBairro ? { slug: r1.slug, texto: `~${minutosTexto(r1.tempo.minutos)}` } : undefined}
              acesos={[...new Set(top.map((t) => porSlug.get(t.slug)!.bairroId).filter((id): id is number => id != null))]}
              titulo="Mapa com o seu ranking"
            />
          </div>
        </div>
      </section>

      {/* do 2º ao 5º */}
      {resto.length > 0 && (
        <section aria-labelledby="tambem" className="contem pb-12">
          <h2 id="tambem" className="t-h2 text-green-900">Também combinam com você</h2>
          <Revela as="ol" className="mt-5 grid gap-4 lg:grid-cols-2">
            {resto.map((rec, k) => {
              const e = porSlug.get(rec.slug)!;
              const caps = filmes[rec.slug] ?? [];
              const fotos = [e.imagens.capa, ...caps.map((c) => c.fotos[0]).filter((f) => f && f.id !== e.imagens.capa.id)].slice(0, 3);
              return (
                <li key={rec.slug}>
                  <RankingCard
                    posicao={k + 2}
                    slug={rec.slug}
                    nome={e.nome}
                    local={`${e.bairroNome} · ${e.cidade}`}
                    score={rec.score}
                    faixa={rec.faixa}
                    diferenca={diferencaPara1(rec, r1, e, e1, respostas, dados.destinos)}
                    fotos={fotos}
                    query={query}
                    slug1={r1.slug}
                  />
                </li>
              );
            })}
          </Revela>

          {foraDoTop.length > 0 && (
            <div className="mt-6">
              <button type="button" onClick={() => setCompleto((c) => !c)} aria-expanded={completo} className="inline-flex h-11 items-center gap-2 rounded-md px-3 font-semibold text-green-900 hover:bg-selected">
                {completo ? "Esconder o ranking completo" : `Ver o ranking completo (${ranking.length})`}
                <ChevronDown className={`size-5 transition-transform duration-[var(--t-base)] ${completo ? "rotate-180" : ""}`} aria-hidden />
              </button>
              {completo && (
                <PreviaFlutuante itens={foraDoTop.map((rec) => { const e = porSlug.get(rec.slug)!; return { slug: rec.slug, nome: e.nome, score: rec.score, capa: e.imagens.capa }; })}>
                <ol start={top.length + 1} className="desdobra mt-3 divide-y divide-line rounded-lg border border-line">
                  {foraDoTop.map((rec, k) => {
                    const e = porSlug.get(rec.slug)!;
                    return (
                      <li key={rec.slug} data-previa={rec.slug}>
                        <Link href={`/empreendimentos/${rec.slug}?${query}`} className="flex min-h-14 items-center gap-3 px-4 py-2 hover:bg-selected">
                          <span className="w-6 text-sm font-semibold tabular-nums text-muted">{top.length + k + 1}</span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate font-semibold text-ink">{e.nome}</span>
                            <span className="block truncate text-sm text-muted">{e.bairroNome} · {e.cidade}</span>
                          </span>
                          <span className="text-sm font-semibold tabular-nums text-green-900">{rec.score}%</span>
                        </Link>
                      </li>
                    );
                  })}
                </ol>
                </PreviaFlutuante>
              )}
            </div>
          )}

          <p className="mt-10 flex items-start gap-2 text-sm text-muted">
            <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
            A compatibilidade compara suas respostas com dados públicos de cada empreendimento e do bairro. Tempos de ônibus são de tabela, em dia útil, sem trânsito.
          </p>
        </section>
      )}
    </>
  );
}
