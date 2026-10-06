"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import type { EmpreendimentoResumo } from "@/lib/data";
import type { Bairro, Destino, Polo } from "@/lib/types";
import { codificar, decodificar, respondeuAlgo } from "@/lib/quiz/url";
import { minutosTexto, pontuar, tempoAte } from "@/lib/scoring/score";
import { LAZER_FRASE } from "@/lib/quiz/types";
import { destinoNome } from "@/lib/quiz/destino";
import { REGIAO_NOME, STATUS_ROTULO, areaTexto, quartosTexto, vagaTexto } from "@/lib/rotulos";
import { Img } from "@/components/ui/Img";
import { LinkButton } from "@/components/ui/Button";

type Props = { dados: { empreendimentos: EmpreendimentoResumo[]; bairros: Bairro[]; polos: Polo[]; destinos: Destino[] } };

type Linha = { rotulo: string; valores: string[] };

export function Comparar({ dados }: Props) {
  const params = useSearchParams();
  const r = useMemo(() => decodificar(params), [params]);
  const [tudo, setTudo] = useState(false);
  const ids = (params.get("ids") ?? "").split(",").filter(Boolean).slice(0, 3);
  const lista = ids.map((id) => dados.empreendimentos.find((e) => e.slug === id)).filter((e): e is EmpreendimentoResumo => !!e);
  const quiz = respondeuAlgo(r);
  const query = codificar(r);

  if (lista.length < 2) {
    return (
      <div className="contem py-16 text-center">
        <h1 className="t-h2 text-green-900">Escolha 2 ou 3 empreendimentos para comparar</h1>
        <p className="mt-3 text-muted">Marque “Comparar” nos cards do seu resultado.</p>
        <LinkButton href={quiz ? `/descobrir/resultado?${query}` : "/empreendimentos"} className="mt-8">
          {quiz ? "Voltar ao resultado" : "Ver empreendimentos"}
        </LinkButton>
      </div>
    );
  }

  const linhas: Linha[] = [
    ...(quiz ? [{ rotulo: "Compatibilidade", valores: lista.map((e) => { const p = pontuar(e, r, dados); return `${p.faixa} (${p.score})`; }) }] : []),
    ...(r.destino && r.destino !== "casa"
      ? [{ rotulo: `Até ${destinoNome(r.destino, dados.destinos)}`, valores: lista.map((e) => { const t = tempoAte(e, r.destino as Exclude<typeof r.destino, "casa" | undefined>, dados); return t ? `~${minutosTexto(t.minutos)}${t.estimado ? "*" : ""}` : "—"; }) }]
      : []),
    { rotulo: "Região", valores: lista.map((e) => `${REGIAO_NOME[e.regiao]} · ${e.bairroNome}`) },
    { rotulo: "Situação", valores: lista.map((e) => STATUS_ROTULO[e.status]) },
    { rotulo: "Planta", valores: lista.map((e) => quartosTexto(e.quartos) + (e.suite ? ", com suíte" : "")) },
    { rotulo: "Área", valores: lista.map((e) => areaTexto(e) ?? "Não informado") },
    { rotulo: "Garagem", valores: lista.map((e) => vagaTexto(e.vagasPorUnidade)) },
    { rotulo: "Varanda", valores: lista.map((e) => (e.varanda === "sim" ? "Sim" : e.varanda === "opcao" ? "Opcional" : "Não informado")) },
    { rotulo: "Lazer", valores: lista.map((e) => { const t = e.lazer.map((l) => LAZER_FRASE[l]).join(", "); return t.charAt(0).toUpperCase() + t.slice(1); }) },
    { rotulo: "Itens de lazer", valores: lista.map((e) => `${e.lazerItens.length} itens`) },
  ];
  const diferentes = linhas.filter((l) => new Set(l.valores).size > 1);
  const exibidas = tudo ? linhas : diferentes;
  const colunas = { gridTemplateColumns: `repeat(${lista.length}, minmax(0, 1fr))` };

  return (
    <div className="contem py-6 md:py-10">
      <Link href={quiz ? `/descobrir/resultado?${query}` : "/empreendimentos"} className="inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-green-900 hover:underline">
        <ArrowLeft className="size-4" aria-hidden /> {quiz ? "Voltar ao resultado" : "Empreendimentos"}
      </Link>
      <h1 className="t-h2 mt-2 text-green-900">Comparando {lista.length} empreendimentos</h1>

      <div className="sticky top-14 z-10 -mx-5 mt-6 border-b border-line bg-white/95 px-5 py-3 backdrop-blur-sm md:top-16 md:mx-0 md:px-0">
        <div className="grid gap-3" style={colunas}>
          {lista.map((e) => (
            <Link key={e.slug} href={`/empreendimentos/${e.slug}${query ? `?${query}` : ""}`} className="group block min-w-0">
              <Img img={e.imagens.capa} sizes="(min-width: 768px) 30vw, 33vw" className="aspect-[4/3] rounded-md" />
              <span className="mt-2 block text-sm font-semibold leading-tight text-ink group-hover:underline md:text-base">{e.nome}</span>
            </Link>
          ))}
        </div>
      </div>

      <dl className="mt-2">
        {exibidas.map((l) => (
          // as linhas iguais, quando aparecem, descem de onde estava o botão
          <div key={l.rotulo} className={`border-b border-line py-4 ${tudo && !diferentes.includes(l) ? "desdobra" : ""}`}>
            <dt className="mb-2 text-[13px] font-semibold uppercase tracking-[0.04em] text-muted">{l.rotulo}</dt>
            <div className="grid gap-3" style={colunas}>
              {l.valores.map((v, i) => (
                <dd key={i} className="min-w-0 text-[15px] leading-snug text-ink">{v}</dd>
              ))}
            </div>
          </div>
        ))}
      </dl>
      {exibidas.length === 0 && <p className="py-6 text-muted">Estes empreendimentos são iguais em tudo o que comparamos.</p>}

      {diferentes.length < linhas.length && (
        <button type="button" onClick={() => setTudo((t) => !t)} className="mt-4 h-11 rounded-md px-3 text-sm font-semibold text-green-900 hover:bg-selected">
          {tudo ? "Mostrar só as diferenças" : `Mostrar também o que é igual (${linhas.length - diferentes.length})`}
        </button>
      )}
      {linhas.some((l) => l.valores.some((v) => v.endsWith("*"))) && (
        <p className="mt-4 text-sm text-muted">* Estimativa pela distância, fora de Fortaleza.</p>
      )}
    </div>
  );
}
