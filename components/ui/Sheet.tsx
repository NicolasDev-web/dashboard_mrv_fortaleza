"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { ReactNode, RefObject } from "react";

type Props = {
  /** sem gatilho, o Sheet é aberto por fora (open + onOpenChange) */
  trigger?: ReactNode;
  titulo: string;
  descricao?: string;
  children: ReactNode;
  /** "folha": sobe de baixo no celular e centraliza no desktop; "tela": tela cheia (plantas, galeria) */
  modo?: "folha" | "tela";
  /** modo controlado (opcional): quem abre é o componente pai */
  open?: boolean;
  onOpenChange?: (aberto: boolean) => void;
  /** sem gatilho, para onde o foco volta ao fechar (o Radix devolveria ao gatilho, que não existe) */
  retornarFoco?: RefObject<HTMLElement | null>;
};

/** Foco preso, Esc fecha, foco volta ao gatilho: tudo pelo Radix Dialog. */
export function Sheet({ trigger, titulo, descricao, children, modo = "folha", open, onOpenChange, retornarFoco }: Props) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      {trigger && <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>}
      <Dialog.Portal>
        <Dialog.Overlay className="overlay fixed inset-0 z-50 bg-[rgb(0_51_31/0.4)]" />
        <Dialog.Content
          onCloseAutoFocus={retornarFoco ? (e) => { e.preventDefault(); retornarFoco.current?.focus(); } : undefined}
          className={
            modo === "tela"
              ? "folha fixed inset-0 z-50 flex flex-col bg-ink text-white"
              : "folha fixed inset-x-0 bottom-0 z-50 max-h-[90dvh] overflow-y-auto rounded-t-xl bg-white p-5 pb-[calc(20px+env(safe-area-inset-bottom))] shadow-e3 md:inset-x-auto md:bottom-auto md:left-1/2 md:top-1/2 md:w-[520px] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-xl md:p-6"
          }
        >
          {modo === "folha" && <div aria-hidden className="mx-auto -mt-1 mb-4 h-1.5 w-10 rounded-full bg-line md:hidden" />}
          <div className={`flex items-start justify-between gap-4 ${modo === "tela" ? "px-4 py-3" : ""}`}>
            <div>
              <Dialog.Title className={modo === "tela" ? "text-base font-semibold" : "t-card text-ink"}>{titulo}</Dialog.Title>
              {descricao ? (
                <Dialog.Description className={`mt-1 text-sm ${modo === "tela" ? "text-white/70" : "text-muted"}`}>{descricao}</Dialog.Description>
              ) : (
                <Dialog.Description className="sr-only">{titulo}</Dialog.Description>
              )}
            </div>
            <Dialog.Close
              aria-label="Fechar"
              className={`-mr-2 -mt-1 flex size-11 shrink-0 items-center justify-center rounded-full ${modo === "tela" ? "text-white hover:bg-white/10" : "text-muted hover:bg-selected"}`}
            >
              <X className="size-5" aria-hidden />
            </Dialog.Close>
          </div>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
