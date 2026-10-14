"use client";

import dynamic from "next/dynamic";
import { Component, useEffect, useRef, useState, useSyncExternalStore, type ReactNode, type RefObject } from "react";
import { Check, Hand, RotateCcw, Sun, Sunrise, Sunset, Tag, ZoomIn, ZoomOut, type LucideIcon } from "lucide-react";
import type { Maquete, Referencia } from "@/lib/maquete/tipos";
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

const HORARIOS: { hora: number; rotulo: string; Icone: LucideIcon }[] = [
  { hora: 8, rotulo: "Manhã", Icone: Sunrise },
  { hora: 12, rotulo: "Meio-dia", Icone: Sun },
  { hora: 16, rotulo: "Tarde", Icone: Sunset },
];

/** Rosa dos ventos da interface: a cena gira o elemento interno para o N apontar para o norte real */
/** Onde fica o sol na rosa, por horário: de manhã a leste, ao meio-dia quase a pino, à tarde a oeste */
const SOL_NA_ROSA: Record<number, [number, number]> = { 8: [41, 27], 12: [28, 25], 16: [15, 27] };

function RosaDosVentos({ giroRef, hora }: { giroRef: RefObject<HTMLDivElement | null>; hora: number }) {
  const [sx, sy] = SOL_NA_ROSA[hora] ?? SOL_NA_ROSA[12];
  return (
    <div className="absolute right-3 top-16 z-10 size-14 rounded-full bg-white/95 shadow-e2" aria-hidden>
      <div ref={giroRef} className="size-full">
        <svg viewBox="0 0 56 56" className="size-full">
          {Array.from({ length: 8 }, (_, i) => (
            <line key={i} x1="28" y1="5" x2="28" y2={i % 2 ? 8 : 9.5} stroke="currentColor" className="text-line-strong" strokeWidth="1.2" transform={`rotate(${i * 45} 28 28)`} />
          ))}
          <path d="M28 10 L32.5 28 L28 26 L23.5 28 Z" className="fill-green-900" />
          <path d="M28 46 L32.5 28 L28 30 L23.5 28 Z" className="fill-line-strong" />
          <text x="28" y="9" textAnchor="middle" dominantBaseline="middle" className="fill-green-900 text-[8px] font-bold">N</text>
          <text x="48.5" y="28.5" textAnchor="middle" dominantBaseline="middle" className="fill-orange-500 text-[7px] font-bold">L</text>
          <text x="28" y="49" textAnchor="middle" dominantBaseline="middle" className="fill-ink text-[7px] font-bold">S</text>
          <text x="7.5" y="28.5" textAnchor="middle" dominantBaseline="middle" className="fill-orange-500 text-[7px] font-bold">O</text>
          <circle cx={sx} cy={sy} r="3.6" className="fill-orange-300 stroke-orange-500" strokeWidth="1" />
        </svg>
      </div>
    </div>
  );
}

/**
 * Maquete 3D do condomínio, montada a partir da planta de implantação. No toque, arrastar só gira
 * depois que a pessoa ativa, para o dedo continuar rolando a página; a roda do mouse também segue
 * rolando, e o zoom fica nos botões.
 */
export function Maquete3D({ maquete, poster, referencias }: { maquete: Maquete; poster?: Imagem; referencias: Referencia[] }) {
  const caixa = useRef<HTMLDivElement>(null);
  const bussola = useRef<HTMLDivElement>(null);
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
  const [hora, setHora] = useState(8);

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
                hora={hora}
                referencias={referencias}
                bussolaRef={bussola}
                controleRef={controle}
                aoInteragir={() => setMexeu(true)}
                aoCarregar={() => setPronto(true)}
              />
            </SemWebGL>
          )}
        </div>

        <span className="absolute left-3 top-3 z-10 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-ink shadow-e1">Representação ilustrativa</span>

        {!pronto && !falhou && (
          <p className="absolute inset-x-0 z-10 bottom-4 mx-auto w-fit rounded-full bg-white/95 px-3 py-1.5 text-sm font-semibold text-green-900 shadow-e2" role="status">
            Montando a maquete…
          </p>
        )}
        {falhou && (
          <p className="absolute inset-x-3 z-10 bottom-3 rounded-lg bg-white/95 px-3 py-2 text-sm text-ink shadow-e2" role="status">
            Seu navegador não conseguiu abrir a maquete 3D. A foto mostra o condomínio visto de cima.
          </p>
        )}

        {pronto && !falhou && (
          <>
            <button type="button" onClick={() => setRotulos((r) => !r)} aria-pressed={rotulos} className={`${botao} absolute right-3 top-3 z-10`}>
              <Tag className="size-5" aria-hidden />
              <span className="sr-only">Mostrar nomes e pontos de referência</span>
            </button>
            <RosaDosVentos giroRef={bussola} hora={hora} />

            <div className="absolute bottom-3 left-3 z-10">
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

            <div className="absolute bottom-3 right-3 z-10 flex gap-2">
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
      <div className="mt-3 flex flex-wrap items-center gap-1.5" role="group" aria-label="Posição do sol">
        <span className="mr-1 text-sm font-semibold text-ink">Sol:</span>
        {HORARIOS.map(({ hora: h, rotulo, Icone }) => (
          <button
            key={h}
            type="button"
            onClick={() => setHora(h)}
            aria-pressed={hora === h}
            className={`flex min-h-11 items-center gap-1.5 rounded-full border px-3 text-sm font-semibold transition-colors duration-[var(--t-fast)] ${
              hora === h ? "border-green-900 bg-selected text-green-900" : "border-line text-ink hover:border-line-strong"
            }`}
          >
            <Icone className="size-4 text-orange-500" aria-hidden /> {rotulo}
          </button>
        ))}
      </div>
      <p className="mt-2 text-sm text-muted">
        O sol nasce no leste e se põe no oeste. Escolha o horário para ver quais fachadas e áreas pegam sol: a luz segue a posição de março e setembro (em junho
        ele passa um pouco mais ao norte e, em dezembro, mais ao sul). Os marcadores roxos apontam a direção e a distância em linha reta até lugares conhecidos da cidade
        {referencias.some((r) => r.marco)
          ? "; alguns aparecem em miniatura, bem mais perto e menores do que na realidade, mas na direção certa."
          : "."}
      </p>
      <figcaption className="mt-2 text-sm text-muted">
        {maquete.estimada
          ? "Montada a partir da vista aérea divulgada pela MRV, que não publicou a planta de implantação. Posições e medidas são estimadas."
          : "Montada a partir da planta de implantação divulgada pela MRV. Posições e alturas seguem a planta; acabamentos e cores são aproximados."}
      </figcaption>
    </figure>
  );
}
