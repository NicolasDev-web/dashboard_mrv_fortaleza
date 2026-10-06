import type { NotaBairro, RegiaoSlug } from "@/lib/types";
import { recomendar, type Dados } from "@/lib/scoring/score";
import { FAIXAS } from "@/lib/scoring/config";
import { LAZER_FRASE, type Respostas } from "./types";
import { destinoDe, destinoNome, ehBairro, idBairro } from "./destino";
import type { Pergunta } from "./questions";

/** O que o mapa do quiz mostra depois de cada resposta: brilho dos bairros, força dos pinos e a frase que explica. */
export interface EstadoMapa {
  /** brilho por bairro (id da malha), 0 a 1 */
  brilho: Record<number, number>;
  vizinhos: { caucaia: number; eusebio: number };
  /** por slug: força do pino (0 a 1) e se saiu do filtro */
  pinos: Record<string, { intensidade: number; apagado: boolean }>;
  destino?: { lat: number; lon: number; rotulo: string };
  /** quantos ainda combinam (nota ≥ "Combina bem") e de quantos */
  combinam: number;
  total: number;
  frase: string;
}

const NOTA_BEM = FAIXAS[1].min;
const TEMA: Record<NotaBairro, string> = {
  saude: "saúde por perto",
  escolas: "escolas",
  comercio: "comércio do dia a dia",
  lazer: "praças e parques",
  mobilidade: "ônibus fácil",
};

function distanciaKm(a: { lat: number; lon: number }, b: { lat: number; lon: number }) {
  const r = Math.PI / 180;
  const h = Math.sin(((b.lat - a.lat) * r) / 2) ** 2 + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(((b.lon - a.lon) * r) / 2) ** 2;
  return 12742 * Math.asin(Math.sqrt(h));
}

const lista = (l: string[]) => (l.length > 1 ? `${l.slice(0, -1).join(", ")} e ${l.at(-1)}` : l[0] ?? "");

/** Frase curta sobre a última resposta: o cliente entende por que o mapa mudou. */
function fraseDa(pergunta: Pergunta["id"] | undefined, r: Respostas, dados: Dados): string {
  switch (pergunta) {
    case "onde":
      if (r.onde === "fortaleza") return "Só Fortaleza: Caucaia e Eusébio saíram do mapa.";
      if (r.onde === "regioes") return r.regioes?.length ? "Ficaram só as regiões que você escolheu." : "Escolha as regiões que topa.";
      return "Fortaleza, Caucaia e Eusébio: tudo no jogo.";
    case "destino":
      if (!r.destino) return "Escolha para onde você vai todo dia.";
      if (r.destino === "casa") return "Sem deslocamento diário: o lugar pesa menos.";
      return `Acendem os bairros perto ${destinoDe(r.destino, dados.destinos)}.`;
    case "transporte":
      if (r.transporte === "carro") return "Crescem os que têm mais vaga de garagem.";
      if (r.transporte === "onibus") return "Pesa o tempo de ônibus até o seu destino.";
      return "Anotado. O tempo até o seu destino continua valendo.";
    case "moradores":
      if (r.moradores === "filhos") return "Playground e escolas por perto contam mais.";
      if (r.moradores === "casal") return "Opções com suíte contam mais.";
      return "Anotado: apartamento para uma pessoa.";
    case "lazer":
      return r.lazer?.length ? `Crescem os que têm ${lista(r.lazer.map((l) => LAZER_FRASE[l]))}.` : "Lazer não vai pesar na escolha.";
    case "bairro":
      return r.bairro?.length ? `Crescem os bairros com ${lista(r.bairro.map((b) => TEMA[b]))}.` : "O entorno não vai pesar na escolha.";
    case "prazo":
      if (r.prazo === "logo") return "Sobem os que já estão em construção.";
      return "Prazo anotado.";
    default:
      return "Os 16 empreendimentos MRV da Grande Fortaleza.";
  }
}

export function estadoDoMapa(r: Respostas, dados: Dados, ultima?: Pergunta["id"]): EstadoMapa {
  const { ranking } = recomendar(r, dados);
  const nota = new Map(ranking.map((x) => [x.slug, x.score]));
  const temCriterio = ranking.some((x) => x.criterios.some((c) => c.peso > 0));
  const total = dados.empreendimentos.length;

  const pinos: EstadoMapa["pinos"] = {};
  for (const e of dados.empreendimentos) {
    const s = nota.get(e.slug);
    pinos[e.slug] = s == null ? { intensidade: 0, apagado: true } : { intensidade: temCriterio ? Math.max(0.15, Math.min(1, (s - 40) / 50)) : 1, apagado: false };
  }

  // Destino: ponto no mapa para o alvo e para o brilho por proximidade.
  let destino: EstadoMapa["destino"];
  if (r.destino && r.destino !== "casa") {
    const alvo = ehBairro(r.destino) ? dados.destinos.find((d) => d.id === idBairro(r.destino as `b${number}`)) : dados.polos.find((p) => p.id === r.destino);
    if (alvo) destino = { lat: alvo.lat, lon: alvo.lon, rotulo: destinoNome(r.destino, dados.destinos) };
  }

  const regioesOk = (reg: RegiaoSlug) => r.onde !== "regioes" || !r.regioes?.length || r.regioes.includes(reg);
  const melhorPorBairro = new Map<number, number>();
  for (const e of dados.empreendimentos) {
    const s = nota.get(e.slug);
    if (e.bairroId != null && s != null) melhorPorBairro.set(e.bairroId, Math.max(melhorPorBairro.get(e.bairroId) ?? 0, s));
  }
  const comMrv = new Set(dados.empreendimentos.map((e) => e.bairroId).filter((id): id is number => id != null));

  const brilho: Record<number, number> = {};
  for (const d of dados.destinos) {
    if (!regioesOk(d.regiao)) { brilho[d.id] = 0.08; continue; }
    let b = 0.3;
    if (destino) b += 0.55 * Math.max(0, 1 - distanciaKm(d, destino) / 8);
    if (comMrv.has(d.id)) {
      const s = melhorPorBairro.get(d.id);
      b = s == null ? 0.12 : Math.max(b, temCriterio ? 0.35 + (0.6 * s) / 100 : 0.85);
    }
    brilho[d.id] = Math.min(1, b);
  }

  const foraOk = (reg: RegiaoSlug) => r.onde !== "fortaleza" && regioesOk(reg);
  return {
    brilho,
    vizinhos: { caucaia: foraOk("caucaia") ? 0.2 : 0.04, eusebio: foraOk("eusebio") ? 0.2 : 0.04 },
    pinos,
    destino,
    combinam: temCriterio ? ranking.filter((x) => x.score >= NOTA_BEM).length : ranking.length,
    total,
    frase: fraseDa(ultima, r, dados),
  };
}
