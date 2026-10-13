import type { Maquete, Torre } from "./tipos";

/** Bloco de 4 apartamentos por andar com a escada no meio, como desenhado na planta */
const bloco = (nome: string, cx: number, y1: number, y2: number): Torre => ({
  nome,
  partes: [[cx - 50, y1, cx - 12, y2], [cx + 12, y1, cx + 50, y2]],
  nucleo: [cx - 12, y1 + 2, cx + 12, y2 - 2],
  andares: 5,
});

/**
 * Medido sobre a implantação 03-19 na largura de 1600 px (norte para cima). Cada bloco tem ~100 ×
 * 78 px; com ~200 m² por pavimento (4 apartamentos e a escada), a escala fica em ~6 px/m. Andares:
 * 300 unidades ÷ 15 blocos ÷ 4 por andar = 5.
 */
export const villeDeLisboa: Maquete = {
  nome: "Ville de Lisboa",
  fonte: { imagem: "/img/ville-de-lisboa/03-19", largura: 1600 },
  escala: 6,
  peDireito: 2.8,
  vista: 165,
  lote: [[260, 465], [1385, 465], [1385, 840], [260, 840]],
  interno: [[298, 480], [1310, 480], [1310, 815], [298, 815]],
  ruas: [[190, 420, 1415, 465], [190, 840, 1415, 890], [190, 420, 260, 890], [1385, 420, 1415, 890]],
  pisos: [
    { tipo: "pavimento", ret: [305, 665, 1130, 750] },
    { tipo: "piso", ret: [305, 750, 1310, 815] },
    { tipo: "piso", ret: [1130, 660, 1310, 750] },
    { tipo: "deck", ret: [1150, 745, 1288, 808] },
    { tipo: "playground", ret: [1060, 775, 1125, 800] },
    { tipo: "pista", ret: [400, 482, 920, 490] },
  ],
  rotularTorres: false,
  torres: [
    bloco("Bloco 01", 368, 572, 650),
    ...[490, 612, 735, 858, 982, 1105, 1228].flatMap((cx, i) => [
      bloco(`Bloco ${String(2 * i + 3).padStart(2, "0")}`, cx, 493, 572),
      bloco(`Bloco ${String(2 * i + 2).padStart(2, "0")}`, cx, 572, 650),
    ]),
  ],
  construcoes: [
    { ret: [470, 768, 555, 790], altura: 3 }, // apoio administrativo
    { ret: [575, 788, 625, 808], altura: 2.8 }, // depósito de lixo
    { ret: [852, 770, 882, 795], altura: 3, placa: true }, // guarita
    { ret: [905, 781, 940, 799], altura: 2.8 }, // market
    { ret: [950, 770, 985, 795], altura: 3, tipo: "pergolado" }, // praça de convivência
    { ret: [1010, 770, 1045, 795], altura: 3, tipo: "pergolado" },
    { ret: [1240, 680, 1265, 702], altura: 3, tipo: "pergolado" }, // churrasqueiras
    { ret: [1280, 680, 1305, 702], altura: 3, tipo: "pergolado" },
    { ret: [1100, 718, 1125, 742], altura: 3, tipo: "pergolado" }, // happy hour
  ],
  piscinas: [
    [[1160, 755], [1248, 755], [1248, 800], [1160, 800]],
    [[1260, 757], [1280, 757], [1280, 798], [1260, 798]],
  ],
  reservatorios: [365, 388, 410, 432, 454].map((x) => ({ em: [x, 783] as [number, number], raio: 10, altura: 3 })),
  arvores: [
    { em: [380, 525], tipo: "copa" }, { em: [410, 518], tipo: "copa", porte: 0.8 }, { em: [1210, 668], tipo: "copa" },
    { em: [570, 770], tipo: "copa", porte: 0.8 }, { em: [685, 772], tipo: "copa", porte: 0.8 }, { em: [780, 775], tipo: "ipe", porte: 0.8 },
    { em: [1135, 785], tipo: "palmeira", porte: 0.8 }, { em: [1295, 740], tipo: "palmeira", porte: 0.8 }, { em: [320, 790], tipo: "copa", porte: 0.8 },
    { em: [1040, 700], tipo: "copa", porte: 0.8 },
  ],
  vagas: [
    { de: 345, ate: 850, em: 683, sentido: "h", ocupacao: 0.4 },
    { de: 870, ate: 1130, em: 683, sentido: "h", ocupacao: 0.4 },
    { de: 315, ate: 850, em: 731, sentido: "h", ocupacao: 0.4 },
    { de: 870, ate: 1130, em: 731, sentido: "h", ocupacao: 0.4 },
  ],
  guardaSois: [[1170, 750], [1200, 805], [1235, 805]],
  rotulos: [
    { texto: "15 blocos de 5 andares", em: [800, 572], altura: 18 },
    { texto: "Piscinas", em: [1205, 778] },
    { texto: "Playground", em: [1092, 788], secundario: true },
    { texto: "Churrasqueiras", em: [1272, 690], altura: 4, secundario: true },
    { texto: "Reservatórios", em: [410, 783], altura: 4, secundario: true },
    { texto: "Portaria", em: [867, 782], altura: 4 },
  ],
  fachada: { parede: "#e6e4df", faixa: "#a7a39c", paineis: ["#cfccc5", "#bdb9b1", "#e9e7e2"] },
  descricao:
    "Maquete ilustrativa do Ville de Lisboa: 15 blocos de 5 andares, sem elevador, enfileirados no lado norte do lote. " +
    "O estacionamento fica no meio e o lazer ao sul, com piscinas, playground e churrasqueiras no canto sudeste. A portaria fica no meio do lado sul.",
};
