import type { Metadata } from "next";
import { Suspense } from "react";
import { QuizShell } from "@/components/quiz/QuizShell";
import { dadosScoringResumidos, destinos, empreendimentos, regioes } from "@/lib/data";
import type { PinMapa } from "@/components/mapa/CidadeMapa";

export const metadata: Metadata = {
  title: "Descobrir",
  description: "7 perguntas rápidas para encontrar o empreendimento MRV que combina com a sua rotina.",
};

const pins: PinMapa[] = empreendimentos.map(({ slug, nome, bairroNome, cidade, status, coord, coordAproximada, imagens }) => ({
  slug, nome, bairroNome, cidade, status, coord, coordAproximada, imagens: { capa: imagens.capa },
}));

export default function DescobrirPage() {
  return (
    // O quiz lê as respostas da URL (useSearchParams): o Suspense deixa o resto da rota pré-renderizado.
    <Suspense fallback={<div className="min-h-dvh" />}>
      <QuizShell regioes={regioes.map(({ slug, nome }) => ({ slug, nome }))} bairros={destinos.map(({ id, nome }) => ({ id, nome }))}
        mapa={{ pins, dados: dadosScoringResumidos() }}
      />
    </Suspense>
  );
}
