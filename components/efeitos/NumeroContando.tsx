"use client";

import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";

/**
 * Número que conta até o valor (portado do Number Ticker do Magic UI, MIT).
 * Escreve direto no DOM a cada quadro, sem re-render. Começa quando entra na tela e `iniciar` é true;
 * com reduced motion já mostra o valor final. Decorativo: quem usa expõe o valor ao leitor de tela.
 */
export function NumeroContando({ valor, de = 0, sufixo = "", duracao = 1.2, atraso = 0, iniciar = true, className = "" }: {
  valor: number;
  de?: number;
  sufixo?: string;
  /** segundos */
  duracao?: number;
  /** segundos */
  atraso?: number;
  iniciar?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const visto = useInView(ref, { once: true });
  const reduzir = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduzir) {
      el.textContent = `${valor}${sufixo}`;
      return;
    }
    if (!visto || !iniciar) return;
    const controle = animate(de, valor, {
      duration: duracao,
      delay: atraso,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => { el.textContent = `${Math.round(v)}${sufixo}`; },
    });
    return () => controle.stop();
  }, [valor, de, sufixo, duracao, atraso, iniciar, visto, reduzir]);

  return (
    <span ref={ref} aria-hidden className={`tabular-nums ${className}`}>
      {de}{sufixo}
    </span>
  );
}
