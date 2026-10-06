import type { DestinoId, Lazer, NotaBairro, PoloId, RegiaoSlug } from "@/lib/types";

export type Onde = "fortaleza" | "metropolitana" | "regioes";
export type Transporte = "onibus" | "carro" | "bike" | "app";
export type Moradores = "so" | "casal" | "filhos";
export type Prazo = "logo" | "medio" | "tanto_faz";
export type LazerEscolhivel = Exclude<Lazer, "pet">;

export interface Respostas {
  onde?: Onde;
  regioes?: RegiaoSlug[];
  destino?: DestinoId | "casa";
  transporte?: Transporte;
  moradores?: Moradores;
  pet?: boolean;
  lazer?: LazerEscolhivel[];
  bairro?: NotaBairro[];
  prazo?: Prazo;
}

/** Artigo + nome curto, para frases como "até a Unifor" ou "até o Centro". */
export const POLO_FRASE: Record<PoloId, string> = {
  centro: "o Centro",
  beira_mar: "a Beira-Mar",
  aldeota: "a Aldeota",
  papicu: "o Papicu",
  iguatemi: "o Iguatemi",
  unifor: "a Unifor",
  centro_eventos: "o Centro de Eventos",
  parangaba: "a Parangaba",
  messejana: "Messejana",
  ufc_benfica: "a UFC Benfica",
  ufc_pici: "a UFC Pici",
  aeroporto: "o Aeroporto",
};

export const LAZER_FRASE: Record<Lazer, string> = {
  piscina: "piscina",
  academia: "academia",
  kids: "playground",
  festas: "espaço de festas e churrasco",
  esportes: "quadra ou salão de jogos",
  verde: "área verde para caminhar",
  pet: "pet place",
};

export const NOTA_FRASE: Record<NotaBairro, string> = {
  saude: "hospitais e postos de saúde por perto",
  escolas: "escolas por perto",
  comercio: "comércio do dia a dia",
  lazer: "praças, parques e lazer",
  mobilidade: "opções de ônibus e metrô",
};
