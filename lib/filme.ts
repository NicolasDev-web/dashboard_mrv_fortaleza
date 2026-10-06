import type { Empreendimento, Imagem, TipoImagem } from "./types";

/** Capítulos do filme do empreendimento. O scoring liga cada motivo a um deles (lib/scoring/capitulos.ts). */
export type CapituloId = "fachada" | "piscina" | "lazer" | "apartamento" | "planta" | "aerea";

export interface Capitulo {
  id: CapituloId;
  rotulo: string;
  fotos: Imagem[];
}

const REGRAS: { id: CapituloId; rotulo: string; tipos: TipoImagem[]; max: number }[] = [
  { id: "fachada", rotulo: "Fachada", tipos: ["fachada", "portaria"], max: 2 },
  { id: "piscina", rotulo: "Piscina", tipos: ["piscina"], max: 1 },
  { id: "lazer", rotulo: "Lazer", tipos: ["kids", "gourmet", "festas", "fitness", "pet", "lazer"], max: 3 },
  { id: "apartamento", rotulo: "Apartamento", tipos: ["interno"], max: 3 },
  { id: "planta", rotulo: "Planta", tipos: ["planta"], max: 1 },
  { id: "aerea", rotulo: "Vista aérea", tipos: ["aerea"], max: 1 },
];

/**
 * Sequência curta (até ~11 fotos, ~45 s) e sempre na mesma ordem: chegar, aproveitar, morar, entender.
 * A capa abre o filme, no capítulo dela, para casar com a foto do card (transição de capa).
 */
export function capitulosDo(e: Pick<Empreendimento, "imagens">): Capitulo[] {
  const todas = [...e.imagens.galeria, ...e.imagens.plantas, ...e.imagens.aerea];
  const capa = e.imagens.capa;
  const usadas = new Set<string>();
  const caps: Capitulo[] = [];
  for (const regra of REGRAS) {
    const doTipo = todas.filter((f) => regra.tipos.includes(f.tipo) && !usadas.has(f.id));
    // A capa vem primeiro no capítulo dela; o capítulo da capa sobe para o começo do filme.
    doTipo.sort((a, b) => Number(b.id === capa.id) - Number(a.id === capa.id));
    const fotos = doTipo.slice(0, regra.max);
    fotos.forEach((f) => usadas.add(f.id));
    if (fotos.length) caps.push({ id: regra.id, rotulo: regra.rotulo, fotos });
  }
  const iCapa = caps.findIndex((c) => c.fotos[0]?.id === capa.id);
  if (iCapa > 0) caps.unshift(...caps.splice(iCapa, 1));
  return caps;
}
