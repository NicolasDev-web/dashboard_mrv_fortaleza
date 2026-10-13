import type { Maquete, Torre } from "./tipos";

/** Torre de 8 apartamentos por andar: corpo central e as duas pontas um pouco mais largas */
const torre = (nome: string, x1: number, x2: number): Torre => ({
  nome,
  partes: [[x1 + 15, 92, x2 - 13, 135], [x1, 87, x1 + 27, 140], [x2 - 26, 87, x2, 140]],
  nucleo: [(x1 + x2) / 2 - 9, 90, (x1 + x2) / 2 + 11, 137],
  andares: 17,
});

/**
 * Medido sobre a implantação 09-15 na largura de 1080 px (norte para cima). Torres de 8 apartamentos
 * por andar com ~127 px de comprimento (~41 m) e carros de ~12 px: ~3 px/m. Andares: 264 unidades ÷
 * 2 torres ÷ 8 por andar ≈ 17. O edifício-garagem tem 4 pavimentos, como nas plantas ao lado.
 */
export const sensiaVilaDoSol: Maquete = {
  nome: "Sensia Reserva Vila do Sol",
  fonte: { imagem: "/img/sensia-reserva-vila-do-sol/09-15", largura: 1080 },
  escala: 3,
  peDireito: 2.85,
  vista: 200,
  lote: [[255, 60], [937, 60], [937, 153], [454, 153], [454, 304], [270, 304], [220, 292], [184, 258], [163, 205], [160, 96], [255, 90]],
  interno: [[258, 64], [933, 64], [933, 149], [450, 149], [450, 300], [272, 300], [224, 288], [189, 255], [168, 204], [165, 100], [258, 94]],
  ruas: [[190, 15, 940, 58], [140, 60, 158, 310]],
  pisos: [
    { tipo: "pavimento", ret: [268, 105, 452, 300] },
    { tipo: "deck", ret: [655, 106, 730, 146] },
    { tipo: "playground", ret: [615, 105, 655, 145] },
    { tipo: "piso", ret: [660, 78, 750, 106] },
  ],
  torres: [torre("Torre 1", 475, 602), torre("Torre 2", 767, 895)],
  construcoes: [
    { ret: [268, 140, 452, 268], altura: 12, tipo: "garagem" }, // edifício-garagem
    { ret: [330, 82, 400, 105], altura: 4, placa: true }, // lobby e guarita
    { ret: [402, 90, 450, 138], altura: 3.5 }, // administração e apoio
    { ret: [665, 80, 745, 97], altura: 4 }, // salão de festas, gourmet e academia
    { ret: [722, 107, 745, 145], altura: 3 }, // vestiários
  ],
  piscinas: [
    [[670, 128], [722, 128], [722, 142], [670, 142]],
    [[690, 113], [712, 113], [712, 124], [690, 124]],
  ],
  reservatorios: [{ em: [927, 145], raio: 5, altura: 22, castelo: true }],
  arvores: [
    ...[480, 500, 520, 570, 590].map((x) => ({ em: [x, 70] as [number, number], tipo: "ipe" as const, porte: 0.7 })),
    ...([[287, 190], [287, 220], [287, 250], [305, 275], [325, 290], [350, 292], [375, 292], [400, 292], [425, 292]] as [number, number][]).map((em) => ({
      em,
      tipo: "ipe" as const,
      porte: 0.7,
    })),
    { em: [912, 100], tipo: "ipe", porte: 0.7 }, { em: [912, 125], tipo: "ipe", porte: 0.7 },
    { em: [640, 150], tipo: "palmeira", porte: 0.7 }, { em: [700, 150], tipo: "palmeira", porte: 0.7 }, { em: [755, 150], tipo: "palmeira", porte: 0.7 },
  ],
  vagas: [{ de: 325, ate: 425, em: 280, sentido: "h", ocupacao: 0.5 }],
  guardaSois: [[662, 118], [728, 136]],
  rotulos: [
    { texto: "Piscinas", em: [695, 135] },
    { texto: "Salão de festas", em: [705, 88], altura: 5, secundario: true },
    { texto: "Playground", em: [635, 125], secundario: true },
    { texto: "Edifício-garagem", em: [360, 200], altura: 14 },
    { texto: "Portaria", em: [365, 93], altura: 5 },
    { texto: "Castelo d'água", em: [927, 145], altura: 24, secundario: true },
  ],
  fachada: { parede: "#e8e6e1", faixa: "#5d5a55", paineis: ["#bfbab2", "#d9d5ce", "#a29d95"] },
  descricao:
    "Maquete ilustrativa do Sensia Reserva Vila do Sol: duas torres de 17 andares numa faixa comprida ao longo da rua, com o lazer entre elas, onde ficam as piscinas, o salão de festas e o playground. " +
    "No lado oeste fica o edifício-garagem de quatro pavimentos, com a portaria na frente.",
};
