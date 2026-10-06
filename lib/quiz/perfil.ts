import type { Destino, PoloId } from "@/lib/types";
import { LAZER_FRASE, POLO_FRASE, type Respostas } from "./types";
import { destinoNome, ehBairro } from "./destino";

const lista = (l: string[]) => (l.length > 1 ? `${l.slice(0, -1).join(", ")} e ${l.at(-1)}` : l[0] ?? "");

/** Uma frase que devolve à pessoa o que ela respondeu, no tom de conversa. */
export function frasePerfil(r: Respostas, destinos: Pick<Destino, "id" | "nome">[] = []): string {
  const partes: string[] = [];
  if (r.destino && r.destino !== "casa") {
    const meio = { onibus: " de ônibus", carro: " de carro", bike: " de bicicleta", app: " de aplicativo" }[r.transporte ?? "onibus"] ?? "";
    if (ehBairro(r.destino)) {
      partes.push(`vai todo dia para ${destinoNome(r.destino, destinos)}${meio}`);
    } else {
      const ate = POLO_FRASE[r.destino as PoloId].replace(/^o /, "ao ").replace(/^a /, "à ").replace(/^Messejana/, "à Messejana");
      partes.push(`vai ${ate}${meio}`);
    }
  } else if (r.destino === "casa") {
    partes.push("trabalha ou estuda de casa");
  }
  if (r.moradores) partes.push({ so: "vai morar só", casal: "vai morar a dois", filhos: "tem crianças em casa" }[r.moradores]);
  const quer = (r.lazer ?? []).map((l) => LAZER_FRASE[l]);
  if (r.pet) quer.push("espaço para o pet");
  if (quer.length) partes.push(`quer ${lista(quer)}`);
  if (r.prazo === "logo") partes.push("tem pressa para se mudar");
  if (!partes.length) return "Estes são os empreendimentos que mais combinam com o que você contou.";
  return `Você ${lista(partes)}.`;
}
