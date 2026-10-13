import type { Maquete } from "./tipos";

/**
 * Medido sobre a implantação 11-15 na largura de 1080 px (norte para cima). Torres de ~175 × 36 px
 * para ~60 × 12 m: ~3,2 px/m. Andares: 384 unidades ÷ 2 torres ÷ 12 por andar = 16.
 */
export const torreDoMar: Maquete = {
  nome: "Torre do Mar",
  fonte: { imagem: "/img/torre-do-mar/11-15", largura: 1080 },
  escala: 3.2,
  peDireito: 2.85,
  vista: 170,
  lote: [[28, 56], [1028, 58], [1030, 196], [28, 192]],
  interno: [[31, 59], [1025, 61], [1027, 193], [31, 189]],
  ruas: [[1032, 40, 1066, 215]],
  pisos: [
    { tipo: "pavimento", ret: [31, 61, 1025, 191] },
    { tipo: "grama", ret: [140, 105, 345, 165] },
    { tipo: "grama", ret: [690, 112, 900, 175] },
    { tipo: "piso", ret: [430, 110, 560, 186] },
    { tipo: "deck", ret: [455, 113, 505, 182] },
    { tipo: "playground", ret: [513, 163, 547, 181] },
    { tipo: "piso", ret: [45, 70, 75, 112] },
  ],
  torres: [
    { nome: "Torre 2", partes: [[163, 117, 243, 150], [262, 117, 333, 150]], nucleo: [243, 114, 262, 153], andares: 16 },
    { nome: "Torre 1", partes: [[707, 125, 800, 162], [820, 125, 887, 162]], nucleo: [800, 122, 820, 165], andares: 16 },
  ],
  construcoes: [
    { ret: [510, 117, 547, 137], altura: 4 }, // salão de festas
    { ret: [513, 139, 540, 157], altura: 3, tipo: "pergolado" }, // gourmet
    { ret: [447, 137, 463, 157], altura: 3, tipo: "pergolado" }, // gazebo
    { ret: [453, 113, 480, 126], altura: 2.6 }, // casa de máquinas
    { ret: [987, 60, 1017, 77], altura: 3, placa: true }, // guarita
    { ret: [1003, 123, 1020, 140], altura: 2.8 }, // depósito de lixo
    { ret: [923, 90, 967, 123], altura: 3 }, // administração, refeitório e vestiário
  ],
  piscinas: [
    [[473, 127], [493, 127], [493, 160], [473, 160]],
    [[462, 166], [488, 166], [488, 177], [462, 177]],
  ],
  reservatorios: [{ em: [113, 100], raio: 6, altura: 22, castelo: true }],
  arvores: [
    { em: [455, 180], tipo: "palmeira", porte: 0.7 }, { em: [553, 176], tipo: "palmeira", porte: 0.7 }, { em: [545, 113], tipo: "ipe", porte: 0.7 },
    { em: [600, 190], tipo: "copa", porte: 0.7 }, { em: [680, 190], tipo: "copa", porte: 0.7 }, { em: [250, 165], tipo: "copa", porte: 0.6 },
    { em: [280, 165], tipo: "copa", porte: 0.6 }, { em: [310, 165], tipo: "copa", porte: 0.6 }, { em: [35, 70], tipo: "copa", porte: 0.8 },
    { em: [35, 170], tipo: "copa", porte: 0.8 }, { em: [940, 125], tipo: "copa", porte: 0.6 },
  ],
  vagas: [
    { de: 40, ate: 1000, em: 68, sentido: "h", ocupacao: 0.45 },
    { de: 140, ate: 440, em: 103, sentido: "h", ocupacao: 0.45 },
    { de: 560, ate: 1000, em: 103, sentido: "h", ocupacao: 0.45 },
    ...[100, 370, 400, 590, 640, 920, 965].map((x) => ({ de: 112, ate: 186, em: x, sentido: "v" as const, ocupacao: 0.45 })),
  ],
  guardaSois: [[462, 120], [500, 120]],
  rotulos: [
    { texto: "Piscinas", em: [483, 145] },
    { texto: "Salão de festas", em: [528, 127], altura: 5, secundario: true },
    { texto: "Playground", em: [530, 172], secundario: true },
    { texto: "Castelo d'água", em: [113, 100], altura: 24, secundario: true },
    { texto: "Portaria", em: [1002, 68], altura: 4 },
  ],
  fachada: { parede: "#e8bea6", faixa: "#c98f78", paineis: ["#f0cdb8", "#dca58c", "#f5ddd0"] },
  descricao:
    "Maquete ilustrativa do Torre do Mar: duas torres de 16 andares num lote comprido, cercadas de estacionamento, com o lazer no meio, entre elas: piscinas, salão de festas, gourmet e playground. " +
    "A portaria fica no canto nordeste e o castelo d'água no lado oeste.",
};
