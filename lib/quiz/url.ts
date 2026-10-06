import type { NotaBairro, PoloId, RegiaoSlug } from "@/lib/types";
import type { LazerEscolhivel, Moradores, Onde, Prazo, Respostas, Transporte } from "./types";

/**
 * Respostas <-> query string legível e compartilhável:
 *   ?o=regioes&g=leste,sul&d=unifor&t=onibus&m=filhos&p=1&l=piscina,kids&b=saude&z=logo
 * Valores desconhecidos são descartados em silêncio: um link editado à mão não quebra a página.
 */
const ONDE: Onde[] = ["fortaleza", "metropolitana", "regioes"];
const REGIOES: RegiaoSlug[] = ["oeste-centro", "leste", "sul", "caucaia", "eusebio"];
const POLOS: PoloId[] = ["centro", "beira_mar", "aldeota", "papicu", "iguatemi", "unifor", "centro_eventos", "parangaba", "messejana", "ufc_benfica", "ufc_pici", "aeroporto"];
const TRANSPORTE: Transporte[] = ["onibus", "carro", "bike", "app"];
const MORADORES: Moradores[] = ["so", "casal", "filhos"];
const LAZER: LazerEscolhivel[] = ["piscina", "academia", "kids", "festas", "esportes", "verde"];
const BAIRRO: NotaBairro[] = ["saude", "escolas", "comercio", "lazer", "mobilidade"];
const PRAZO: Prazo[] = ["logo", "medio", "tanto_faz"];

const um = <T extends string>(v: string | null, ok: readonly T[]) => (v && (ok as readonly string[]).includes(v) ? (v as T) : undefined);
const varios = <T extends string>(v: string | null, ok: readonly T[], max: number) => {
  const l = [...new Set((v ?? "").split(",").filter((x) => (ok as readonly string[]).includes(x)))] as T[];
  return l.length ? l.slice(0, max) : undefined;
};

export function codificar(r: Respostas): string {
  const p = new URLSearchParams();
  if (r.onde) p.set("o", r.onde);
  if (r.onde === "regioes" && r.regioes?.length) p.set("g", r.regioes.join(","));
  if (r.destino) p.set("d", r.destino);
  if (r.transporte) p.set("t", r.transporte);
  if (r.moradores) p.set("m", r.moradores);
  if (r.pet) p.set("p", "1");
  if (r.lazer?.length) p.set("l", r.lazer.join(","));
  if (r.bairro?.length) p.set("b", r.bairro.join(","));
  if (r.prazo) p.set("z", r.prazo);
  return p.toString();
}

export function decodificar(q: URLSearchParams | string): Respostas {
  const p = typeof q === "string" ? new URLSearchParams(q) : q;
  const onde = um(p.get("o"), ONDE);
  const d = p.get("d") ?? "";
  // "b24" = bairro de id 24 (os 121 bairros); id inexistente cai no scoring como critério sem dado.
  const destino = d === "casa" ? "casa" : /^b\d{1,3}$/.test(d) ? (d as `b${number}`) : um(d, POLOS);
  return {
    onde,
    regioes: onde === "regioes" ? varios(p.get("g"), REGIOES, 5) : undefined,
    destino,
    transporte: um(p.get("t"), TRANSPORTE),
    moradores: um(p.get("m"), MORADORES),
    pet: p.get("p") === "1" || undefined,
    lazer: varios(p.get("l"), LAZER, 3),
    bairro: varios(p.get("b"), BAIRRO, 2),
    prazo: um(p.get("z"), PRAZO),
  };
}

/** sessionStorage: o quiz grava as respostas ao terminar; o resultado mostra a revelação uma vez. */
export const CHAVE_REVELAR = "descubra:revelar";

export const respondeuAlgo = (r: Respostas) => Object.values(r).some((v) => v !== undefined);
