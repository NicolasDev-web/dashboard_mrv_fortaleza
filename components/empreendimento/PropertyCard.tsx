import Link from "next/link";
import { ViewTransition, type ReactNode } from "react";
import type { Empreendimento } from "@/lib/types";
import { Img } from "@/components/ui/Img";
import { Badge, StatusBadge } from "@/components/ui/Badge";
import { areaTexto, quartosTexto } from "@/lib/rotulos";

type Dados = Pick<Empreendimento, "slug" | "nome" | "bairroNome" | "cidade" | "status" | "linha" | "quartos" | "areaMin" | "areaMax"> & {
  imagens: { capa: Empreendimento["imagens"]["capa"] };
};

type Props = {
  e: Dados;
  /** query string do quiz, levada ao detalhe para mostrar "Por que combina com você" */
  query?: string;
  priority?: boolean;
  sizes?: string;
  /** selo sobre a foto (ex.: compatibilidade) */
  selo?: ReactNode;
  /** conteúdo extra no rodapé do card (ex.: motivos) */
  children?: ReactNode;
  /** nível do título, para manter a hierarquia da página */
  titulo?: "h2" | "h3";
};

/**
 * Card do empreendimento. A foto fica com cantos retos dentro do contêiner (guia: muitas imagens),
 * e o card inteiro é clicável por um link esticado sobre ele.
 */
export function PropertyCard({ e, query, priority, sizes, selo, children, titulo: H = "h3" }: Props) {
  const href = `/empreendimentos/${e.slug}${query ? `?${query}` : ""}`;
  const area = areaTexto(e);
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-line bg-white transition-[box-shadow,transform] duration-[var(--t-base)] ease-mrv active:scale-[0.98] lg:hover:shadow-e2 lg:active:scale-100">
      <div className="relative aspect-[4/3] overflow-hidden">
        <ViewTransition name={`capa-${e.slug}`} share="morph" default="none">
          <Img
            img={e.imagens.capa}
            priority={priority}
            sizes={sizes}
            className="h-full w-full transition-transform duration-[var(--t-emph)] ease-mrv lg:group-hover:scale-[1.03]"
          />
        </ViewTransition>
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <StatusBadge status={e.status} />
          {e.linha === "sensia" && <Badge tom="sensia">Sensia</Badge>}
        </div>
        {selo && <div className="absolute bottom-3 left-3">{selo}</div>}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <H className="t-card text-ink">
          <Link href={href} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:rounded-lg focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:outline-green-500">
            {e.nome}
          </Link>
        </H>
        <p className="text-sm text-muted">
          {e.bairroNome} · {e.cidade}
        </p>
        <p className="text-sm text-ink">
          {quartosTexto(e.quartos)}
          {area && <> · {area}</>}
        </p>
        {children && <div className="mt-3 border-t border-line pt-3">{children}</div>}
      </div>
    </article>
  );
}
