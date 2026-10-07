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
  orcamento: 5, // o que mais pesa: não adianta combinar com a rotina e não caber no bolso
} as const;

/**
 * Orçamento: quanto a pessoa consegue pagar = financiamento (parcela de até 30% da renda, tabela Price)
 * + subsídio (só nas faixas 1 e 2, quando o imóvel atende a faixa da pessoa) + entrada.
 * Valores de referência do MCMV; não substituem a simulação da Caixa, só ordenam as sugestões.
 */
export const FINANCIAMENTO = {
  comprometimento: 0.3,
  meses: 420,
  /** juros ao ano quando o imóvel não atende a faixa da pessoa (ou ela está acima do MCMV) */
  jurosForaMcmv: 0.115,
  faixas: {
    1: { juros: 0.0425, subsidio: 45_000 },
    2: { juros: 0.06, subsidio: 15_000 },
    3: { juros: 0.0766, subsidio: 0 },
    4: { juros: 0.1, subsidio: 0 },
  },
} as const;

/** Valor usado na conta para cada faixa de renda do quiz (perto do topo da faixa) e a faixa MCMV correspondente. */
export const RENDA = {
  r1: { mensal: 2_600, faixa: 1 },
  r2: { mensal: 4_200, faixa: 2 },
  r3: { mensal: 7_500, faixa: 3 },
  r4: { mensal: 11_000, faixa: 4 },
  r5: { mensal: 15_000, faixa: null },
} as const;

/** Valor usado na conta para cada faixa de entrada do quiz (conservador: perto do piso da faixa). */
export const ENTRADA = { e0: 0, e1: 8_000, e2: 20_000, e3: 45_000, e4: 70_000 } as const;

/**
 * Poder de compra ÷ preço. A partir de 1 cabe (nota 100); entre `limite` e 1 está no limite;
 * abaixo de `limite` fica fora do orçamento. A nota cai até 0 em `piso`.
 * Quem está no limite ou fora leva a penalidade e o ranking põe quem está fora no fim.
 */
export const ORCAMENTO = { limite: 0.85, piso: 0.7, penalidadeLimite: 0.92, penalidadeFora: 0.6 } as const;

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
