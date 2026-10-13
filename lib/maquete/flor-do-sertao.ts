import type { Maquete } from "./tipos";

/**
 * Medido sobre a implantação 02-17 na largura de 1600 px (norte para a direita). Carros com ~20 px
 * de largura e ~45 px de comprimento dão ~10,5 px/m: torre de ~66 × 14 m. Andares: 216 unidades ÷
 * 12 por andar = 18.
 */
export const florDoSertao: Maquete = {
  nome: "Residencial Flor do Sertão",
  fonte: { imagem: "/img/residencial-flor-do-sertao/02-17", largura: 1600 },
  escala: 10.5,
  peDireito: 2.85,
  vista: 150,
  lote: [[130, 443], [1000, 490], [1270, 555], [1450, 685], [1335, 905], [190, 905]],
  interno: [[150, 460], [995, 505], [1260, 570], [1425, 690], [1325, 890], [205, 890]],
  ruas: [[30, 420, 128, 940]],
  pisos: [
    { tipo: "pavimento", ret: [262, 452, 745, 548] },
    { tipo: "pavimento", ret: [265, 452, 345, 900] },
    { tipo: "pavimento", ret: [180, 705, 1000, 890] },
    { tipo: "piso", ret: [745, 505, 1000, 552] },
    { tipo: "piso", ret: [1070, 575, 1255, 790] },
    { tipo: "piso", ret: [1000, 790, 1200, 890] },
    { tipo: "deck", ret: [1200, 640, 1415, 890] },
    { tipo: "madeira", ret: [1300, 650, 1365, 715] },
    { tipo: "grama", ret: [350, 548, 1065, 708] },
    { tipo: "playground", ret: [1205, 562, 1290, 612] },
  ],
  torres: [{ nome: "Torre 1", partes: [[365, 557, 690, 700], [742, 557, 1060, 700]], nucleo: [690, 551, 742, 706], andares: 18 }],
  construcoes: [
    { ret: [1085, 575, 1190, 650], altura: 4.2 }, // academia
    { ret: [222, 528, 262, 612], altura: 3.2 }, // apoio administrativo
    { ret: [220, 460, 262, 525], altura: 2.8 }, // bicicletário e apoio
    { ret: [152, 555, 200, 612], altura: 2.8 }, // depósito de lixo
    { ret: [245, 675, 272, 760], altura: 2.8 }, // espaço market
    { ret: [205, 845, 248, 882], altura: 3.2, placa: true }, // guarita
    { ret: [1150, 805, 1195, 842], altura: 2.6 }, // casa de máquinas
    { ret: [1095, 668, 1137, 702], altura: 3, tipo: "pergolado" }, // churrasqueira
    { ret: [1095, 722, 1137, 756], altura: 3, tipo: "pergolado" }, // churrasqueira
    { ret: [1198, 638, 1242, 680], altura: 3, tipo: "pergolado" }, // happy hour
  ],
  piscinas: [
    [[1290, 712], [1392, 742], [1340, 872], [1248, 845]], // adulto
    [[1360, 668], [1415, 668], [1415, 712], [1360, 712]], // infantil
  ],
  reservatorios: [[1030, 815], [1080, 815], [1127, 815], [1030, 862], [1080, 862], [1127, 862], [1170, 862]].map(([x, y]) => ({
    em: [x, y] as [number, number],
    raio: 20,
    altura: 3,
  })),
  arvores: [
    { em: [190, 462], tipo: "ipe", porte: 0.8 }, { em: [735, 462], tipo: "ipe", porte: 0.8 }, { em: [880, 508], tipo: "ipe", porte: 1.1 },
    { em: [1045, 508], tipo: "ipe", porte: 0.8 }, { em: [195, 618], tipo: "ipe", porte: 0.8 }, { em: [270, 660], tipo: "copa", porte: 0.8 },
    { em: [1205, 732], tipo: "ipe", porte: 0.9 }, { em: [1050, 748], tipo: "ipe", porte: 0.8 }, { em: [1150, 772], tipo: "copa", porte: 0.8 },
    { em: [1262, 622], tipo: "copa", porte: 0.8 }, { em: [972, 852], tipo: "copa", porte: 0.7 }, { em: [272, 862], tipo: "ipe", porte: 0.8 },
    { em: [1230, 780], tipo: "palmeira", porte: 0.8 }, { em: [1420, 780], tipo: "palmeira", porte: 0.8 },
  ],
  vagas: [
    { de: 345, ate: 995, em: 750, sentido: "h", ocupacao: 0.4 },
    { de: 345, ate: 995, em: 865, sentido: "h", ocupacao: 0.4 },
    { de: 350, ate: 735, em: 478, sentido: "h", ocupacao: 0.25 },
    { de: 350, ate: 735, em: 525, sentido: "h", ocupacao: 0.25 },
  ],
  guardaSois: [[1235, 700], [1262, 770], [1395, 800]],
  rotulos: [
    { texto: "Piscinas", em: [1320, 790] },
    { texto: "Academia", em: [1137, 612], altura: 5, secundario: true },
    { texto: "Churrasqueiras", em: [1140, 712], altura: 4, secundario: true },
    { texto: "Playground", em: [1250, 585], secundario: true },
    { texto: "Reservatórios", em: [1100, 840], altura: 4, secundario: true },
    { texto: "Portaria", em: [226, 865], altura: 4 },
  ],
  fachada: { parede: "#d8d0c3", faixa: "#7b746b", paineis: ["#b7ab99", "#e2dace", "#8d8478"] },
  descricao:
    "Maquete ilustrativa do Residencial Flor do Sertão: uma torre de 18 andares no meio do lote, com o estacionamento dos dois lados. " +
    "O lazer fica na ponta norte, com piscinas adulto e infantil, academia, churrasqueiras e playground. A portaria fica junto à rua, no lado sul.",
};
