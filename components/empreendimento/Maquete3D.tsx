"use client";

import dynamic from "next/dynamic";
import { Component, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { Check, Hand, RotateCcw, Tag, ZoomIn, ZoomOut } from "lucide-react";
import type { Maquete } from "@/lib/maquete/tipos";
import type { Imagem } from "@/lib/types";
import { Img } from "@/components/ui/Img";
import type { ControleMaquete } from "./maquete/Cena";

// three.js só baixa quando a seção chega perto da tela, e nunca no servidor
const Cena = dynamic(() => import("./maquete/Cena").then((m) => m.Cena), { ssr: false });

function useMidia(consulta: string, noServidor: boolean) {
  return useSyncExternalStore(
    (avisar) => {
      const mq = window.matchMedia(consulta);
      mq.addEventListener("change", avisar);
      return () => mq.removeEventListener("change", avisar);
    },
    () => window.matchMedia(consulta).matches,
    () => noServidor,
  );
}

/** Sem WebGL (ou com o contexto perdido), a foto aérea fica no lugar */
class SemWebGL extends Component<{ children: ReactNode; aoFalhar(): void }, { erro: boolean }> {
  state = { erro: false };
  static getDerivedStateFromError() {
    return { erro: true };
  }
  componentDidCatch() {
    this.props.aoFalhar();
  }
  render() {
    return this.state.erro ? null : this.props.children;
  }
}

const botao = "flex size-11 items-center justify-center rounded-full bg-white/95 text-green-900 shadow-e2 disabled:opacity-40";

/**
 * Maquete 3D do condomínio, montada a partir da planta de implantação. No toque, arrastar só gira
 * depois que a pessoa ativa, para o dedo continuar rolando a página; a roda do mouse também segue
 * rolando, e o zoom fica nos botões.
 */
export function Maquete3D({ maquete, poster }: { maquete: Maquete; poster?: Imagem }) {
  const caixa = useRef<HTMLDivElement>(null);
  const controle = useRef<ControleMaquete | null>(null);
  const toque = useMidia("(pointer: coarse)", true);
  const reduzir = useMidia("(prefers-reduced-motion: reduce)", true);
  const [carregar, setCarregar] = useState(false);
  const [visivel, setVisivel] = useState(false);
  const [pronto, setPronto] = useState(false);
  const [falhou, setFalhou] = useState(false);
  const [ativoNoToque, setAtivoNoToque] = useState(false);
  const [mexeu, setMexeu] = useState(false);
  const [rotulos, setRotulos] = useState(true);

  useEffect(() => {
    const io = new IntersectionObserver(
      ([en]) => {
        setVisivel(en.isIntersecting);
        if (en.isIntersecting) setCarregar(true);
      },
      { rootMargin: "300px" },
    );
    io.observe(caixa.current!);
    return () => io.disconnect();
  }, []);

  const interativo = !toque || ativoNoToque;

  return (
    <figure>
      <div ref={caixa} className="relative isolate aspect-square overflow-hidden rounded-lg border border-line bg-bg-subtle sm:aspect-[4/3] lg:aspect-[16/10]">
        <div role="img" aria-label={maquete.descricao} className="absolute inset-0">
          {poster && (
            <Img
              img={poster}
              alt=""
              sizes="(min-width: 1024px) 896px, 100vw"
              className={`pointer-events-none absolute inset-0 transition-opacity duration-[var(--t-emph)] ${pronto && !falhou ? "opacity-0" : "opacity-100"}`}
            />
          )}
          {carregar && !falhou && (
            <SemWebGL aoFalhar={() => setFalhou(true)}>
              <Cena
                m={maquete}
                interativo={interativo}
                zoomLivre={toque && ativoNoToque}
                girando={!reduzir && !mexeu}
                intro={!reduzir}
                visivel={visivel}
                rotulos={rotulos}
                controleRef={controle}
                aoInteragir={() => setMexeu(true)}
                aoCarregar={() => setPronto(true)}
              />
            </SemWebGL>
          )}
        </div>

        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-ink shadow-e1">Representação ilustrativa</span>

        {!pronto && !falhou && (
          <p className="absolute inset-x-0 bottom-4 mx-auto w-fit rounded-full bg-white/95 px-3 py-1.5 text-sm font-semibold text-green-900 shadow-e2" role="status">
            Montando a maquete…
          </p>
        )}
        {falhou && (
          <p className="absolute inset-x-3 bottom-3 rounded-lg bg-white/95 px-3 py-2 text-sm text-ink shadow-e2" role="status">
            Seu navegador não conseguiu abrir a maquete 3D. A foto mostra o condomínio visto de cima.
          </p>
        )}

        {pronto && !falhou && (
          <>
            <button type="button" onClick={() => setRotulos((r) => !r)} aria-pressed={rotulos} className={`${botao} absolute right-3 top-3`}>
              <Tag className="size-5" aria-hidden />
              <span className="sr-only">Mostrar nomes dos espaços</span>
            </button>

            <div className="absolute bottom-3 left-3">
              {toque ? (
                <button
                  type="button"
                  onClick={() => {
                    setAtivoNoToque((a) => !a);
                    setMexeu(true);
                  }}
                  className="flex min-h-11 items-center gap-2 rounded-full bg-white/95 px-4 text-sm font-semibold text-green-900 shadow-e2"
                >
                  {ativoNoToque ? <Check className="size-4" aria-hidden /> : <Hand className="size-4" aria-hidden />}
                  {ativoNoToque ? "Concluir" : "Tocar para girar"}
                </button>
              ) : (
                !mexeu && <span className="rounded-full bg-white/95 px-3 py-1.5 text-sm font-semibold text-green-900 shadow-e1">Arraste para girar</span>
              )}
            </div>

            <div className="absolute bottom-3 right-3 flex gap-2">
              <button type="button" onClick={() => controle.current?.zoom(0.8)} className={botao}>
                <ZoomIn className="size-5" aria-hidden />
                <span className="sr-only">Aproximar</span>
              </button>
              <button type="button" onClick={() => controle.current?.zoom(1.25)} className={botao}>
                <ZoomOut className="size-5" aria-hidden />
                <span className="sr-only">Afastar</span>
              </button>
              <button type="button" onClick={() => controle.current?.resetar()} className={botao}>
                <RotateCcw className="size-5" aria-hidden />
                <span className="sr-only">Voltar à vista inicial</span>
              </button>
            </div>
          </>
        )}
      </div>
      <figcaption className="mt-2 text-sm text-muted">
        {maquete.estimada
          ? "Montada a partir da vista aérea divulgada pela MRV, que não publicou a planta de implantação. Posições e medidas são estimadas."
          : "Montada a partir da planta de implantação divulgada pela MRV. Posições e alturas seguem a planta; acabamentos e cores são aproximados."}
      </figcaption>
    </figure>
  );
}
