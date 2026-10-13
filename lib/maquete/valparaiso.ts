import type { Maquete, Torre } from "./tipos";

/** Bloco com duas fileiras de 2 apartamentos e a escada na faixa do meio, como na planta */
const bloco = (nome: string, x1: number, x2: number): Torre => ({
  nome,
  partes: [[x1, 400, x2, 418], [x1, 442, x2, 462]],
  nucleo: [x1 + 7, 418, x2 - 7, 442],
  andares: 5,
});

/**
 * Medido sobre a implantação 15-01 na largura de 1080 px (norte para cima). Cada bloco tem ~53 × 62
 * px; com ~200 m² por pavimento, ~3,7 px/m. Andares: 240 unidades ÷ 12 blocos ÷ 4 por andar = 5.
 */
const pares: [number, number][] = [[99, 206], [226, 333], [353, 460], [483, 587], [610, 714], [737, 841]];

export const valparaiso: Maquete = {
  nome: "Residencial Valparaíso",
  fonte: { imagem: "/img/residencial-valparaiso/15-01", largura: 1080 },
  escala: 3.7,
  peDireito: 2.8,
  vista: 150,
  lote: [[85, 347], [1030, 347], [1030, 486], [85, 486]],
  interno: [[89, 350], [1026, 350], [1026, 482], [89, 482]],
  ruas: [[5, 345, 82, 480], [1045, 340, 1078, 500]],
  pisos: [
    { tipo: "pavimento", ret: [89, 350, 1026, 388] },
    { tipo: "pista", ret: [92, 390, 850, 395] },
    { tipo: "pista", ret: [92, 474, 850, 479] },
    { tipo: "piso", ret: [851, 388, 1026, 482] },
    { tipo: "deck", ret: [895, 415, 1000, 476] },
    { tipo: "playground", ret: [868, 452, 895, 469] },
  ],
  rotularTorres: false,
  torres: pares.flatMap(([a, b], i) => {
    const meio = Math.round((a + b) / 2);
    return [bloco(`Bloco ${String(12 - 2 * i).padStart(2, "0")}`, a, meio), bloco(`Bloco ${String(11 - 2 * i).padStart(2, "0")}`, meio, b)];
  }),
  construcoes: [
    { ret: [868, 415, 901, 445], altura: 3, tipo: "pergolado" }, // churrasqueira
    { ret: [962, 399, 988, 412], altura: 3 }, // administração e refeitório
    { ret: [1002, 352, 1022, 366], altura: 3, placa: true }, // guarita
    { ret: [1002, 442, 1025, 469], altura: 2.8 }, // depósito de lixo
    { ret: [124, 368, 135, 380], altura: 2.6 }, // casa de máquinas
  ],
  piscinas: [
    [[928, 419], [995, 419], [995, 445], [928, 445]],
    [[906, 424], [921, 424], [921, 436], [906, 436]],
  ],
  reservatorios: [
    { em: [975, 362], raio: 7, altura: 22, castelo: true },
    ...([[106, 358], [118, 358], [106, 370], [118, 370]] as [number, number][]).map((em) => ({ em, raio: 5, altura: 3 })),
  ],
  arvores: [
    { em: [1012, 425], tipo: "palmeira", porte: 0.7 }, { em: [905, 470], tipo: "palmeira", porte: 0.7 }, { em: [860, 400], tipo: "copa", porte: 0.7 },
    { em: [95, 400], tipo: "copa", porte: 0.7 }, { em: [95, 470], tipo: "copa", porte: 0.7 }, { em: [470, 480], tipo: "ipe", porte: 0.6 },
  ],
  vagas: [{ de: 139, ate: 855, em: 362, sentido: "h", ocupacao: 0.3 }],
  guardaSois: [[915, 465], [960, 465]],
  rotulos: [
    { texto: "12 blocos de 5 andares", em: [470, 431], altura: 18 },
    { texto: "Piscinas", em: [955, 432] },
    { texto: "Playground", em: [881, 460], secundario: true },
    { texto: "Castelo d'água", em: [975, 362], altura: 24, secundario: true },
    { texto: "Portaria", em: [1012, 359], altura: 4 },
  ],
  fachada: { parede: "#e9e8e4", faixa: "#8b8d8f", paineis: ["#cacbcc", "#dfe0e0", "#b5b7b9"] },
  descricao:
    "Maquete ilustrativa do Residencial Valparaíso: 12 blocos de 5 andares, sem elevador, em fila ao longo de um lote comprido, com a pista de cooper em volta e o estacionamento no lado norte. " +
    "O lazer fica na ponta leste, com piscinas, churrasqueira e playground, junto à portaria e ao castelo d'água.",
};
