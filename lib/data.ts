import empreendimentosJson from "@/data/empreendimentos.json";
import bairrosJson from "@/data/bairros.json";
import polosJson from "@/data/polos.json";
import regioesJson from "@/data/regioes.json";
import destinosJson from "@/data/destinos.json";
import type { Bairro, Destino, Empreendimento, Polo, Regiao, RegiaoSlug } from "./types";
import type { Dados } from "./scoring/score";

export const empreendimentos = empreendimentosJson as unknown as Empreendimento[];
export const bairros = bairrosJson as unknown as Bairro[];
export const polos = polosJson as unknown as Polo[];
export const regioes = regioesJson as unknown as Regiao[];
export const destinos = destinosJson as unknown as Destino[];

export const empreendimentoPorSlug = (slug: string) => empreendimentos.find((e) => e.slug === slug);
export const regiaoPorSlug = (slug: string) => regioes.find((r) => r.slug === slug);
export const bairroDe = (e: Empreendimento) => (e.bairroId != null ? bairros.find((b) => b.id === e.bairroId) : undefined);
export const daRegiao = (slug: RegiaoSlug) => empreendimentos.filter((e) => e.regiao === slug);

/**
 * Versão enxuta para Client Components (resultado, comparar, explorar): só o que o scoring e o card usam.
 * Galeria, plantas e textos longos ficam no servidor.
 */
export type EmpreendimentoResumo = Omit<Empreendimento, "descricao" | "diferenciais" | "imagens" | "endereco" | "proximoA" | "fonte"> & {
  imagens: { capa: Empreendimento["imagens"]["capa"] };
};

export function resumir(e: Empreendimento): EmpreendimentoResumo {
  return {
    slug: e.slug, ordem: e.ordem, nome: e.nome, linha: e.linha, cidade: e.cidade, bairroNome: e.bairroNome,
    bairroId: e.bairroId, regiao: e.regiao, coord: e.coord, coordAproximada: e.coordAproximada, status: e.status, quartos: e.quartos, suite: e.suite,
    varanda: e.varanda, areaMin: e.areaMin, areaMax: e.areaMax, elevador: e.elevador, unidades: e.unidades,
    vagas: e.vagas, vagasPorUnidade: e.vagasPorUnidade, lazer: e.lazer, lazerItens: e.lazerItens, mcmv: e.mcmv,
    preco: e.preco, faixasMcmv: e.faixasMcmv,
    urlOficial: e.urlOficial, imagens: { capa: e.imagens.capa },
  };
}

export function dadosScoring(): Dados {
  return { empreendimentos, bairros, polos, destinos };
}

export function dadosScoringResumidos() {
  return { empreendimentos: empreendimentos.map(resumir), bairros, polos, destinos };
}

export { STATUS_ROTULO } from "./rotulos";

export function contagensPorRegiao(): Record<RegiaoSlug, number> {
  return Object.fromEntries(regioes.map((r) => [r.slug, daRegiao(r.slug).length])) as Record<RegiaoSlug, number>;
}
