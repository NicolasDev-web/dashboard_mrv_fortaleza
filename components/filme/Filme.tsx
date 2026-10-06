"use client";

import { ViewTransition, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Check, Expand, Pause, Play } from "lucide-react";
import { useReducedMotion } from "motion/react";
import type { Imagem } from "@/lib/types";
import type { Capitulo, CapituloId } from "@/lib/filme";
import { Img } from "@/components/ui/Img";
import { Sheet } from "@/components/ui/Sheet";

/** Tempo de cada foto. A barra de progresso (animação CSS) dita o ritmo: pausar = congelar a animação. */
const SEGUNDOS = 4.2;

type Props = {
  slug: string;
  nome: string;
  capitulos: Capitulo[];
  /** motivo da recomendação que aparece sobre o capítulo correspondente */
  motivos?: Partial<Record<CapituloId, string>>;
  /** começa a passar sozinho (sem som, sempre pausável) */
  autoplay?: boolean;
  /** altura/proporção do palco */
  className?: string;
  /** conteúdo sobre a parte de baixo da foto (nome, selo, botão) */
  children?: ReactNode;
  /** conteúdo no alto, abaixo das barras (ex.: "#1 para você") */
  topo?: ReactNode;
  /** todas as fotos, para o "Ver todas" */
  galeria?: Imagem[];
  priority?: boolean;
  /** `sizes` das fotos; num palco mais alto que a foto, o recorte amplia: peça uma variante maior */
  sizes?: string;
};

/**
 * O empreendimento como um filme curto: as fotos passam sozinhas com zoom lento, como stories.
 * Tocar à direita avança, à esquerda volta, segurar pausa; os capítulos levam direto ao ambiente.
 * Só a foto atual e as duas seguintes são montadas (o resto não baixa). Para fora da tela, com a aba
 * oculta e com prefers-reduced-motion (aí não há zoom nem avanço automático).
 */
export function Filme({ slug, nome, capitulos, motivos, autoplay = true, className = "aspect-[4/3]", children, topo, galeria, priority, sizes = "(min-width: 1024px) 70vw, 100vw" }: Props) {
  const quadros = useMemo(() => capitulos.flatMap((c) => c.fotos.map((foto) => ({ foto, cap: c.id }))), [capitulos]);
  const [i, setI] = useState(0);
  const [pausado, setPausado] = useState(false);
  const [segurando, setSegurando] = useState(false);
  const [visivel, setVisivel] = useState(true);
  const [oculta, setOculta] = useState(false);
  const reduzir = !!useReducedMotion();
  const raiz = useRef<HTMLDivElement>(null);
  const toque = useRef<{ t: number; timer: ReturnType<typeof setTimeout> | null; segurou: boolean }>({ t: 0, timer: null, segurou: false });

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisivel(e.intersectionRatio > 0.35), { threshold: [0, 0.35, 1] });
    if (raiz.current) io.observe(raiz.current);
    const vis = () => setOculta(document.hidden);
    document.addEventListener("visibilitychange", vis);
    return () => { io.disconnect(); document.removeEventListener("visibilitychange", vis); };
  }, []);

  const tocando = autoplay && !reduzir && !pausado && !segurando && visivel && !oculta;
  const total = quadros.length;
  const ir = useCallback((n: number) => setI(((n % total) + total) % total), [total]);
  const atual = quadros[i];
  const capAtual = atual?.cap;

  const onPointerDown = () => {
    toque.current.segurou = false;
    toque.current.timer = setTimeout(() => { toque.current.segurou = true; setSegurando(true); }, 220);
  };
  const soltar = (dir: 1 | -1) => {
    if (toque.current.timer) clearTimeout(toque.current.timer);
    if (toque.current.segurou) setSegurando(false);
    else ir(i + dir);
  };

  if (!atual) return null;
  const montados = new Set([i, (i + 1) % total, (i + 2) % total, (i - 1 + total) % total]);
  const motivo = capAtual ? motivos?.[capAtual] : undefined;

  return (
    <div
      ref={raiz}
      className={`filme relative overflow-hidden bg-ink text-white ${className}`}
      role="region"
      aria-roledescription="carrossel"
      aria-label={`Fotos do ${nome}`}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") ir(i + 1);
        else if (e.key === "ArrowLeft") ir(i - 1);
      }}
    >
      {quadros.map((q, k) => {
        if (!montados.has(k)) return null;
        const ativo = k === i;
        const planta = q.foto.tipo === "planta" || q.foto.tipo === "implantacao";
        const img = (
          <Img
            img={q.foto}
            priority={priority && k === 0}
            fit={planta ? "contain" : "cover"}
            sizes={sizes}
            className={`h-full w-full ${planta ? "bg-white" : ""}`}
            style={planta ? { backgroundColor: "#fff" } : undefined}
          />
        );
        return (
          <div
            key={q.foto.id}
            aria-hidden={!ativo}
            className="absolute inset-0 transition-opacity duration-[600ms] ease-mrv"
            style={{ opacity: ativo ? 1 : 0, zIndex: ativo ? 1 : 0 }}
          >
            <div
              className={ativo && !planta && !reduzir ? `kb kb-${k % 4}` : "h-full w-full"}
              style={{ animationPlayState: tocando ? "running" : "paused", animationDuration: `${SEGUNDOS + 1.5}s` }}
            >
              {k === 0 ? (
                <ViewTransition name={`capa-${slug}`} share="morph" default="none">{img}</ViewTransition>
              ) : img}
            </div>
          </div>
        );
      })}

      {/* véus para legibilidade do texto em cima da foto */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-28 bg-gradient-to-b from-[rgb(0_51_31/0.65)] to-transparent" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-3/5 bg-gradient-to-t from-[rgb(0_51_31/0.92)] via-[rgb(0_51_31/0.5)] to-transparent" />

      {/* zonas de toque: esquerda volta, direita avança, segurar pausa */}
      <button type="button" aria-label="Foto anterior" className="absolute inset-y-0 left-0 z-[3] w-[30%] cursor-w-resize outline-none"
        onPointerDown={onPointerDown} onPointerUp={() => soltar(-1)} onPointerLeave={() => segurando && setSegurando(false)}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); ir(i - 1); } }} />
      <button type="button" aria-label="Próxima foto" className="absolute inset-y-0 right-0 z-[3] w-[70%] cursor-e-resize outline-none"
        onPointerDown={onPointerDown} onPointerUp={() => soltar(1)} onPointerLeave={() => segurando && setSegurando(false)}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); ir(i + 1); } }} />

      {/* barras de progresso, como stories */}
      <div className="pointer-events-none absolute inset-x-3 top-3 z-[4] flex gap-1" aria-hidden>
        {quadros.map((q, k) => (
          <span key={q.foto.id} className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/30">
            {k < i && <span className="block h-full w-full bg-white" />}
            {k === i && (
              <span
                key={`${i}-${autoplay && !reduzir}`}
                className={autoplay && !reduzir ? "barra-filme block h-full w-full origin-left bg-white" : "block h-full w-full bg-white/70"}
                style={{ animationDuration: `${SEGUNDOS}s`, animationPlayState: tocando ? "running" : "paused" }}
                onAnimationEnd={() => ir(i + 1)}
              />
            )}
          </span>
        ))}
      </div>

      <div className="absolute right-2 top-6 z-[5] flex gap-1">
        {autoplay && !reduzir && (
          <button type="button" onClick={() => setPausado((p) => !p)} aria-label={pausado ? "Continuar fotos" : "Pausar fotos"}
            className="flex size-11 items-center justify-center rounded-full text-white hover:bg-white/15">
            {pausado ? <Play className="size-5" aria-hidden /> : <Pause className="size-5" aria-hidden />}
          </button>
        )}
        {galeria && galeria.length > 0 && (
          <Sheet modo="tela" titulo={`Fotos do ${nome}`} descricao="Imagens ilustrativas"
            trigger={<button type="button" aria-label="Ver todas as fotos" onClick={() => setPausado(true)} className="flex size-11 items-center justify-center rounded-full text-white hover:bg-white/15"><Expand className="size-5" aria-hidden /></button>}>
            <ul className="flex-1 space-y-2 overflow-y-auto px-2 pb-8 md:px-8">
              {galeria.map((f) => (
                <li key={f.id} className="mx-auto max-w-5xl">
                  <Img img={f} sizes="(min-width: 1024px) 1024px, 100vw" className="w-full" fit="contain" style={{ aspectRatio: `${f.w} / ${f.h}` }} />
                  <p className="px-2 py-2 text-sm text-white/70">{f.alt}</p>
                </li>
              ))}
            </ul>
          </Sheet>
        )}
      </div>

      {topo && <div className="pointer-events-none absolute left-4 top-7 z-[4] [&_a]:pointer-events-auto [&_button]:pointer-events-auto">{topo}</div>}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[4] p-4 md:p-6 [&_a]:pointer-events-auto [&_button]:pointer-events-auto">
        {motivo && (
          <p key={`${i}-${motivo}`} className="motivo-filme mb-3 inline-flex max-w-full items-start gap-2 rounded-lg bg-white/95 px-3 py-2 text-[15px] font-semibold leading-snug text-ink shadow-e2">
            <Check className="mt-0.5 size-4 shrink-0 text-green-700" strokeWidth={2.5} aria-hidden /> {motivo}
          </p>
        )}
        {children}
        {capitulos.length > 1 && (
          <div className="trilho -mx-4 mt-3 gap-1.5 px-4 md:-mx-6 md:px-6" role="tablist" aria-label="Ambientes">
            {capitulos.map((c) => {
              const ativo = c.id === capAtual;
              const primeiro = quadros.findIndex((q) => q.cap === c.id);
              return (
                <button key={c.id} type="button" role="tab" aria-selected={ativo} onClick={() => ir(primeiro)}
                  className={`h-9 shrink-0 rounded-full px-3.5 text-[14px] font-semibold transition-colors duration-[var(--t-base)] ${ativo ? "bg-white text-green-950" : "bg-white/15 text-white hover:bg-white/25"}`}>
                  {c.rotulo}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <p className="sr-only" aria-live={tocando ? "off" : "polite"}>
        Foto {i + 1} de {total}: {atual.foto.alt}
      </p>
    </div>
  );
}
