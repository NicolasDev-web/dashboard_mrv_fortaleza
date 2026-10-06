"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, LazyMotion, domAnimation, m, useReducedMotion } from "motion/react";
import { ArrowLeft, Check, PawPrint, X } from "lucide-react";
import { PERGUNTAS, respondida, type Opcao, type Pergunta } from "@/lib/quiz/questions";
import { CHAVE_REVELAR, codificar, decodificar } from "@/lib/quiz/url";
import type { Respostas } from "@/lib/quiz/types";
import type { RegiaoSlug } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Shape } from "@/components/ui/Shape";
import { ICONES } from "./icones";
import { DestinoPicker } from "./DestinoPicker";
import { QuizMapa } from "./QuizMapa";
import type { PinMapa } from "@/components/mapa/CidadeMapa";
import type { Dados } from "@/lib/scoring/score";
import { estadoDoMapa } from "@/lib/quiz/mapa";

const TOTAL = PERGUNTAS.length;
/** Pausa para a pessoa ver o que marcou antes de avançar sozinho. */
const PAUSA_AVANCO = 260;
/** Nesta pergunta há um complemento (pet) depois da escolha: não avança sozinha. */
const SEM_AVANCO: Pergunta["id"][] = ["moradores"];

type Props = {
  regioes: { slug: RegiaoSlug; nome: string }[];
  /** os 121 bairros de Fortaleza, para a pergunta do destino */
  bairros: { id: number; nome: string }[];
  /** o mapa que reage às respostas: marcadores e os dados do scoring (roda no navegador) */
  mapa: { pins: PinMapa[]; dados: Dados };
};

export function QuizShell({ regioes, bairros, mapa }: Props) {
  const router = useRouter();
  const params = useSearchParams();
  const reduzir = useReducedMotion();

  // A URL é a fonte de verdade: recarregar a página ou usar o voltar do sistema não perde respostas.
  const r = useMemo(() => decodificar(params), [params]);
  const passo = Math.min(TOTAL, Math.max(1, Number(params.get("passo")) || 1));
  const pergunta = PERGUNTAS[passo - 1];
  // "Nenhum" numa múltipla escolha não aparece na URL; lembramos aqui para o botão dizer "Continuar".
  const [vazias, setVazias] = useState<Set<string>>(new Set());

  // Direção da transição (avançar desliza para a esquerda, voltar para a direita): ajustada no render.
  const [anterior, setAnterior] = useState(passo);
  const [dir, setDir] = useState(1);
  if (passo !== anterior) {
    setDir(passo > anterior ? 1 : -1);
    setAnterior(passo);
  }

  const titulo = useRef<HTMLHeadingElement>(null);
  const ponteiro = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const url = useCallback((resp: Respostas, p: number) => `/descobrir?${codificar(resp)}${codificar(resp) ? "&" : ""}passo=${p}`, []);
  // Editar uma resposta substitui o estado atual; mudar de pergunta cria uma entrada no histórico.
  const editar = useCallback((resp: Respostas) => window.history.replaceState(null, "", url(resp, passo)), [passo, url]);

  useEffect(() => { router.prefetch("/descobrir/resultado"); }, [router]);
  // Ao trocar de pergunta (não no carregamento), o foco vai para o título: o leitor de tela lê a nova pergunta.
  const montado = useRef(false);
  useEffect(() => {
    if (montado.current) titulo.current?.focus({ preventScroll: true });
    montado.current = true;
  }, [passo]);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  // A cerimônia (revelação do ranking no mapa) acontece no resultado, com os dados de verdade.
  const finalizar = useCallback((resp: Respostas) => {
    try { sessionStorage.setItem(CHAVE_REVELAR, codificar(resp)); } catch { /* sem storage: vai direto */ }
    router.push(`/descobrir/resultado?${codificar(resp)}`);
  }, [router]);

  const avancar = useCallback((resp: Respostas = r) => {
    if (timer.current) clearTimeout(timer.current);
    if (passo === TOTAL) return finalizar(resp);
    window.history.pushState(null, "", url(resp, passo + 1));
  }, [finalizar, passo, r, url]);

  const voltar = () => {
    if (passo > 1) window.history.pushState(null, "", url(r, passo - 1));
  };

  const escolherUnica = (valor: string, confirmar = false) => {
    const resp: Respostas = { ...r, [pergunta.id]: valor };
    if (pergunta.id === "onde" && valor !== "regioes") delete resp.regioes;
    editar(resp);
    const pode = (ponteiro.current || confirmar) && !SEM_AVANCO.includes(pergunta.id) && !(pergunta.id === "onde" && valor === "regioes");
    ponteiro.current = false;
    if (timer.current) clearTimeout(timer.current);
    if (pode) timer.current = setTimeout(() => avancar(resp), PAUSA_AVANCO);
  };

  const alternarMultipla = (valor: string) => {
    const atual = (r[pergunta.id as "lazer" | "bairro"] ?? []) as string[];
    const novo = atual.includes(valor) ? atual.filter((v) => v !== valor) : [...atual, valor].slice(0, pergunta.max);
    setVazias((s) => { const n = new Set(s); if (novo.length) n.delete(pergunta.id); else n.add(pergunta.id); return n; });
    editar({ ...r, [pergunta.id]: novo.length ? novo : undefined });
  };

  const alternarRegiao = (slug: RegiaoSlug) => {
    const atual = r.regioes ?? [];
    editar({ ...r, onde: "regioes", regioes: atual.includes(slug) ? atual.filter((s) => s !== slug) : [...atual, slug] });
  };

  // O mapa explica a resposta mais recente: a pergunta atual, se já respondida, ou a anterior.
  const ultima = respondida(pergunta, r) ? pergunta.id : passo > 1 ? PERGUNTAS[passo - 2].id : undefined;
  const estado = useMemo(() => estadoDoMapa(r, mapa.dados, ultima), [r, mapa.dados, ultima]);

  const multipla = pergunta.tipo === "multipla";
  const selecionados = multipla ? ((r[pergunta.id as "lazer" | "bairro"] ?? []) as string[]) : [];
  const ok = respondida(pergunta, r) || multipla;
  const rotuloContinuar = passo === TOTAL ? "Ver meu resultado" : multipla && !selecionados.length && !vazias.has(pergunta.id) ? "Pular" : "Continuar";

  const variantes = {
    entra: (d: number) => ({ opacity: 0, x: reduzir ? 0 : d * 24 }),
    centro: { opacity: 1, x: 0, transition: { duration: reduzir ? 0.12 : 0.32, ease: [0.16, 1, 0.3, 1] as const } },
    sai: (d: number) => ({ opacity: 0, x: reduzir ? 0 : d * -24, transition: { duration: reduzir ? 0.12 : 0.18, ease: [0.2, 0.8, 0.2, 1] as const } }),
  };

  return (
    <LazyMotion features={domAnimation} strict>
      <div className="flex min-h-dvh flex-col bg-white">
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm">
          <div className="mx-auto flex h-14 w-full max-w-[720px] items-center gap-2 px-3 md:h-16 lg:max-w-[1200px] lg:px-5">
            <button
              type="button"
              onClick={voltar}
              disabled={passo === 1}
              aria-label="Pergunta anterior"
              className="flex size-11 items-center justify-center rounded-full text-green-900 transition-colors hover:bg-selected disabled:invisible"
            >
              <ArrowLeft className="size-5" aria-hidden />
            </button>
            <div className="flex flex-1 gap-1" aria-hidden="true">
              {PERGUNTAS.map((p, i) => (
                <span key={p.id} className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
                  <span
                    className="block h-full origin-left rounded-full bg-green-900 transition-transform duration-[var(--t-slow)] ease-mrv"
                    style={{ transform: `scaleX(${i < passo - 1 || (i === passo - 1 && respondida(p, r)) ? 1 : i === passo - 1 ? 0.35 : 0})` }}
                  />
                </span>
              ))}
            </div>
            <span className="w-10 text-center text-sm font-semibold tabular-nums text-muted" aria-hidden="true">
              {passo}/{TOTAL}
            </span>
            <Link href="/" aria-label="Sair do quiz" className="flex size-11 items-center justify-center rounded-full text-muted transition-colors hover:bg-selected hover:text-green-900">
              <X className="size-5" aria-hidden />
            </Link>
          </div>
          <p className="sr-only" aria-live="polite">Pergunta {passo} de {TOTAL}</p>
        </header>

        <div className="mx-auto w-full max-w-[720px] flex-1 px-5 pb-32 pt-2 md:pt-6 lg:grid lg:max-w-[1200px] lg:grid-cols-[minmax(0,1fr)_440px] lg:items-start lg:gap-14 lg:pt-10">
          <aside className="mb-5 lg:order-2 lg:mb-0 lg:sticky lg:top-24" aria-label="Mapa das suas respostas">
            <QuizMapa pins={mapa.pins} estado={estado} />
          </aside>
          <div className="relative flex min-w-0 flex-col overflow-x-clip lg:order-1">
          <AnimatePresence mode="popLayout" initial={false} custom={dir}>
            <m.fieldset key={pergunta.id} custom={dir} variants={variantes} initial="entra" animate="centro" exit="sai" className="min-w-0">
              <legend className="contents">
                {passo === 1 && <Shape variante="quiz" className="mb-4 block w-14" />}
                <h1 ref={titulo} tabIndex={-1} className="t-pergunta text-green-900 outline-none focus-visible:outline-none">
                  {pergunta.titulo}
                </h1>
              </legend>
              {pergunta.ajuda && <p className="mt-2 text-muted">{pergunta.ajuda}</p>}
              {multipla && (
                <p className="mt-1 text-sm font-semibold text-green-700" aria-live="polite">
                  {selecionados.length} de {pergunta.max} escolhidas
                </p>
              )}

              <div className="mt-6" onPointerDown={() => (ponteiro.current = true)}>
                {pergunta.tipo === "destino" ? (
                  <DestinoPicker pergunta={pergunta} bairros={bairros} valor={r.destino} onEscolher={escolherUnica} />
                ) : (
                  <div className={`grid gap-3 ${multipla ? "grid-cols-2 md:grid-cols-3" : "grid-cols-1"}`}>
                    {pergunta.opcoes.map((o) => (
                      <OpcaoTile
                        key={o.valor}
                        opcao={o}
                        nome={pergunta.id}
                        tipo={multipla ? "checkbox" : "radio"}
                        compacta={multipla}
                        marcada={multipla ? selecionados.includes(o.valor) : r[pergunta.id] === o.valor}
                        desabilitada={multipla && !selecionados.includes(o.valor) && selecionados.length >= (pergunta.max ?? 99)}
                        onChange={() => (multipla ? alternarMultipla(o.valor) : escolherUnica(o.valor))}
                      />
                    ))}
                  </div>
                )}

                {pergunta.id === "onde" && r.onde === "regioes" && (
                  <m.div initial={{ opacity: 0, y: reduzir ? 0 : 8 }} animate={{ opacity: 1, y: 0 }} className="mt-5 rounded-lg bg-bg-subtle p-4">
                    <p className="mb-3 text-sm font-semibold text-ink">Quais regiões?</p>
                    <div className="flex flex-wrap gap-2">
                      {regioes.map((g) => {
                        const on = r.regioes?.includes(g.slug) ?? false;
                        return (
                          <label key={g.slug} className="inline-flex h-11 cursor-pointer select-none items-center gap-2 rounded-full border border-line-strong bg-white px-4 text-[15px] font-semibold text-ink transition-[background-color,border-color,color,transform] duration-[var(--t-fast)] ease-mrv active:scale-[0.97] has-[:checked]:border-green-900 has-[:checked]:bg-green-900 has-[:checked]:text-white has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-green-500">
                            <input type="checkbox" className="sr-only" checked={on} onChange={() => alternarRegiao(g.slug)} />
                            {on && <Check className="size-4" aria-hidden />}
                            {g.nome}
                          </label>
                        );
                      })}
                    </div>
                  </m.div>
                )}

                {pergunta.id === "moradores" && (
                  <label className="mt-5 flex min-h-14 cursor-pointer items-center gap-3 rounded-lg border border-line px-4 transition-colors has-[:checked]:border-green-900 has-[:checked]:bg-selected has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-green-500">
                    <input type="checkbox" className="size-5 accent-[var(--color-green-900)]" checked={!!r.pet} onChange={(e) => editar({ ...r, pet: e.target.checked || undefined })} />
                    <PawPrint className="size-5 text-green-900" aria-hidden />
                    <span className="font-semibold">Tenho pet</span>
                  </label>
                )}
              </div>
            </m.fieldset>
          </AnimatePresence>
          </div>
        </div>

        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-sm">
          <div className="mx-auto flex w-full max-w-[720px] gap-3 px-5 py-3 lg:grid lg:max-w-[1200px] lg:grid-cols-[minmax(0,1fr)_440px] lg:gap-14">
            <Button onClick={() => avancar()} disabled={!ok} className="w-full">
              {rotuloContinuar}
            </Button>
          </div>
        </div>
      </div>

    </LazyMotion>
  );
}

function OpcaoTile({ opcao, nome, tipo, marcada, desabilitada, compacta, onChange }: {
  opcao: Opcao; nome: string; tipo: "radio" | "checkbox"; marcada: boolean; desabilitada?: boolean; compacta?: boolean; onChange: () => void;
}) {
  const Icone = opcao.icone ? ICONES[opcao.icone] : null;
  return (
    <label
      className={`group relative flex cursor-pointer select-none rounded-lg border-[1.5px] border-line bg-white transition-[border-color,background-color,transform] duration-[var(--t-fast)] ease-mrv active:scale-[0.98]
        has-[:checked]:border-2 has-[:checked]:border-green-900 has-[:checked]:bg-selected
        has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-green-500
        has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-45 lg:hover:border-line-strong
        ${compacta ? "min-h-[104px] flex-col items-start justify-between gap-3 p-4" : "min-h-16 items-center gap-4 px-4 py-3"}`}
    >
      <input type={tipo} name={nome} value={opcao.valor} checked={marcada} disabled={desabilitada} onChange={onChange} className="sr-only" />
      {Icone && (
        <span className={`flex shrink-0 items-center justify-center rounded-md bg-bg-subtle text-green-900 transition-colors group-has-[:checked]:bg-green-900 group-has-[:checked]:text-white ${compacta ? "size-10" : "size-11"}`}>
          <Icone className="size-6" strokeWidth={1.75} aria-hidden />
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block text-[16px] font-semibold leading-snug text-ink">{opcao.rotulo}</span>
        {opcao.descricao && <span className="mt-0.5 block text-sm text-muted">{opcao.descricao}</span>}
      </span>
      <span
        aria-hidden
        className={`flex size-6 shrink-0 scale-60 items-center justify-center rounded-full bg-green-900 text-white opacity-0 transition-[opacity,transform] duration-[var(--t-base)] ease-saida group-has-[:checked]:scale-100 group-has-[:checked]:opacity-100 ${compacta ? "absolute right-3 top-3" : ""}`}
      >
        <Check className="size-4" strokeWidth={2.5} />
      </span>
    </label>
  );
}
