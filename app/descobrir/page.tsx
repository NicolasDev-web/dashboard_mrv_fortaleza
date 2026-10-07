import type { Metadata } from "next";
import { Suspense } from "react";
import { QuizShell } from "@/components/quiz/QuizShell";
import { dadosScoringResumidos, destinos, empreendimentos, regioes } from "@/lib/data";
import type { PinMapa } from "@/components/mapa/CidadeMapa";

export const metadata: Metadata = {
  title: "Descobrir",
  description: "9 perguntas rápidas para encontrar o empreendimento MRV que combina com a sua rotina.",
};

const pins: PinMapa[] = empreendimentos.map(({ slug, nome, bairroNome, cidade, status, coord, coordAproximada, imagens }) => ({
  slug, nome, bairroNome, cidade, status, coord, coordAproximada, imagens: { capa: imagens.capa },
}));

/** Enquanto o quiz carrega (ele lê a URL no navegador): a mesma moldura, sem tela branca. */
function Esqueleto() {
  return (
    <div className="flex min-h-dvh flex-col bg-white" aria-busy="true">
      <div className="mx-auto flex h-14 w-full max-w-[720px] items-center gap-2 px-3 md:h-16 lg:max-w-[1200px] lg:px-5">
        <span className="size-11" />
        <span className="esqueleto h-1.5 flex-1 rounded-full" />
        <span className="w-10" />
        <span className="size-11" />
      </div>
      <div className="mx-auto w-full max-w-[720px] flex-1 px-5 pt-2 md:pt-6 lg:grid lg:max-w-[1200px] lg:grid-cols-[minmax(0,1fr)_440px] lg:items-start lg:gap-14 lg:pt-10">
        <div className="esqueleto mb-5 h-24 rounded-xl lg:order-2 lg:mb-0 lg:h-[420px]" />
        <div className="lg:order-1">
          <p className="sr-only">Carregando o quiz…</p>
          <div className="esqueleto h-9 w-3/4 rounded-md" />
          <div className="mt-6 grid gap-3">
            {[0, 1, 2].map((i) => <div key={i} className="esqueleto h-16 rounded-lg" />)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DescobrirPage() {
  return (
    // O quiz lê as respostas da URL (useSearchParams): o Suspense deixa o resto da rota pré-renderizado.
    <Suspense fallback={<Esqueleto />}>
      <QuizShell regioes={regioes.map(({ slug, nome }) => ({ slug, nome }))} bairros={destinos.map(({ id, nome }) => ({ id, nome }))}
        mapa={{ pins, dados: dadosScoringResumidos() }}
      />
    </Suspense>
  );
}
