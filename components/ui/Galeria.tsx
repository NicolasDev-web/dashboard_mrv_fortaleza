"use client";

import { useCallback, type ReactNode, type RefObject } from "react";
import type { Imagem } from "@/lib/types";
import { Img } from "@/components/ui/Img";
import { Sheet } from "@/components/ui/Sheet";

type Props = {
  nome: string;
  fotos: Imagem[];
  /** id da foto em que a galeria abre (a que a pessoa tocou ou estava vendo) */
  inicial?: string;
  trigger?: ReactNode;
  open?: boolean;
  onOpenChange?: (aberto: boolean) => void;
  retornarFoco?: RefObject<HTMLElement | null>;
};

/** Todas as fotos em tela cheia, uma embaixo da outra, abrindo já na foto escolhida. */
export function Galeria({ nome, fotos, inicial, trigger, open, onOpenChange, retornarFoco }: Props) {
  // Ref de callback: roda quando a lista monta, ou seja, a cada abertura do Sheet.
  const lista = useCallback(
    (el: HTMLUListElement | null) => {
      if (!el || !inicial) return;
      el.querySelector<HTMLElement>(`[data-foto="${inicial}"]`)?.scrollIntoView({ block: "start" });
    },
    [inicial],
  );
  return (
    <Sheet modo="tela" titulo={`Fotos do ${nome}`} descricao="Imagens ilustrativas" trigger={trigger} open={open} onOpenChange={onOpenChange} retornarFoco={retornarFoco}>
      <ul ref={lista} className="flex-1 space-y-2 overflow-y-auto px-2 pb-8 md:px-8">
        {fotos.map((f) => (
          <li key={f.id} data-foto={f.id} className="mx-auto max-w-5xl">
            <Img img={f} sizes="(min-width: 1024px) 1024px, 100vw" className="w-full" fit="contain" style={{ aspectRatio: `${f.w} / ${f.h}` }} />
            <p className="px-2 py-2 text-sm text-white/70">{f.alt}</p>
          </li>
        ))}
      </ul>
    </Sheet>
  );
}
