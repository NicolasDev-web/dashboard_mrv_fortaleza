/**
 * Regras do lazer do condomínio: classifica a lista oficial em grupos, aplica data/curated/lazer.json por cima
 * e confere tudo contra os outros textos oficiais e as fotos. Usado por scripts/build-data.ts e pelos testes
 * (tests/dados.test.ts).
 *
 * Por que existe: em 10/2026 o Forte Alencar apareceu sem academia e o time MRV contestou. O lazer vinha só da
 * lista "diferenciaisNew" da página oficial, sem nenhuma conferência cruzada. Agora o build FALHA quando:
 *   - um termo de lazer aparece nos textos oficiais (descrição, apresentação, qualquer diferencial) e o grupo
 *     não está no lazer nem tem decisão em data/curated/lazer.json;
 *   - existe foto de um tipo de lazer (piscina, fitness, kids, pet, gourmet, festas) sem o grupo correspondente,
 *     a não ser que lazer.json decida explicitamente, com fonte;
 *   - uma decisão, item extra ou correção de foto em lazer.json não tem fonte.
 * Decisões com `pendente: true` só geram aviso.
 *
 * "Próximo a" (proximoA) descreve o ENTORNO ("academias", "Parque..."), nunca o condomínio: não entra aqui.
 */
import type { Imagem, Lazer, TipoImagem } from "../lib/types";

export const GRUPOS: Lazer[] = ["piscina", "academia", "kids", "festas", "esportes", "verde", "pet"];

/**
 * Item da lista oficial → grupo. "Espaço Funcional Descoberto" (barras e rampa ao ar livre) e crossfit ao ar
 * livre NÃO contam como academia (decisão do time MRV em 07/10/2026): só academia de verdade, coberta.
 */
export const GRUPOS_LAZER: [RegExp, Lazer][] = [
  [/piscina/i, "piscina"],
  [/academia|fitness/i, "academia"],
  [/playground|playbaby|kids|brinquedoteca/i, "kids"],
  [/churrasqueira|gourmet|pizza|festas|happy hour/i, "festas"],
  [/quadra|jogos|futmesa/i, "esportes"],
  [/caminhada|cooper|piquenique|pomar|zen/i, "verde"],
  [/pet/i, "pet"],
];

/** Termos procurados nos textos livres (descrição, apresentação, títulos de todos os diferenciais). */
export const TERMOS_TEXTO: [RegExp, Lazer][] = [
  [/piscina/i, "piscina"],
  [/\bacademia|fitness/i, "academia"],
  [/playground|playbaby|espa[cç]o kids|brinquedoteca/i, "kids"],
  [/churrasqueira|gourmet|sal[aã]o de festas|happy hour|espa[cç]o pizza/i, "festas"],
  [/quadra|sal[aã]o de jogos|sala de jogos|futmesa/i, "esportes"],
  [/caminhada|cooper|piquenique|pomar|[aá]rea verde|espa[cç]o zen/i, "verde"],
  [/pet place|pet care|espa[cç]o pet/i, "pet"],
];

/** Tipo de foto da galeria → grupo que ela pressupõe. */
export const FOTO_GRUPO: Partial<Record<TipoImagem, Lazer>> = {
  piscina: "piscina",
  fitness: "academia",
  kids: "kids",
  pet: "pet",
  gourmet: "festas",
  festas: "festas",
};

/** Nome de exibição: o funcional não pode soar como academia. */
const RENOMEAR: [RegExp, string][] = [[/^espa[cç]o funcional descoberto$/i, "Espaço funcional ao ar livre"]];

export type Diferencial = { titulo: string | null; tipo: string | null };

/** Só o que a página oficial diz sobre o condomínio. proximoA fica de fora de propósito. */
export type TextosOficiais = {
  descricao: string | null;
  apresentacao: string | null;
  diferenciais: Diferencial[];
  proximoA?: string | null;
  /** [origem, texto] de outros campos da página (data/raw/mrv/NN.completo.json), já sem os de entorno */
  extras?: [string, string][];
};

/** Campos da página que descrevem o ENTORNO: nunca contam como lazer do condomínio. */
const CAMPOS_ENTORNO = /proximi|entorno|vizinhan|interesse|localiza|regiao|região/i;
/** Campos que não são texto para o comprador (endereços de arquivo, ids). */
const NAO_TEXTO = /^(https?:|\/)|\.(jpe?g|png|webp|avif|gif|svg|pdf|mp4)(\?.*)?$/i;

/**
 * Textos de todos os campos do item completo da página (scripts/extract-mrv.ts grava em NN.completo.json),
 * menos os de entorno ("proximidade" etc.). Assim um item de lazer citado fora de "diferenciaisNew" também
 * passa pela conferência.
 */
export function textosDaPaginaCompleta(item: unknown): [string, string][] {
  const saida: [string, string][] = [];
  const andar = (v: unknown, caminho: string) => {
    if (typeof v === "string") {
      const t = v.replace(/~u([0-9a-f]{4})/gi, (_, h: string) => String.fromCharCode(parseInt(h, 16))).trim();
      if (t && !NAO_TEXTO.test(t)) saida.push([`página completa, campo ${caminho}`, t]);
    } else if (Array.isArray(v)) v.forEach((x, i) => andar(x, `${caminho}[${i}]`));
    else if (v && typeof v === "object")
      for (const [k, x] of Object.entries(v)) if (!CAMPOS_ENTORNO.test(k)) andar(x, caminho ? `${caminho}.${k}` : k);
  };
  andar(item, "");
  return saida;
}

export type Decisao = {
  tem: boolean;
  fonte: string;
  trecho?: string;
  conferidoEm: string;
  pendente?: boolean;
  obs?: string;
};
export type ItemExtra = { item: string; grupo?: Lazer; fonte: string; conferidoEm: string; pendente?: boolean };
export type CorrecaoFoto = { tipo?: TipoImagem; alt?: string; fonte: string; conferidoEm: string };
export type LazerCurado = {
  grupos?: Partial<Record<Lazer, Decisao>>;
  itensExtras?: ItemExtra[];
  fotos?: Record<string, CorrecaoFoto>;
};
export type ArquivoLazer = { _leia?: string; empreendimentos: Record<string, LazerCurado> };

export function semAcento(s: string) {
  return s.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
}

export function gruposDe(texto: string, regras: [RegExp, Lazer][] = GRUPOS_LAZER): Lazer[] {
  return regras.filter(([re]) => re.test(texto)).map(([, g]) => g);
}

/** Grupos que a lista oficial de lazer, sozinha, sustenta (na ordem em que aparecem). */
export function gruposDosItens(itens: string[]): Lazer[] {
  return [...new Set(itens.flatMap((t) => gruposDe(t)))];
}

/**
 * Separa a lista oficial em itens de lazer e outros diferenciais. Conta como lazer o que a MRV marcou como
 * "Diferenciais de Lazer" e também o que tem nome de lazer em outra categoria (ex.: o Playground do Ville de
 * Lisboa vem como "Diferenciais de Card"; Playbaby, Futmesa e Happy Hour vêm sem tipo).
 */
export function separarDiferenciais(brutos: Diferencial[]) {
  const lazerItens: string[] = [];
  const outros: string[] = [];
  const visto = new Set<string>();
  for (const { titulo, tipo } of brutos) {
    if (!titulo) continue;
    const chave = semAcento(titulo).replace(/ com copa$/, "");
    if (visto.has(chave)) continue;
    visto.add(chave);
    const nomeDeLazer = gruposDe(titulo).length > 0 && !/vesti[aá]rio/i.test(titulo);
    if (/lazer/i.test(tipo ?? "") || nomeDeLazer) lazerItens.push(titulo);
    else outros.push(titulo);
  }
  return { lazerItens, outros };
}

export function nomeDeExibicao(item: string) {
  for (const [re, nome] of RENOMEAR) if (re.test(item)) return nome;
  return item;
}

/** Onde cada grupo aparece nos textos oficiais (exceto proximoA), com o trecho que disparou. */
export function gruposNosTextos(t: TextosOficiais): Map<Lazer, { origem: string; trecho: string }> {
  const achados = new Map<Lazer, { origem: string; trecho: string }>();
  const fontes: [string, string][] = [
    ["descrição", t.descricao ?? ""],
    ["apresentação", t.apresentacao ?? ""],
    ...t.diferenciais.filter((d) => d.titulo).map((d): [string, string] => [`diferencial "${d.tipo ?? "sem tipo"}"`, d.titulo!]),
    ...(t.extras ?? []),
  ];
  for (const [origem, texto] of fontes) {
    for (const [re, g] of TERMOS_TEXTO) {
      if (achados.has(g)) continue;
      const m = re.exec(texto);
      if (!m) continue;
      const ini = Math.max(0, m.index - 40);
      const trecho = texto.slice(ini, m.index + m[0].length + 40).replace(/\s+/g, " ").trim();
      achados.set(g, { origem, trecho: (ini > 0 ? "…" : "") + trecho + "…" });
    }
  }
  return achados;
}

/** Aplica as correções de foto de lazer.json (tipo e/ou alt). */
export function corrigirFotos<T extends Pick<Imagem, "id" | "tipo" | "alt">>(fotos: T[], curado: LazerCurado | undefined, nome: string): T[] {
  const correcoes = curado?.fotos ?? {};
  for (const [id, c] of Object.entries(correcoes)) {
    if (!c.fonte?.trim()) throw new Error(`${nome}: correção da foto ${id} em data/curated/lazer.json sem "fonte"`);
    if (!fotos.some((f) => f.id === id)) throw new Error(`${nome}: foto ${id} de data/curated/lazer.json não existe em data/imagens.json`);
  }
  return fotos.map((f) => {
    const c = correcoes[f.id];
    return c ? { ...f, tipo: c.tipo ?? f.tipo, alt: c.alt ?? f.alt } : f;
  });
}

export type Conferencia = {
  lazer: Lazer[];
  lazerItens: string[];
  /** grupo → de onde veio o "tem" */
  fontes: Partial<Record<Lazer, string>>;
  erros: string[];
  avisos: string[];
  /** o que a curadoria mudou em relação à lista oficial */
  mudancas: string[];
};

/**
 * Junta a lista oficial e a curadoria e confere com textos e fotos. Não lança: devolve `erros` para o build
 * juntar tudo numa mensagem só.
 */
export function conferirLazer(args: {
  nome: string;
  textos: TextosOficiais;
  fotos: Pick<Imagem, "id" | "tipo">[];
  curado?: LazerCurado;
}): Conferencia {
  const { nome, textos, fotos, curado } = args;
  const erros: string[] = [];
  const avisos: string[] = [];
  const mudancas: string[] = [];
  const fontes: Partial<Record<Lazer, string>> = {};

  const { lazerItens: oficiais } = separarDiferenciais(textos.diferenciais);
  const auto = gruposDosItens(oficiais);
  const noTexto = gruposNosTextos(textos);
  const nasFotos = new Map<Lazer, string[]>();
  for (const f of fotos) {
    const g = FOTO_GRUPO[f.tipo];
    if (g) nasFotos.set(g, [...(nasFotos.get(g) ?? []), `${f.id} (${f.tipo})`]);
  }

  for (const g of Object.keys(curado?.grupos ?? {})) {
    if (!GRUPOS.includes(g as Lazer)) erros.push(`${nome}: grupo desconhecido "${g}" em data/curated/lazer.json`);
  }

  const final = new Set<Lazer>();
  for (const g of GRUPOS) {
    const d = curado?.grupos?.[g];
    if (d) {
      if (typeof d.tem !== "boolean") erros.push(`${nome}/${g}: decisão em lazer.json sem "tem" (true/false)`);
      if (!d.fonte?.trim()) erros.push(`${nome}/${g}: decisão em lazer.json sem "fonte"`);
      if (!d.conferidoEm) erros.push(`${nome}/${g}: decisão em lazer.json sem "conferidoEm"`);
      if (d.pendente) avisos.push(`${nome}/${g}: ${d.tem ? "TEM" : "NÃO TEM"} marcado como pendente (fonte: ${d.fonte})`);
      if (d.tem !== auto.includes(g)) mudancas.push(`${g}: ${d.tem ? "entra" : "sai"} (lista oficial ${auto.includes(g) ? "tem" : "não tem"}; fonte: ${d.fonte})`);
      if (d.tem) {
        final.add(g);
        fontes[g] = `lazer.json: ${d.fonte}`;
      }
      continue;
    }
    if (auto.includes(g)) {
      final.add(g);
      fontes[g] = `lista oficial: ${oficiais.filter((t) => gruposDe(t).includes(g)).join(", ")}`;
      continue;
    }
    const t = noTexto.get(g);
    if (t) erros.push(`${nome}/${g}: o texto oficial (${t.origem}) diz "${t.trecho}", mas "${g}" não está na lista oficial de lazer nem tem decisão em data/curated/lazer.json`);
    const f = nasFotos.get(g);
    if (f) erros.push(`${nome}/${g}: há foto(s) ${f.join(", ")} mas "${g}" não está no lazer nem tem decisão em data/curated/lazer.json (corrija o tipo da foto ou decida o grupo, com fonte)`);
  }

  const lazerItens = oficiais.map(nomeDeExibicao);
  for (const x of curado?.itensExtras ?? []) {
    if (!x.fonte?.trim()) erros.push(`${nome}: item extra "${x.item}" em lazer.json sem "fonte"`);
    if (!x.conferidoEm) erros.push(`${nome}: item extra "${x.item}" em lazer.json sem "conferidoEm"`);
    if (x.grupo && !final.has(x.grupo)) erros.push(`${nome}: item extra "${x.item}" é do grupo "${x.grupo}", que ficou fora do lazer`);
    if (x.pendente) avisos.push(`${nome}: item "${x.item}" pendente de reconferência (fonte: ${x.fonte})`);
    if (!lazerItens.some((i) => semAcento(i) === semAcento(x.item))) lazerItens.push(x.item);
  }

  // Ordem: a da lista oficial, depois o que a curadoria acrescentou.
  const ordem = [...gruposDosItens(oficiais), ...GRUPOS];
  const lazer = [...new Set(ordem)].filter((g) => final.has(g));
  return { lazer, lazerItens, fontes, erros, avisos, mudancas };
}
