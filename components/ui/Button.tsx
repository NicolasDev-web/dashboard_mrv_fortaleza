import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variante = "primary" | "secondary" | "ghost" | "inverse" | "contornoClaro";
type Tamanho = "md" | "lg";

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-md font-semibold text-[15px] leading-tight select-none " +
  "transition-[background-color,color,transform,box-shadow] duration-[var(--t-fast)] ease-mrv active:scale-[0.98] " +
  "disabled:pointer-events-none disabled:bg-ink/8 disabled:text-ink/45";

const VARIANTES: Record<Variante, string> = {
  // hover escurece (green-950) em vez de clarear: branco sobre green-700 fica em 3,5:1, abaixo do AA
  primary: "bg-green-900 text-white hover:bg-green-950 active:bg-ink",
  secondary: "border border-green-900 text-green-900 bg-white hover:bg-selected",
  ghost: "text-green-900 hover:bg-selected",
  inverse: "bg-white text-green-900 hover:bg-sage-200",
  // secundário sobre fundo escuro (green-950, fotos): par do inverse
  contornoClaro: "border border-white/40 text-white hover:bg-white/10",
};

const TAMANHOS: Record<Tamanho, string> = {
  md: "h-11 px-4",
  lg: "h-12 px-6 md:h-11",
};

export function classesBotao(variante: Variante = "primary", tamanho: Tamanho = "lg", extra = "") {
  return `${BASE} ${VARIANTES[variante]} ${TAMANHOS[tamanho]} ${extra}`;
}

type Comum = { variante?: Variante; tamanho?: Tamanho; className?: string; children: ReactNode };

export function Button({ variante, tamanho, className, children, ...props }: Comum & ComponentProps<"button">) {
  return (
    <button type="button" className={classesBotao(variante, tamanho, className)} {...props}>
      {children}
    </button>
  );
}

export function LinkButton({ variante, tamanho, className, children, ...props }: Comum & ComponentProps<typeof Link>) {
  return (
    <Link className={classesBotao(variante, tamanho, className)} {...props}>
      {children}
    </Link>
  );
}
