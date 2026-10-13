import { LAZER_FRASE, type Respostas } from "@/lib/quiz/types";
import { destinoAte, destinoDe } from "@/lib/quiz/destino";
import type { Destino } from "@/lib/types";
import { minutosTexto, type EmpScoring, type Recomendacao } from "./score";

/** Uma linha que explica por que este ficou atrás do 1º (ou o que tem de melhor que ele). */
export function diferencaPara1(rec: Recomendacao, primeiro: Recomendacao, e: EmpScoring, e1: EmpScoring, r: Respostas, destinos: Destino[]): string {
  const partes: string[] = [];
  if (rec.orcamento === "fora" && primeiro.orcamento !== "fora") partes.push("acima do seu orçamento");
  else if (rec.orcamento === "limite" && primeiro.orcamento === "cabe") partes.push("no limite do seu orçamento");
  if (rec.tempo && primeiro.tempo && r.destino && r.destino !== "casa") {
    const d = Math.round((rec.tempo.minutos - primeiro.tempo.minutos) / 5) * 5;
    const ate = destinoAte(r.destino, destinos);
    if (d >= 5) partes.push(`+${d} min até ${ate}`);
    else if (d <= -5) partes.push(`${minutosTexto(-d)} mais perto ${destinoDe(r.destino, destinos)}`);
    else partes.push(`mesmo tempo até ${ate}`);
  }
  const faltando = (r.lazer ?? []).filter((l) => e1.lazer.includes(l) && !e.lazer.includes(l));
  if (faltando.length) partes.push(`sem ${LAZER_FRASE[faltando[0]]}`);
  if (r.transporte === "carro" && e.vagasPorUnidade < e1.vagasPorUnidade - 0.15) partes.push("menos vagas de garagem");
  if (r.prazo === "logo" && e.status === "lancamento" && e1.status !== "lancamento") partes.push("entrega mais tarde");
  if (r.moradores === "casal" && e1.suite && !e.suite) partes.push("sem opção de suíte");
  return partes.length ? partes.slice(0, 2).join(" · ") : "Quase empatado com o 1º";
}
