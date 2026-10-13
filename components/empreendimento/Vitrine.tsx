import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Empreendimento } from "@/lib/types";
import { Badge, StatusBadge } from "@/components/ui/Badge";
import { ContactCTA } from "./ContactCTA";
import { fatosDo } from "./Blocos";
import { BotaoGaleria, ColunasFotos } from "./VitrineFotos";

/**
 * Topo da página do empreendimento: à esquerda o nome, o resumo e 4 fatos; à direita as fotos
 * em duas colunas que rolam em sentidos opostos. No celular as fotos vêm primeiro (visualmente),
 * mas o título vem antes no DOM para o leitor de tela.
 */
export function Vitrine({ e }: { e: Empreendimento }) {
  const fotos = [...e.imagens.galeria, ...e.imagens.aerea];
  // toda foto das colunas existe na galeria: tocar numa delas abre a galeria nela
  const galeria = [...fotos, ...e.imagens.plantas];
  return (
    <section aria-labelledby="nome-empreendimento" className="escuro bg-green-950 text-white">
      <div className="contem flex flex-col gap-7 py-6 lg:grid lg:h-[min(680px,calc(100svh-64px))] lg:grid-cols-[minmax(0,1fr)_minmax(0,480px)] lg:grid-rows-[minmax(0,1fr)] lg:items-center lg:gap-16 lg:py-0">
        <div className="min-w-0">
          <nav aria-label="Você está em" className="mb-6 hidden text-sm text-white/70 lg:block">
            <ol className="flex items-center gap-1">
              <li><Link href="/empreendimentos" className="text-white hover:underline">Empreendimentos</Link></li>
              <li aria-hidden><ChevronRight className="size-4" /></li>
              <li aria-current="page">{e.nome}</li>
            </ol>
          </nav>

          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={e.status} />
            {e.mcmv && <Badge tom="neutro">Minha Casa Minha Vida</Badge>}
            {e.linha === "sensia" && (
              <span className="inline-flex h-6 items-center rounded-full bg-white px-2.5">
                {/* eslint-disable-next-line @next/next/no-img-element -- PNG de marca já no tamanho final */}
                <img src="/brand/sensia.png" alt="Sensia Incorporadora" width={69} height={16} className="h-4 w-auto" />
              </span>
            )}
          </div>

          <p className="mt-5 text-sm font-semibold uppercase tracking-[0.08em] text-green-300">
            {e.bairroNome} · {e.cidade}
          </p>
          <h1 id="nome-empreendimento" className="t-display mt-2">{e.nome}</h1>
          {e.descricao[0] && <p className="mt-4 line-clamp-3 max-w-xl text-lg text-white/85">{e.descricao[0]}</p>}

          <ul className="mt-7 grid gap-x-6 gap-y-4 sm:grid-cols-2">
            {fatosDo(e).map(([I, t]) => (
              <li key={t} className="flex items-center gap-3 text-white/85">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-green-300">
                  <I className="size-5" strokeWidth={1.75} aria-hidden />
                </span>
                {t}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap [&_button]:whitespace-nowrap">
            {/* no celular o "Quero conhecer" já fica fixo no rodapé da tela */}
            <div className="hidden lg:block">
              <ContactCTA nome={e.nome} bairro={e.bairroNome} urlOficial={e.urlOficial} variante="inverse" />
            </div>
            <BotaoGaleria nome={e.nome} galeria={galeria} />
          </div>
        </div>

        <ColunasFotos nome={e.nome} fotos={fotos} galeria={galeria} className="order-first h-[24rem] sm:h-[28rem] lg:order-none lg:h-full lg:self-stretch" />
      </div>
    </section>
  );
}
