import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ChevronRight, ExternalLink, MapPin } from "lucide-react";
import { bairros, destinos, empreendimentoPorSlug, empreendimentos, polos, regiaoPorSlug, resumir } from "@/lib/data";
import { Badge, StatusBadge } from "@/components/ui/Badge";
import { Filme } from "@/components/filme/Filme";
import { capitulosDo } from "@/lib/filme";
import { FloorPlans } from "@/components/empreendimento/FloorPlans";
import { AmenityList, CommuteInfo, ListaSimples, PropertyFacts } from "@/components/empreendimento/Blocos";
import { ContactCTA } from "@/components/empreendimento/ContactCTA";
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

  return (
    <>
      <div className="lg:contem lg:pt-6">
        <nav aria-label="Você está em" className="contem hidden py-3 text-sm text-muted lg:block lg:px-0">
          <ol className="flex items-center gap-1">
            <li><Link href="/empreendimentos" className="text-green-900 hover:underline">Empreendimentos</Link></li>
            <li aria-hidden><ChevronRight className="size-4" /></li>
            <li aria-current="page" className="text-ink">{e.nome}</li>
          </ol>
        </nav>
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-10">
          <Filme
            slug={e.slug}
            nome={e.nome}
            capitulos={capitulosDo(e)}
            galeria={[...e.imagens.galeria, ...e.imagens.plantas]}
            priority
            className="aspect-[4/3] lg:aspect-[16/10] lg:rounded-lg"
          />

          <aside className="contem pt-5 lg:sticky lg:top-24 lg:self-start lg:px-0 lg:pt-0">
            <div className="flex flex-wrap gap-1.5">
              <StatusBadge status={e.status} />
              {e.mcmv && <Badge tom="neutro" className="border border-line">Minha Casa Minha Vida</Badge>}
            </div>
            {e.linha === "sensia" && (
              // eslint-disable-next-line @next/next/no-img-element -- PNG de marca já no tamanho final
              <img src="/brand/sensia.png" alt="Sensia Incorporadora" width={86} height={20} className="mt-4 h-5 w-auto" />
            )}
            <h1 className="t-h2 mt-3 text-green-900 lg:text-[2.25rem]">{e.nome}</h1>
            <p className="mt-1 flex items-center gap-1.5 text-muted">
              <MapPin className="size-4" aria-hidden /> {e.bairroNome} · {e.cidade}
            </p>
            <div className="mt-5">
              <PropertyFacts e={e} />
            </div>
            <div className="mt-6 hidden lg:block">
              <ContactCTA nome={e.nome} bairro={e.bairroNome} urlOficial={e.urlOficial} />
            </div>
          </aside>
        </div>
      </div>

      <div className="contem mt-8 space-y-10 pb-28 lg:mt-12 lg:max-w-[calc(1200px+4rem)] lg:pb-16">
        <div className="lg:max-w-[calc(100%-400px)]">
          <Suspense fallback={null}>
            <PorQueCombina e={resumir(e)} bairros={bairros} polos={polos} destinos={destinos} />
          </Suspense>
        </div>

        <div className="space-y-10 lg:max-w-[calc(100%-400px)]">
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

          <Secao id="lazer" titulo="Lazer no condomínio">
            <AmenityList itens={e.lazerItens} />
          </Secao>

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

          {e.diferenciais.length > 0 && (
            <Secao id="diferenciais" titulo="Diferenciais">
              <ListaSimples itens={e.diferenciais} />
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

      <ContactCTA nome={e.nome} bairro={e.bairroNome} urlOficial={e.urlOficial} fixo />
      <Rodape />
    </>
  );
}
