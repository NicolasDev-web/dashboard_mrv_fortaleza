import {
  BedDouble, BusFront, Car, Check, Clock, Dumbbell, Fence, PawPrint, PersonStanding, Ruler, Trees, Trophy, UtensilsCrossed, Waves, Blocks, Sparkles,
  type LucideIcon,
} from "lucide-react";
import type { Empreendimento, PoloId } from "@/lib/types";
import { areaTexto, quartosTexto, vagaTexto } from "@/lib/rotulos";
import { minutosTexto, tempoAte } from "@/lib/scoring/score";
import { dadosScoring, polos } from "@/lib/data";

/** 2 quartos · m² · vaga · suíte, em linha: sem tabela. */
export function PropertyFacts({ e }: { e: Empreendimento }) {
  const area = areaTexto(e);
  const fatos: [LucideIcon, string][] = [
    [BedDouble, quartosTexto(e.quartos) + (e.suite ? ", opção com suíte" : "")],
    ...(area ? [[Ruler, area] as [LucideIcon, string]] : []),
    [Car, vagaTexto(e.vagasPorUnidade)],
    ...(e.varanda ? [[Fence, e.varanda === "opcao" ? "Opção de varanda" : "Com varanda"] as [LucideIcon, string]] : []),
  ];
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-2">
      {fatos.map(([I, t]) => (
        <li key={t} className="flex items-center gap-2 text-[15px] text-ink">
          <I className="size-5 text-green-900" strokeWidth={1.75} aria-hidden /> {t}
        </li>
      ))}
    </ul>
  );
}

/**
 * Ícone de cada item de lazer. O haltere é só para academia de verdade (coberta / fitness): espaço funcional e
 * crossfit ao ar livre não são academia (data/curated/lazer.json) e ganham outro ícone.
 */
const ICONE_LAZER: [RegExp, LucideIcon][] = [
  [/piscina/i, Waves],
  [/academia|fitness/i, Dumbbell],
  [/funcional|crossfit/i, PersonStanding],
  [/playground|playbaby|kids/i, Blocks],
  [/churrasqueira|gourmet|pizza|festas|happy/i, UtensilsCrossed],
  [/quadra|jogos|futmesa/i, Trophy],
  [/caminhada|cooper|piquenique|pomar|zen/i, Trees],
  [/pet/i, PawPrint],
];

export function AmenityList({ itens }: { itens: string[] }) {
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-3 md:grid-cols-3">
      {itens.map((t) => {
        const I = ICONE_LAZER.find(([re]) => re.test(t))?.[1] ?? Sparkles;
        return (
          <li key={t} className="flex items-center gap-2.5 text-[15px] text-ink">
            <I className="size-5 shrink-0 text-green-900" strokeWidth={1.75} aria-hidden /> {t}
          </li>
        );
      })}
    </ul>
  );
}

/** Tempo até os polos mais procurados; com estimativa marcada quando não há tempo de ônibus calculado. */
const POLOS_PADRAO: PoloId[] = ["centro", "aldeota", "unifor", "ufc_benfica", "messejana", "parangaba"];

export function CommuteInfo({ e }: { e: Empreendimento }) {
  const dados = dadosScoring();
  const linhas = POLOS_PADRAO.map((id) => ({ polo: polos.find((p) => p.id === id)!, t: tempoAte(e, id, dados) }))
    .filter((l) => l.t)
    .sort((a, b) => a.t!.minutos - b.t!.minutos)
    .slice(0, 4);
  const estimado = linhas.some((l) => l.t!.estimado);
  return (
    <div>
      <ul className="divide-y divide-line rounded-lg border border-line">
        {linhas.map(({ polo, t }) => (
          <li key={polo.id} className="flex items-center justify-between gap-4 px-4 py-3">
            <span className="flex items-center gap-2.5 text-ink">
              <BusFront className="size-5 text-green-900" strokeWidth={1.75} aria-hidden /> {polo.nome}
            </span>
            <span className="flex items-center gap-1.5 whitespace-nowrap font-semibold tabular-nums text-ink">
              <Clock className="size-4 text-muted" aria-hidden /> ~{minutosTexto(t!.minutos)}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-sm text-muted">
        {estimado
          ? "Estimativa pela distância: este empreendimento fica fora de Fortaleza, onde não calculamos as linhas de ônibus."
          : "De ônibus ou metrô, em dia útil com saída entre 6h30 e 8h, pelos horários oficiais (sem trânsito)."}
      </p>
    </div>
  );
}

export function ListaSimples({ itens }: { itens: string[] }) {
  return (
    <ul className="grid gap-x-6 gap-y-2 md:grid-cols-2">
      {itens.map((t) => (
        <li key={t} className="flex gap-2 text-[15px] text-ink">
          <Check className="mt-1 size-4 shrink-0 text-green-700" strokeWidth={2.5} aria-hidden /> {t}
        </li>
      ))}
    </ul>
  );
}
