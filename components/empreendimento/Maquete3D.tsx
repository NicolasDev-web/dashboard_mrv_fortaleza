"use client";

import dynamic from "next/dynamic";
import { Component, useEffect, useRef, useState, useSyncExternalStore, type ReactNode, type RefObject } from "react";
import { ArrowLeft, Check, Hand, MapPin, Maximize2, Minimize2, RotateCcw, Sun, Sunrise, Sunset, Tag, X, ZoomIn, ZoomOut, type LucideIcon } from "lucide-react";
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

/** Manhã, meio-dia e tarde; em tela cheia flutua no alto da maquete */
function SeletorSol({ hora, setHora, flutuante }: { hora: number; setHora(h: number): void; flutuante?: boolean }) {
  return (
    <div
      className={
        flutuante
          ? "absolute bottom-3 left-3 z-10 flex items-center gap-1 rounded-full bg-white/95 p-1 shadow-e2 sm:bottom-auto sm:left-1/2 sm:top-3 sm:-translate-x-1/2"
          : "mt-3 flex flex-wrap items-center gap-1.5"
      }
      role="group"
      aria-label="Posição do sol"
    >
      {!flutuante && <span className="mr-1 text-sm font-semibold text-ink">Sol:</span>}
      {HORARIOS.map(({ hora: h, rotulo, Icone }) => (
        <button
          key={h}
          type="button"
          onClick={() => setHora(h)}
          aria-pressed={hora === h}
          className={`flex min-h-11 items-center gap-1.5 rounded-full border px-3 text-sm font-semibold transition-colors duration-[var(--t-fast)] ${
            hora === h ? "border-green-900 bg-selected text-green-900" : `${flutuante ? "border-transparent" : "border-line"} text-ink hover:border-line-strong`
          }`}
        >
          <Icone className="size-4 text-orange-500" aria-hidden /> <span className={flutuante ? "max-sm:sr-only" : undefined}>{rotulo}</span>
        </button>
      ))}
    </div>
  );
}

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

const SENTIDOS = ["ao norte", "a nordeste", "a leste", "a sudeste", "ao sul", "a sudoeste", "a oeste", "a noroeste"];

/**
 * O que é o lugar em foco e a que distância fica. Sobre a maquete fica no canto superior esquerdo
 * ou, no celular em tela cheia, embaixo; no celular fora da tela cheia vai para baixo da maquete,
 * que é pequena demais para dividir espaço com o texto.
 */
function FichaDoMarco({ refs, aoVoltar, abaixo, className = "" }: { refs: Referencia[]; aoVoltar(): void; abaixo?: boolean; className?: string }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    if (abaixo) ref.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [abaixo, refs]);
  return (
    <section
      ref={ref}
      aria-label={`Sobre ${refs.map((r) => r.nome).join(" e ")}`}
      className={`${
        abaixo
          ? "relative mt-3 rounded-lg border border-line bg-white p-3 pr-11"
          : "absolute inset-x-3 bottom-16 z-20 max-h-[46%] overflow-y-auto rounded-lg bg-white/95 p-3 pr-11 shadow-e2 sm:inset-x-auto sm:bottom-auto sm:left-3 sm:top-12 sm:max-h-[calc(100%-8rem)] sm:w-80"
      } ${className}`}
    >
      <button type="button" onClick={aoVoltar} className="absolute right-0 top-0 flex size-11 items-center justify-center text-muted hover:text-ink">
        <X className="size-5" aria-hidden />
        <span className="sr-only">Fechar e voltar ao condomínio</span>
      </button>
      {refs.map((r, i) => (
        <div key={r.nome} className={i ? "mt-3 border-t border-line pt-3" : undefined}>
          <h3 className="text-base font-bold leading-snug text-ink">{r.nome}</h3>
          <p className="mt-1 flex items-start gap-1.5 text-sm font-semibold text-purple-700">
            <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden />
            {r.km.toLocaleString("pt-BR")} km em linha reta, {SENTIDOS[Math.round(r.rumo / 45) % 8]} do condomínio
          </p>
          {r.sobre && <p className="mt-1.5 text-sm leading-relaxed text-ink">{r.sobre}</p>}
        </div>
      ))}
      <button
        type="button"
        onClick={aoVoltar}
        className="mt-3 flex min-h-11 items-center gap-1.5 rounded-full border border-line px-3 text-sm font-semibold text-green-900 hover:border-line-strong"
      >
        <ArrowLeft className="size-4" aria-hidden /> Voltar ao condomínio
      </button>
    </section>
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
  const [marco, setMarco] = useState<string | null>(null);
  const emFoco = marco ? referencias.filter((r) => r.marco === marco).sort((a, b) => a.km - b.km) : [];
  // tela cheia: a do navegador quando existe; senão (Safari do iPhone) a maquete cobre a janela
  const [cheia, setCheia] = useState(false);
  const [cobrindo, setCobrindo] = useState(false);

  useEffect(() => {
    const aoMudar = () => setCheia(document.fullscreenElement === caixa.current);
    document.addEventListener("fullscreenchange", aoMudar);
    return () => document.removeEventListener("fullscreenchange", aoMudar);
  }, []);

  useEffect(() => {
    if (!cobrindo) return;
    const aoTeclar = (e: KeyboardEvent) => e.key === "Escape" && setCobrindo(false);
    const rolagem = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", aoTeclar);
    return () => {
      document.body.style.overflow = rolagem;
      window.removeEventListener("keydown", aoTeclar);
    };
  }, [cobrindo]);

  const emTelaCheia = cheia || cobrindo;
  async function alternarTelaCheia() {
    if (emTelaCheia) {
      if (document.fullscreenElement) await document.exitFullscreen().catch(() => {});
      setCobrindo(false);
      return;
    }
    setMexeu(true);
    const el = caixa.current!;
    if (el.requestFullscreen && document.fullscreenEnabled) {
      try {
        await el.requestFullscreen({ navigationUI: "hide" });
        return;
      } catch {
        // recusado (iframe, permissão): cai na cobertura da janela
      }
    }
    setCobrindo(true);
  }

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

  // em tela cheia não há página para rolar: o dedo já gira e a pinça aproxima
  const interativo = !toque || ativoNoToque || emTelaCheia;

  return (
    <figure>
      <div
        ref={caixa}
        className={`isolate overflow-hidden bg-bg-subtle ${
          cobrindo ? "fixed inset-0 z-[100] h-dvh w-screen" : "relative aspect-square rounded-lg border border-line sm:aspect-[4/3] lg:aspect-[16/10] [&:fullscreen]:rounded-none [&:fullscreen]:border-0"
        }`}
      >
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
                zoomLivre={emTelaCheia || (toque && ativoNoToque)}
                girando={!reduzir && !mexeu}
                intro={!reduzir}
                visivel={visivel}
                rotulos={rotulos}
                hora={hora}
                referencias={referencias}
                bussolaRef={bussola}
                controleRef={controle}
                marcoEscolhido={marco}
                aoEscolherMarco={(id) => {
                  setMexeu(true);
                  setMarco(id);
                }}
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
            <button type="button" onClick={alternarTelaCheia} aria-pressed={emTelaCheia} className={`${botao} absolute right-16 top-3 z-10`}>
              {emTelaCheia ? <Minimize2 className="size-5" aria-hidden /> : <Maximize2 className="size-5" aria-hidden />}
              <span className="sr-only">{emTelaCheia ? "Sair da tela cheia" : "Ver a maquete em tela cheia"}</span>
            </button>
            {emTelaCheia && <SeletorSol hora={hora} setHora={setHora} flutuante />}
            <button type="button" onClick={() => setRotulos((r) => !r)} aria-pressed={rotulos} className={`${botao} absolute right-3 top-3 z-10`}>
              <Tag className="size-5" aria-hidden />
              <span className="sr-only">Mostrar nomes e pontos de referência</span>
            </button>
            <RosaDosVentos giroRef={bussola} hora={hora} />
            {emFoco.length > 0 && <FichaDoMarco refs={emFoco} aoVoltar={() => setMarco(null)} className={emTelaCheia ? "" : "max-sm:hidden"} />}

            <div className="absolute bottom-3 left-3 z-10">
              {toque && !emTelaCheia ? (
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
              <button
                type="button"
                onClick={() => {
                  setMarco(null);
                  controle.current?.resetar();
                }}
                className={botao}
              >
                <RotateCcw className="size-5" aria-hidden />
                <span className="sr-only">Voltar à vista inicial</span>
              </button>
            </div>
          </>
        )}
      </div>
      {emFoco.length > 0 && !emTelaCheia && <FichaDoMarco refs={emFoco} aoVoltar={() => setMarco(null)} abaixo className="sm:hidden" />}
      <SeletorSol hora={hora} setHora={setHora} />
      <p className="mt-2 text-sm text-muted">
        O sol nasce no leste e se põe no oeste. Escolha o horário para ver quais fachadas e áreas pegam sol: a luz segue a posição de março e setembro (em junho
        ele passa um pouco mais ao norte e, em dezembro, mais ao sul). Os marcadores roxos apontam a direção e a distância em linha reta até lugares conhecidos da cidade
        {referencias.some((r) => r.marco)
          ? "; alguns aparecem em miniatura, bem mais perto e menores do que na realidade, mas na direção certa. Toque ou clique numa miniatura para vê-la de perto e saber o que é."
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
