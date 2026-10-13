import type { Maquete } from "./tipos";

/**
 * A MRV não publicou a implantação do Fortitudine: o desenho sai da vista aérea 01-02 e da fachada
 * 01-01, em coordenadas próprias de 10 px/m. Duas torres de duas lâminas com o núcleo no meio,
 * desencontradas, e o lazer numa extensão do lote. Andares: 384 unidades ÷ 2 torres ÷ 12 por andar = 16.
 */
export const fortitudine: Maquete = {
  nome: "Residencial Fortitudine",
  fonte: { imagem: "/img/residencial-fortitudine/01-02", largura: 1600 },
  estimada: true,
  escala: 10,
  peDireito: 2.85,
  vista: 210,
  lote: [[0, 0], [1300, 0], [1300, 350], [900, 350], [900, 620], [0, 620]],
  interno: [[6, 6], [1294, 6], [1294, 344], [894, 344], [894, 614], [6, 614]],
  ruas: [[-180, -100, -20, 720], [-180, 640, 1300, 720]],
  pisos: [
    { tipo: "pavimento", ret: [6, 430, 894, 614] },
    { tipo: "pavimento", ret: [680, 6, 894, 430] },
    { tipo: "piso", ret: [900, 6, 1294, 344] },
    { tipo: "deck", ret: [950, 60, 1255, 240] },
    { tipo: "playground", ret: [1130, 262, 1220, 330] },
  ],
  torres: [
    { nome: "Torre 1", partes: [[100, 60, 190, 360], [250, 60, 340, 360]], nucleo: [190, 150, 250, 270], andares: 16 },
    { nome: "Torre 2", partes: [[420, 120, 510, 420], [570, 120, 660, 420]], nucleo: [510, 210, 570, 330], andares: 16 },
  ],
  construcoes: [
    { ret: [960, 262, 1040, 322], altura: 4 }, // happy hour e espaço funcional
    { ret: [1060, 262, 1110, 312], altura: 3, tipo: "pergolado" }, // churrasqueira
    { ret: [700, 560, 780, 608], altura: 3.2, placa: true }, // portaria
  ],
  piscinas: [
    [[990, 90], [1200, 90], [1200, 170], [990, 170]],
    [[1210, 110], [1240, 110], [1240, 160], [1210, 160]],
  ],
  reservatorios: [{ em: [880, 40], raio: 25, altura: 24, castelo: true }],
  arvores: [
    { em: [40, 400], tipo: "copa" }, { em: [40, 560], tipo: "ipe", porte: 0.9 }, { em: [380, 600], tipo: "copa", porte: 0.9 },
    { em: [600, 600], tipo: "copa", porte: 0.9 }, { em: [930, 300], tipo: "palmeira", porte: 0.8 }, { em: [1270, 300], tipo: "palmeira", porte: 0.8 },
    { em: [1270, 40], tipo: "copa", porte: 0.9 }, { em: [380, 40], tipo: "copa", porte: 0.8 },
  ],
  vagas: [
    { de: 30, ate: 640, em: 470, sentido: "h", ocupacao: 0.4 },
    { de: 30, ate: 640, em: 575, sentido: "h", ocupacao: 0.4 },
    { de: 80, ate: 400, em: 720, sentido: "v", ocupacao: 0.4 },
    { de: 80, ate: 400, em: 860, sentido: "v", ocupacao: 0.4 },
  ],
  guardaSois: [[975, 210], [1030, 215], [1170, 215]],
  rotulos: [
    { texto: "Piscinas", em: [1095, 130] },
    { texto: "Churrasqueira", em: [1085, 287], altura: 4, secundario: true },
    { texto: "Playground", em: [1175, 296], secundario: true },
    { texto: "Castelo d'água", em: [880, 40], altura: 26, secundario: true },
    { texto: "Portaria", em: [740, 584], altura: 4 },
  ],
  fachada: { parede: "#ebeae6", faixa: "#6e655c", paineis: ["#a9bf8f", "#c9d6b4", "#8fa676"] },
  descricao:
    "Maquete ilustrativa e estimada do Residencial Fortitudine: duas torres de 16 andares lado a lado, com o estacionamento na frente e ao lado. " +
    "O lazer fica numa extensão do lote ao lado das torres, com piscinas, churrasqueira e playground.",
};
