"use client";

import { useMemo } from "react";
import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { CidadeMapa, projetar, type PinMapa } from "@/components/mapa/CidadeMapa";
import type { EstadoMapa } from "@/lib/quiz/mapa";

const CENTRO: [number, number] = [0.5, 0.45];

/**
 * O mapa que reage ao quiz. No celular, uma faixa compacta acima da pergunta (mapa pequeno + contador);
 * no desktop, a coluna da direita, fixa enquanto a pessoa responde.
 */
export function QuizMapa({ pins, estado }: { pins: PinMapa[]; estado: EstadoMapa }) {
  const reduzir = useReducedMotion();
  const comEstado = useMemo(
    () => pins.map((p) => ({ ...p, intensidade: estado.pinos[p.slug]?.intensidade ?? 1, apagado: estado.pinos[p.slug]?.apagado ?? false })),
    [pins, estado.pinos],
  );
  // A onda parte do destino quando há um; senão, do centro. Memo por valor: a mesma origem não reinicia a onda.
  const ox = estado.destino ? projetar(estado.destino.lat, estado.destino.lon)[0] : CENTRO[0];
  const oy = estado.destino ? projetar(estado.destino.lat, estado.destino.lon)[1] : CENTRO[1];
  const origem = useMemo<[number, number]>(() => [ox, oy], [ox, oy]);

  return (
    <div className="flex items-center gap-3 rounded-xl bg-green-950 p-2.5 text-white lg:block lg:p-5">
      <div className="hidden items-end justify-between gap-4 pb-3 lg:flex">
        <Contador combinam={estado.combinam} total={estado.total} reduzir={!!reduzir} grande />
      </div>
      <div className="w-[44%] shrink-0 lg:w-full">
        <CidadeMapa
          pins={comEstado}
          brilho={estado.brilho}
          vizinhos={estado.vizinhos}
          origem={origem}
          destino={estado.destino}
          somenteLeitura
          titulo="Mapa com os empreendimentos que combinam com as suas respostas"
        />
      </div>
      <div className="min-w-0 flex-1 lg:pt-3">
        <div className="lg:hidden">
          <Contador combinam={estado.combinam} total={estado.total} reduzir={!!reduzir} />
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <m.p
            key={estado.frase}
            initial={{ opacity: 0, y: reduzir ? 0 : 6 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.24 } }}
            exit={{ opacity: 0, transition: { duration: 0.12 } }}
            className="mt-1 text-[13px] leading-snug text-white/75 lg:mt-0 lg:text-[15px]"
            aria-live="polite"
          >
            {estado.frase}
          </m.p>
        </AnimatePresence>
      </div>
    </div>
  );
}

function Contador({ combinam, total, reduzir, grande }: { combinam: number; total: number; reduzir: boolean; grande?: boolean }) {
  return (
    <p className="flex items-baseline gap-2" aria-live="polite">
      <span className={`relative inline-flex overflow-hidden font-extrabold tabular-nums text-green-300 ${grande ? "text-5xl" : "text-3xl"}`}>
        <AnimatePresence mode="popLayout" initial={false}>
          <m.span
            key={combinam}
            initial={{ y: reduzir ? 0 : "60%", opacity: 0 }}
            animate={{ y: 0, opacity: 1, transition: { duration: 0.32, ease: [0.16, 1, 0.3, 1] } }}
            exit={{ y: reduzir ? 0 : "-60%", opacity: 0, transition: { duration: 0.18 } }}
          >
            {combinam}
          </m.span>
        </AnimatePresence>
      </span>
      <span className={`leading-tight text-white ${grande ? "text-lg" : "text-[13px]"}`}>
        de {total} combinam
        <span className={grande ? "" : "block"}> com você</span>
      </span>
    </p>
  );
}
