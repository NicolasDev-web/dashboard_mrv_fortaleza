"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import { CidadeMapa, projetar, type DestinoMapa, type PinMapa } from "@/components/mapa/CidadeMapa";

/**
 * A revelação entre o quiz e o resultado (~3 s, pulável): o mapa apaga quem ficou de fora, os números
 * 5, 4, 3 e 2 aparecem, o 1º pulsa, a câmera aproxima dele e corta para a foto de capa.
 * Só aparece quando a pessoa chega do quiz; com prefers-reduced-motion, não aparece.
 */
const TEMPOS = [450, 800, 1050, 1300, 1550, 1900, 2650, 3050]; // apaga, #5, #4, #3, #2, #1, zoom, fim

export function Revelacao({ pins, top, destino, nome1, onFim }: {
  pins: PinMapa[];
  /** slugs do top 5 na ordem */
  top: string[];
  destino?: DestinoMapa;
  nome1: string;
  onFim: () => void;
}) {
  const [etapa, setEtapa] = useState(0);
  useEffect(() => {
    const ts = TEMPOS.map((t, k) => setTimeout(() => (k === TEMPOS.length - 1 ? onFim() : setEtapa(k + 1)), t));
    return () => ts.forEach(clearTimeout);
  }, [onFim]);

  const numeros = top.length;
  const comEstado = useMemo(() => pins.map((p) => {
    const pos = top.indexOf(p.slug);
    // etapa 1 apaga os de fora; etapas 2..6 revelam do último colocado ao 1º
    const revelado = pos >= 0 && etapa >= 1 + (numeros - pos);
    return { ...p, apagado: etapa >= 1 && pos < 0, intensidade: pos >= 0 ? 1 : 0.4, numero: revelado ? pos + 1 : undefined };
  }), [pins, top, etapa, numeros]);

  const p1 = pins.find((p) => p.slug === top[0]);
  const [x1, y1] = p1 ? projetar(p1.coord.lat, p1.coord.lon) : [0.5, 0.5];
  const zoom = etapa >= 7;

  return (
    <div
      className="revelacao fixed inset-0 z-50 flex flex-col items-center justify-center bg-green-950 px-5 text-white"
      role="status"
      aria-label={`Encontramos o seu MRV: ${nome1}`}
      onClick={onFim}
    >
      <p className="mb-4 text-center text-sm font-semibold uppercase tracking-[0.1em] text-green-300">
        {etapa < 6 ? "Comparando os 16 com as suas respostas" : "Encontramos o seu MRV"}
      </p>
      <div className="w-full max-w-[560px] transition-[transform,opacity] duration-[500ms] ease-saida" style={{ transform: zoom ? "scale(2.4)" : "scale(1)", transformOrigin: `${x1 * 100}% ${y1 * 100}%`, opacity: etapa >= 7 ? 0 : 1 }}>
        <CidadeMapa pins={comEstado} destino={destino} somenteLeitura titulo="Revelação do ranking" />
      </div>
      {/* o nome entra palavra por palavra (efeito do Split Text do React Bits, em CSS: sem GSAP nesta rota) */}
      <p className="mt-5 text-center text-2xl font-extrabold md:text-3xl" aria-hidden>
        {nome1.split(" ").map((palavra, k) => (
          <Fragment key={k}>
            {k > 0 && " "}
            <span
              className={`inline-block transition-[opacity,transform] duration-[var(--t-emph)] ease-saida ${etapa >= 6 ? "translate-y-0 opacity-100" : "translate-y-[0.4em] opacity-0"}`}
              style={{ transitionDelay: etapa >= 6 ? `${k * 60}ms` : "0ms" }}
            >
              {palavra}
            </span>
          </Fragment>
        ))}
      </p>
      <button type="button" onClick={onFim} className="absolute bottom-[calc(24px+env(safe-area-inset-bottom))] h-11 rounded-full px-5 text-sm font-semibold text-white/80 hover:bg-white/10">
        Pular
      </button>
    </div>
  );
}
