import type { Maquete } from "./tipos";

/**
 * Medido sobre a implantação 06-05 na largura de 1600 px (norte para cima). Torres de ~265 × 65 px e
 * carros de ~20 px de comprimento: ~4,4 px/m, torres de ~60 × 15 m. Andares: 492 unidades ÷ 3 torres
 * ÷ 12 por andar ≈ 14.
 */
export const forteAlencar: Maquete = {
  nome: "Forte Alencar",
  fonte: { imagem: "/img/forte-alencar/06-05", largura: 1600 },
  escala: 4.4,
  peDireito: 2.85,
  norte: -8,
  vista: 320,
  lote: [[66, 498], [912, 256], [842, 826], [66, 826]],
  interno: [[78, 500], [900, 272], [832, 815], [78, 815]],
  ruas: [
    [20, 380, 52, 890],
    [[20, 440], [930, 200], [935, 248], [52, 492]],
    [[925, 205], [995, 205], [892, 890], [848, 890]],
  ],
  pisos: [
    { tipo: "pavimento", ret: [80, 520, 832, 813] },
    { tipo: "pavimento", ret: [480, 378, 880, 445] },
    { tipo: "grama", ret: [480, 440, 762, 525] },
    { tipo: "grama", ret: [500, 668, 787, 755] },
    { tipo: "grama", ret: [145, 668, 432, 755] },
    { tipo: "piso", ret: [180, 452, 480, 525] },
    { tipo: "deck", ret: [248, 457, 368, 520] },
    { tipo: "piso", ret: [640, 318, 800, 372] },
    { tipo: "piso", ret: [812, 285, 900, 330] },
    { tipo: "playground", ret: [375, 490, 415, 512] },
    { tipo: "playground", ret: [398, 408, 426, 432] },
  ],
  torres: [
    { nome: "Torre 1", partes: [[490, 450, 600, 512], [645, 450, 750, 512]], nucleo: [600, 446, 645, 516], andares: 14 },
    { nome: "Torre 2", partes: [[510, 678, 620, 745], [655, 678, 775, 745]], nucleo: [620, 674, 655, 749], andares: 14 },
    { nome: "Torre 3", partes: [[155, 678, 270, 745], [300, 678, 420, 745]], nucleo: [270, 674, 300, 749], andares: 14 },
  ],
  construcoes: [
    { ret: [390, 455, 435, 487], altura: 4 }, // salão de festas
    { ret: [436, 445, 470, 475], altura: 3, tipo: "pergolado" }, // gourmet
    { ret: [474, 480, 490, 500], altura: 2.8 }, // apoio PCD
    { ret: [810, 560, 840, 600], altura: 3, placa: true }, // guarita
    { ret: [830, 455, 855, 487], altura: 3 }, // apoio administrativo
    { ret: [856, 445, 880, 465], altura: 2.8 }, // depósito de lixo
    { ret: [238, 500, 262, 515], altura: 2.8 }, // apoio técnico
    { ret: [690, 305, 720, 320], altura: 2.4 }, // central de gás
  ],
  piscinas: [
    [[272, 463], [357, 463], [357, 498], [272, 498]],
    [[255, 470], [269, 470], [269, 492], [255, 492]],
  ],
  reservatorios: [
    { em: [840, 305], raio: 12, altura: 24, castelo: true },
    { em: [885, 305], raio: 12, altura: 24, castelo: true },
  ],
  arvores: [
    { em: [530, 350], tipo: "copa", porte: 1.3 }, { em: [350, 425], tipo: "copa" }, { em: [300, 438], tipo: "copa", porte: 0.8 },
    { em: [215, 470], tipo: "copa", porte: 0.8 }, { em: [460, 395], tipo: "ipe", porte: 0.8 }, { em: [365, 515], tipo: "palmeira", porte: 0.8 },
    { em: [250, 455], tipo: "palmeira", porte: 0.8 }, { em: [470, 650], tipo: "copa", porte: 0.8 }, { em: [800, 700], tipo: "copa", porte: 0.8 },
  ],
  vagas: [
    { de: 150, ate: 480, em: 537, sentido: "h", ocupacao: 0.35 },
    { de: 150, ate: 465, em: 580, sentido: "h", ocupacao: 0.4 },
    { de: 500, ate: 775, em: 580, sentido: "h", ocupacao: 0.4 },
    { de: 150, ate: 465, em: 605, sentido: "h", ocupacao: 0.4 },
    { de: 500, ate: 775, em: 605, sentido: "h", ocupacao: 0.4 },
    { de: 150, ate: 465, em: 652, sentido: "h", ocupacao: 0.4 },
    { de: 500, ate: 775, em: 652, sentido: "h", ocupacao: 0.4 },
    { de: 150, ate: 465, em: 765, sentido: "h", ocupacao: 0.4 },
    { de: 500, ate: 775, em: 765, sentido: "h", ocupacao: 0.4 },
    { de: 80, ate: 830, em: 805, sentido: "h", ocupacao: 0.35 },
    { de: 490, ate: 760, em: 395, sentido: "h", ocupacao: 0.3 },
    { de: 440, ate: 760, em: 425, sentido: "h", ocupacao: 0.3 },
    { de: 540, ate: 800, em: 85, sentido: "v", ocupacao: 0.35 },
    { de: 540, ate: 760, em: 135, sentido: "v", ocupacao: 0.35 },
    { de: 640, ate: 800, em: 812, sentido: "v", ocupacao: 0.35 },
    { de: 440, ate: 520, em: 770, sentido: "v", ocupacao: 0.35 },
  ],
  guardaSois: [[262, 512], [300, 512], [340, 512]],
  rotulos: [
    { texto: "Piscinas", em: [312, 480] },
    { texto: "Salão de festas", em: [412, 471], altura: 5, secundario: true },
    { texto: "Playground", em: [412, 420], secundario: true },
    { texto: "Castelos d'água", em: [862, 305], altura: 28, secundario: true },
    { texto: "Portaria", em: [825, 580], altura: 4 },
  ],
  fachada: { parede: "#eef0f0", faixa: "#8e98a0", paineis: ["#c9d1d6", "#e2e6e8", "#aab4bb"] },
  descricao:
    "Maquete ilustrativa do Forte Alencar: três torres de 14 andares, uma ao norte e duas ao sul, com o estacionamento entre elas. " +
    "O lazer fica no lado noroeste, com piscinas, salão de festas, gourmet e playground. A portaria fica no lado leste e os castelos d'água no canto nordeste.",
};
