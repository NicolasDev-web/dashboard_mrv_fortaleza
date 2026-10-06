"use client";

import { useEffect, useRef, useState } from "react";
import type { gsap as Gsap } from "gsap";
import type { Imagem } from "@/lib/types";
import { TIPO_IMAGEM_ROTULO } from "@/lib/rotulos";
import { Img } from "@/components/ui/Img";
import { Badge } from "@/components/ui/Badge";
import { Galeria } from "@/components/ui/Galeria";

/**
 * Fotos do lazer em leque, adaptado do Bounce Cards (React Bits, MIT + Commons Clause).
 * Mudanças em relação ao original: posições em % da carta (cabe em 360 px e escala até o desktop),
 * leque simétrico em arco, curvas sem elástico (o guia veta bounce excessivo), entrada só quando a
 * seção chega na tela, cartas são botões (teclado e leitor de tela), empurrão só com mouse ou foco,
 * e tocar abre a galeria naquela foto. Com reduced motion, o leque fica parado.
 * O GSAP (~29 KB) chega depois da página: o leque fica abaixo da dobra e já aparece montado pelo CSS.
 */

/** Distância entre cartas (% da carta), giro e curvatura do arco, por posição a partir do centro. */
const PASSO_X = 44;
const GIRO = 6;
const ARCO_Y = 5;
/** Quanto as vizinhas se afastam (em % da carta) quando uma carta é destacada. */
const EMPURRAO = 26;

function base(i: number, n: number) {
  const c = i - (n - 1) / 2;
  return { xPercent: c * PASSO_X, yPercent: c * c * ARCO_Y, rotation: c * GIRO, zIndex: 10 - Math.round(Math.abs(c) * 2) };
}

export function LequeLazer({ nome, fotos, galeria }: { nome: string; fotos: Imagem[]; galeria: Imagem[] }) {
  const raiz = useRef<HTMLDivElement>(null);
  /** a carta que abriu a galeria recebe o foco de volta ao fechar */
  const origem = useRef<HTMLButtonElement | null>(null);
  const motor = useRef<typeof Gsap | null>(null);
  const contexto = useRef<gsap.Context | null>(null);
  const parado = useRef(false);
  const [aberta, setAberta] = useState<string | null>(null);
  const n = fotos.length;

  useEffect(() => {
    const el = raiz.current;
    if (!el) return;
    parado.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let io: IntersectionObserver | undefined;
    let cancelado = false;
    import("gsap").then(({ gsap }) => {
      if (cancelado) return;
      motor.current = gsap;
      const cartas = () => gsap.utils.toArray<HTMLElement>(".carta", el);
      contexto.current = gsap.context(() => {
        if (parado.current || el.getBoundingClientRect().top < window.innerHeight * 0.9) return;
        gsap.set(cartas(), { opacity: 0, scale: 0.9 });
        io = new IntersectionObserver(
          ([e]) => {
            if (!e.isIntersecting) return;
            io?.disconnect();
            contexto.current?.add(() => gsap.to(cartas(), { opacity: 1, scale: 1, duration: 0.5, stagger: 0.06, ease: "power3.out" }));
          },
          { rootMargin: "100000px 0px -15% 0px" },
        );
        io.observe(el);
      }, el);
    });
    return () => {
      cancelado = true;
      io?.disconnect();
      contexto.current?.revert();
      contexto.current = null;
    };
  }, [n]);

  const destacar = (alvo: number) => {
    const gsap = motor.current;
    if (!gsap || parado.current) return;
    contexto.current?.add(() => {
      gsap.utils.toArray<HTMLElement>(".carta", raiz.current).forEach((c, i) => {
        const b = base(i, n);
        // a pilha é decidida no suporte (pai), que o GSAP não move
        gsap.set(c.parentElement, { zIndex: i === alvo ? 20 : b.zIndex });
        if (i === alvo) {
          // desfaz o giro do leque (que está no suporte) e sobe um pouco
          gsap.to(c, { xPercent: 0, yPercent: -8, rotation: -b.rotation, scale: 1.05, duration: 0.32, ease: "back.out(1.2)", overwrite: "auto" });
        } else {
          gsap.to(c, {
            xPercent: i < alvo ? -EMPURRAO : EMPURRAO, yPercent: 0, rotation: 0, scale: 1,
            duration: 0.32, delay: Math.abs(alvo - i) * 0.04, ease: "back.out(1.2)", overwrite: "auto",
          });
        }
      });
    });
  };

  const soltar = () => {
    const gsap = motor.current;
    if (!gsap || parado.current) return;
    contexto.current?.add(() => {
      gsap.utils.toArray<HTMLElement>(".carta", raiz.current).forEach((c, i) => {
        gsap.set(c.parentElement, { zIndex: base(i, n).zIndex });
        gsap.to(c, { xPercent: 0, yPercent: 0, rotation: 0, scale: 1, duration: 0.32, ease: "power3.out", overwrite: "auto" });
      });
    });
  };

  return (
    <>
      <div
        ref={raiz}
        // alinhado ao topo: as cartas das pontas descem pelo arco; a folga em cima é para o giro e a subida no hover
        className="relative mx-auto flex h-[calc(var(--carta)*1.8)] items-start justify-center pt-[calc(var(--carta)*0.12)] [--carta:clamp(100px,28vw,200px)]"
        onPointerLeave={soltar}
      >
        {fotos.map((f, i) => {
          const b = base(i, n);
          const rotulo = TIPO_IMAGEM_ROTULO[f.tipo];
          const lado = i - (n - 1) / 2;
          // o rótulo fica no lado que aparece (as vizinhas cobrem o outro); no celular, só o da carta do meio
          const posRotulo = lado < 0 ? "left-2 hidden sm:block" : lado > 0 ? "right-2 hidden sm:block" : "left-1/2 -translate-x-1/2";
          return (
            // Suporte: guarda a posição no leque (CSS, já vem do servidor) e a ordem da pilha. O GSAP anima só
            // o botão dentro dele; se animasse o mesmo elemento, absorveria translate/rotate no transform.
            <div key={f.id} className="absolute w-[var(--carta)]" style={{ transform: `translate(${b.xPercent}%, ${b.yPercent}%) rotate(${b.rotation}deg)`, zIndex: b.zIndex }}>
            <button
              type="button"
              aria-label={`Ver foto: ${rotulo}`}
              onClick={(e) => { origem.current = e.currentTarget; setAberta(f.id); }}
              onPointerEnter={(e) => e.pointerType === "mouse" && destacar(i)}
              onFocus={() => destacar(i)}
              onBlur={soltar}
              className="carta relative block w-full overflow-hidden rounded-lg border-4 border-white bg-white shadow-e2"
            >
              <Img img={f} alt="" sizes="200px" className="aspect-[4/5] w-full rounded-[8px]" />
              <span className={`absolute bottom-2 ${posRotulo}`}>
                <Badge tom="neutro" className="shadow-e1">{rotulo}</Badge>
              </span>
            </button>
            </div>
          );
        })}
      </div>
      <Galeria nome={nome} fotos={galeria} inicial={aberta ?? undefined} open={aberta != null} onOpenChange={(v) => !v && setAberta(null)} retornarFoco={origem} />
    </>
  );
}
