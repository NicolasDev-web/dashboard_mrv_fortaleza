"use client";

import { useEffect, useState, type PointerEvent, type ReactNode } from "react";
import { AnimatePresence, LazyMotion, domAnimation, m, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import type { Imagem } from "@/lib/types";
import { Img } from "@/components/ui/Img";

/** largura do cartão (a mesma do w-[220px] abaixo) */
const LARGURA = 220;
/** foto 4:3 mais a linha do nome */
const ALTURA = LARGURA * 0.75 + 36;

export type Previa = { slug: string; nome: string; score: number; capa: Imagem };

/**
 * Hover Preview: num mouse, a capa do empreendimento flutua ao lado do cursor enquanto ele passa pelas
 * linhas do ranking completo (que são só texto); cada linha marca `data-previa={slug}`. Decorativa
 * (aria-hidden, sem eventos de ponteiro): a linha continua sendo o link. Sem hover (toque), não
 * existe. Com reduced motion, segue sem mola.
 */
export function PreviaFlutuante({ itens, children }: { itens: Previa[]; children: ReactNode }) {
  const reduzir = useReducedMotion();
  const [ativo, setAtivo] = useState<string | null>(null);
  const [comMouse, setComMouse] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mola = { stiffness: 420, damping: 36, mass: 0.6 };
  const sy = useSpring(y, mola);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const ler = () => setComMouse(mq.matches);
    ler();
    mq.addEventListener("change", ler);
    return () => mq.removeEventListener("change", ler);
  }, []);

  // Na faixa vazia do meio da lista (entre o nome e o %), sem cobrir o que a pessoa lê; só a altura
  // acompanha o cursor, com mola. LARGURA/2 e ALTURA/2 centralizam o cartão na linha.
  const posicionar = (e: PointerEvent<HTMLDivElement>, saltar: boolean) => {
    const r = e.currentTarget.getBoundingClientRect();
    x.set(r.left + r.width / 2 - LARGURA / 2);
    // sempre inteiro na tela: abaixo do cabeçalho fixo (64 px) e acima da borda de baixo
    const topo = Math.min(Math.max(e.clientY - ALTURA / 2, 72), window.innerHeight - ALTURA - 12);
    y.set(topo);
    if (saltar) sy.jump(topo);
  };

  const mover = (e: PointerEvent<HTMLDivElement>) => {
    if (!comMouse || e.pointerType !== "mouse") return;
    const slug = (e.target as Element).closest<HTMLElement>("[data-previa]")?.dataset.previa ?? null;
    // ao aparecer, nasce já no cursor (sem vir voando do canto); depois segue com mola
    posicionar(e, !ativo || !!reduzir);
    if (slug !== ativo) setAtivo(slug);
  };

  const item = itens.find((i) => i.slug === ativo);

  return (
    <LazyMotion features={domAnimation} strict>
      <div onPointerMove={mover} onPointerLeave={() => setAtivo(null)}>
        {children}
      </div>
      <AnimatePresence>
        {item && (
          <m.div
            key="previa"
            aria-hidden
            data-previa-flutuante
            className="pointer-events-none fixed left-0 top-0 z-40 w-[220px] overflow-hidden rounded-lg border border-line bg-white shadow-e3"
            style={{ x, y: sy }}
            initial={{ opacity: 0, scale: reduzir ? 1 : 0.94 }}
            animate={{ opacity: 1, scale: 1, transition: { duration: reduzir ? 0 : 0.18, ease: [0.2, 0.8, 0.2, 1] } }}
            exit={{ opacity: 0, scale: reduzir ? 1 : 0.94, transition: { duration: reduzir ? 0 : 0.12 } }}
          >
            <Img key={item.slug} img={item.capa} sizes="220px" className="aspect-[4/3] w-full" />
            <div className="flex items-center justify-between gap-2 px-3 py-2">
              <span className="truncate text-sm font-semibold text-ink">{item.nome}</span>
              <span className="shrink-0 text-sm font-semibold tabular-nums text-green-900">{item.score}%</span>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </LazyMotion>
  );
}
