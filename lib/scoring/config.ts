/**
 * Todos os pesos e limiares do scoring ficam aqui. Mudou um número? Rode `npm test`:
 * os perfis de referência em tests/scoring.test.ts mostram o efeito no ranking.
 */
export const PESOS = {
  deslocamento: 4,
  vaga: 2.5,
  mobilidade: 1.5, // só sem destino fixo: com destino, o tempo de ônibus já mede isso
  lazer: 2,
  bairro: 1.5, // cada tema escolhido na pergunta 6
  filhos: 1,
  casal: 1,
  prazoLogo: 1.5,
  prazoMedio: 0.5,
} as const;

/** Deslocamento: nota 100 até `ideal` minutos, cai em linha reta até 0 em `limite`. */
export const TEMPO = { ideal: 20, limite: 80 } as const;

/**
 * Caucaia e Eusébio não têm tempo de ônibus calculado. Estimativa pela distância em linha reta,
 * ajustada nos 13 empreendimentos de Fortaleza (144 pares empreendimento–polo): t ≈ 23 + 4,49 × km,
 * erro típico de 11 min. A tela sempre diz "estimativa" quando usa isto.
 */
export const ESTIMATIVA_TEMPO = { base: 23, porKm: 4.49 } as const;

/** Quem vai de carro e cai num empreendimento com menos vagas que isso por unidade leva a penalidade. */
export const VAGA = { minimo: 0.5, penalidade: 0.85 } as const;

export const PRAZO = {
  logo: { em_construcao: 100, pronto: 100, lancamento: 40 },
  medio: { em_construcao: 100, pronto: 100, lancamento: 80 },
} as const;

export const SUITE = { com: 100, sem: 40 } as const;

/** Um critério vira motivo a partir desta nota. */
export const LIMIAR_MOTIVO = 70;
/** Abaixo disto, o deslocamento vira ponto de atenção. */
export const LIMIAR_ATENCAO = 30;

/** Faixas do selo de compatibilidade. */
export const FAIXAS = [
  { min: 75, rotulo: "Combina muito" },
  { min: 60, rotulo: "Combina bem" },
  { min: 0, rotulo: "Vale conhecer" },
] as const;

/** Diversidade: no top 5, um segundo empreendimento do mesmo bairro só entra se estiver tantos pontos acima do próximo. */
export const DIVERSIDADE_FOLGA = 5;

/** Tamanho do pódio do resultado: o 1º em filme e do 2º ao 5º em lista. */
export const TOP = 5;
