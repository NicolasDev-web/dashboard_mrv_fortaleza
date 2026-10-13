import { Sparkles } from "lucide-react";
import type { Faixa } from "@/lib/destaques";
import { ICONES_DESTAQUE } from "./icones-destaque";

/** Lazer e diferenciais oficiais em três grupos (Lazer, No apartamento, No condomínio), em lista parada com ícone. */
export function ListaDestaques({ faixas }: { faixas: Faixa[] }) {
  return (
    <div className="space-y-7">
      {faixas.map((f) => (
        <div key={f.id}>
          <h3 className="mb-3 text-sm font-semibold text-ink">
            {f.titulo} <span className="font-normal text-muted">· {f.itens.length} {f.itens.length === 1 ? "item" : "itens"}</span>
          </h3>
          <ul className="grid gap-x-4 gap-y-3 sm:grid-cols-2 md:grid-cols-3">
            {f.itens.map((t) => {
              const I = ICONES_DESTAQUE.find(([re]) => re.test(t))?.[1] ?? Sparkles;
              return (
                <li key={t} className="flex items-center gap-2.5 text-[15px] text-ink">
                  <I className="size-5 shrink-0 text-green-900" strokeWidth={1.75} aria-hidden /> {t}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
