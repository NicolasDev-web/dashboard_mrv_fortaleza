/**
 * Gera docs/criterios/FICHA_EMPREENDIMENTOS.md: uma ficha por empreendimento com o que o quiz usa para
 * pontuar cada um (lazer, vagas, suíte, prazo, bairro, tempo de ônibus, faixas do MCMV) e onde ele
 * ganha ou perde pontos, pelas regras reais de lib/scoring/.
 *
 *   data/empreendimentos.json   o que o quiz usa hoje (gerado por scripts/build-data.ts)
 * + data/bairros.json           notas do bairro e tempo de ônibus
 * + data/polos.json, data/destinos.json
 * + data/curated/lazer.json     (opcional) lazer conferido à mão; se faltar, a ficha sai sem essa coluna
 *
 *   npm run data:ficha
 *
 * O preço nunca aparece: a ficha só diz "cabe", "no limite" ou "acima", como o quiz.
 */
import { readFile, writeFile, mkdir, access } from "node:fs/promises";
import path from "node:path";
import type { Bairro, Destino, Empreendimento, Lazer, NotaBairro, Polo } from "../lib/types";
import type { Entrada, Renda, Respostas } from "../lib/quiz/types";
import { PERGUNTAS } from "../lib/quiz/questions";
import { criterios, minutosTexto, tempoAte, type Dados } from "../lib/scoring/score";
import { DIVERSIDADE_FOLGA, ENTRADA, LIMIAR_ATENCAO, LIMIAR_MOTIVO, PESOS, PRAZO, RENDA, SUITE, TEMPO, VAGA } from "../lib/scoring/config";
import { REGIAO_NOME, STATUS_ROTULO, areaTexto } from "../lib/rotulos";

const RAIZ = path.resolve(import.meta.dirname, "..");
const SAIDA = "docs/criterios/FICHA_EMPREENDIMENTOS.md";
const LAZER_CURADO = "data/curated/lazer.json";
const lerJson = async <T,>(rel: string): Promise<T> => JSON.parse(await readFile(path.join(RAIZ, rel), "utf-8"));
const existe = (rel: string) => access(path.join(RAIZ, rel)).then(() => true, () => false);

/** Ordem e rótulos dos grupos de lazer: os 6 da pergunta 5 do quiz + pet place. */
const GRUPOS: { id: Lazer; rotulo: string }[] = [
  ...PERGUNTAS.find((p) => p.id === "lazer")!.opcoes.map((o) => ({ id: o.valor as Lazer, rotulo: o.rotulo })),
  { id: "pet", rotulo: "Pet place" },
];

const TEMAS: { id: NotaBairro; rotulo: string }[] = PERGUNTAS.find((p) => p.id === "bairro")!.opcoes.map((o) => ({
  id: o.valor as NotaBairro,
  rotulo: o.rotulo,
}));

const RENDAS: { id: Exclude<Renda, "nao_informar">; rotulo: string }[] = PERGUNTAS.find((p) => p.id === "renda")!
  .opcoes.filter((o) => o.valor !== "nao_informar")
  .map((o) => ({ id: o.valor as Exclude<Renda, "nao_informar">, rotulo: o.rotulo }));
const ENTRADAS: { id: Entrada; rotulo: string }[] = PERGUNTAS.find((p) => p.id === "entrada")!.opcoes.map((o) => ({
  id: o.valor as Entrada,
  rotulo: o.rotulo,
}));

/**
 * Formato de data/curated/lazer.json (cada campo pode faltar):
 *   { _leia, empreendimentos: { slug: { grupos: { grupo: { tem, fonte, trecho?, conferidoEm, pendente?, obs? } },
 *                                       itensExtras?: [{ item, grupo?, fonte, conferidoEm?, pendente? }] } } }
 * Também aceita o grupo direto no slug ({ slug: { grupo: {...} } }). Chaves com "_" são comentários.
 * Grupo ausente = vale o automático (lista de lazer da página oficial).
 */
interface Conferido {
  tem?: boolean;
  fonte?: string;
  trecho?: string;
  conferidoEm?: string;
  pendente?: boolean | string;
  obs?: string;
}
interface ItemExtra {
  item?: string;
  grupo?: string;
  fonte?: string;
  conferidoEm?: string;
  pendente?: boolean | string;
}
interface CuradoEmp {
  grupos: Partial<Record<Lazer, Conferido>>;
  extras: ItemExtra[];
}
type LazerCurado = Record<string, CuradoEmp>;

const ehObjeto = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);

function normalizarLazer(bruto: unknown): LazerCurado {
  if (!ehObjeto(bruto)) return {};
  const raiz = ehObjeto(bruto.empreendimentos) ? bruto.empreendimentos : bruto;
  const saida: LazerCurado = {};
  for (const [slug, v] of Object.entries(raiz)) {
    if (slug.startsWith("_") || !ehObjeto(v)) continue;
    const fonteGrupos = ehObjeto(v.grupos) ? v.grupos : ehObjeto(v.lazer) ? v.lazer : v;
    const grupos: Partial<Record<Lazer, Conferido>> = {};
    for (const g of GRUPOS) {
      const c = fonteGrupos[g.id];
      if (ehObjeto(c)) grupos[g.id] = c as Conferido;
      else if (typeof c === "boolean") grupos[g.id] = { tem: c };
    }
    const extras = Array.isArray(v.itensExtras) ? (v.itensExtras.filter(ehObjeto) as ItemExtra[]) : [];
    saida[slug] = { grupos, extras };
  }
  return saida;
}

const limitar = (v: number) => Math.max(0, Math.min(100, v));
const notaTempo = (min: number) => limitar(((TEMPO.limite - min) / (TEMPO.limite - TEMPO.ideal)) * 100);
const topPercent = (nota: number) => Math.max(5, Math.ceil((100 - nota) / 5) * 5);
const nf = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 2 });
const num = (v: number) => nf.format(v);
const lista = (l: string[]) => (l.length > 1 ? `${l.slice(0, -1).join(", ")} e ${l.at(-1)}` : (l[0] ?? ""));
const celula = (s: string) => s.replace(/\|/g, "\\|").replace(/\s*\n\s*/g, " ");
const SIM = "✔", NAO = "✖";

/** Minutos que viram motivo / ponto de atenção, pela regra do deslocamento. */
const MIN_MOTIVO = TEMPO.limite - (LIMIAR_MOTIVO / 100) * (TEMPO.limite - TEMPO.ideal);
const MIN_ATENCAO = TEMPO.limite - (LIMIAR_ATENCAO / 100) * (TEMPO.limite - TEMPO.ideal);

function situacaoLazer(e: Empreendimento, g: Lazer, curado: CuradoEmp | undefined) {
  const usa = e.lazer.includes(g);
  const c = curado?.grupos[g];
  const pendente = !!c?.pendente;
  const diverge = c?.tem !== undefined && c.tem !== usa;
  return { usa, c, pendente, diverge };
}

function simboloResumo(e: Empreendimento, g: Lazer, curado: LazerCurado | null) {
  const s = situacaoLazer(e, g, curado?.[e.slug]);
  let t = s.usa ? SIM : NAO;
  if (s.diverge) t += " ⚠";
  if (s.pendente) t += " (p)";
  return t;
}

function orcamentoSimbolo(e: Empreendimento, renda: Respostas["renda"], entrada: Entrada, dados: Dados) {
  const o = criterios(e, { renda, entrada }, dados).orcamento;
  return o === "cabe" ? "cabe" : o === "limite" ? "limite" : o === "fora" ? "acima" : "—";
}

function ficha(e: Empreendimento, todos: Empreendimento[], dados: Dados, polos: Polo[], curado: LazerCurado | null): string {
  const b = e.bairroId != null ? dados.bairros.find((x) => x.id === e.bairroId) : undefined;
  const linhas: string[] = [];
  const ganha: string[] = [];
  const perde: string[] = [];
  const obs: string[] = [];

  linhas.push(`## ${e.ordem}. ${e.nome}`, "");
  linhas.push(`- **Onde:** ${e.bairroNome}, ${e.cidade} · região ${REGIAO_NOME[e.regiao]}${e.coordAproximada ? " · localização aproximada (centro do bairro)" : ""}`);
  linhas.push(`- **Status (prazo):** ${STATUS_ROTULO[e.status]}`);
  const area = areaTexto(e);
  linhas.push(
    `- **Planta:** ${e.quartos.join(" ou ")} quarto${e.quartos.at(-1)! > 1 ? "s" : ""} · suíte: ${e.suite ? "tem opção" : "não"} · varanda: ${
      e.varanda === "sim" ? "sim" : e.varanda === "opcao" ? "opcional" : "não informado"
    } · área: ${area ?? "não informada"}`,
  );
  linhas.push(`- **Vagas:** ${e.vagas} vagas para ${e.unidades} apartamentos = **${num(e.vagasPorUnidade)} vaga por apartamento**`);
  linhas.push(
    `- **Minha Casa Minha Vida:** ${e.faixasMcmv.length ? `atende a${e.faixasMcmv.length > 1 ? "s faixas" : " faixa"} ${lista(e.faixasMcmv.map(String))}` : "fora do programa"}${
      e.mcmv ? "" : " · o site oficial não mostra o selo MCMV"
    } (preço de tabela: uso interno, não aparece aqui)`,
  );
  linhas.push(`- **Página oficial:** ${e.urlOficial} (extraída em ${e.fonte.extraidoEm.slice(0, 10)})`, "");

  // Lazer
  const cur = curado?.[e.slug];
  linhas.push("### Lazer do condomínio", "");
  linhas.push(`Itens de lazer na página oficial: ${e.lazerItens.length ? e.lazerItens.join(", ") : "nenhum"}.`, "");
  if (curado) {
    linhas.push("| Grupo do quiz | O quiz usa hoje | Conferência à mão | Fonte | Trecho |", "| --- | :-: | --- | --- | --- |");
  } else {
    linhas.push("| Grupo do quiz | O quiz usa hoje |", "| --- | :-: |");
  }
  const notas: string[] = [];
  for (const g of GRUPOS) {
    const s = situacaoLazer(e, g.id, cur);
    const usa = s.usa ? SIM : NAO;
    if (!curado) {
      linhas.push(`| ${g.rotulo} | ${usa} |`);
      continue;
    }
    if (!s.c) {
      linhas.push(`| ${g.rotulo} | ${usa} | automático (lista oficial) | — | — |`);
      continue;
    }
    const conf = [
      s.c.tem === undefined ? "sem decisão" : s.c.tem ? `${SIM} tem` : `${NAO} não tem`,
      s.diverge ? "⚠ diverge do quiz" : "",
      s.pendente ? `**pendente**${typeof s.c.pendente === "string" ? ` (${celula(s.c.pendente)})` : ""}` : "",
      s.c.conferidoEm ? `em ${s.c.conferidoEm}` : "",
    ].filter(Boolean).join(" · ");
    linhas.push(`| ${g.rotulo} | ${usa} | ${conf} | ${celula(s.c.fonte ?? "—")} | ${s.c.trecho ? celula(s.c.trecho) : "—"} |`);
    if (s.c.obs) notas.push(`${g.rotulo}: ${s.c.obs.replace(/\s+/g, " ")}`);
  }
  linhas.push("");
  if (!curado) linhas.push(`> ${LAZER_CURADO} ainda não existe: a coluna "Conferência à mão" aparece quando ele for criado.`, "");
  else if (!cur) linhas.push(`> Nenhuma correção em ${LAZER_CURADO}: vale a lista de lazer da página oficial.`, "");
  for (const n of notas) linhas.push(`> **Obs.** ${n}`, ">");
  for (const x of cur?.extras ?? []) {
    linhas.push(`> **Item acrescentado à mão:** ${x.item ?? "?"}${x.grupo ? ` (grupo ${x.grupo})` : ""} · fonte: ${x.fonte ?? "não informada"}${x.conferidoEm ? ` · em ${x.conferidoEm}` : ""}${x.pendente ? " · **pendente**" : ""}`, ">");
  }
  if (notas.length || cur?.extras.length) linhas.push("");
  const divergentes = GRUPOS.filter((g) => situacaoLazer(e, g.id, cur).diverge).map((g) => g.rotulo.toLowerCase());
  if (divergentes.length) {
    obs.push(`O lazer conferido à mão diverge do que o quiz usa hoje em: ${lista(divergentes)}. Rode \`npm run data:build\` (ou corrija o build) e gere esta ficha de novo.`);
  }

  // Bairro
  linhas.push("### Notas do bairro (posição entre os 121 bairros de Fortaleza, 0 a 100)", "");
  if (b) {
    linhas.push("| Tema (pergunta 6) | Nota | Leitura |", "| --- | :-: | --- |");
    for (const t of TEMAS) {
      const n = b.notas[t.id];
      linhas.push(`| ${t.rotulo} | ${n ?? "—"} | ${n == null ? "sem dado: sai da conta" : n >= LIMIAR_MOTIVO ? `entre os ${topPercent(n)}%: vira motivo` : n < 40 ? "baixa: puxa a nota para baixo" : "média"} |`);
    }
    linhas.push("");
  } else {
    linhas.push(`Sem notas: ${e.cidade} não está na base dos 121 bairros de Fortaleza. Para este empreendimento os critérios de bairro (pergunta 6), a parte de escolas do critério "família com crianças" e a mobilidade do bairro **saem da conta**, e o peso vai para os outros critérios.`, "");
  }

  // Deslocamento
  linhas.push("### Tempo até os lugares mais procurados", "");
  const tempos = polos.map((p) => ({ p, t: tempoAte(e, p.id, dados) }));
  const estimado = tempos.some((x) => x.t?.estimado);
  linhas.push(
    estimado
      ? `Estimativa pela distância em linha reta (${e.cidade} não tem tabela de ônibus); erro típico de 11 min.`
      : "Mediana da tabela de ônibus e metrô (GTFS ETUFOR/Metrofor), dia útil, saída 6h30–8h, sem trânsito.",
    "",
  );
  linhas.push("| Destino | Minutos | Nota no quiz |", "| --- | :-: | :-: |");
  for (const { p, t } of tempos) {
    if (!t) { linhas.push(`| ${p.nome} | — | sem dado |`); continue; }
    const n = Math.round(notaTempo(t.minutos));
    linhas.push(`| ${p.nome} | ${t.minutos}${t.estimado ? " (est.)" : ""} | ${n}${n >= LIMIAR_MOTIVO ? " · motivo" : n < LIMIAR_ATENCAO ? " · atenção" : ""} |`);
  }
  linhas.push("");

  // Onde ganha / perde pontos
  const perto = tempos.filter((x) => x.t && x.t.minutos <= MIN_MOTIVO).map((x) => `${x.p.nome.replace(/\s*\(.*\)$/, "")} (${minutosTexto(x.t!.minutos)})`);
  const longe = tempos.filter((x) => x.t && x.t.minutos > MIN_ATENCAO).map((x) => x.p.nome.replace(/\s*\(.*\)$/, ""));
  if (perto.length) ganha.push(`**Deslocamento (peso ${num(PESOS.deslocamento)}):** vira motivo para quem vai todo dia a ${lista(perto)}.`);
  if (longe.length) perde.push(`**Deslocamento (peso ${num(PESOS.deslocamento)}):** mais de ${Math.round(MIN_ATENCAO)} min até ${lista(longe)}: nota abaixo de ${LIMIAR_ATENCAO} e ponto de atenção.`);
  if (estimado) perde.push("**Tempo é estimativa** (distância em linha reta, erro típico de 11 min), mas entra na nota com o mesmo peso de um tempo medido. A tela avisa \"(estimativa)\".");

  const pctVaga = Math.round(Math.min(1, e.vagasPorUnidade) * 100);
  const notaVaga = Math.round(limitar(e.vagasPorUnidade * 100));
  if (e.vagasPorUnidade >= 1) ganha.push(`**Vaga (peso ${num(PESOS.vaga)}, quem vai de carro):** nota 100, motivo "Uma vaga de garagem por apartamento".`);
  else if (notaVaga >= LIMIAR_MOTIVO) ganha.push(`**Vaga (peso ${num(PESOS.vaga)}, quem vai de carro):** nota ${notaVaga}, motivo "Vagas para ${pctVaga}% dos apartamentos".`);
  else if (e.vagasPorUnidade >= VAGA.minimo) perde.push(`**Vaga (peso ${num(PESOS.vaga)}, quem vai de carro):** nota ${notaVaga}, sem motivo nem penalidade.`);
  else perde.push(`**Vaga (peso ${num(PESOS.vaga)}, quem vai de carro):** só ${pctVaga}% dos apartamentos têm vaga (menos de ${num(VAGA.minimo)} por unidade): nota ${notaVaga} **e** a nota final é multiplicada por ${num(VAGA.penalidade)}; aviso "Vagas limitadas".`);

  const temLazer = GRUPOS.filter((g) => g.id !== "pet" && e.lazer.includes(g.id)).map((g) => g.rotulo.toLowerCase());
  const semLazer = GRUPOS.filter((g) => g.id !== "pet" && !e.lazer.includes(g.id)).map((g) => g.rotulo.toLowerCase());
  if (temLazer.length) ganha.push(`**Lazer (peso ${num(PESOS.lazer)}):** conta para quem pede ${lista(temLazer)}.`);
  if (semLazer.length) perde.push(`**Lazer (peso ${num(PESOS.lazer)}):** não pontua para quem pede ${lista(semLazer)} (a nota é a fração dos itens pedidos que o condomínio tem).`);

  if (b) {
    const fortes = TEMAS.filter((t) => (b.notas[t.id] ?? 0) >= LIMIAR_MOTIVO).map((t) => `${t.rotulo.toLowerCase()} (${b.notas[t.id]})`);
    const fracos = TEMAS.filter((t) => b.notas[t.id] != null && b.notas[t.id]! < 40).map((t) => `${t.rotulo.toLowerCase()} (${b.notas[t.id]})`);
    if (fortes.length) ganha.push(`**Bairro (peso ${num(PESOS.bairro)} cada tema escolhido):** forte em ${lista(fortes)}: vira motivo.`);
    if (fracos.length) perde.push(`**Bairro (peso ${num(PESOS.bairro)} cada tema escolhido):** nota baixa em ${lista(fracos)}.`);
    const mob = b.notas.mobilidade;
    if (mob != null) (mob >= LIMIAR_MOTIVO ? ganha : perde).push(`**Mobilidade (peso ${num(PESOS.mobilidade)}, quem anda de ônibus e não tem destino fixo):** nota ${mob}${mob >= LIMIAR_MOTIVO ? ", vira motivo" : ""}.`);
  } else {
    ganha.push(`**Sem dado de bairro:** quem escolhe temas na pergunta 6 (ou anda de ônibus sem destino fixo) não tem esses critérios contados aqui, então eles **não puxam a nota para baixo**. Ver a auditoria: isso pode pôr este empreendimento à frente de bairros com notas reais.`);
  }

  const kids = e.lazer.includes("kids");
  const esc = b?.notas.escolas;
  const notaFilhos = esc != null ? (Number(kids) * 100 + esc) / 2 : Number(kids) * 100;
  (kids ? ganha : perde).push(
    `**Família com crianças (peso ${num(PESOS.filhos)}):** ${kids ? "tem" : "não tem"} playground${esc != null ? `; escolas do bairro ${esc}` : ""} → nota ${num(notaFilhos)}${
      esc != null ? ` (só ${kids ? 100 : 0} se a pessoa também escolheu "Escolas" na pergunta 6, porque aí as escolas já contam lá)` : ""
    }.`,
  );
  (e.suite ? ganha : perde).push(`**Casal (peso ${num(PESOS.casal)}):** ${e.suite ? `tem opção com suíte → nota ${SUITE.com}` : `sem suíte → nota ${SUITE.sem}`}.`);
  if (e.status === "lancamento") {
    perde.push(`**Prazo:** lançamento → nota ${PRAZO.logo.lancamento} para quem quer mudar "o quanto antes" (peso ${num(PESOS.prazoLogo)}) e ${PRAZO.medio.lancamento} para "em 1 a 2 anos" (peso ${num(PESOS.prazoMedio)}).`);
  } else {
    ganha.push(`**Prazo:** ${STATUS_ROTULO[e.status].toLowerCase()} → nota 100 para quem quer mudar logo (peso ${num(PESOS.prazoLogo)}) ou em 1 a 2 anos (peso ${num(PESOS.prazoMedio)}).`);
  }

  if (e.faixasMcmv.some((f) => f <= 2)) ganha.push(`**Orçamento (peso ${num(PESOS.orcamento)}):** atende faixa${e.faixasMcmv.filter((f) => f <= 2).length > 1 ? "s" : ""} ${lista(e.faixasMcmv.filter((f) => f <= 2).map(String))} do MCMV: quem tem essa renda recebe subsídio e juros menores na conta.`);
  const minFaixa = e.faixasMcmv.length ? Math.min(...e.faixasMcmv) : null;
  if (minFaixa == null) perde.push(`**Orçamento (peso ${num(PESOS.orcamento)}):** fora do MCMV: a conta usa juros de mercado para todas as rendas.`);
  else if (minFaixa > 1) {
    const abaixo = Array.from({ length: minFaixa - 1 }, (_, i) => String(i + 1));
    perde.push(`**Orçamento (peso ${num(PESOS.orcamento)}):** quem é da${abaixo.length > 1 ? "s faixas" : " faixa"} ${lista(abaixo)} não usa as condições do MCMV aqui (a conta usa juros de mercado e não há subsídio).`);
  }

  const vizinhos = todos.filter((o) => o.slug !== e.slug && o.bairroNome === e.bairroNome).map((o) => o.nome);
  if (vizinhos.length) obs.push(`Mesmo bairro de ${lista(vizinhos)}: pela regra de diversidade, só um deles entra no top 5, a não ser que o segundo esteja ${DIVERSIDADE_FOLGA} pontos ou mais à frente do próximo de outro bairro.`);
  const posicaoItens = 1 + todos.filter((o) => o.lazerItens.length > e.lazerItens.length).length;
  obs.push(`Desempate (nota e tempo iguais): ${e.lazerItens.length} itens de lazer na página oficial, ${posicaoItens}º entre os 16.`);
  if (e.lazer.includes("pet")) obs.push(`Tem pet place: o motivo "Pet place para o seu bicho" é verdadeiro aqui (o quiz hoje mostra esse motivo sem checar; ver auditoria).`);
  else obs.push(`**Não tem pet place**, mas o quiz hoje mostra "Pet place para o seu bicho" para quem tem pet (ver auditoria).`);

  linhas.push("### Onde ganha pontos", "", ...ganha.map((g) => `- ${g}`), "");
  linhas.push("### Onde perde pontos", "", ...(perde.length ? perde.map((p) => `- ${p}`) : ["- Nada que se destaque."]), "");
  linhas.push("### Observações", "", ...obs.map((o) => `- ${o}`), "");

  // Orçamento: só a categoria, nunca o valor
  linhas.push("### Orçamento no quiz (cabe / limite / acima, sem preço)", "", "Ver a nota sobre os valores usados na conta no início desta ficha.", "");
  linhas.push(`| Renda \\ Entrada | ${ENTRADAS.map((x) => x.rotulo).join(" | ")} |`, `| --- | ${ENTRADAS.map(() => ":-:").join(" | ")} |`);
  for (const r of RENDAS) linhas.push(`| ${r.rotulo} | ${ENTRADAS.map((x) => orcamentoSimbolo(e, r.id, x.id, dados)).join(" | ")} |`);
  linhas.push("");
  return linhas.join("\n");
}

async function main() {
  const empreendimentos = await lerJson<Empreendimento[]>("data/empreendimentos.json");
  const bairros = await lerJson<Bairro[]>("data/bairros.json");
  const polos = await lerJson<Polo[]>("data/polos.json");
  const destinos = await lerJson<Destino[]>("data/destinos.json");
  const precos = await lerJson<{ atualizadoEm?: string }>("data/curated/precos.json");
  const temCurado = await existe(LAZER_CURADO);
  const curado = temCurado ? normalizarLazer(await lerJson<unknown>(LAZER_CURADO)) : null;
  const dados: Dados = { empreendimentos, bairros, polos, destinos };
  const lista16 = [...empreendimentos].sort((a, b) => a.ordem - b.ordem);
  const extraido = [...new Set(lista16.map((e) => e.fonte.extraidoEm.slice(0, 10)))].sort();

  const md: string[] = [];
  md.push(
    "<!-- ARQUIVO GERADO por `npm run data:ficha` (scripts/build-ficha.ts). NÃO EDITE À MÃO: corrija os dados ou o script e gere de novo. -->",
    "",
    "# Ficha dos empreendimentos",
    "",
    "> **Arquivo gerado automaticamente. Não edite à mão.** Para atualizar: `npm run data:ficha`.",
    "> Como cada critério funciona está em [COMO_ESCOLHEMOS.md](COMO_ESCOLHEMOS.md); o que pode estar errado no cálculo, em [AUDITORIA_SCORING.md](AUDITORIA_SCORING.md).",
    "",
    "Fontes desta versão:",
    "",
    `- Páginas oficiais da MRV, extraídas em ${lista(extraido)} (\`data/empreendimentos.json\`).`,
    "- Notas do bairro e tempo de ônibus: `data/bairros.json` (OpenStreetMap e tabela GTFS ETUFOR/Metrofor).",
    `- Faixas do MCMV: tabela interna \`data/curated/precos.json\`${precos.atualizadoEm ? ` (atualizada em ${precos.atualizadoEm})` : ""}. O preço não aparece nesta ficha.`,
    temCurado
      ? `- Lazer conferido à mão: \`${LAZER_CURADO}\` (${Object.keys(curado ?? {}).length} empreendimentos).`
      : `- Lazer conferido à mão: \`${LAZER_CURADO}\` **ainda não existe**; a ficha mostra só o lazer que o quiz usa hoje.`,
    "",
    `Orçamento: cada ficha traz uma tabela "cabe / limite / acima" por faixa de renda e de entrada, calculada pela mesma regra do quiz, sem mostrar preço. A conta usa um valor perto do **topo** de cada faixa de renda (${RENDAS.map((r) => `R$ ${num(RENDA[r.id].mensal)}`).join(", ")}) e perto do **piso** de cada faixa de entrada (${ENTRADAS.map((x) => `R$ ${num(ENTRADA[x.id])}`).join(", ")}).`,
    "",
    "## Resumo",
    "",
    "✔ tem · ✖ não tem · ⚠ o lazer conferido à mão diverge do que o quiz usa hoje · (p) conferência pendente. Lazer: só o que fica dentro do condomínio.",
    "",
  );
  md.push(
    `| # | Empreendimento | Região | Status | Suíte | Vaga/apto | MCMV | ${GRUPOS.map((g) => g.rotulo).join(" | ")} | Itens de lazer | Escolas | Saúde | Ônibus |`,
    `| --: | --- | --- | --- | :-: | :-: | :-: | ${GRUPOS.map(() => ":-:").join(" | ")} | :-: | :-: | :-: | :-: |`,
  );
  for (const e of lista16) {
    const b = e.bairroId != null ? bairros.find((x) => x.id === e.bairroId) : undefined;
    const vaga = `${num(e.vagasPorUnidade)}${e.vagasPorUnidade < VAGA.minimo ? " ⚠" : ""}`;
    md.push(
      `| ${e.ordem} | [${e.nome}](#${slugAncora(`${e.ordem}. ${e.nome}`)}) | ${REGIAO_NOME[e.regiao]} (${e.bairroNome}) | ${STATUS_ROTULO[e.status]} | ${e.suite ? SIM : NAO} | ${vaga} | ${e.faixasMcmv.join(", ") || "fora"} | ${GRUPOS.map((g) => simboloResumo(e, g.id, curado)).join(" | ")} | ${e.lazerItens.length} | ${b?.notas.escolas ?? "—"} | ${b?.notas.saude ?? "—"} | ${b?.notas.mobilidade ?? "—"} |`,
    );
  }
  md.push(
    "",
    `Vaga/apto com ⚠: menos de ${num(VAGA.minimo)} vaga por apartamento, penalidade para quem vai de carro. Escolas, Saúde e Ônibus: nota do bairro (0 a 100); "—" = sem dado (Caucaia e Eusébio).`,
    "",
  );
  for (const e of lista16) md.push(ficha(e, lista16, dados, polos, curado));

  await mkdir(path.join(RAIZ, path.dirname(SAIDA)), { recursive: true });
  await writeFile(path.join(RAIZ, SAIDA), md.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd() + "\n");
  console.log(`${SAIDA}: ${lista16.length} empreendimentos, lazer conferido à mão: ${temCurado ? "sim" : "não (arquivo ausente)"}`);
}

/** Âncora no estilo do GitHub: minúsculas, sem pontuação, espaços viram hífen. */
function slugAncora(titulo: string) {
  return titulo.toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, "").replace(/\s/g, "-");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
