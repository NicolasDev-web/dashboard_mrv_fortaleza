import type { Maquete } from "./tipos";

/**
 * Medido sobre a implantação 04-17 na largura de 1080 px (norte para cima). As torres têm ~210 ×
 * 47 px e as vagas ~9 px: ~3,5 px/m, torres de ~60 × 13 m. Andares: 372 unidades ÷ 2 torres ÷ 12
 * por andar ≈ 16 (o térreo tem menos apartamentos).
 */
export const reservaDaLagoa: Maquete = {
  nome: "Reserva da Lagoa",
  fonte: { imagem: "/img/reserva-da-lagoa/04-17", largura: 1080 },
  escala: 3.5,
  peDireito: 2.85,
  vista: 290,
  lote: [[290, 290], [860, 290], [860, 420], [757, 420], [757, 597], [342, 597], [220, 372], [232, 318], [262, 295]],
  interno: [[293, 296], [855, 296], [855, 415], [752, 415], [752, 591], [346, 591], [228, 372], [238, 322], [265, 300]],
  ruas: [[[180, 350], [215, 335], [345, 600], [306, 616]]],
  pisos: [
    { tipo: "pavimento", ret: [290, 296, 855, 415] },
    { tipo: "pavimento", ret: [300, 415, 752, 590] },
    { tipo: "grama", ret: [405, 360, 642, 425] },
    { tipo: "grama", ret: [400, 470, 642, 535] },
    { tipo: "piso", ret: [232, 302, 362, 392] },
    { tipo: "deck", ret: [232, 335, 305, 385] },
    { tipo: "playground", ret: [288, 313, 310, 331] },
    { tipo: "piso", ret: [790, 300, 855, 340] },
  ],
  torres: [
    { nome: "Torre 1", partes: [[420, 368, 512, 415], [530, 368, 632, 415]], nucleo: [512, 365, 530, 418], andares: 16 },
    { nome: "Torre 2", partes: [[415, 480, 508, 525], [527, 480, 630, 525]], nucleo: [508, 477, 527, 528], andares: 16 },
  ],
  construcoes: [
    { ret: [315, 322, 357, 356], altura: 4 }, // salão de festas
    { ret: [340, 362, 360, 382], altura: 3, tipo: "pergolado" }, // gourmet
    { ret: [320, 460, 342, 482], altura: 3 }, // apoio administrativo
    { ret: [272, 440, 294, 458], altura: 3, placa: true }, // guarita
    { ret: [296, 490, 316, 515], altura: 2.8 }, // depósitos de lixo e gás
    { ret: [785, 345, 820, 365], altura: 3 }, // gerador e esgoto
    { ret: [672, 528, 684, 542], altura: 2.6 }, // casa de máquinas
  ],
  piscinas: [
    [[262, 345], [300, 345], [300, 370], [262, 370]],
    [[240, 349], [257, 349], [257, 367], [240, 367]],
  ],
  reservatorios: [
    { em: [698, 535], raio: 8, altura: 26, castelo: true },
    { em: [832, 340], raio: 8, altura: 3 },
  ],
  arvores: [
    { em: [255, 302], tipo: "palmeira", porte: 0.8 }, { em: [335, 298], tipo: "copa", porte: 0.8 }, { em: [400, 455], tipo: "copa", porte: 0.8 },
    { em: [640, 455], tipo: "copa", porte: 0.8 }, { em: [302, 575], tipo: "ipe", porte: 0.8 }, { em: [700, 300], tipo: "copa", porte: 0.8 },
    { em: [855, 330], tipo: "ipe", porte: 0.8 }, { em: [250, 388], tipo: "palmeira", porte: 0.7 }, { em: [365, 300], tipo: "ipe", porte: 0.7 },
  ],
  vagas: [
    { de: 395, ate: 650, em: 310, sentido: "h", ocupacao: 0.55 },
    { de: 400, ate: 640, em: 355, sentido: "h", ocupacao: 0.55 },
    { de: 415, ate: 650, em: 432, sentido: "h", ocupacao: 0.55 },
    { de: 395, ate: 650, em: 465, sentido: "h", ocupacao: 0.55 },
    { de: 410, ate: 640, em: 545, sentido: "h", ocupacao: 0.55 },
    { de: 345, ate: 750, em: 582, sentido: "h", ocupacao: 0.55 },
    { de: 720, ate: 785, em: 340, sentido: "h", ocupacao: 0.5 },
    { de: 720, ate: 855, em: 378, sentido: "h", ocupacao: 0.5 },
    { de: 360, ate: 590, em: 690, sentido: "v", ocupacao: 0.55 },
    { de: 440, ate: 590, em: 735, sentido: "v", ocupacao: 0.55 },
    { de: 400, ate: 580, em: 335, sentido: "v", ocupacao: 0.5 },
  ],
  guardaSois: [[245, 378], [275, 380]],
  rotulos: [
    { texto: "Piscinas", em: [272, 357] },
    { texto: "Salão de festas", em: [336, 339], altura: 5, secundario: true },
    { texto: "Playground", em: [299, 322], secundario: true },
    { texto: "Castelo d'água", em: [698, 535], altura: 29, secundario: true },
    { texto: "Portaria", em: [283, 449], altura: 4 },
  ],
  fachada: { parede: "#f0efeb", faixa: "#6f7377", paineis: ["#b9bcbf", "#d9dbdc", "#a4a8ab"] },
  descricao:
    "Maquete ilustrativa do Reserva da Lagoa: duas torres de 16 andares no centro do lote, cercadas de estacionamento. " +
    "O lazer fica no canto noroeste, com piscinas, salão de festas, gourmet e playground, e a portaria fica junto à rua do lado oeste.",
};
