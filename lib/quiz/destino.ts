import type { Destino, DestinoId, PoloId } from "@/lib/types";
import { POLO_FRASE } from "./types";

export const ehBairro = (d: string): d is `b${number}` => /^b\d{1,3}$/.test(d);
export const idBairro = (d: `b${number}`) => Number(d.slice(1));

/** Nome curto do destino, para chips e listas: "Unifor", "Meireles". */
export function destinoNome(d: DestinoId, destinos: Pick<Destino, "id" | "nome">[]): string {
  if (ehBairro(d)) return destinos.find((x) => x.id === idBairro(d))?.nome ?? "seu destino";
  return POLO_FRASE[d as PoloId].replace(/^(o|a) /, "");
}

/** Para frases como "até a Unifor" ou "até Meireles" (bairros sem artigo, que varia de nome para nome). */
export function destinoAte(d: DestinoId, destinos: Pick<Destino, "id" | "nome">[]): string {
  return ehBairro(d) ? destinoNome(d, destinos) : POLO_FRASE[d as PoloId];
}

/** "perto da Unifor", "perto do Centro", "perto de Messejana", "perto de Meireles". */
export function destinoDe(d: DestinoId, destinos: Pick<Destino, "id" | "nome">[]): string {
  if (ehBairro(d)) return `de ${destinoNome(d, destinos)}`;
  return POLO_FRASE[d as PoloId].replace(/^a /, "da ").replace(/^o /, "do ").replace(/^(?!d[ao] )/, "de ");
}
