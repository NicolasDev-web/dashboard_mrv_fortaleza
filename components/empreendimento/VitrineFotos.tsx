"use client";

import { useRef, useState, type CSSProperties } from "react";
import { Images, Pause, Play } from "lucide-react";
import type { Imagem } from "@/lib/types";
import { Img } from "@/components/ui/Img";
import { Galeria } from "@/components/ui/Galeria";
import { Button } from "@/components/ui/Button";

/** Segundos por foto: colunas com mais fotos não andam mais rápido. */
const SEGUNDOS_POR_FOTO = 5;
/** As primeiras de cada coluna aparecem já na abertura da página: carregam com prioridade. */
const PRIORITARIAS = 2;

/**
 * Duas colunas de fotos rolando na vertical em sentidos opostos (uma sobe, a outra desce).
 * Cada coluna tem a lista duplicada para o laço não ter emenda: a 2ª cópia é `aria-hidden` e `inert`
 * (nem leitor de tela nem Tab passam por ela). Tocar numa foto abre a galeria nela.
 * Para no hover e no foco, tem botão de pausa (WCAG 2.2.2) e fica parada com reduced motion.
 * CSS em app/globals.css (.vitrine-*).
 */
export function ColunasFotos({ nome, fotos, galeria, className = "" }: { nome: string; fotos: Imagem[]; galeria: Imagem[]; className?: string }) {
  const [pausado, setPausado] = useState(false);
  const [aberta, setAberta] = useState<string | null>(null);
  const origem = useRef<HTMLElement | null>(null);
  const colunas = [fotos.filter((_, i) => i % 2 === 0), fotos.filter((_, i) => i % 2 === 1)];

  const lista = (col: Imagem[], copia: boolean) =>
    col.map((f, i) => (
      <li key={f.id}>
        <button
          type="button"
          aria-label={`Ver foto: ${f.alt}`}
          onClick={(ev) => { origem.current = ev.currentTarget; setAberta(f.id); }}
          className="group block w-full overflow-hidden rounded-xl"
        >
          <Img
            img={f}
            sizes="(min-width: 1024px) 240px, 45vw"
            priority={!copia && i < PRIORITARIAS}
            className="aspect-[4/5] w-full transition-transform duration-[var(--t-emph)] ease-mrv group-hover:scale-[1.04]"
          />
        </button>
      </li>
    ));

  return (
    <div className={`vitrine relative ${className}`} data-pausado={pausado || undefined}>
      <div className="grid h-full grid-cols-2 gap-3">
        {colunas.map((col, k) => (
          <div
            key={k}
            className="vitrine-coluna"
            data-sentido={k === 0 ? "sobe" : "desce"}
            style={{ "--duracao": `${col.length * SEGUNDOS_POR_FOTO}s` } as CSSProperties}
          >
            <div className="vitrine-trilha">
              <ul className="vitrine-grupo">{lista(col, false)}</ul>
              <ul className="vitrine-grupo" aria-hidden inert>{lista(col, true)}</ul>
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => setPausado((p) => !p)}
        aria-pressed={pausado}
        aria-label={pausado ? "Retomar fotos" : "Pausar fotos"}
        className="vitrine-pausa absolute bottom-3 right-3 z-10 flex size-11 items-center justify-center rounded-full border border-white/20 bg-green-950/75 text-white backdrop-blur-sm transition-colors hover:bg-green-950"
      >
        {pausado ? <Play className="size-5" aria-hidden /> : <Pause className="size-5" aria-hidden />}
      </button>
      <Galeria nome={nome} fotos={galeria} inicial={aberta ?? undefined} open={aberta != null} onOpenChange={(v) => !v && setAberta(null)} retornarFoco={origem} />
    </div>
  );
}

/** "Ver todas as fotos": abre a galeria do começo. */
export function BotaoGaleria({ nome, galeria }: { nome: string; galeria: Imagem[] }) {
  return (
    <Galeria
      nome={nome}
      fotos={galeria}
      trigger={
        <Button variante="contornoClaro" className="w-full sm:w-auto">
          <Images className="size-5" aria-hidden /> Ver todas as fotos ({galeria.length})
        </Button>
      }
    />
  );
}
