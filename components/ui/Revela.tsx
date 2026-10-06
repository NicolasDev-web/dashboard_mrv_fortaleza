"use client";

import { useEffect, useRef, type ReactNode, type RefObject } from "react";

type Props = {
  as?: "div" | "ul" | "ol";
  className?: string;
  children: ReactNode;
};

/**
 * Os filhos entram em cascata (16 px de baixo + fade, 60 ms entre eles) quando o bloco chega na tela,
 * uma vez só. O estado escondido só é aplicado aqui, no navegador, e só se o bloco ainda está abaixo
 * da dobra: sem JS, com reduced motion ou já à vista, nada some. CSS em app/globals.css ([data-revela]).
 */
export function Revela({ as: Tag = "div", className, children }: Props) {
  // div, ul e ol: o ref de HTMLDivElement serve aos três para o que usamos (dataset e posição)
  const raiz = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = raiz.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return;
    el.dataset.revela = "espera";
    // Margem enorme em cima: um bloco que ficou acima da tela (salto de rolagem) também conta como visto.
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        el.dataset.revela = "visto";
        io.disconnect();
      },
      { rootMargin: "100000px 0px -12% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag ref={raiz as RefObject<never>} className={className}>
      {children}
    </Tag>
  );
}
