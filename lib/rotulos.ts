import type { Empreendimento, RegiaoSlug, TipoImagem } from "./types";

export const STATUS_ROTULO: Record<Empreendimento["status"], string> = {
  lancamento: "Lançamento",
  em_construcao: "Em construção",
  pronto: "Pronto para morar",
};

export const REGIAO_NOME: Record<RegiaoSlug, string> = {
  "oeste-centro": "Oeste e Centro",
  leste: "Leste",
  sul: "Sul",
  caucaia: "Caucaia",
  eusebio: "Eusébio",
};

/** Rótulo curto de cada tipo de foto, para chips sobre a imagem. */
export const TIPO_IMAGEM_ROTULO: Record<TipoImagem, string> = {
  fachada: "Fachada",
  portaria: "Portaria",
  aerea: "Vista aérea",
  implantacao: "Implantação",
  planta: "Planta",
  piscina: "Piscina",
  pet: "Pet place",
  kids: "Espaço kids",
  gourmet: "Gourmet",
  festas: "Festas",
  fitness: "Fitness",
  lazer: "Lazer",
  interno: "Apartamento",
};

const nf = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 2 });
export const m2 = (v: number) => `${nf.format(v)} m²`;

export function areaTexto(e: Pick<Empreendimento, "areaMin" | "areaMax">) {
  if (e.areaMin == null) return null;
  return e.areaMax && e.areaMax - e.areaMin > 0.5 ? `${nf.format(e.areaMin)} a ${m2(e.areaMax)}` : m2(e.areaMin);
}

export function quartosTexto(q: number[]) {
  if (q.length > 1) return `${q.join(" ou ")} quartos`;
  return q[0] === 1 ? "1 quarto" : `${q[0]} quartos`;
}

export function vagaTexto(v: number) {
  if (v >= 1) return "1 vaga por apto.";
  return `Vagas para ${Math.round(v * 100)}%`;
}
