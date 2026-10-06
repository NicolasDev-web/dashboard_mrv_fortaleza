import type { Metadata } from "next";
import { Suspense } from "react";
import { Resultado } from "@/components/resultado/Resultado";
import { Rodape } from "@/components/layout/Rodape";
import { dadosScoringResumidos, empreendimentos } from "@/lib/data";
import { capitulosDo, type Capitulo } from "@/lib/filme";
import type { PinMapa } from "@/components/mapa/CidadeMapa";

export const metadata: Metadata = {
  title: "Seu resultado",
  description: "Os empreendimentos MRV que mais combinam com a sua rotina.",
};

function Esqueleto() {
  return (
    <>
      <div className="h-72 bg-green-900" />
      <div className="contem grid gap-5 py-8 md:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="overflow-hidden rounded-lg border border-line">
            <div className="esqueleto aspect-[4/3]" />
            <div className="space-y-2 p-4">
              <div className="esqueleto h-5 w-2/3 rounded" />
              <div className="esqueleto h-4 w-1/2 rounded" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// Filmes dos 16: o ranking só é conhecido no navegador. O blur de carregamento fica só na 1ª foto
// de cada filme (as outras entram atrás de uma foto já carregada), para o payload não pesar.
const filmes: Record<string, Capitulo[]> = Object.fromEntries(
  empreendimentos.map((e) => [
    e.slug,
    capitulosDo(e).map((c, ci) => ({ ...c, fotos: c.fotos.map((f, fi) => (ci === 0 && fi === 0 ? f : { ...f, blur: "" })) })),
  ]),
);
const pins: PinMapa[] = empreendimentos.map(({ slug, nome, bairroNome, cidade, status, coord, coordAproximada, imagens }) => ({
  slug, nome, bairroNome, cidade, status, coord, coordAproximada, imagens: { capa: imagens.capa },
}));

export default function ResultadoPage() {
  // O ranking roda no navegador a partir das respostas na URL: ~20 KB de dados, sem servidor.
  return (
    <>
      <Suspense fallback={<Esqueleto />}>
        <Resultado dados={dadosScoringResumidos()} filmes={filmes} pins={pins} />
      </Suspense>
      <Rodape />
    </>
  );
}
