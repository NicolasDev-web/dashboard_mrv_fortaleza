import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { RegionMap } from "@/components/regiao/RegionMap";
import { Rodape } from "@/components/layout/Rodape";
import { contagensPorRegiao, regioes } from "@/lib/data";

export const metadata: Metadata = {
  title: "Regiões",
  description: "As 5 regiões da Grande Fortaleza com empreendimentos MRV.",
};

export default function RegioesPage() {
  const contagens = contagensPorRegiao();
  return (
    <>
      <div className="contem grid gap-10 py-8 md:py-12 lg:grid-cols-[1fr_1.2fr] lg:items-center">
        <div>
          <h1 className="t-display text-green-900">Regiões</h1>
          <p className="mt-3 max-w-md text-lg text-muted">Os 16 empreendimentos MRV estão em 5 regiões. Toque em uma para ver o dia a dia por lá.</p>
          <ul className="mt-8 divide-y divide-line border-y border-line">
            {regioes.map((r) => (
              <li key={r.slug}>
                <Link href={`/regioes/${r.slug}`} className="flex min-h-16 items-center justify-between gap-4 py-3 transition-colors hover:text-green-900">
                  <span>
                    <span className="block font-semibold text-ink">{r.nome}</span>
                    <span className="text-sm text-muted">{contagens[r.slug]} empreendimento{contagens[r.slug] > 1 ? "s" : ""} · {r.resumo}</span>
                  </span>
                  <ChevronRight className="seta size-5 shrink-0 text-green-900" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <RegionMap contagens={contagens} className="w-full" />
      </div>
      <Rodape />
    </>
  );
}
