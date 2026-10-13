import type { Maquete, Torre } from "./tipos";

/** Torre de 8 apartamentos por andar: pontas avançadas e o meio um pouco recuado, como na planta */
const torre = (nome: string, x1: number, x2: number): Torre => {
  const meio = (x1 + x2) / 2;
  return {
    nome,
    partes: [[x1, 222, x1 + 60, 300], [x2 - 62, 222, x2, 300], [x1 + 60, 228, x2 - 62, 295]],
    nucleo: [meio - 12, 231, meio + 13, 292],
    andares: 17,
  };
};

/**
 * Medido sobre a implantação 14-22 na largura de 1080 px (norte para cima). Torres de ~255 × 78 px e
 * carros de ~24 px: ~5,4 px/m, torres de ~47 × 14 m. Andares: 272 unidades ÷ 2 torres ÷ 8 por andar = 17.
 */
export const brisaDoMar: Maquete = {
  nome: "Reserva Brisa do Mar",
  fonte: { imagem: "/img/reserva-brisa-do-mar/14-22", largura: 1080 },
  escala: 5.4,
  peDireito: 2.85,
  vista: 220,
  lote: [[5, 28], [1045, 28], [1045, 345], [5, 345]],
  interno: [[8, 31], [1042, 31], [1042, 338], [8, 338]],
  chao: "pavimento",
  ruas: [[0, 350, 1080, 382], [1048, 20, 1080, 382]],
  pisos: [
    { tipo: "grama", ret: [8, 300, 1042, 338] },
    { tipo: "grama", ret: [345, 214, 1042, 300] },
    { tipo: "piso", ret: [95, 214, 345, 300] },
    { tipo: "deck", ret: [212, 220, 312, 312] },
    { tipo: "playground", ret: [151, 217, 202, 243] },
  ],
  torres: [torre("Torre 2", 370, 625), torre("Torre 1", 702, 957)],
  construcoes: [
    { ret: [108, 267, 202, 317], altura: 4 }, // salão de festas, gourmet e sanitários
    { ret: [212, 219, 226, 231], altura: 2.6 }, // casa de máquinas
    { ret: [998, 205, 1038, 220], altura: 2.8 }, // depósito de lixo
    { ret: [981, 237, 1008, 314], altura: 3 }, // administração, refeitório e vestiários
    { ret: [1025, 250, 1038, 305], altura: 2.4 }, // gás
    { ret: [988, 143, 1015, 160], altura: 3, placa: true }, // guarita
    { ret: [955, 60, 975, 76], altura: 2.6 }, // casa de bombas
    { ret: [665, 227, 680, 240], altura: 2.6 }, // apoio PCD
  ],
  piscinas: [
    [[230, 252], [292, 252], [292, 278], [230, 278]],
    [[262, 281], [292, 281], [292, 296], [262, 296]],
  ],
  reservatorios: [{ em: [995, 69], raio: 12, altura: 24, castelo: true }],
  arvores: [
    ...[57, 124, 181, 242, 306, 373, 437, 504, 568, 625, 689, 753, 833, 894, 954, 1015].map((x, i) => ({
      em: [x, 334] as [number, number],
      tipo: (i % 3 === 1 ? "ipe" : "copa") as "ipe" | "copa",
      porte: 0.8,
    })),
    { em: [333, 230], tipo: "palmeira", porte: 0.8 }, { em: [333, 262], tipo: "palmeira", porte: 0.8 }, { em: [333, 292], tipo: "palmeira", porte: 0.8 },
  ],
  vagas: [
    { de: 74, ate: 920, em: 100, sentido: "h", ocupacao: 0.35 },
    { de: 74, ate: 920, em: 130, sentido: "h", ocupacao: 0.35 },
    { de: 74, ate: 940, em: 193, sentido: "h", ocupacao: 0.35 },
    { de: 59, ate: 320, em: 22, sentido: "v", ocupacao: 0.35 },
    { de: 180, ate: 320, em: 85, sentido: "v", ocupacao: 0.35 },
  ],
  guardaSois: [[222, 240], [300, 240], [222, 300]],
  rotulos: [
    { texto: "Piscinas", em: [261, 265] },
    { texto: "Salão de festas", em: [155, 292], altura: 5, secundario: true },
    { texto: "Playground", em: [176, 230], secundario: true },
    { texto: "Castelo d'água", em: [995, 69], altura: 26, secundario: true },
    { texto: "Portaria", em: [1001, 152], altura: 4 },
  ],
  fachada: { parede: "#ece7dc", faixa: "#a99a80", paineis: ["#d0c3ab", "#9db3c9", "#e6dccb"] },
  descricao:
    "Maquete ilustrativa do Reserva Brisa do Mar: duas torres de 17 andares no lado sul do lote, com o estacionamento ao norte. " +
    "O lazer fica no lado oeste, com piscinas, salão de festas, gourmet e playground. A portaria e o castelo d'água ficam no lado leste.",
};
