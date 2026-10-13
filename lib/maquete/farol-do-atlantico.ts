import type { Maquete } from "./tipos";

/**
 * Medido sobre a implantação 08-17 na largura de 1600 px (norte para cima). Torre de ~505 × 110 px e
 * carros de ~35 px: ~8,4 px/m, torre de ~60 × 13 m. Andares: 204 unidades ÷ 12 por andar = 17. O
 * edifício-garagem tem 3 pavimentos, como no render da fachada.
 */
export const farolDoAtlantico: Maquete = {
  nome: "Residencial Farol do Atlântico",
  fonte: { imagem: "/img/residencial-farol-do-atlantico/08-17", largura: 1600 },
  escala: 8.4,
  peDireito: 2.85,
  norte: -29,
  vista: 230,
  lote: [[215, 215], [945, 215], [945, 815], [215, 815]],
  interno: [[222, 222], [938, 222], [938, 808], [222, 808]],
  ruas: [[105, 200, 205, 830], [960, 200, 1050, 830]],
  pisos: [
    { tipo: "pavimento", ret: [355, 475, 885, 640] },
    { tipo: "piso", ret: [495, 222, 938, 330] },
    { tipo: "piso", ret: [222, 430, 355, 808] },
    { tipo: "deck", ret: [225, 240, 350, 430] },
    { tipo: "grama", ret: [340, 625, 872, 800] },
    { tipo: "playground", ret: [235, 450, 290, 510] },
  ],
  torres: [{ nome: "Torre", partes: [[350, 640, 570, 750], [625, 640, 855, 750]], nucleo: [570, 634, 625, 756], andares: 17 }],
  construcoes: [
    { ret: [385, 330, 890, 475], altura: 9, tipo: "garagem" }, // edifício-garagem
    { ret: [370, 255, 490, 325], altura: 4 }, // academia coberta
    { ret: [770, 285, 825, 325], altura: 3 }, // apoio administrativo
    { ret: [870, 335, 905, 370], altura: 3, placa: true }, // guarita
    { ret: [315, 440, 355, 470], altura: 3 }, // casa de máquinas
    { ret: [300, 510, 355, 565], altura: 3.5 }, // gourmet e sanitários
    { ret: [905, 665, 935, 700], altura: 2.8 }, // depósito de lixo
    { ret: [830, 285, 885, 320], altura: 2.8, tipo: "pergolado" }, // bicicletário
    { ret: [225, 530, 255, 555], altura: 3, tipo: "pergolado" }, // gazebo
    { ret: [305, 670, 335, 695], altura: 3, tipo: "pergolado" },
  ],
  piscinas: [
    [[270, 305], [335, 305], [335, 405], [270, 405]],
    [[270, 250], [335, 250], [335, 280], [270, 280]],
  ],
  reservatorios: [790, 825, 860, 895].map((x) => ({ em: [x, 255] as [number, number], raio: 16, altura: 3 })),
  arvores: [
    { em: [345, 270], tipo: "palmeira" }, { em: [345, 400], tipo: "palmeira" }, { em: [352, 350], tipo: "palmeira", porte: 0.8 },
    { em: [915, 490], tipo: "palmeira" }, { em: [925, 545], tipo: "palmeira" }, { em: [920, 770], tipo: "palmeira" },
    { em: [325, 680], tipo: "copa", porte: 0.8 }, { em: [320, 770], tipo: "copa", porte: 0.8 }, { em: [880, 790], tipo: "copa", porte: 0.9 },
    { em: [240, 600], tipo: "ipe", porte: 0.7 },
  ],
  vagas: [
    { de: 395, ate: 880, em: 497, sentido: "h", ocupacao: 0.4 },
    { de: 390, ate: 880, em: 590, sentido: "h", ocupacao: 0.4 },
  ],
  guardaSois: [[245, 310], [245, 370]],
  rotulos: [
    { texto: "Piscinas", em: [302, 330] },
    { texto: "Edifício-garagem", em: [640, 400], altura: 12 },
    { texto: "Academia", em: [430, 290], altura: 5, secundario: true },
    { texto: "Playground", em: [262, 480], secundario: true },
    { texto: "Reservatórios", em: [842, 255], altura: 4, secundario: true },
    { texto: "Portaria", em: [887, 352], altura: 4 },
  ],
  fachada: { parede: "#dad5cc", faixa: "#6d675f", paineis: ["#b8b0a3", "#e6e1d8", "#9c9386"] },
  descricao:
    "Maquete ilustrativa do Residencial Farol do Atlântico: uma torre de 17 andares no lado sul do lote e um edifício-garagem de três pavimentos ao norte. " +
    "O lazer ocupa a faixa oeste, com piscinas, playground, gourmet e gazebos, e a academia coberta fica ao lado da garagem. A portaria fica no lado leste.",
};
