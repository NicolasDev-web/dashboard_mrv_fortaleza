import type { Empreendimento } from "./types";

/**
 * Lazer e diferenciais da página oficial, reagrupados em faixas que a pessoa entende:
 * o que dá para usar (lazer), o que vem dentro do apê e o que o condomínio oferece.
 * Itens repetidos entre as duas listas oficiais aparecem uma vez só.
 */
export type FaixaId = "lazer" | "apartamento" | "condominio";
export interface Faixa {
  id: FaixaId;
  titulo: string;
  itens: string[];
}

const TITULO: Record<FaixaId, string> = { lazer: "Lazer", apartamento: "No apartamento", condominio: "No condomínio" };

const LAZER = /playground|playbaby|quadra|pet|gazebo|piscina|lazer|pra[cç]a|horta|churrasq|gourmet|academia|funcional|jogos|festas|caminhada|piquenique|pomar|brinquedo/i;
const APARTAMENTO = /piso|bancada|tanque|revestimento|ar condicionado|su[ií]te|varanda|cer[aâ]mica|laminado|medi[cç][aã]o|economizador/i;

const chave = (t: string) => t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

export function agruparDestaques(e: Pick<Empreendimento, "lazerItens" | "diferenciais">): Faixa[] {
  const grupos: Record<FaixaId, string[]> = { lazer: [], apartamento: [], condominio: [] };
  const vistos = new Set<string>();
  const por = (id: FaixaId, t: string) => {
    if (vistos.has(chave(t))) return;
    vistos.add(chave(t));
    grupos[id].push(t);
  };
  for (const t of e.lazerItens) por("lazer", t);
  for (const t of e.diferenciais) por(LAZER.test(t) ? "lazer" : APARTAMENTO.test(t) ? "apartamento" : "condominio", t);
  return (Object.keys(grupos) as FaixaId[]).filter((id) => grupos[id].length).map((id) => ({ id, titulo: TITULO[id], itens: grupos[id] }));
}
