"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, Map, Sparkles } from "lucide-react";
import { Marca } from "./Marca";

const ITENS = [
  { href: "/descobrir", rotulo: "Descobrir", Icone: Sparkles },
  { href: "/empreendimentos", rotulo: "Empreendimentos", Icone: Building2 },
  { href: "/regioes", rotulo: "Regiões", Icone: Map },
] as const;

const ativo = (path: string, href: string) => path === href || path.startsWith(href + "/");
/** O quiz é tela cheia: sem cabeçalho nem barra inferior, para manter o foco na pergunta. */
const emQuiz = (path: string) => path === "/descobrir";

export function Cabecalho() {
  const path = usePathname();
  if (emQuiz(path)) return null;
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-white/90 backdrop-blur-sm supports-[backdrop-filter]:bg-white/80">
      <div className="contem flex h-14 items-center justify-between md:h-16">
        <Marca />
        <nav aria-label="Principal" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {ITENS.map(({ href, rotulo }) => (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={ativo(path, href) ? "page" : undefined}
                  className="relative inline-flex h-10 items-center rounded-md px-3 text-sm font-semibold text-muted transition-colors duration-[var(--t-fast)] hover:text-green-900 aria-[current=page]:text-green-900 aria-[current=page]:after:absolute aria-[current=page]:after:inset-x-3 aria-[current=page]:after:-bottom-[11px] aria-[current=page]:after:h-[3px] aria-[current=page]:after:rounded-full aria-[current=page]:after:bg-green-900"
                >
                  {rotulo}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export function BarraInferior() {
  const path = usePathname();
  if (emQuiz(path)) return null;
  return (
    <>
    {/* reserva o espaço da barra fixa, para o rodapé não ficar escondido atrás dela */}
    <div aria-hidden className="h-[calc(56px+env(safe-area-inset-bottom))] md:hidden" />
    <nav
      aria-label="Principal"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-sm md:hidden"
    >
      <ul className="grid grid-cols-3">
        {ITENS.map(({ href, rotulo, Icone }) => (
          <li key={href}>
            <Link
              href={href}
              aria-current={ativo(path, href) ? "page" : undefined}
              className="flex h-14 flex-col items-center justify-center gap-0.5 text-[12px] font-semibold text-muted aria-[current=page]:text-green-900"
            >
              <Icone className="size-5" strokeWidth={1.75} aria-hidden />
              {rotulo === "Empreendimentos" ? "Imóveis" : rotulo}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
    </>
  );
}
