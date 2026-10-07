import type { CapituloId } from "@/lib/filme";
import { LAZER_FRASE, type Respostas } from "@/lib/quiz/types";
import { destinoAte, destinoDe } from "@/lib/quiz/destino";
import type { Destino } from "@/lib/types";
import { LIMIAR_MOTIVO } from "./config";
import { minutosTexto, type Criterio, type EmpScoring, type Recomendacao } from "./score";

/**
 * Onde cada motivo aparece no filme: sobre a foto que o comprova. A lista é a ordem de preferência;
 * se o empreendimento não tem aquele capítulo, vale o próximo.
 */
const CAPITULO_DO_CRITERIO: Record<string, CapituloId[]> = {
  deslocamento: ["aerea", "fachada"],
  mobilidade: ["aerea", "fachada"],
  vaga: ["fachada"],
  prazo: ["fachada"],
  casal: ["apartamento"],
  filhos: ["lazer", "piscina"],
  pet: ["lazer"],
};

function capitulosPreferidos(c: Criterio, r: Respostas): CapituloId[] {
  if (c.id === "lazer") return r.lazer?.includes("piscina") ? ["piscina", "lazer"] : ["lazer", "piscina"];
  if (c.id.startsWith("bairro:")) return ["aerea", "fachada"];
  return CAPITULO_DO_CRITERIO[c.id] ?? ["fachada"];
}

/** Um motivo por capítulo, os mais fortes primeiro; o que sobrar aparece só no resumo. */
export function motivosPorCapitulo(rec: Recomendacao, r: Respostas, disponiveis: CapituloId[]): Partial<Record<CapituloId, string>> {
  const fortes = rec.criterios
    .filter((c) => c.motivo && c.nota >= LIMIAR_MOTIVO && !c.atencao)
    .sort((a, b) => b.peso * b.nota - a.peso * a.nota);
  const saida: Partial<Record<CapituloId, string>> = {};
  for (const c of fortes) {
    const cap = capitulosPreferidos(c, r).find((id) => disponiveis.includes(id) && !saida[id]);
    if (cap) saida[cap] = c.motivo;
  }
  return saida;
}

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
