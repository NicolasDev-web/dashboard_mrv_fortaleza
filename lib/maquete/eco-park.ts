import type { Maquete, Ponto, Torre } from "./tipos";

/**
 * Coluna com dois blocos de 4 apartamentos por andar, um atrás do outro, com a escada na faixa
 * central (x de `n1` a `n2`). O nome de cima vem primeiro.
 */
const coluna = (nomes: [string, string], x1: number, x2: number, y1: number, y2: number, n1: number, n2: number): Torre[] => {
  const meio = Math.round((y1 + y2) / 2);
  return [
    [nomes[0], y1, meio],
    [nomes[1], meio, y2],
  ].map(([nome, a, b]) => ({
    nome: nome as string,
    partes: [[x1, a as number, n1, b as number], [n2, a as number, x2, b as number]],
    nucleo: [n1, (a as number) + 1, n2, (b as number) - 1],
    andares: 5,
  }));
};

/**
 * Medido sobre a implantação 16-17 na largura de 1080 px (norte para cima). Cada bloco tem ~55 ×
 * 45 px e os carros ~15 px: ~3,4 px/m. Andares: 200 unidades ÷ 10 blocos ÷ 4 por andar = 5.
 */
export const ecoPark: Maquete = {
  nome: "Eco Park",
  fonte: { imagem: "/img/eco-park/16-17", largura: 1080 },
  escala: 3.4,
  peDireito: 2.8,
  vista: 100,
  lote: [[383, 323], [675, 278], [662, 550], [372, 597]],
  interno: [[386, 327], [671, 283], [659, 547], [376, 593]],
  chao: "pavimento",
  ruas: [[[332, 603], [697, 547], [697, 570], [332, 630]] as Ponto[]],
  pisos: [
    { tipo: "grama", ret: [384, 362, 450, 460] },
    { tipo: "grama", ret: [380, 462, 445, 553] },
    { tipo: "grama", ret: [496, 328, 557, 422] },
    { tipo: "grama", ret: [493, 428, 556, 522] },
    { tipo: "grama", ret: [599, 418, 661, 509] },
    { tipo: "piso", ret: [606, 322, 668, 417] },
    { tipo: "deck", ret: [612, 346, 668, 372] },
    { tipo: "playground", ret: [653, 397, 668, 410] },
  ],
  rotularTorres: false,
  torres: [
    ...coluna(["Bloco 04", "Bloco 03"], 390, 445, 367, 455, 410, 427),
    ...coluna(["Bloco 02", "Bloco 01"], 385, 440, 467, 550, 407, 423),
    ...coluna(["Bloco 08", "Bloco 07"], 500, 553, 333, 418, 520, 535),
    ...coluna(["Bloco 06", "Bloco 05"], 497, 552, 433, 518, 517, 533),
    ...coluna(["Bloco 10", "Bloco 09"], 603, 657, 422, 505, 620, 637),
  ],
  construcoes: [
    { ret: [608, 387, 645, 410], altura: 4 }, // salão de festas e gourmet
    { ret: [645, 327, 662, 340], altura: 3, tipo: "pergolado" }, // churrasqueira
    { ret: [663, 293, 674, 307], altura: 2.6 }, // casa de máquinas
    { ret: [447, 572, 462, 586], altura: 3, placa: true }, // guarita
    { ret: [382, 553, 442, 588], altura: 3 }, // apoio, refeitório e depósitos
  ],
  piscinas: [
    [[618, 352], [650, 352], [650, 367], [618, 367]],
    [[655, 355], [667, 355], [667, 365], [655, 365]],
  ],
  reservatorios: [{ em: [653, 300], raio: 6, altura: 22, castelo: true }],
  arvores: [
    { em: [395, 335], tipo: "copa", porte: 0.7 }, { em: [470, 322], tipo: "copa", porte: 0.7 }, { em: [560, 307], tipo: "copa", porte: 0.7 },
    { em: [610, 330], tipo: "palmeira", porte: 0.7 }, { em: [600, 530], tipo: "copa", porte: 0.7 }, { em: [470, 560], tipo: "ipe", porte: 0.6 },
    { em: [612, 375], tipo: "palmeira", porte: 0.6 },
  ],
  vagas: [
    { de: 347, ate: 550, em: 458, sentido: "v", ocupacao: 0.35 },
    { de: 340, ate: 545, em: 488, sentido: "v", ocupacao: 0.35 },
    { de: 330, ate: 520, em: 565, sentido: "v", ocupacao: 0.35 },
    { de: 345, ate: 505, em: 597, sentido: "v", ocupacao: 0.35 },
    { de: 400, ate: 595, em: 323, sentido: "h", ocupacao: 0.3 },
    { de: 588, ate: 655, em: 525, sentido: "h", ocupacao: 0.35 },
    { de: 475, ate: 655, em: 545, sentido: "h", ocupacao: 0.35 },
  ],
  guardaSois: [[622, 349], [645, 371]],
  rotulos: [
    { texto: "10 blocos de 5 andares", em: [520, 430], altura: 18 },
    { texto: "Piscinas", em: [635, 360] },
    { texto: "Salão de festas", em: [626, 398], altura: 5, secundario: true },
    { texto: "Playground", em: [661, 404], secundario: true },
    { texto: "Castelo d'água", em: [653, 300], altura: 24, secundario: true },
    { texto: "Portaria", em: [455, 580], altura: 4 },
  ],
  fachada: { parede: "#efe4d2", faixa: "#b98a63", paineis: ["#e3c9a6", "#c99e78", "#f2e7d6"] },
  descricao:
    "Maquete ilustrativa do Eco Park: 10 blocos de 5 andares, sem elevador, em três colunas, com o estacionamento entre elas. " +
    "O lazer fica no canto nordeste, com piscinas, salão de festas, churrasqueira e playground, e a portaria fica no lado sul, junto à rua.",
};
