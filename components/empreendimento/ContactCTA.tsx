"use client";

import { ExternalLink, MessageCircle } from "lucide-react";
import { Sheet } from "@/components/ui/Sheet";
import { classesBotao } from "@/components/ui/Button";

type Props = { nome: string; bairro: string; urlOficial: string; fixo?: boolean };

// Número do WhatsApp comercial: definido no ambiente da Vercel. Sem ele, só o link oficial aparece.
const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP?.replace(/\D/g, "");

export function ContactCTA({ nome, bairro, urlOficial, fixo }: Props) {
  const mensagem = encodeURIComponent(`Olá! Tenho interesse no ${nome}, no bairro ${bairro}. Vi no Descubra seu MRV.`);
  const utm = `${urlOficial}${urlOficial.includes("?") ? "&" : "?"}utm_source=descubra-seu-mrv&utm_medium=interno&utm_campaign=quiz`;
  const botao = (
    <button type="button" className={classesBotao("primary", "lg", "w-full")}>
      <span className="sm:hidden">Quero conhecer</span>
      <span className="hidden sm:inline">Quero conhecer este MRV</span>
    </button>
  );
  const folha = (
    <Sheet trigger={botao} titulo={`Próximo passo: ${nome}`} descricao="Escolha como prefere continuar.">
      <div className="mt-5 grid gap-3">
        {WHATSAPP && (
          <a href={`https://wa.me/${WHATSAPP}?text=${mensagem}`} target="_blank" rel="noopener noreferrer" className={classesBotao("primary", "lg", "w-full")}>
            <MessageCircle className="size-5" aria-hidden /> Falar com um corretor no WhatsApp
          </a>
        )}
        <a href={utm} target="_blank" rel="noopener noreferrer" className={classesBotao(WHATSAPP ? "secondary" : "primary", "lg", "w-full")}>
          <ExternalLink className="size-5" aria-hidden /> Simular e ver condições na página oficial
        </a>
        <p className="text-sm text-muted">A página oficial da MRV abre em uma nova aba.</p>
      </div>
    </Sheet>
  );
  if (!fixo) return folha;
  return (
    <div className="fixed inset-x-0 bottom-[calc(56px+env(safe-area-inset-bottom))] z-20 border-t border-line bg-white/95 px-5 py-3 backdrop-blur-sm lg:hidden">
      {folha}
    </div>
  );
}
