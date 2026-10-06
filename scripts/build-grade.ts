/**
 * Pré-calcula a grade do mapa em pixels (components/mapa/CidadeMapa.tsx): qual bairro ocupa cada célula,
 * em duas resoluções. Assim o celular não testa 121 polígonos ao abrir a página.
 *
 *   npx tsx scripts/build-grade.ts [--origem ../Dashboard_de_Bairros_de_Fortaleza]
 *
 * Entrada: malha de bairros (projeto de bairros), contornos de Caucaia e Eusébio (API de malhas do IBGE,
 * guardados em data/raw/ibge/) e as coordenadas de data/empreendimentos.json (o recorte cobre todos os pinos).
 * Saída: data/grade.json.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const RAIZ = path.resolve(import.meta.dirname, "..");
const iOrigem = process.argv.indexOf("--origem");
const ORIGEM = path.resolve(RAIZ, iOrigem > 0 ? process.argv[iOrigem + 1] : "../Dashboard_de_Bairros_de_Fortaleza");
const MUNICIPIOS = { caucaia: 2303709, eusebio: 2304285 } as const;
/** Colunas da grade: 40 para mapas pequenos (faixa do quiz no celular), 72 para telas estreitas, 120 para desktop. */
const RESOLUCOES = [40, 72, 120];
/** Código na grade: 0..120 = índice do bairro em `ids`; 250/251 = Caucaia/Eusébio; 255 = vazio. */
const COD = { caucaia: 250, eusebio: 251, vazio: 255 } as const;

type Ponto = [number, number];
type Poligono = Ponto[][]; // anel externo + buracos

async function contornoIbge(nome: keyof typeof MUNICIPIOS): Promise<Poligono[]> {
  const cache = path.join(RAIZ, `data/raw/ibge/${nome}.json`);
  if (!existsSync(cache)) {
    const url = `https://servicodados.ibge.gov.br/api/v3/malhas/municipios/${MUNICIPIOS[nome]}?formato=application/vnd.geo+json&qualidade=intermediaria`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`IBGE ${nome}: HTTP ${res.status}`);
    await mkdir(path.dirname(cache), { recursive: true });
    await writeFile(cache, await res.text());
  }
  const g = JSON.parse(await readFile(cache, "utf-8")).features[0].geometry;
  return (g.type === "Polygon" ? [g.coordinates] : g.coordinates) as Poligono[];
}

function dentroAnel(x: number, y: number, anel: Ponto[]) {
  let c = false;
  for (let i = 0, j = anel.length - 1; i < anel.length; j = i++) {
    const [xi, yi] = anel[i], [xj, yj] = anel[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
}
const dentro = (x: number, y: number, polys: Poligono[]) =>
  polys.some((p) => dentroAnel(x, y, p[0]) && !p.slice(1).some((h) => dentroAnel(x, y, h)));

async function main() {
  const geo = JSON.parse(await readFile(path.join(ORIGEM, "data/geo/bairros_fortaleza.geojson"), "utf-8")) as {
    features: { properties: { bairro_id: number }; geometry: { type: string; coordinates: unknown } }[];
  };
  const bairros = geo.features.map((f) => ({
    id: f.properties.bairro_id,
    polys: (f.geometry.type === "Polygon" ? [f.geometry.coordinates] : f.geometry.coordinates) as Poligono[],
  }));
  const fora = { caucaia: await contornoIbge("caucaia"), eusebio: await contornoIbge("eusebio") };
  const emps = JSON.parse(await readFile(path.join(RAIZ, "data/empreendimentos.json"), "utf-8")) as { coord: { lat: number; lon: number } }[];

  // Recorte: Fortaleza inteira + todos os pinos, com folga.
  const pts = [...bairros.flatMap((b) => b.polys.flatMap((p) => p[0])), ...emps.map((e) => [e.coord.lon, e.coord.lat] as Ponto)];
  let [lonMin, lonMax] = [Math.min(...pts.map((p) => p[0])), Math.max(...pts.map((p) => p[0]))];
  let [latMin, latMax] = [Math.min(...pts.map((p) => p[1])), Math.max(...pts.map((p) => p[1]))];
  const folgaLon = (lonMax - lonMin) * 0.06, folgaLat = (latMax - latMin) * 0.06;
  lonMin -= folgaLon; lonMax += folgaLon; latMin -= folgaLat; latMax += folgaLat;
  const kx = Math.cos((((latMin + latMax) / 2) * Math.PI) / 180);
  const proporcao = (latMax - latMin) / ((lonMax - lonMin) * kx); // altura / largura

  const ids = bairros.map((b) => b.id);
  const grades = RESOLUCOES.map((cols) => {
    const lins = Math.round(cols * proporcao);
    const celulas = new Uint8Array(cols * lins).fill(COD.vazio);
    for (let j = 0; j < lins; j++) {
      for (let i = 0; i < cols; i++) {
        const lon = lonMin + ((i + 0.5) / cols) * (lonMax - lonMin);
        const lat = latMax - ((j + 0.5) / lins) * (latMax - latMin);
        const k = bairros.findIndex((b) => dentro(lon, lat, b.polys));
        if (k >= 0) celulas[j * cols + i] = k;
        else if (dentro(lon, lat, fora.caucaia)) celulas[j * cols + i] = COD.caucaia;
        else if (dentro(lon, lat, fora.eusebio)) celulas[j * cols + i] = COD.eusebio;
      }
    }
    return { cols, lins, celulas: Buffer.from(celulas).toString("base64") };
  });

  const r6 = (v: number) => Math.round(v * 1e6) / 1e6;
  const saida = { bbox: { lonMin: r6(lonMin), lonMax: r6(lonMax), latMin: r6(latMin), latMax: r6(latMax) }, ids, cod: COD, grades };
  await writeFile(path.join(RAIZ, "data/grade.json"), JSON.stringify(saida) + "\n");
  for (const g of grades) {
    const cel = Buffer.from(g.celulas, "base64");
    const conta = (f: (v: number) => boolean) => cel.reduce((s, v) => s + (f(v) ? 1 : 0), 0);
    console.log(`${g.cols}×${g.lins}: ${conta((v) => v < 250)} células de Fortaleza, ${conta((v) => v === 250)} de Caucaia, ${conta((v) => v === 251)} do Eusébio`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
