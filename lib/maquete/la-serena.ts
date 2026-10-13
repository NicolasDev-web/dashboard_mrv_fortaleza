import type { Maquete, Torre } from "./tipos";

/** Bloco com duas fileiras de 2 apartamentos e a escada na faixa do meio, como na planta */
const bloco = (nome: string, x1: number, x2: number): Torre => ({
  nome,
  partes: [[x1, 668, x2, 703], [x1, 734, x2, 770]],
  nucleo: [x1 + 10, 703, x2 - 10, 734],
  andares: 5,
});

/**
 * Medido sobre a implantação 05-12 na largura de 1600 px (norte para cima). Cada apartamento tem
 * ~40 × 34 px; com ~42 m² por unidade, ~5,5 px/m. Andares: 240 unidades ÷ 12 blocos ÷ 4 por andar = 5.
 */
const pares: [number, number][] = [[28, 190], [225, 388], [423, 585], [620, 783], [818, 980], [1015, 1178]];

export const laSerena: Maquete = {
  nome: "Residencial La Serena",
  fonte: { imagem: "/img/residencial-la-serena/05-12", largura: 1600 },
  escala: 5.5,
  peDireito: 2.8,
  norte: -22,
  vista: 150,
  lote: [[12, 592], [1442, 592], [1442, 795], [12, 795]],
  interno: [[16, 597], [1437, 597], [1437, 790], [16, 790]],
  ruas: [[1455, 500, 1525, 800]],
  pisos: [
    { tipo: "pavimento", ret: [16, 597, 1437, 662] },
    { tipo: "piso", ret: [1190, 662, 1437, 790] },
    { tipo: "deck", ret: [1268, 728, 1395, 787] },
    { tipo: "playground", ret: [1205, 760, 1245, 783] },
    { tipo: "pista", ret: [16, 775, 1185, 786] },
  ],
  rotularTorres: false,
  torres: pares.flatMap(([a, b], i) => {
    const meio = Math.round((a + b) / 2);
    return [bloco(`Bloco ${String(12 - 2 * i).padStart(2, "0")}`, a, meio), bloco(`Bloco ${String(11 - 2 * i).padStart(2, "0")}`, meio, b)];
  }),
  construcoes: [
    { ret: [1258, 665, 1285, 690], altura: 2.6 }, // casa de máquinas
    { ret: [1370, 668, 1405, 700], altura: 3 }, // apoio administrativo
    { ret: [1416, 600, 1442, 626], altura: 3, placa: true }, // guarita
    { ret: [1355, 598, 1385, 612], altura: 2.4 }, // gás
    { ret: [1415, 745, 1437, 785], altura: 2.8 }, // depósito de lixo
    { ret: [1235, 700, 1260, 745], altura: 3 }, // banheiros
    { ret: [1208, 715, 1233, 745], altura: 3, tipo: "pergolado" }, // churrasqueira
  ],
  piscinas: [
    [[1295, 735], [1362, 735], [1362, 780], [1295, 780]],
    [[1367, 757], [1386, 757], [1386, 778], [1367, 778]],
  ],
  reservatorios: [{ em: [1303, 675], raio: 9, altura: 22, castelo: true }],
  arvores: [
    { em: [1262, 784], tipo: "palmeira", porte: 0.8 }, { em: [1400, 712], tipo: "palmeira", porte: 0.8 }, { em: [1340, 700], tipo: "copa", porte: 0.8 },
    { em: [205, 785], tipo: "copa", porte: 0.7 }, { em: [600, 785], tipo: "copa", porte: 0.7 }, { em: [1000, 785], tipo: "copa", porte: 0.7 },
  ],
  vagas: [{ de: 18, ate: 1330, em: 612, sentido: "h", ocupacao: 0.35 }],
  guardaSois: [[1280, 783], [1385, 735]],
  rotulos: [
    { texto: "12 blocos de 5 andares", em: [600, 718], altura: 18 },
    { texto: "Piscinas", em: [1330, 758] },
    { texto: "Playground", em: [1225, 771], secundario: true },
    { texto: "Castelo d'água", em: [1303, 675], altura: 24, secundario: true },
    { texto: "Portaria", em: [1429, 612], altura: 4 },
  ],
  fachada: { parede: "#e6dfd3", faixa: "#b3a593", paineis: ["#cdbfac", "#efe8dc", "#bfae98"] },
  descricao:
    "Maquete ilustrativa do Residencial La Serena: 12 blocos de 5 andares, sem elevador, em fila ao longo de um lote comprido, com o estacionamento no lado norte. " +
    "O lazer fica na ponta leste, com piscinas, churrasqueira e playground, junto à portaria e ao castelo d'água.",
};
