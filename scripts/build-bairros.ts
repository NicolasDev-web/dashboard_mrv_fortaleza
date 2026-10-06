/**
 * Importa do projeto "Dashboard de Bairros de Fortaleza" só o que o produto usa:
 *   data/bairros.json   notas de entorno (percentil entre os 121 bairros) e tempo de ônibus até os polos
 *                       e até cada um dos 121 bairros (para "para onde você vai quase todo dia?")
 *   data/polos.json     os 12 lugares mais procurados, atalhos da mesma pergunta
 *   data/destinos.json  os 121 bairros como destino: nome e centro aproximado
 *   data/mapa.json      contorno simplificado dos 121 bairros, já agrupados nas 5 regiões
 *
 *   npx tsx scripts/build-bairros.ts [--origem ../Dashboard_de_Bairros_de_Fortaleza]
 *
 * Segurança e renda ficam de fora de propósito: decisão da MRV, para não estigmatizar bairros.
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const RAIZ = path.resolve(import.meta.dirname, "..");
const iOrigem = process.argv.indexOf("--origem");
const ORIGEM = path.resolve(RAIZ, iOrigem > 0 ? process.argv[iOrigem + 1] : "../Dashboard_de_Bairros_de_Fortaleza");

// Bairros com empreendimento MRV (ids da malha Seuma). Manter igual a data/curated/empreendimentos.json.
const BAIRROS_MRV = [6, 10, 11, 18, 40, 53, 61, 82, 88];
const NOTAS = ["saude", "lazer", "mobilidade", "escolas", "comercio"] as const;

function lerCsv(txt: string): Record<string, string>[] {
  const [cab, ...linhas] = txt.replace(/^﻿/, "").trim().split(/\r?\n/);
  const cols = cab.split(",");
  return linhas.map((l) => Object.fromEntries(l.split(",").map((v, i) => [cols[i], v])));
}
const ler = (rel: string) => readFile(path.join(ORIGEM, rel), "utf-8");

// Posição de cada bairro entre os 121 (0 a 100), com empates na posição média, como no "Onde morar".
function percentis(valores: Map<number, number>): Map<number, number> {
  const pares = [...valores].sort((a, b) => a[1] - b[1]);
  const out = new Map<number, number>();
  for (let i = 0; i < pares.length; ) {
    let j = i;
    while (j + 1 < pares.length && pares[j + 1][1] === pares[i][1]) j++;
    const pos = (((i + j) / 2 + 1) / pares.length) * 100;
    for (let k = i; k <= j; k++) out.set(pares[k][0], Math.round(pos));
    i = j + 1;
  }
  return out;
}

// "CONJUNTO CEARÁ II" -> "Conjunto Ceará II", "SAPIRANGA-COITÉ" -> "Sapiranga-Coité", "DE LOURDES" -> "De Lourdes"
const nomeProprio = (s: string) =>
  s
    .toLowerCase()
    .replace(/(^|[\s-])(\p{L})/gu, (_, sep: string, l: string) => sep + l.toUpperCase())
    .replace(/(?<=\s)(Do|Da|Dos|Das|De)(?=\s)/g, (m) => m.toLowerCase())
    .replace(/\b(Ii|Iii|Xxiii)\b/g, (m) => m.toUpperCase());

type Ponto = [number, number];
// Douglas-Peucker: o mapa é ilustrativo, não precisa de mais de ~1 px de precisão.
function simplificar(pts: Ponto[], tol: number): Ponto[] {
  if (pts.length < 4) return pts;
  const [a, b] = [pts[0], pts[pts.length - 1]];
  let maxD = 0, idx = 0;
  for (let i = 1; i < pts.length - 1; i++) {
    const [x, y] = pts[i];
    const dx = b[0] - a[0], dy = b[1] - a[1];
    const d = Math.abs(dy * x - dx * y + b[0] * a[1] - b[1] * a[0]) / (Math.hypot(dx, dy) || 1);
    if (d > maxD) { maxD = d; idx = i; }
  }
  if (maxD <= tol) return [a, b];
  return [...simplificar(pts.slice(0, idx + 1), tol).slice(0, -1), ...simplificar(pts.slice(idx), tol)];
}
// Num anel fechado o primeiro ponto é igual ao último: corta no ponto mais distante e simplifica as duas metades.
function simplificarAnel(anel: Ponto[], tol: number): Ponto[] {
  const [x0, y0] = anel[0];
  let longe = 0;
  anel.forEach(([x, y], i) => { if (Math.hypot(x - x0, y - y0) > Math.hypot(anel[longe][0] - x0, anel[longe][1] - y0)) longe = i; });
  return [...simplificar(anel.slice(0, longe + 1), tol).slice(0, -1), ...simplificar(anel.slice(longe), tol)];
}

async function main() {
  const equip = lerCsv(await ler("data/processed/bairros_equipamentos.csv"));
  const regional = new Map(lerCsv(await ler("data/raw/bairro_regional.csv")).map((r) => [Number(r.bairro_id), Number(r.regional)]));
  const tempos = lerCsv(await ler("data/processed/transporte_tempos.csv"));
  const transporteJs = await ler("dashboard/transporte.js");
  const polosBrutos = JSON.parse(/"polos":(\[[^\]]*\])/.exec(transporteJs)![1]) as { id: string; nome: string; lat: number; lon: number }[];

  const pct = Object.fromEntries(
    NOTAS.map((n) => [n, percentis(new Map(equip.filter((r) => r[n] !== "").map((r) => [Number(r.bairro_id), Number(r[n])])))]),
  ) as Record<(typeof NOTAS)[number], Map<number, number>>;

  const bairros = BAIRROS_MRV.map((id) => {
    const linha = equip.find((r) => Number(r.bairro_id) === id);
    if (!linha) throw new Error(`bairro ${id} sem equipamentos`);
    const tempoAtePolo: Record<string, number> = {};
    const tempoAteBairro: Record<string, number> = {};
    for (const t of tempos) {
      if (t.from_id !== `b${id}`) continue;
      if (t.to_id.startsWith("p_")) tempoAtePolo[t.to_id.slice(2)] = Math.round(Number(t.p50));
      else if (t.to_id.startsWith("b") && t.p50 !== "") tempoAteBairro[t.to_id.slice(1)] = Math.round(Number(t.p50));
    }
    return {
      id,
      nome: nomeProprio(linha.nome),
      regional: regional.get(id) ?? null,
      notas: Object.fromEntries(NOTAS.map((n) => [n, pct[n].get(id) ?? null])),
      tempoAtePolo,
      tempoAteBairro,
    };
  });

  const polos = polosBrutos.map((p) => ({
    id: p.id.slice(2),
    nome: p.nome.replace(/\s*\((terminal)\)/, " (terminal)"),
    lat: p.lat,
    lon: p.lon,
  }));

  // Mapa: projeção equirretangular simples, viewBox 0 0 1000 H.
  const geo = JSON.parse(await ler("data/geo/bairros_fortaleza.geojson")) as {
    features: { properties: { bairro_id: number; nome: string }; geometry: { type: string; coordinates: number[][][] | number[][][][] } }[];
  };
  const aneis = geo.features.map((f) => {
    const polys = (f.geometry.type === "MultiPolygon" ? f.geometry.coordinates : [f.geometry.coordinates]) as number[][][][];
    return { id: f.properties.bairro_id, nome: nomeProprio(f.properties.nome), aneis: polys.map((p) => p[0].map(([x, y]) => [x, y] as Ponto)) };
  });
  const todos = aneis.flatMap((b) => b.aneis.flat());
  const [minX, maxX] = [Math.min(...todos.map((p) => p[0])), Math.max(...todos.map((p) => p[0]))];
  const [minY, maxY] = [Math.min(...todos.map((p) => p[1])), Math.max(...todos.map((p) => p[1]))];
  const kx = Math.cos(((minY + maxY) / 2) * (Math.PI / 180));
  const escala = 1000 / ((maxX - minX) * kx);
  const proj = ([x, y]: Ponto): Ponto => [(x - minX) * kx * escala, (maxY - y) * escala];
  const altura = Math.round((maxY - minY) * escala);

  // Centro de cada bairro (centroide do maior anel): ponto de chegada para estimativas e para o mapa.
  const centroide = (anel: Ponto[]): Ponto => {
    let a = 0, cx = 0, cy = 0;
    for (let i = 0; i < anel.length - 1; i++) {
      const [x0, y0] = anel[i], [x1, y1] = anel[i + 1], f = x0 * y1 - x1 * y0;
      a += f; cx += (x0 + x1) * f; cy += (y0 + y1) * f;
    }
    return [cx / (3 * a), cy / (3 * a)];
  };
  const area = (anel: Ponto[]) => Math.abs(anel.reduce((s, [x, y], i) => { const [x1, y1] = anel[(i + 1) % anel.length]; return s + x * y1 - x1 * y; }, 0) / 2);
  const slug = (s: string) => s.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const regiaoDoBairro = (id: number, lat: number) => {
    const reg = regional.get(id);
    if (reg === 2 || reg === 7) return "leste";
    return lat < -3.778 ? "sul" : "oeste-centro";
  };
  // Mesma regra do mapa de regiões: média dos vértices do bairro.
  const latMediaDe = (b: (typeof aneis)[number]) => { const pts = b.aneis.flat(); return pts.reduce((s, p) => s + p[1], 0) / pts.length; };
  const destinos = aneis
    .map((b) => {
      const maior = [...b.aneis].sort((x, y) => area(y) - area(x))[0];
      const [lon, lat] = centroide(maior);
      return { id: b.id, nome: b.nome, slug: slug(b.nome), regiao: regiaoDoBairro(b.id, latMediaDe(b)), lat: Math.round(lat * 1e5) / 1e5, lon: Math.round(lon * 1e5) / 1e5 };
    })
    .sort((x, y) => x.nome.localeCompare(y.nome, "pt-BR"));

  const mapa = {
    largura: 1000,
    altura,
    bairros: aneis.map((b) => {
      const latMedia = latMediaDe(b);
      const d = b.aneis
        .map((anel) => simplificarAnel(anel.map(proj), 1.2))
        .filter((anel) => anel.length >= 3)
        .map((anel) => "M" + anel.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join("L") + "Z")
        .join("");
      return { id: b.id, regiao: regiaoDoBairro(b.id, latMedia), d };
    }),
  };

  await writeFile(path.join(RAIZ, "data/bairros.json"), JSON.stringify(bairros, null, 2) + "\n");
  await writeFile(path.join(RAIZ, "data/polos.json"), JSON.stringify(polos, null, 2) + "\n");
  await writeFile(path.join(RAIZ, "data/mapa.json"), JSON.stringify(mapa) + "\n");
  await writeFile(path.join(RAIZ, "data/destinos.json"), JSON.stringify(destinos) + "\n");
  console.log(`${bairros.length} bairros com MRV (tempo até ${Object.keys(bairros[0].tempoAteBairro).length} bairros), ${polos.length} polos, ${destinos.length} destinos, mapa ${altura}px`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
