import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variante = "primary" | "secondary" | "ghost" | "inverse";
type Tamanho = "md" | "lg";

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-md font-semibold text-[15px] leading-tight select-none " +
  "transition-[background-color,color,transform,box-shadow] duration-[var(--t-fast)] ease-mrv active:scale-[0.98] " +
  "disabled:pointer-events-none disabled:bg-[rgb(26_66_54/0.08)] disabled:text-[rgb(26_66_54/0.45)]";

const VARIANTES: Record<Variante, string> = {
  primary: "bg-green-900 text-white hover:bg-green-700 active:bg-ink",
  secondary: "border border-green-900 text-green-900 bg-white hover:bg-selected",
  ghost: "text-green-900 hover:bg-selected",
  inverse: "bg-white text-green-900 hover:bg-sage-200",
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
