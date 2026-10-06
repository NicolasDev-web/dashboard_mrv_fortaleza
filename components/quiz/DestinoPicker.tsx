"use client";

import { useId, useMemo, useRef, useState } from "react";
import { Building2, Check, MapPin, Search, X } from "lucide-react";
import type { Opcao, Pergunta } from "@/lib/quiz/questions";
import { ICONES } from "./icones";

type Props = {
  pergunta: Pergunta;
  /** os 121 bairros de Fortaleza */
  bairros: { id: number; nome: string }[];
  valor?: string;
  /** `confirmar` = escolha deliberada (Enter na busca): pode avançar mesmo sem toque */
  onEscolher: (valor: string, confirmar?: boolean) => void;
};

type Item = { valor: string; nome: string; tipo: "lugar" | "bairro" };

const normalizar = (s: string) => s.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().trim();

/**
 * "Para onde você vai quase todo dia?": a pessoa pensa no lugar ("trabalho no Meireles"), não numa lista.
 * Busca primeiro (qualquer um dos 121 bairros ou dos 12 lugares conhecidos, sem exigir acento),
 * atalhos de um toque para os mais procurados, e "de casa" sempre à mão.
 */
export function DestinoPicker({ pergunta, bairros, valor, onEscolher }: Props) {
  const [busca, setBusca] = useState("");
  const campo = useRef<HTMLInputElement>(null);
  const listaId = useId();
  const lugares = pergunta.opcoes.filter((o) => o.valor !== "casa");
  const casa = pergunta.opcoes.find((o) => o.valor === "casa")!;

  const itens = useMemo<Item[]>(() => {
    const nomesLugares = new Set(lugares.map((l) => normalizar(l.rotulo)));
    return [
      ...lugares.map((l) => ({ valor: l.valor, nome: l.rotulo, tipo: "lugar" as const })),
      // "Centro", "Aldeota"... existem como lugar e como bairro: fica só o lugar, que é mais preciso.
      ...bairros.filter((b) => !nomesLugares.has(normalizar(b.nome))).map((b) => ({ valor: `b${b.id}`, nome: b.nome, tipo: "bairro" as const })),
    ];
  }, [lugares, bairros]);

  const resultados = useMemo(() => {
    const q = normalizar(busca);
    if (!q) return [];
    const nota = (nome: string) => {
      const n = normalizar(nome);
      if (n.startsWith(q)) return 0;
      if (n.split(/[\s-]+/).some((p) => p.startsWith(q))) return 1;
      return n.includes(q) ? 2 : 9;
    };
    return itens
      .map((i) => ({ i, n: nota(i.nome) }))
      .filter((x) => x.n < 9)
      .sort((a, b) => a.n - b.n || a.i.nome.localeCompare(b.i.nome, "pt-BR"))
      .slice(0, 7)
      .map((x) => x.i);
  }, [busca, itens]);

  const escolhido = valor ? itens.find((i) => i.valor === valor) : undefined;
  const escolhidoForaDosAtalhos = escolhido?.tipo === "bairro";

  return (
    <div>
      <label className="relative block">
        <span className="sr-only">Buscar bairro ou lugar</span>
        <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted" aria-hidden />
        <input
          ref={campo}
          type="search"
          inputMode="search"
          enterKeyHint="search"
          autoComplete="off"
          spellCheck={false}
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          onFocus={(e) => e.currentTarget.scrollIntoView({ block: "center", behavior: "smooth" })}
          onKeyDown={(e) => {
            if (e.key === "Enter" && resultados[0]) {
              e.preventDefault();
              onEscolher(resultados[0].valor, true);
            }
          }}
          placeholder="Digite o bairro: Meireles, Benfica…"
          aria-controls={busca ? listaId : undefined}
          className="h-14 w-full rounded-lg border-[1.5px] border-line-strong bg-white pl-12 pr-12 text-[16px] text-ink outline-none transition-colors placeholder:text-muted focus:border-green-900 [&::-webkit-search-cancel-button]:hidden"
        />
        {busca && (
          <button type="button" onClick={() => { setBusca(""); campo.current?.focus(); }} aria-label="Limpar busca" className="absolute right-2 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full text-muted hover:bg-selected">
            <X className="size-5" aria-hidden />
          </button>
        )}
      </label>

      {busca ? (
        <div id={listaId} className="mt-3" aria-live="polite">
          {resultados.length === 0 ? (
            <p className="rounded-lg bg-bg-subtle px-4 py-4 text-muted">Não achamos “{busca}”. Confira a grafia ou escolha um dos lugares abaixo.</p>
          ) : (
            <ul className="divide-y divide-line overflow-hidden rounded-lg border border-line">
              {resultados.map((i) => (
                <li key={i.valor}>
                  <label className="flex min-h-14 cursor-pointer items-center gap-3 px-4 py-2 transition-colors hover:bg-selected has-[:checked]:bg-selected has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:-outline-offset-2 has-[:focus-visible]:outline-green-500">
                    <input type="radio" name="destino" value={i.valor} checked={valor === i.valor} onChange={() => onEscolher(i.valor)} className="sr-only" />
                    {i.tipo === "lugar" ? <Building2 className="size-5 shrink-0 text-green-900" strokeWidth={1.75} aria-hidden /> : <MapPin className="size-5 shrink-0 text-green-900" strokeWidth={1.75} aria-hidden />}
                    <span className="flex-1">
                      <span className="block font-semibold text-ink"><Destaque texto={i.nome} busca={busca} /></span>
                      <span className="block text-sm text-muted">{i.tipo === "lugar" ? "Lugar conhecido" : "Bairro de Fortaleza"}</span>
                    </span>
                    {valor === i.valor && <Check className="size-5 text-green-900" strokeWidth={2.5} aria-hidden />}
                  </label>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <>
          {escolhidoForaDosAtalhos && (
            <div className="mt-4 flex items-center gap-3 rounded-lg border-2 border-green-900 bg-selected px-4 py-3">
              <MapPin className="size-5 text-green-900" aria-hidden />
              <span className="flex-1 font-semibold text-ink">{escolhido.nome}</span>
              <Check className="size-5 text-green-900" strokeWidth={2.5} aria-hidden />
            </div>
          )}
          <p className="mb-3 mt-6 text-sm font-semibold text-muted">Mais procurados</p>
          <div className="grid grid-cols-2 gap-2.5 md:grid-cols-3">
            {lugares.map((o) => (
              <Atalho key={o.valor} opcao={o} marcada={valor === o.valor} onEscolher={onEscolher} />
            ))}
          </div>
        </>
      )}

      <div className="mt-5">
        <label className="group flex min-h-16 cursor-pointer select-none items-center gap-4 rounded-lg border-[1.5px] border-line bg-white px-4 py-3 transition-[border-color,background-color] has-[:checked]:border-2 has-[:checked]:border-green-900 has-[:checked]:bg-selected has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-green-500">
          <input type="radio" name="destino" value="casa" checked={valor === "casa"} onChange={() => onEscolher("casa")} className="sr-only" />
          {(() => { const I = ICONES[casa.icone ?? "casa"]; return <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-bg-subtle text-green-900 group-has-[:checked]:bg-green-900 group-has-[:checked]:text-white"><I className="size-6" strokeWidth={1.75} aria-hidden /></span>; })()}
          <span className="flex-1 text-[16px] font-semibold text-ink">{casa.rotulo}</span>
        </label>
      </div>
    </div>
  );
}

function Atalho({ opcao, marcada, onEscolher }: { opcao: Opcao; marcada: boolean; onEscolher: (v: string) => void }) {
  return (
    <label className="flex min-h-14 cursor-pointer select-none items-center justify-center rounded-lg border-[1.5px] border-line px-3 text-center text-[15px] font-semibold text-ink transition-[border-color,background-color,color,transform] duration-[var(--t-fast)] active:scale-[0.98] has-[:checked]:border-green-900 has-[:checked]:bg-green-900 has-[:checked]:text-white has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-green-500 lg:hover:border-line-strong">
      <input type="radio" name="destino" value={opcao.valor} checked={marcada} onChange={() => onEscolher(opcao.valor)} className="sr-only" />
      {opcao.rotulo}
    </label>
  );
}

/** Deixa em negrito o trecho que casou com a busca, ignorando acentos. */
function Destaque({ texto, busca }: { texto: string; busca: string }) {
  const q = normalizar(busca);
  const i = normalizar(texto).indexOf(q);
  if (!q || i < 0) return <>{texto}</>;
  return (
    <>
      {texto.slice(0, i)}
      <mark className="bg-transparent font-extrabold text-green-900">{texto.slice(i, i + q.length)}</mark>
      {texto.slice(i + q.length)}
    </>
  );
}
