import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ChevronRight, ExternalLink } from "lucide-react";
import { bairros, destinos, empreendimentoPorSlug, empreendimentos, polos, regiaoPorSlug, resumir } from "@/lib/data";
import { fotosDeLazer } from "@/lib/filme";
import { FloorPlans } from "@/components/empreendimento/FloorPlans";
import { CommuteInfo } from "@/components/empreendimento/Blocos";
import { ListaDestaques } from "@/components/empreendimento/Destaques";
import { Vitrine } from "@/components/empreendimento/Vitrine";
import { agruparDestaques } from "@/lib/destaques";
import { ContactCTA } from "@/components/empreendimento/ContactCTA";
import { LequeLazer } from "@/components/empreendimento/LequeLazer";
import { Maquete3D } from "@/components/empreendimento/Maquete3D";
import { maquetePorSlug } from "@/lib/maquete";
import { referenciasDe } from "@/lib/maquete/referencias";
import { PorQueCombina } from "@/components/resultado/PorQueCombina";
import { Rodape } from "@/components/layout/Rodape";

export const dynamicParams = false;

export function generateStaticParams() {
  return empreendimentos.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: PageProps<"/empreendimentos/[slug]">): Promise<Metadata> {
  const e = empreendimentoPorSlug((await params).slug);
  if (!e) return {};
  const titulo = `${e.nome} – 2 quartos em ${e.bairroNome}, ${e.cidade}`;
  return {
    title: e.nome,
    description: `${titulo}. ${e.lazerItens.slice(0, 4).join(", ")}.`,
    openGraph: { title: titulo, images: [{ url: `${e.imagens.capa.src}-1080.webp`, width: 1080, alt: e.imagens.capa.alt }] },
  };
}

function Secao({ id, titulo, children }: { id: string; titulo: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="border-t border-line pt-8">
      <h2 id={id} className="t-h2 mb-5 text-green-900">{titulo}</h2>
      {children}
    </section>
  );
}

export default async function EmpreendimentoPage({ params }: PageProps<"/empreendimentos/[slug]">) {
  const e = empreendimentoPorSlug((await params).slug);
  if (!e) notFound();
  const regiao = regiaoPorSlug(e.regiao)!;
  const visaoGeral = [...e.imagens.implantacao, ...e.imagens.aerea];
  const galeria = [...e.imagens.galeria, ...e.imagens.plantas];
  const lazer = fotosDeLazer(e);
  const destaques = agruparDestaques(e);
  const maquete = maquetePorSlug(e.slug);

  return (
    <>
      <Vitrine e={e} />

      <div className="contem mt-8 space-y-10 pb-10 lg:mt-12 lg:pb-16">
        <div className="lg:max-w-4xl">
          <Suspense fallback={null}>
            <PorQueCombina e={resumir(e)} bairros={bairros} polos={polos} destinos={destinos} />
          </Suspense>
        </div>

        <div className="space-y-10 lg:max-w-4xl">
          <Secao id="regiao" titulo="A região">
            <CommuteInfo e={e} />
            {e.proximoA && (
              <p className="mt-5 text-ink">
                <span className="font-semibold">Perto de: </span>
                {e.proximoA}.
              </p>
            )}
            <Link href={`/regioes/${regiao.slug}`} className="mt-4 inline-flex min-h-11 items-center gap-1 font-semibold text-green-900 hover:underline">
              Conhecer a região {regiao.nome} <ChevronRight className="seta size-4" aria-hidden />
            </Link>
          </Secao>

          {maquete && (
            <Secao id="maquete" titulo="O condomínio em 3D">
              <Maquete3D maquete={maquete} poster={e.imagens.aerea[0] ?? e.imagens.implantacao[0]} referencias={referenciasDe(e)} />
            </Secao>
          )}

          {lazer.length >= 3 && (
            <Secao id="lazer" titulo="Lazer no condomínio">
              <LequeLazer nome={e.nome} fotos={lazer} galeria={galeria} />
            </Secao>
          )}

          {destaques.length > 0 && (
            <Secao id="diferenciais" titulo="O que vem com ele">
              <ListaDestaques faixas={destaques} />
            </Secao>
          )}

          {e.imagens.plantas.length > 0 && (
            <Secao id="plantas" titulo="Plantas">
              <FloorPlans nome={e.nome} imagens={e.imagens.plantas} rotulo="Planta" />
            </Secao>
          )}

          {visaoGeral.length > 0 && (
            <Secao id="condominio" titulo="O condomínio por cima">
              <FloorPlans nome={e.nome} imagens={visaoGeral} rotulo="Vista" />
            </Secao>
          )}

          {e.descricao.length > 0 && (
            <section className="border-t border-line pt-6">
              <details className="group">
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between font-semibold text-green-900 [&::-webkit-details-marker]:hidden">
                  Sobre o empreendimento
                  <ChevronRight className="size-5 transition-transform duration-[var(--t-base)] group-open:rotate-90" aria-hidden />
                </summary>
                <div className="desdobra-aberto mt-3 space-y-3 text-muted">
                  {e.descricao.map((p) => <p key={p}>{p}</p>)}
                </div>
              </details>
            </section>
          )}

          <section aria-labelledby="ficha" className="border-t border-line pt-6 text-sm text-muted">
            <h2 id="ficha" className="mb-3 font-semibold text-ink">Ficha</h2>
            <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1.5">
              <dt>Unidades</dt><dd className="text-ink">{e.unidades}</dd>
              <dt>Vagas de garagem</dt><dd className="text-ink">{e.vagas}</dd>
              {e.elevador != null && (<><dt>Elevador</dt><dd className="text-ink">{e.elevador ? "Sim" : "Não"}</dd></>)}
              {e.endereco && (<><dt>Endereço</dt><dd className="text-ink">{e.endereco}, {e.bairroNome}, {e.cidade}</dd></>)}
            </dl>
            <a href={e.urlOficial} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex min-h-11 items-center gap-1.5 font-semibold text-green-900 hover:underline">
              Página oficial do empreendimento <ExternalLink className="size-4" aria-hidden />
            </a>
          </section>
        </div>
      </div>

      <Rodape />
      <ContactCTA nome={e.nome} bairro={e.bairroNome} urlOficial={e.urlOficial} fixo />
    </>
  );
}
