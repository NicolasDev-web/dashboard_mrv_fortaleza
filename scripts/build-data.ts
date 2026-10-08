/**
 * Monta data/empreendimentos.json e data/regioes.json, que o app importa.
 *
 *   data/raw/mrv/*.json             extraído das páginas oficiais (scripts/extract-mrv.ts)
 * + data/curated/empreendimentos.json  correções revisadas à mão (vencem o extraído)
 * + data/curated/precos.json        tabela de preços e faixas MCMV (uso interno do scoring)
 * + data/curated/lazer.json         lazer conferido à mão (vence a lista oficial; travas em scripts/lazer-regras.ts)
 * + data/imagens.json               variantes geradas (scripts/build-images.ts)
 *
 *   npx tsx scripts/build-data.ts
 */
import { readFile, readdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import type { Empreendimento, FaixaMcmv, Imagem, Regiao, Status, TipoImagem } from "../lib/types";
import { conferirLazer, corrigirFotos, separarDiferenciais, textosDaPaginaCompleta, type ArquivoLazer } from "./lazer-regras";

const RAIZ = path.resolve(import.meta.dirname, "..");
const lerJson = async <T,>(rel: string): Promise<T> => JSON.parse(await readFile(path.join(RAIZ, rel), "utf-8"));

type Bruto = {
  ordem: number; url: string; extraidoEm: string; nome: string; cidade: string; bairro: string; status: string;
  elevador: boolean | null; lat: number; lon: number; endereco: string | null; apresentacao: string | null;
  tipologias: { titulo: string; areas: number[] }[]; unidades: number; vagas: number;
  proximoA: string | null; descricao: string | null; mcmv: boolean; diferenciais: { titulo: string; tipo: string }[];
};
type Curado = {
  ordem: number; slug: string; nome: string; linha?: "sensia"; bairroNome: string; bairroId: number | null;
  regiao: Empreendimento["regiao"]; capa: number; coord?: { lat: number; lon: number; aproximada?: boolean };
};

const STATUS: Record<string, Status> = { "lançamento": "lancamento", "em construção": "em_construcao", pronto: "pronto" };

const TIPOS_GALERIA: TipoImagem[] = ["fachada", "portaria", "piscina", "gourmet", "festas", "kids", "fitness", "pet", "lazer", "interno"];

/** Diferenciais que não são lazer (o lazer sai de conferirLazer). */
function outrosDiferenciais(brutos: Bruto["diferenciais"]) {
  const { outros } = separarDiferenciais(brutos);
  const economia = outros.some((t) => /economizador/i.test(t));
  const limpos = outros
    .filter((t) => !/economizador|^suíte$|^elevador$/i.test(t))
    .map((t) => t.replace(/^Previsão para medição/, "Medição"));
  if (economia) limpos.push("Dispositivos economizadores de água e energia");
  return [...new Set(limpos)];
}

async function main() {
  const curado = await lerJson<{ regioes: Regiao[]; empreendimentos: Curado[] }>("data/curated/empreendimentos.json");
  const imagens = await lerJson<Record<string, Omit<Imagem, "src">[]>>("data/imagens.json");
  const { precos } = await lerJson<{ precos: Record<string, { preco: number; faixas: FaixaMcmv[] }> }>("data/curated/precos.json");
  const lazerCurado = await lerJson<ArquivoLazer>("data/curated/lazer.json");
  for (const slug of Object.keys(lazerCurado.empreendimentos))
    if (!curado.empreendimentos.some((c) => c.slug === slug)) throw new Error(`data/curated/lazer.json: slug desconhecido "${slug}"`);
  // NN.json é o resumo; NN.completo.json (item inteiro da página) é só arquivo de consulta.
  const arquivos = (await readdir(path.join(RAIZ, "data/raw/mrv"))).filter((f) => /^\d+\.json$/.test(f));
  const brutos = new Map<number, Bruto>();
  const completos = new Map<number, [string, string][]>();
  for (const f of arquivos) {
    const b = await lerJson<Bruto>(`data/raw/mrv/${f}`);
    brutos.set(b.ordem, b);
    const completo = `data/raw/mrv/${f.replace(/\.json$/, ".completo.json")}`;
    if (existsSync(path.join(RAIZ, completo))) completos.set(b.ordem, textosDaPaginaCompleta((await lerJson<{ item: unknown }>(completo)).item));
  }

  const errosLazer: string[] = [];
  const avisosLazer: string[] = [];
  const mudancasLazer: string[] = [];

  const lista: Empreendimento[] = curado.empreendimentos.map((c) => {
    const b = brutos.get(c.ordem);
    if (!b) throw new Error(`sem dado extraído para ${c.nome}`);
    const lazerC = lazerCurado.empreendimentos[c.slug];
    const fotos = corrigirFotos(imagens[c.slug] ?? [], lazerC, c.nome).map((i) => ({ ...i, src: `/img/${c.slug}/${i.id}` }));
    const capa = fotos.find((f) => f.n === c.capa);
    if (!capa) throw new Error(`${c.nome}: capa ${c.capa} não está em data/imagens.json`);
    const status = STATUS[b.status.toLowerCase()];
    if (!status) throw new Error(`${c.nome}: status desconhecido "${b.status}"`);

    const textos = [b.apresentacao ?? "", ...b.tipologias.map((t) => t.titulo)].join(" ");
    const quartos = [...new Set([...textos.matchAll(/(\d)\s*quarto/gi)].map((m) => Number(m[1])))].sort();
    const areas = b.tipologias.flatMap((t) => t.areas).filter((a) => a > 0);
    const outros = outrosDiferenciais(b.diferenciais);
    // proximoA (entorno) fica de fora de propósito: "academias" ali não é academia do condomínio.
    const conf = conferirLazer({
      nome: c.nome,
      textos: { descricao: b.descricao, apresentacao: b.apresentacao, diferenciais: b.diferenciais, extras: completos.get(c.ordem) },
      fotos: fotos.filter((f) => TIPOS_GALERIA.includes(f.tipo)),
      curado: lazerC,
    });
    errosLazer.push(...conf.erros);
    avisosLazer.push(...conf.avisos);
    mudancasLazer.push(...conf.mudancas.map((m) => `${c.nome}: ${m}`));
    const { lazer, lazerItens } = conf;
    const varanda = /op[cç][aã]o de varanda/i.test(textos) ? "opcao" : /varanda/i.test(textos) ? "sim" : null;
    const suite = /su[ií]te/i.test(textos) || b.diferenciais.some((d) => /^su[ií]te$/i.test(d.titulo));

    return {
      slug: c.slug,
      ordem: c.ordem,
      nome: c.nome,
      linha: c.linha ?? "mrv",
      cidade: b.cidade as Empreendimento["cidade"],
      bairroNome: c.bairroNome,
      bairroId: c.bairroId,
      regiao: c.regiao,
      coord: c.coord ? { lat: c.coord.lat, lon: c.coord.lon } : { lat: b.lat, lon: b.lon },
      coordAproximada: !!c.coord?.aproximada,
      endereco: b.endereco,
      status,
      quartos: quartos.length ? quartos : [2],
      suite,
      varanda,
      areaMin: areas.length ? Math.min(...areas) : null,
      areaMax: areas.length ? Math.max(...areas) : null,
      elevador: b.elevador,
      unidades: b.unidades,
      vagas: b.vagas,
      vagasPorUnidade: Math.round((b.vagas / b.unidades) * 100) / 100,
      lazer,
      lazerItens,
      diferenciais: outros,
      proximoA: b.proximoA?.replace(/^Pr[oó]xim[oa]s?\s+(a|ao|à|do|da)\s+/i, "").replace(/\s+/g, " ").replace(/[.\s]+$/, "") ?? null,
      descricao: (b.descricao ?? "").split(/\n\s*\n/).map((p) => p.replace(/\s+/g, " ").trim()).filter(Boolean),
      mcmv: b.mcmv,
      preco: precos[c.slug]?.preco ?? null,
      faixasMcmv: precos[c.slug]?.faixas ?? [],
      urlOficial: b.url,
      imagens: {
        capa,
        galeria: [capa, ...fotos.filter((f) => f !== capa && TIPOS_GALERIA.includes(f.tipo))],
        plantas: fotos.filter((f) => f.tipo === "planta"),
        implantacao: fotos.filter((f) => f.tipo === "implantacao"),
        aerea: fotos.filter((f) => f.tipo === "aerea"),
      },
      fonte: { extraidoEm: b.extraidoEm },
    };
  });

  for (const m of mudancasLazer) console.log(`lazer.json muda: ${m}`);
  for (const a of avisosLazer) console.warn(`AVISO lazer pendente: ${a}`);
  if (errosLazer.length)
    throw new Error(`Conferência do lazer falhou (${errosLazer.length}). Corrija os dados ou registre a decisão, com fonte, em data/curated/lazer.json:\n  - ${errosLazer.join("\n  - ")}`);

  await writeFile(path.join(RAIZ, "data/empreendimentos.json"), JSON.stringify(lista, null, 1) + "\n");
  await writeFile(path.join(RAIZ, "data/regioes.json"), JSON.stringify(curado.regioes, null, 2) + "\n");
  for (const e of lista)
    console.log(`${e.slug.padEnd(32)} ${e.status.padEnd(13)} ${e.quartos.join("/")}q ${e.suite ? "suíte " : ""}${e.varanda ?? "-"} ${e.areaMin ?? "?"}–${e.areaMax ?? "?"}m² vagas ${e.vagasPorUnidade} lazer ${e.lazer.join(",")} galeria ${e.imagens.galeria.length} plantas ${e.imagens.plantas.length}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
