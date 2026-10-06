/**
 * Gera as variantes otimizadas das fotos e o manifest que o app lê.
 *
 *   npx tsx scripts/build-images.ts           processa só o que ainda não existe em public/img/
 *   npx tsx scripts/build-images.ts --force   refaz tudo
 *
 * Entrada: assets-src/mrv_empreendimentos/NN_<NOME>/ (descompactado do zip, fora do git).
 * Saída:   public/img/<slug>/<NN>-<largura>.avif, <NN>-1080.webp e data/imagens.json.
 *
 * O formato é lido do conteúdo, não da extensão: há WebP salvos como .jpg.
 */
import { mkdir, readdir, readFile, writeFile, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import os from "node:os";
import sharp from "sharp";

const RAIZ = path.resolve(import.meta.dirname, "..");
const ORIGEM = path.join(RAIZ, "assets-src/mrv_empreendimentos");
const SAIDA = path.join(RAIZ, "public/img");
const forcar = process.argv.includes("--force");

const LARGURAS = [640, 1080, 1600];
const LARGURA_HERO = 2400;
const LARGURA_FALLBACK = 1080;

export type Tipo =
  | "fachada" | "portaria" | "aerea" | "implantacao" | "planta"
  | "piscina" | "pet" | "kids" | "gourmet" | "festas" | "fitness" | "lazer" | "interno";

// A ordem importa: "PH_IMPLANTACAO" é implantação, não planta.
const REGRAS: [RegExp, Tipo, string][] = [
  [/AEREA|VOO|INSERCAO|PANORAMA/, "aerea", "Vista aérea com o entorno"],
  [/IMPLANTA|IMPLA3D|IMP3D|IMP-3D|IMPL3D|IMPLGERAL|MASTERPLAN|_IMP_/, "implantacao", "Implantação do condomínio"],
  [/_PH_|^\d+_PH_|_PL_|PLANTA|_AP_\d{3}(_|$)|PHAPTO/, "planta", "Planta do apartamento"],
  [/QUARTO|SUITE/, "interno", "Quarto"],
  [/SALA(?!O)|LIVING|COZINHA/, "interno", "Sala e cozinha"], // "SALAO_DE_FESTAS" não é sala
  [/VARANDA/, "interno", "Varanda"],
  // Só depois dos internos: "SALA_COZINHA_APTO_1205" é foto, "BLOCO_02_APTO003_TERREO" é planta.
  [/APTO_?\d{3}/, "planta", "Planta do apartamento"],
  [/FACHAD/, "fachada", "Fachada"],
  [/GUARIT|PORTARIA/, "portaria", "Portaria"],
  [/PISCIN/, "piscina", "Piscina"],
  [/PET/, "pet", "Pet place"],
  [/PLAY|KIDS/, "kids", "Playground e espaço kids"],
  [/CHURRAS|GOURMET|HAPPY|PIZZA/, "gourmet", "Espaço gourmet"],
  [/FESTA/, "festas", "Salão de festas"],
  [/FITNESS|CROSS|FUNCIONAL|QUADRA|CROSFI/, "fitness", "Espaço fitness"],
  [/POMAR|PIQUENIQUE|BICICLET|CAMINHADA|JOGOS|CARWASH|GARAGEM|LAZER|GERAL/, "lazer", "Área de lazer"],
  [/PRIVATIVA|INTERNA|CIRCULA/, "interno", "Área privativa"],
];
const ROTULO_PADRAO: Partial<Record<Tipo, string>> = { aerea: "Vista aérea com o entorno", fachada: "Fachada", lazer: "Área de lazer" };

function classificar(arquivo: string): { tipo: Tipo; rotulo: string } | null {
  const nome = arquivo.toUpperCase().replace(/-/g, "_").replace(/\.[A-Z]+$/, "");
  for (const [re, tipo, rotulo] of REGRAS) if (re.test(nome)) return { tipo, rotulo };
  return null;
}

type Curado = { ordem: number; slug: string; nome: string; capa: number; tipos?: Record<string, Tipo>; ocultar?: number[] };

export type Imagem = {
  id: string; // "07-01"
  n: number;
  tipo: Tipo;
  alt: string;
  w: number; // largura do original
  h: number;
  cor: string;
  blur: string; // data URI
  larguras: number[]; // variantes AVIF disponíveis
  fallback: number; // largura da variante WebP
};

async function pool<T>(itens: T[], n: number, fn: (x: T) => Promise<void>) {
  let i = 0;
  await Promise.all(Array.from({ length: n }, async () => { while (i < itens.length) await fn(itens[i++]); }));
}

async function main() {
  const curado = JSON.parse(await readFile(path.join(RAIZ, "data/curated/empreendimentos.json"), "utf-8")).empreendimentos as Curado[];
  const pastas = await readdir(ORIGEM);
  const manifest: Record<string, Imagem[]> = {};
  const tarefas: { emp: Curado; arq: string; dir: string; n: number }[] = [];

  for (const emp of curado) {
    const pasta = pastas.find((p) => p.startsWith(String(emp.ordem).padStart(2, "0") + "_"));
    if (!pasta) throw new Error(`pasta de fotos não encontrada: ${emp.nome}`);
    const dir = path.join(ORIGEM, pasta);
    for (const arq of (await readdir(dir)).filter((a) => /\.(jpe?g|webp|png)$/i.test(a)).sort()) {
      const n = Number(arq.slice(0, 2));
      if (emp.ocultar?.includes(n)) continue;
      tarefas.push({ emp, arq, dir, n });
    }
    manifest[emp.slug] = [];
  }

  if (process.argv.includes("--listar")) {
    for (const { emp, arq, n } of tarefas) {
      const c = classificar(arq);
      console.log(`${emp.slug.padEnd(32)} ${String(n).padStart(2)} ${(emp.tipos?.[String(n)] ?? c?.tipo ?? "?").padEnd(12)} ${arq.slice(0, 70)}`);
    }
    return;
  }

  const semTipo: string[] = [];
  let feitos = 0;
  sharp.concurrency(1); // o paralelismo vem do pool, um thread do libvips por imagem
  await pool(tarefas, Math.max(2, os.cpus().length - 1), async ({ emp, arq, dir, n }) => {
    const auto = classificar(arq);
    const tipo = emp.tipos?.[String(n)] ?? auto?.tipo ?? "lazer";
    if (!auto && !emp.tipos?.[String(n)]) semTipo.push(`${emp.slug}/${arq}`);
    const rotulo = emp.tipos?.[String(n)] ? (ROTULO_PADRAO[tipo] ?? auto?.rotulo ?? "Área de lazer") : (auto?.rotulo ?? "Área de lazer");

    const meta = await sharp(path.join(dir, arq), { failOn: "none" }).metadata();
    const w = meta.autoOrient?.width ?? meta.width!, h = meta.autoOrient?.height ?? meta.height!;
    const id = `${String(emp.ordem).padStart(2, "0")}-${String(n).padStart(2, "0")}`;
    const ehCapa = n === emp.capa;
    const comTexto = tipo === "planta" || tipo === "implantacao";
    let larguras = [...LARGURAS, ...(ehCapa ? [LARGURA_HERO] : [])].filter((l) => l <= w);
    if (!larguras.length || larguras[larguras.length - 1] < Math.min(w, LARGURAS[0])) larguras.push(w);
    larguras = [...new Set(larguras)].sort((a, b) => a - b);
    const fallback = Math.min(LARGURA_FALLBACK, w);

    // Decodifica o original (até 8.048 px) uma vez só, já reduzido para a maior largura que vamos usar.
    const maior = Math.max(...larguras, fallback);
    const { data, info } = await sharp(path.join(dir, arq), { failOn: "none" })
      .rotate()
      .resize({ width: maior, withoutEnlargement: true })
      .raw()
      .toBuffer({ resolveWithObject: true });
    const base = () => sharp(data, { raw: { width: info.width, height: info.height, channels: info.channels } });

    const destino = path.join(SAIDA, emp.slug);
    await mkdir(destino, { recursive: true });
    const precisa = async (f: string) => {
      if (forcar || !existsSync(f)) return true;
      try { await sharp(f).metadata(); return false; } catch { return true; } // arquivo parcial de uma execução interrompida
    };
    for (const l of larguras) {
      const f = path.join(destino, `${id}-${l}.avif`);
      if (await precisa(f)) await base().resize({ width: l }).avif({ quality: comTexto ? 62 : 50, effort: 2 }).toFile(f);
    }
    const fw = path.join(destino, `${id}-${fallback}.webp`);
    if (await precisa(fw)) await base().resize({ width: fallback }).webp({ quality: comTexto ? 80 : 70 }).toFile(fw);

    const { dominant } = await base().resize(64).stats();
    const mini = await base().resize(16).webp({ quality: 40 }).toBuffer();
    const hex = (v: number) => v.toString(16).padStart(2, "0");
    manifest[emp.slug].push({
      id, n, tipo,
      alt: `${rotulo} do ${emp.nome}`,
      w, h,
      cor: `#${hex(dominant.r)}${hex(dominant.g)}${hex(dominant.b)}`,
      blur: `data:image/webp;base64,${mini.toString("base64")}`,
      larguras, fallback,
    });
    feitos++;
    if (feitos % 10 === 0) console.log(`${feitos}/${tarefas.length}`);
  });

  for (const slug in manifest) manifest[slug].sort((a, b) => a.n - b.n);
  await writeFile(path.join(RAIZ, "data/imagens.json"), JSON.stringify(manifest, null, 1) + "\n");
  let bytes = 0;
  for (const slug in manifest) for (const f of await readdir(path.join(SAIDA, slug))) bytes += (await stat(path.join(SAIDA, slug, f))).size;
  console.log(`${tarefas.length} imagens, ${(bytes / 1024 / 1024).toFixed(1)} MB em public/img`);
  if (semTipo.length) console.log("Sem tipo reconhecido (ficaram como lazer):\n  " + semTipo.join("\n  "));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
