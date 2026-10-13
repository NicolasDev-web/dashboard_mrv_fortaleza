import type { Maquete, Torre } from "./tipos";

/** Bloco de 4 apartamentos por andar com a escada e o poço de luz no meio */
const bloco = (nome: string, x: number, y1: number, y2: number): Torre => ({
  nome,
  partes: [[x, y1, x + 32, y2], [x + 68, y1, x + 100, y2]],
  nucleo: [x + 32, y1 + 3, x + 68, y2 - 3],
  andares: 5,
});

/**
 * Medido sobre a implantação 10-16 na largura de 1600 px (norte para cima). Cada bloco tem ~100 ×
 * 73 px; com ~200 m² por pavimento, ~6 px/m. Andares: 320 unidades ÷ 16 blocos ÷ 4 por andar = 5.
 */
export const villeDePorto: Maquete = {
  nome: "Ville de Porto",
  fonte: { imagem: "/img/ville-de-porto/10-16", largura: 1600 },
  escala: 6,
  peDireito: 2.8,
  norte: -7,
  vista: 30,
  lote: [[265, 435], [1410, 435], [1410, 800], [265, 800]],
  interno: [[285, 452], [1390, 452], [1390, 785], [285, 785]],
  ruas: [[225, 395, 1450, 435], [225, 800, 1450, 830], [225, 395, 265, 830], [1410, 395, 1450, 830]],
  pisos: [
    { tipo: "pavimento", ret: [365, 452, 1165, 590] },
    { tipo: "piso", ret: [1165, 452, 1390, 600] },
    { tipo: "deck", ret: [1190, 455, 1342, 525] },
    { tipo: "playground", ret: [1215, 545, 1255, 562] },
    { tipo: "pista", ret: [375, 595, 1375, 602] },
    { tipo: "pista", ret: [375, 772, 1375, 780] },
    { tipo: "pista", ret: [375, 595, 383, 780] },
    { tipo: "pista", ret: [1368, 595, 1375, 780] },
  ],
  rotularTorres: false,
  torres: [390, 515, 642, 767, 893, 1018, 1145, 1270].flatMap((x, i) => [
    bloco(`Bloco ${String(2 * i + 1).padStart(2, "0")}`, x, 615, 688),
    bloco(`Bloco ${String(2 * i + 2).padStart(2, "0")}`, x, 688, 762),
  ]),
  construcoes: [
    { ret: [590, 450, 625, 485], altura: 2.8 }, // depósito de lixo
    { ret: [760, 452, 785, 476], altura: 3, placa: true }, // guarita
    { ret: [870, 470, 945, 490], altura: 3 }, // apoio administrativo
    { ret: [1080, 470, 1105, 492], altura: 2.6 }, // casa de máquinas
    { ret: [1285, 535, 1315, 550], altura: 3 }, // vestiários
    { ret: [1165, 540, 1212, 555], altura: 2.8 }, // espaço market
    { ret: [1275, 555, 1325, 580], altura: 3, tipo: "pergolado" }, // churrasqueira
  ],
  piscinas: [
    [[1240, 460], [1330, 460], [1330, 505], [1240, 505]],
    [[1205, 475], [1235, 475], [1235, 505], [1205, 505]],
  ],
  reservatorios: [975, 997, 1022, 1047, 1071].map((x) => ({ em: [x, 480] as [number, number], raio: 12, altura: 3 })),
  arvores: [
    { em: [390, 460], tipo: "copa", porte: 0.8 }, { em: [525, 460], tipo: "copa", porte: 0.8 }, { em: [1055, 455], tipo: "copa", porte: 0.8 },
    { em: [1180, 520], tipo: "palmeira", porte: 0.8 }, { em: [1350, 470], tipo: "palmeira", porte: 0.8 }, { em: [310, 520], tipo: "copa" },
    { em: [310, 640], tipo: "copa" }, { em: [315, 760], tipo: "ipe", porte: 0.9 }, { em: [1385, 620], tipo: "copa", porte: 0.8 },
  ],
  vagas: [
    { de: 365, ate: 1125, em: 510, sentido: "h", ocupacao: 0.3 },
    { de: 365, ate: 1165, em: 562, sentido: "h", ocupacao: 0.35 },
  ],
  guardaSois: [[1200, 515], [1340, 470], [1340, 500]],
  rotulos: [
    { texto: "16 blocos de 5 andares", em: [830, 690], altura: 18 },
    { texto: "Piscinas", em: [1270, 483] },
    { texto: "Playground", em: [1235, 553], secundario: true },
    { texto: "Reservatórios", em: [1022, 480], altura: 4, secundario: true },
    { texto: "Portaria", em: [772, 464], altura: 4 },
  ],
  fachada: { parede: "#dfd9cf", faixa: "#a39a8d", paineis: ["#c4baab", "#eae5dc", "#b3a898"] },
  descricao:
    "Maquete ilustrativa do Ville de Porto: 16 blocos de 5 andares, sem elevador, em oito pares lado a lado, com uma pista de caminhada em volta. " +
    "O estacionamento fica no lado norte, junto à portaria, e o lazer no canto nordeste, com piscinas, churrasqueira e playground.",
};
