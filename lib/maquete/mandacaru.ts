import type { Maquete } from "./tipos";

/**
 * Medido sobre a implantação 13-16 na largura de 1080 px (norte para cima). A torre fica na vertical,
 * com ~320 × 72 px, e os carros têm ~25 px: ~5,4 px/m, torre de ~59 × 13 m. Andares: 204 unidades ÷
 * 12 por andar = 17.
 */
export const mandacaru: Maquete = {
  nome: "Residencial Mandacaru",
  fonte: { imagem: "/img/residencial-mandacaru/13-16", largura: 1080 },
  escala: 5.4,
  peDireito: 2.85,
  norte: 7,
  vista: 120,
  lote: [[140, 92], [380, 92], [510, 135], [510, 548], [490, 572], [180, 572], [140, 380]],
  interno: [[144, 96], [379, 96], [506, 138], [506, 546], [488, 568], [183, 568], [144, 380]],
  chao: "pavimento",
  ruas: [
    [100, 576, 580, 632],
    [513, 135, 575, 575],
    [[70, 90], [135, 90], [135, 380], [175, 575], [100, 632], [70, 632]],
  ],
  pisos: [
    { tipo: "grama", ret: [215, 187, 310, 508] },
    { tipo: "piso", ret: [410, 180, 506, 545] },
    { tipo: "piso", ret: [405, 125, 482, 176] },
    { tipo: "deck", ret: [425, 280, 506, 400] },
    { tipo: "playground", ret: [480, 180, 505, 230] },
    { tipo: "grama", ret: [144, 96, 160, 380] },
  ],
  torres: [{ nome: "Torre 1", partes: [[228, 190, 300, 325], [228, 360, 300, 507]], nucleo: [225, 325, 303, 360], andares: 17 }],
  construcoes: [
    { ret: [415, 185, 470, 235], altura: 4 }, // salão de festas
    { ret: [415, 236, 480, 270], altura: 3 }, // copa e sanitários
    { ret: [415, 415, 455, 490], altura: 4 }, // academia coberta
    { ret: [465, 480, 505, 505], altura: 3, tipo: "pergolado" }, // gazebo
    { ret: [455, 155, 480, 170], altura: 2.6 }, // casa de máquinas
    { ret: [490, 515, 506, 530], altura: 2.8 }, // depósito de lixo
    { ret: [318, 555, 335, 570], altura: 3, placa: true }, // guarita
    { ret: [225, 520, 315, 540], altura: 3 }, // refeitório, vestiários e administração
    { ret: [210, 555, 235, 568], altura: 2.4 }, // gás
    { ret: [285, 555, 310, 568], altura: 2.4 },
  ],
  piscinas: [
    [[462, 322], [500, 322], [500, 385], [462, 385]],
    [[477, 287], [500, 287], [500, 305], [477, 305]],
  ],
  reservatorios: ([[417, 140], [440, 140], [462, 140], [417, 162], [440, 162]] as [number, number][]).map((em) => ({ em, raio: 11, altura: 3 })),
  arvores: [
    { em: [405, 300], tipo: "palmeira", porte: 0.8 }, { em: [405, 360], tipo: "palmeira", porte: 0.8 }, { em: [460, 405], tipo: "copa", porte: 0.7 },
    { em: [175, 548], tipo: "copa", porte: 0.8 }, { em: [500, 255], tipo: "copa", porte: 0.7 }, { em: [210, 180], tipo: "ipe", porte: 0.7 },
    { em: [310, 180], tipo: "ipe", porte: 0.7 },
  ],
  vagas: [
    { de: 150, ate: 365, em: 112, sentido: "h", ocupacao: 0.35 },
    { de: 150, ate: 500, em: 197, sentido: "v", ocupacao: 0.35 },
    { de: 150, ate: 500, em: 330, sentido: "v", ocupacao: 0.35 },
    { de: 120, ate: 540, em: 390, sentido: "v", ocupacao: 0.35 },
    { de: 410, ate: 480, em: 523, sentido: "h", ocupacao: 0.35 },
    { de: 400, ate: 485, em: 553, sentido: "h", ocupacao: 0.35 },
  ],
  guardaSois: [[440, 300], [440, 330], [440, 360]],
  rotulos: [
    { texto: "Piscinas", em: [480, 350] },
    { texto: "Salão de festas", em: [442, 210], altura: 5, secundario: true },
    { texto: "Playground", em: [492, 205], secundario: true },
    { texto: "Academia", em: [435, 452], altura: 5, secundario: true },
    { texto: "Reservatórios", em: [440, 150], altura: 4, secundario: true },
    { texto: "Portaria", em: [327, 562], altura: 4 },
  ],
  fachada: { parede: "#ecebe6", faixa: "#9c8f7c", paineis: ["#c9bfae", "#e3ded5", "#b5a893"] },
  descricao:
    "Maquete ilustrativa do Residencial Mandacaru: uma torre de 17 andares no sentido norte–sul, com o estacionamento dos dois lados. " +
    "O lazer ocupa a faixa leste, com piscinas, salão de festas, academia coberta e playground, e a portaria fica no lado sul.",
};
