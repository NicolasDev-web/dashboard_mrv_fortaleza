import type { Maquete } from "./tipos";

/**
 * Medido sobre a implantação 12-02 na largura de 1080 px (norte para cima, levemente girado). Torres
 * de ~210 × 47 px para ~60 × 13 m: ~3,5 px/m. Andares: 576 unidades ÷ 3 torres ÷ 12 por andar = 16.
 */
export const portoDasMares: Maquete = {
  nome: "Porto das Marés",
  fonte: { imagem: "/img/porto-das-mares/12-02", largura: 1080 },
  escala: 3.5,
  peDireito: 2.85,
  norte: -21,
  vista: 15,
  lote: [[122, 5], [650, 100], [690, 447], [95, 447], [65, 120], [140, 118]],
  interno: [[127, 12], [645, 106], [684, 441], [100, 441], [71, 125], [143, 124]],
  chao: "pavimento",
  ruas: [
    [40, 452, 755, 555],
    [[5, 118], [62, 118], [92, 452], [35, 452]],
    [[655, 100], [715, 105], [760, 555], [700, 555]],
  ],
  pisos: [
    { tipo: "grama", ret: [72, 128, 100, 440] },
    { tipo: "grama", ret: [640, 112, 683, 440] },
    { tipo: "grama", ret: [140, 140, 350, 205] },
    { tipo: "grama", ret: [150, 305, 380, 370] },
    { tipo: "grama", ret: [385, 305, 605, 370] },
    { tipo: "grama", ret: [101, 425, 683, 440] },
    { tipo: "piso", ret: [400, 115, 600, 200] },
    { tipo: "deck", ret: [404, 128, 492, 175] },
    { tipo: "playground", ret: [540, 180, 575, 199] },
  ],
  torres: [
    { nome: "Torre 1", partes: [[390, 316, 485, 362], [508, 316, 598, 362]], nucleo: [485, 313, 508, 365], andares: 16 },
    { nome: "Torre 2", partes: [[158, 316, 252, 362], [278, 316, 372, 362]], nucleo: [252, 313, 278, 365], andares: 16 },
    { nome: "Torre 3", partes: [[148, 150, 238, 198], [256, 150, 340, 198]], nucleo: [238, 147, 256, 201], andares: 16 },
  ],
  construcoes: [
    { ret: [500, 135, 580, 178], altura: 4 }, // salão de festas e gourmet
    { ret: [383, 413, 400, 440], altura: 3, placa: true }, // guarita
    { ret: [435, 410, 485, 435], altura: 3 }, // administração, refeitório e vestiários
    { ret: [325, 432, 360, 446], altura: 2.8 }, // depósito de lixo
    { ret: [600, 418, 612, 432], altura: 2.6 }, // casa de bombas
  ],
  piscinas: [
    [[410, 138], [470, 138], [470, 165], [410, 165]],
    [[473, 150], [489, 150], [489, 166], [473, 166]],
  ],
  reservatorios: [{ em: [625, 425], raio: 10, altura: 24, castelo: true }],
  arvores: [
    ...[[52, 180], [58, 240], [63, 300], [68, 360], [72, 420]].map((em) => ({ em: em as [number, number], tipo: "palmeira" as const, porte: 0.8 })),
    ...[[705, 190], [710, 250], [715, 310], [720, 370], [725, 430], [120, 475], [200, 475], [280, 475], [500, 475], [580, 475], [650, 482]].map((em) => ({
      em: em as [number, number],
      tipo: "copa" as const,
      porte: 0.9,
    })),
    { em: [400, 195], tipo: "ipe", porte: 0.7 }, { em: [595, 120], tipo: "copa", porte: 0.7 },
  ],
  vagas: [
    { de: 140, ate: 300, em: 35, sentido: "h", ocupacao: 0.3 },
    { de: 140, ate: 340, em: 60, sentido: "h", ocupacao: 0.3 },
    { de: 360, ate: 620, em: 100, sentido: "h", ocupacao: 0.3 },
    { de: 140, ate: 330, em: 125, sentido: "h", ocupacao: 0.3 },
    { de: 130, ate: 620, em: 210, sentido: "h", ocupacao: 0.3 },
    { de: 130, ate: 615, em: 248, sentido: "h", ocupacao: 0.3 },
    { de: 130, ate: 615, em: 268, sentido: "h", ocupacao: 0.3 },
    { de: 140, ate: 620, em: 300, sentido: "h", ocupacao: 0.3 },
    { de: 155, ate: 600, em: 382, sentido: "h", ocupacao: 0.3 },
    { de: 125, ate: 335, em: 418, sentido: "h", ocupacao: 0.3 },
    { de: 405, ate: 610, em: 418, sentido: "h", ocupacao: 0.3 },
    { de: 130, ate: 420, em: 85, sentido: "v", ocupacao: 0.3 },
    { de: 130, ate: 420, em: 112, sentido: "v", ocupacao: 0.3 },
    { de: 125, ate: 410, em: 625, sentido: "v", ocupacao: 0.3 },
  ],
  guardaSois: [[415, 172], [450, 172]],
  rotulos: [
    { texto: "Piscinas", em: [445, 152] },
    { texto: "Salão de festas", em: [540, 156], altura: 5, secundario: true },
    { texto: "Playground", em: [557, 190], secundario: true },
    { texto: "Castelo d'água", em: [625, 425], altura: 26, secundario: true },
    { texto: "Portaria", em: [392, 428], altura: 4 },
  ],
  fachada: { parede: "#efede8", faixa: "#8a6b55", paineis: ["#b08a6e", "#d9cfc4", "#c7a88f"] },
  descricao:
    "Maquete ilustrativa do Porto das Marés: três torres de 16 andares, uma ao norte e duas ao sul, com o estacionamento ocupando o resto do lote. " +
    "O lazer fica no lado norte, com piscinas, salão de festas e playground. A portaria fica no meio do lado sul, de frente para a praça arborizada.",
};
