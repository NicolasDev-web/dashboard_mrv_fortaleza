import type { Maquete } from "./tipos";

/**
 * Medido sobre a implantação 07-11 na largura de 1600 px. As vagas têm ~28,5 px de largura (2,5 m),
 * o que dá 11,4 px/m: torres de ~60 × 12,5 m num lote de ~109 × 115 m. Andares: 576 unidades ÷
 * 3 torres ÷ 12 por andar = 16, conferido nas janelas da fachada (07-19).
 */
export const parqueMarista: Maquete = {
  nome: "Parque Marista",
  fonte: { imagem: "/img/parque-marista/07-11", largura: 1600 },
  escala: 11.4,
  peDireito: 2.85,
  norte: -20,
  lote: [[210, 760], [1322, 760], [1408, 815], [1408, 1990], [1335, 2075], [245, 2075], [162, 1990], [162, 815]],
  interno: [[228, 795], [1310, 795], [1368, 835], [1368, 1975], [1318, 2038], [262, 2038], [200, 1975], [200, 835]],
  ruas: [[68, 660, 1515, 760], [68, 2075, 1515, 2155], [68, 660, 162, 2155], [1408, 660, 1515, 2155]],
  pisos: [
    { tipo: "piso", ret: [205, 785, 1005, 1010] },
    { tipo: "deck", ret: [1005, 785, 1365, 1005] },
    { tipo: "madeira", ret: [1155, 852, 1340, 912] },
    { tipo: "piso", ret: [1085, 1010, 1365, 1095] },
    { tipo: "piso", ret: [240, 1022, 342, 1212] },
    { tipo: "pavimento", ret: [205, 1205, 1090, 1965] },
    { tipo: "pavimento", ret: [1085, 1095, 1282, 2038] },
    { tipo: "grama", ret: [345, 1015, 1082, 1205] },
    { tipo: "grama", ret: [362, 1410, 1078, 1592] },
    { tipo: "grama", ret: [362, 1778, 1078, 1962] },
    { tipo: "quadra", ret: [865, 790, 1000, 860] },
    { tipo: "playground", ret: [440, 805, 522, 895] },
    { tipo: "pista", ret: [522, 795, 862, 842] },
    { tipo: "playground", ret: [715, 1975, 800, 2025] },
  ],
  // muro no limite interno, com o vão da portaria no lado leste
  muros: [
    [228, 795, 1310, 795], [1310, 795, 1368, 835], [1368, 835, 1368, 1430], [1368, 1590, 1368, 1975],
    [1368, 1975, 1318, 2038], [1318, 2038, 262, 2038], [262, 2038, 200, 1975], [200, 1975, 200, 835], [200, 835, 228, 795],
  ],
  torres: [
    { nome: "Torre 1", partes: [[372, 1040, 690, 1182], [742, 1040, 1056, 1182]], nucleo: [690, 1034, 742, 1188], andares: 16 },
    { nome: "Torre 2", partes: [[380, 1430, 700, 1572], [752, 1430, 1066, 1572]], nucleo: [700, 1424, 752, 1578], andares: 16 },
    { nome: "Torre 3", partes: [[380, 1795, 700, 1937], [752, 1795, 1066, 1937]], nucleo: [700, 1789, 752, 1943], andares: 16 },
  ],
  construcoes: [
    { ret: [235, 835, 415, 932], altura: 4.2 }, // salão de festas
    { ret: [630, 845, 852, 932], altura: 4.2 }, // sala de jogos e academia
    { ret: [440, 945, 535, 992], altura: 3 }, // vestiário e espaço pizza
    { ret: [968, 918, 1005, 1000], altura: 3 }, // vestiário da piscina
    { ret: [1140, 1022, 1200, 1068], altura: 3.2 }, // apoio administrativo
    { ret: [1205, 1022, 1300, 1082], altura: 3.2 }, // apoio técnico e pet care
    { ret: [1295, 1470, 1362, 1545], altura: 3.2, placa: true }, // guarita
    { ret: [1308, 1730, 1356, 1852], altura: 2.8 }, // depósito de lixo
    { ret: [1282, 1285, 1310, 1345], altura: 2.8 }, // espaço market
    { ret: [548, 835, 592, 872], altura: 3, tipo: "pergolado" }, // happy hour
    { ret: [548, 898, 592, 940], altura: 3, tipo: "pergolado" }, // churrasqueira
    { ret: [893, 950, 945, 1005], altura: 3, tipo: "pergolado" }, // churrasqueira da piscina
    { ret: [1280, 1420, 1366, 1468], altura: 3.4, tipo: "pergolado" }, // acesso de pedestres
  ],
  piscinas: [
    [[1045, 855], [1155, 855], [1155, 912], [1340, 912], [1340, 975], [1045, 975]], // adulto com prainha
    [[1232, 860], [1312, 860], [1312, 888], [1232, 888]], // infantil
  ],
  reservatorios: [270, 316].flatMap((x) => [1048, 1092, 1140, 1185].map((y) => ({ em: [x, y] as [number, number], raio: 19, altura: 3 }))),
  arvores: [
    { em: [240, 805], tipo: "copa", porte: 0.7 }, { em: [295, 965], tipo: "copa", porte: 1.2 }, { em: [460, 915], tipo: "copa" },
    { em: [535, 825], tipo: "copa" }, { em: [665, 815], tipo: "copa" }, { em: [730, 815], tipo: "copa" },
    { em: [650, 942], tipo: "ipe", porte: 0.8 }, { em: [560, 975], tipo: "copa", porte: 0.8 }, { em: [615, 995], tipo: "copa", porte: 0.9 },
    { em: [690, 985], tipo: "copa", porte: 0.9 }, { em: [780, 975], tipo: "copa", porte: 0.9 }, { em: [860, 980], tipo: "copa", porte: 0.8 },
    { em: [225, 1060], tipo: "copa", porte: 0.9 }, { em: [225, 1160], tipo: "copa", porte: 0.9 }, { em: [340, 1012], tipo: "copa", porte: 0.8 },
    { em: [1120, 1125], tipo: "copa", porte: 1.1 }, { em: [1225, 1120], tipo: "copa", porte: 1.1 }, { em: [1305, 1205], tipo: "copa" },
    { em: [1305, 1375], tipo: "copa" }, { em: [1250, 1525], tipo: "copa", porte: 1.3 }, { em: [1300, 1618], tipo: "copa" },
    { em: [220, 1405], tipo: "copa" }, { em: [360, 1990], tipo: "copa" }, { em: [420, 1992], tipo: "copa", porte: 0.8 },
    { em: [670, 1985], tipo: "copa", porte: 0.9 }, { em: [1315, 1950], tipo: "ipe", porte: 1.2 },
    { em: [1355, 1405], tipo: "palmeira" }, { em: [1355, 1605], tipo: "palmeira" }, { em: [1335, 1700], tipo: "palmeira" },
  ],
  vagas: [
    { de: 330, ate: 1072, em: 1250, sentido: "h", ocupacao: 0.7 },
    { de: 330, ate: 1072, em: 1372, sentido: "h", ocupacao: 0.7 },
    { de: 300, ate: 1045, em: 1625, sentido: "h", ocupacao: 0.7 },
    { de: 355, ate: 1072, em: 1745, sentido: "h", ocupacao: 0.7 },
    { de: 1165, ate: 1915, em: 1120, sentido: "v", ocupacao: 0.45 },
    { de: 1640, ate: 1955, em: 1243, sentido: "v", ocupacao: 0.45 },
  ],
  guardaSois: [[1120, 815], [1180, 815], [1240, 815], [1300, 815]],
  rotulos: [
    { texto: "Piscinas", em: [1190, 915] },
    { texto: "Mini quadra", em: [932, 825], secundario: true },
    { texto: "Salão de festas", em: [325, 885], altura: 5, secundario: true },
    { texto: "Playground", em: [480, 850], secundario: true },
    { texto: "Academia e jogos", em: [740, 888], altura: 5, secundario: true },
    { texto: "Reservatórios", em: [290, 1115], altura: 4, secundario: true },
    { texto: "Portaria", em: [1330, 1505], altura: 4 },
  ],
  fachada: { parede: "#e9e7e2", faixa: "#8f8b86", paineis: ["#e3a36e", "#9dbb88", "#f0c9a3", "#d9d6cf"] },
  descricao:
    "Maquete ilustrativa do Parque Marista: três torres de 16 andares em fileira, de leste a oeste, com o estacionamento entre elas. " +
    "O lazer fica concentrado no lado norte, com piscinas e prainha no canto nordeste, mini quadra, academia, salão de festas e playground. " +
    "A portaria fica no lado leste.",
};
