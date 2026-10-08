/**
 * Lê as páginas oficiais dos empreendimentos (data/raw/links_oficiais.csv) e grava o JSON
 * embutido em <script id="mrv-property-details"> de cada uma em data/raw/mrv/<ordem>.json.
 *
 *   npx tsx scripts/extract-mrv.ts            baixa as 16 páginas
 *   npx tsx scripts/extract-mrv.ts --cache    usa os HTML já baixados em data/raw/mrv/html/
 *
 * Grava dois arquivos por empreendimento:
 *   data/raw/mrv/<ordem>.json           resumo com os campos que o build usa
 *   data/raw/mrv/<ordem>.completo.json  o item INTEIRO do JSON da página, sem descartar nada. Serve de prova
 *                                       e de consulta (ex.: um item de lazer citado fora de "diferenciaisNew"),
 *                                       e scripts/build-data.ts procura termos de lazer nele (exceto entorno).
 *
 * O resultado é só a matéria-prima: o que o app usa é montado por scripts/build-data.ts,
 * que aplica as correções de data/curated/empreendimentos.json e data/curated/lazer.json por cima.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const RAIZ = path.resolve(import.meta.dirname, "..");
const SAIDA = path.join(RAIZ, "data/raw/mrv");
const HTML = path.join(SAIDA, "html");
const usarCache = process.argv.includes("--cache");

// As páginas misturam UTF-8, Windows-1252 e escapes "~uXXXX" do CMS.
function decodificar(buf: Buffer): string {
  const utf8 = new TextDecoder("utf-8", { fatal: true });
  try {
    return utf8.decode(buf);
  } catch {
    return new TextDecoder("windows-1252").decode(buf);
  }
}
const ENTIDADES: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', nbsp: " ", ordm: "º" };
function limpar(s: unknown): string | null {
  if (s == null) return null;
  return String(s)
    .replace(/&(#\d+|[a-z]+);/gi, (m, e: string) => {
      if (e[0] === "#") return String.fromCharCode(Number(e.slice(1)));
      const acento = /^([a-z])(acute|grave|circ|tilde|cedil|uml)$/i.exec(e);
      if (acento) return (acento[1] + { acute: "́", grave: "̀", circ: "̂", tilde: "̃", cedil: "̧", uml: "̈" }[acento[2].toLowerCase()]!).normalize("NFC");
      return ENTIDADES[e.toLowerCase()] ?? m;
    })
    .replace(/~u([0-9a-f]{4})/gi, (_, h: string) => String.fromCharCode(parseInt(h, 16)))
    .trim();
}

type Bruto = Record<string, unknown>;

/** Formato de data/raw/mrv/<ordem>.completo.json: o item da página como veio, mais a origem. */
type ExtracaoCompleta = { ordem: number; url: string; extraidoEm: string; item: Bruto };

function itemDaPagina(html: string): Bruto {
  const m = /<script id="mrv-property-details" type="application\/json">([\s\S]*?)<\/script>/.exec(html);
  if (!m) throw new Error("JSON mrv-property-details não encontrado");
  return JSON.parse(m[1]).empreendimentosList.items[0] as Bruto;
}

function resumir(item: Bruto) {
  const lista = <T,>(v: unknown) => (Array.isArray(v) ? (v as T[]) : []);
  const diferenciais = lista<Bruto>(item.diferenciaisNew).map((d) => ({ titulo: limpar(d.titulo), tipo: limpar(d.tipo) }));
  return {
    nome: limpar(item.nomeImovel),
    cidade: limpar(item.cidade),
    bairro: limpar(item.bairro)?.replace(/-/g, " ").trim(),
    status: limpar(item.statusImovel),
    elevador: item.isElevador ?? null,
    lat: Number(item.latitude),
    lon: Number(item.longitude),
    cep: limpar(item.cep),
    endereco: limpar(item.endereco),
    apresentacao: limpar(item.apresentacao),
    tipologias: lista<Bruto>(item.tipologias).map((t) => ({
      titulo: limpar(t.titulo),
      areas: lista<string>(t.areaTotal).map((a) => Number(String(a).trim().replace(",", "."))).filter((a) => a > 0),
    })),
    unidades: Number(item.totalUnidades) || null,
    vagas: Number(item.totalGaragem) || null,
    proximoA: limpar((item.proximidade as Bruto | undefined)?.plaintext),
    descricao: limpar((item.descricao as Bruto | undefined)?.plaintext),
    mcmv: /Minha Casa/i.test(limpar((item.condicoesPagamento as Bruto | undefined)?.titulo) ?? ""),
    diferenciais,
    promocoes: lista<Bruto>(item.promocoesImovel).map((p) => ({ nome: limpar(p.nome), expira: p.dataExpiracao ?? null })),
  };
}

async function main() {
  await mkdir(HTML, { recursive: true });
  const csv = decodificar(await readFile(path.join(RAIZ, "data/raw/links_oficiais.csv"))).replace(/^﻿/, "");
  const linhas = csv.trim().split(/\r?\n/).slice(1).map((l) => l.split(";"));
  for (const [ordem, nome, url] of linhas) {
    const id = ordem.padStart(2, "0");
    const arqHtml = path.join(HTML, `${id}.html`);
    let buf: Buffer;
    if (usarCache && existsSync(arqHtml)) {
      buf = await readFile(arqHtml);
    } else {
      const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (descubra-seu-mrv)" } });
      if (!res.ok) throw new Error(`${nome}: HTTP ${res.status}`);
      buf = Buffer.from(await res.arrayBuffer());
      await writeFile(arqHtml, buf);
    }
    const item = itemDaPagina(decodificar(buf));
    const origem = { ordem: Number(ordem), url, extraidoEm: new Date().toISOString().slice(0, 10) };
    const dados = { ...origem, ...resumir(item) };
    await writeFile(path.join(SAIDA, `${id}.json`), JSON.stringify(dados, null, 2) + "\n");
    const completo: ExtracaoCompleta = { ...origem, item };
    await writeFile(path.join(SAIDA, `${id}.completo.json`), JSON.stringify(completo, null, 2) + "\n");
    console.log(`${id} ${dados.nome} · ${dados.bairro} · ${dados.status} · ${dados.tipologias.length} tipologia(s)`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
