import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import { Explorar } from "@/components/explorar/Explorar";
import { LinkButton } from "@/components/ui/Button";
import { Rodape } from "@/components/layout/Rodape";
import { empreendimentos, resumir } from "@/lib/data";

export const metadata: Metadata = {
  title: "Empreendimentos",
  description: "Os 16 empreendimentos MRV em Fortaleza, Caucaia e Eusébio.",
};

export default function EmpreendimentosPage() {
  return (
    <>
      <div className="contem py-8 md:py-12">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="t-display text-green-900">Empreendimentos</h1>
            <p className="mt-3 max-w-xl text-lg text-muted">Todos com opção de 2 quartos. O que muda é o lugar, o lazer e a vaga.</p>
          </div>
          <LinkButton href="/descobrir" variante="secondary" className="w-full md:w-auto">
            <Sparkles className="size-5" aria-hidden /> Descobrir o meu
          </LinkButton>
        </div>
        <div className="mt-8">
          <Explorar lista={empreendimentos.map(resumir)} />
        </div>
      </div>
      <Rodape />
    </>
  );
}
