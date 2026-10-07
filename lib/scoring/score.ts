import type { Bairro, Destino, DestinoId, Empreendimento, NotaBairro, Polo, RegiaoSlug } from "@/lib/types";
import { LAZER_FRASE, NOTA_FRASE, type Respostas } from "@/lib/quiz/types";
import { destinoAte, destinoNome, ehBairro, idBairro } from "@/lib/quiz/destino";
import {
  DIVERSIDADE_FOLGA, ENTRADA, ESTIMATIVA_TEMPO, FAIXAS, FINANCIAMENTO, LIMIAR_ATENCAO, LIMIAR_MOTIVO, ORCAMENTO, PESOS, PRAZO,
  RENDA, SUITE, TEMPO, TOP, VAGA,
} from "./config";

export interface Criterio {
  id: string;
  peso: number;
  nota: number;
  /** texto exibido quando a nota passa do limiar de motivo */
  motivo?: string;
  /** texto exibido quando o critério pesa contra */
  atencao?: string;
}

export interface Recomendacao {
  slug: string;
  score: number;
  faixa: string;
  criterios: Criterio[];
  motivos: string[];
  atencoes: string[];
  /** minutos até o destino escolhido; `estimado` quando vem da distância, não do GTFS */
  tempo?: Tempo;
  /** só quando a pessoa informou a renda e o empreendimento tem preço */
  orcamento?: Orcamento;
}

export type Orcamento = "cabe" | "limite" | "fora";

/** Só os campos que o scoring lê: funciona com o Empreendimento completo e com o resumo do cliente. */
export type EmpScoring = Pick<
  Empreendimento,
  "slug" | "cidade" | "regiao" | "bairroId" | "bairroNome" | "coord" | "vagasPorUnidade" | "lazer" | "lazerItens" | "suite" | "status"
  | "preco" | "faixasMcmv"
>;

export interface Dados {
  empreendimentos: EmpScoring[];
  bairros: Bairro[];
  polos: Polo[];
  /** os 121 bairros como destino possível */
  destinos: Destino[];
}

export interface Tempo {
  minutos: number;
  /** calculado pela distância em linha reta, não pela tabela de ônibus */
  estimado: boolean;
  /** o empreendimento fica no próprio bairro de destino */
  mesmoBairro?: boolean;
}

/** Mesmo bairro: a tabela dá 0 min; na prática ainda há um trajeto curto. */
const MINUTOS_MESMO_BAIRRO = 10;

export interface Resultado {
  ranking: Recomendacao[];
  top: Recomendacao[];
  regiao: RegiaoSlug | null;
}

const limitar = (v: number) => Math.max(0, Math.min(100, v));

function distanciaKm(a: { lat: number; lon: number }, b: { lat: number; lon: number }) {
  const r = Math.PI / 180;
  const h = Math.sin(((b.lat - a.lat) * r) / 2) ** 2 + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(((b.lon - a.lon) * r) / 2) ** 2;
  return 12742 * Math.asin(Math.sqrt(h));
}

export function tempoAte(e: EmpScoring, destino: DestinoId, dados: Dados): Tempo | undefined {
  const bairro = e.bairroId != null ? dados.bairros.find((b) => b.id === e.bairroId) : undefined;
  let alvo: { lat: number; lon: number } | undefined;
  if (ehBairro(destino)) {
    const id = idBairro(destino);
    if (e.bairroId === id) return { minutos: MINUTOS_MESMO_BAIRRO, estimado: false, mesmoBairro: true };
    const t = bairro?.tempoAteBairro[String(id)];
    if (t != null) return { minutos: t, estimado: false };
    alvo = dados.destinos.find((d) => d.id === id);
  } else {
    const t = bairro?.tempoAtePolo[destino];
    if (t != null) return { minutos: t, estimado: false };
    alvo = dados.polos.find((p) => p.id === destino);
  }
  if (!alvo) return undefined;
  return { minutos: Math.round(ESTIMATIVA_TEMPO.base + ESTIMATIVA_TEMPO.porKm * distanciaKm(e.coord, alvo)), estimado: true };
}

/** "Cerca de 25 min": arredonda para 5 minutos, porque o tempo é de tabela e não considera trânsito. */
export const minutosTexto = (m: number) => `${Math.max(5, Math.round(m / 5) * 5)} min`;

/** Nota percentil 90 → "entre os 10%". Nunca menos que 5%. */
const topPercent = (nota: number) => Math.max(5, Math.ceil((100 - nota) / 5) * 5);

export function faixa(score: number): string {
  return FAIXAS.find((f) => score >= f.min)!.rotulo;
}

function filtrar(e: EmpScoring, r: Respostas): boolean {
  if (r.onde === "fortaleza") return e.cidade === "Fortaleza";
  if (r.onde === "regioes" && r.regioes?.length) return r.regioes.includes(e.regiao);
  return true;
}

/**
 * Quanto a pessoa consegue pagar neste empreendimento: financiamento + subsídio + entrada.
 * Usa as condições do MCMV da faixa dela quando o imóvel está no programa e não é de uma faixa abaixo da dela
 * (imóvel só de faixa 3 está acima do teto das faixas 1 e 2); o subsídio só vale quando o imóvel atende a faixa dela.
 * Sem renda informada, não há conta.
 */
export function poderDeCompra(e: Pick<EmpScoring, "faixasMcmv">, r: Respostas): { valor: number; mcmv: boolean } | undefined {
  if (!r.renda || r.renda === "nao_informar") return undefined;
  const { mensal, faixa } = RENDA[r.renda];
  const mcmv = faixa != null && e.faixasMcmv.length > 0 && faixa >= Math.min(...e.faixasMcmv);
  const cond = mcmv ? FINANCIAMENTO.faixas[faixa] : undefined;
  const i = (1 + (cond?.juros ?? FINANCIAMENTO.jurosForaMcmv)) ** (1 / 12) - 1;
  const financiado = (mensal * FINANCIAMENTO.comprometimento * (1 - (1 + i) ** -FINANCIAMENTO.meses)) / i;
  const subsidio = cond && e.faixasMcmv.includes(faixa!) ? cond.subsidio : 0;
  return { valor: financiado + subsidio + ENTRADA[r.entrada ?? "e0"], mcmv };
}

export function criterios(e: EmpScoring, r: Respostas, dados: Dados): { lista: Criterio[]; penalidade: number; tempo?: Recomendacao["tempo"]; orcamento?: Orcamento } {
  const lista: Criterio[] = [];
  const bairro = e.bairroId != null ? dados.bairros.find((b) => b.id === e.bairroId) : undefined;
  let penalidade = 1;
  let tempo: Recomendacao["tempo"];
  let orcamento: Orcamento | undefined;

  // O valor nunca aparece: só "cabe", "no limite" ou "acima" do orçamento.
  const poder = poderDeCompra(e, r);
  if (poder && e.preco) {
    const razao = poder.valor / e.preco;
    orcamento = razao >= 1 ? "cabe" : razao >= ORCAMENTO.limite ? "limite" : "fora";
    if (orcamento === "limite") penalidade *= ORCAMENTO.penalidadeLimite;
    if (orcamento === "fora") penalidade *= ORCAMENTO.penalidadeFora;
    lista.push({
      id: "orcamento",
      peso: PESOS.orcamento,
      nota: limitar(((razao - ORCAMENTO.piso) / (1 - ORCAMENTO.piso)) * 100),
      motivo: orcamento === "cabe" ? (poder.mcmv ? "Cabe no seu orçamento, com as condições do Minha Casa Minha Vida" : "Cabe no orçamento que você informou") : undefined,
      atencao:
        orcamento === "limite" ? "No limite do seu orçamento: pode pedir um pouco mais de entrada ou o uso do FGTS"
        : orcamento === "fora" ? "Acima do orçamento que você informou: vale simular com um corretor"
        : undefined,
    });
  }

  if (r.destino && r.destino !== "casa") {
    tempo = tempoAte(e, r.destino, dados);
    if (tempo) {
      const nota = limitar(((TEMPO.limite - tempo.minutos) / (TEMPO.limite - TEMPO.ideal)) * 100);
      const ate = destinoAte(r.destino, dados.destinos);
      const meio = r.transporte === "carro" ? "" : " de ônibus";
      const est = tempo.estimado ? " (estimativa)" : "";
      const texto = tempo.mesmoBairro
        ? `Fica no próprio bairro ${destinoNome(r.destino, dados.destinos)}, onde você vai todo dia`
        : `Cerca de ${minutosTexto(tempo.minutos)}${meio} até ${ate}${est}`;
      lista.push({
        id: "deslocamento",
        peso: PESOS.deslocamento,
        nota,
        motivo: texto,
        atencao: nota < LIMIAR_ATENCAO ? texto : undefined,
      });
    }
  }

  if (r.transporte === "carro") {
    const nota = limitar(e.vagasPorUnidade * 100);
    const pct = Math.round(Math.min(1, e.vagasPorUnidade) * 100);
    if (e.vagasPorUnidade < VAGA.minimo) penalidade *= VAGA.penalidade;
    lista.push({
      id: "vaga",
      peso: PESOS.vaga,
      nota,
      motivo: e.vagasPorUnidade >= 1 ? "Uma vaga de garagem por apartamento" : `Vagas para ${pct}% dos apartamentos`,
      atencao: e.vagasPorUnidade < VAGA.minimo ? `Vagas limitadas: dá para ${pct}% dos apartamentos` : undefined,
    });
  }

  if (r.transporte === "onibus" && (!r.destino || r.destino === "casa") && bairro?.notas.mobilidade != null) {
    const n = bairro.notas.mobilidade;
    lista.push({ id: "mobilidade", peso: PESOS.mobilidade, nota: n, motivo: `Bairro entre os ${topPercent(n)}% de Fortaleza com mais ${NOTA_FRASE.mobilidade}` });
  }

  if (r.lazer?.length) {
    const tem = r.lazer.filter((l) => e.lazer.includes(l));
    const nota = (tem.length / r.lazer.length) * 100;
    const nomes = tem.map((l) => LAZER_FRASE[l]);
    const lista3 = nomes.length > 1 ? `${nomes.slice(0, -1).join(", ")} e ${nomes.at(-1)}` : nomes[0];
    lista.push({
      id: "lazer",
      peso: PESOS.lazer,
      nota,
      motivo: !tem.length
        ? undefined
        : tem.length === r.lazer.length
          ? (tem.length === 1 ? `Tem ${lista3}, que você pediu` : `Tem tudo o que você pediu no lazer: ${lista3}`)
          : `Tem ${lista3}`,
    });
  }

  for (const tema of r.bairro ?? []) {
    const n = bairro?.notas[tema];
    if (n == null) continue;
    lista.push({ id: `bairro:${tema}`, peso: PESOS.bairro, nota: n, motivo: `Bairro entre os ${topPercent(n)}% de Fortaleza com ${NOTA_FRASE[tema as NotaBairro]}` });
  }

  if (r.moradores === "filhos") {
    const kids = e.lazer.includes("kids") ? 100 : 0;
    // Se a pessoa já escolheu "escolas" na pergunta 6, não conta de novo aqui.
    const escolas = r.bairro?.includes("escolas") ? undefined : bairro?.notas.escolas;
    const nota = escolas != null ? (kids + escolas) / 2 : kids;
    lista.push({
      id: "filhos",
      peso: PESOS.filhos,
      nota,
      motivo: escolas != null && escolas >= LIMIAR_MOTIVO ? "Playground no condomínio e escolas no bairro" : e.lazer.includes("kids") ? "Playground para as crianças" : undefined,
    });
  }

  if (r.moradores === "casal") {
    lista.push({ id: "casal", peso: PESOS.casal, nota: e.suite ? SUITE.com : SUITE.sem, motivo: e.suite ? "Tem opção de apartamento com suíte" : undefined });
  }

  if (r.prazo === "logo" || r.prazo === "medio") {
    const nota = PRAZO[r.prazo][e.status];
    lista.push({
      id: "prazo",
      peso: r.prazo === "logo" ? PESOS.prazoLogo : PESOS.prazoMedio,
      nota,
      motivo: e.status === "em_construcao" ? "Já em construção: a mudança tende a ser mais cedo" : e.status === "pronto" ? "Pronto para morar" : undefined,
    });
  }

  if (r.pet) lista.push({ id: "pet", peso: 0, nota: 100, motivo: "Pet place para o seu bicho" });

  return { lista, penalidade, tempo, orcamento };
}

export function pontuar(e: EmpScoring, r: Respostas, dados: Dados): Recomendacao {
  const { lista, penalidade, tempo, orcamento } = criterios(e, r, dados);
  const comPeso = lista.filter((c) => c.peso > 0);
  const somaPesos = comPeso.reduce((s, c) => s + c.peso, 0);
  // Sem nenhum critério ativo (ex.: só respondeu "trabalho de casa" e "tanto faz"), todos empatam em 70.
  const base = somaPesos ? comPeso.reduce((s, c) => s + c.peso * c.nota, 0) / somaPesos : 70;
  const score = Math.round(base * penalidade);
  const motivos = [...lista]
    .filter((c) => c.motivo && c.nota >= LIMIAR_MOTIVO && !c.atencao)
    .sort((a, b) => b.peso * b.nota - a.peso * a.nota)
    .map((c) => c.motivo!);
  const atencoes = lista.filter((c) => c.atencao).map((c) => c.atencao!);
  return { slug: e.slug, score, faixa: faixa(score), criterios: lista, motivos, atencoes, tempo, orcamento };
}

export function recomendar(r: Respostas, dados: Dados): Resultado {
  const porSlug = new Map(dados.empreendimentos.map((e) => [e.slug, e]));
  const ranking = dados.empreendimentos
    .filter((e) => filtrar(e, r))
    .map((e) => pontuar(e, r, dados))
    .sort((a, b) => {
      // Fora do orçamento vai para o fim, por melhor que combine com a rotina.
      const fa = a.orcamento === "fora" ? 1 : 0, fb = b.orcamento === "fora" ? 1 : 0;
      if (fa !== fb) return fa - fb;
      if (b.score !== a.score) return b.score - a.score;
      const ta = a.tempo?.minutos ?? Infinity, tb = b.tempo?.minutos ?? Infinity;
      if (ta !== tb) return ta - tb;
      return porSlug.get(b.slug)!.lazerItens.length - porSlug.get(a.slug)!.lazerItens.length;
    });

  // Diversidade: evita dois do mesmo bairro no top só por estarem no mesmo lugar.
  const top: Recomendacao[] = [];
  const restantes = [...ranking];
  while (top.length < TOP && restantes.length) {
    const i = restantes.findIndex((c) => {
      const bairro = porSlug.get(c.slug)!.bairroNome;
      if (!top.some((t) => porSlug.get(t.slug)!.bairroNome === bairro)) return true;
      const proximo = restantes.find((o) => o !== c && !top.some((t) => porSlug.get(t.slug)!.bairroNome === porSlug.get(o.slug)!.bairroNome));
      // A diversidade nunca troca um que cabe no orçamento por um que está fora.
      if (!proximo || (proximo.orcamento === "fora" && c.orcamento !== "fora")) return true;
      return c.score - proximo.score >= DIVERSIDADE_FOLGA;
    });
    top.push(...restantes.splice(i === -1 ? 0 : i, 1));
  }

  // Região sugerida: maior média dos 2 melhores de cada região.
  const porRegiao = new Map<RegiaoSlug, number[]>();
  for (const rec of ranking) {
    const reg = porSlug.get(rec.slug)!.regiao;
    const l = porRegiao.get(reg) ?? [];
    if (l.length < 2) l.push(rec.score);
    porRegiao.set(reg, l);
  }
  let regiao: RegiaoSlug | null = null, melhor = -1;
  for (const [reg, notas] of porRegiao) {
    const media = notas.reduce((s, n) => s + n, 0) / notas.length;
    if (media > melhor) { melhor = media; regiao = reg; }
  }

  return { ranking, top, regiao };
}
