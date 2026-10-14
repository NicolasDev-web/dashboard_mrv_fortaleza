/**
 * Maquete 3D montada a partir da planta de implantação. Todas as coordenadas estão em pixels da
 * imagem de implantação na largura indicada em `fonte` (x para a direita, y para baixo): assim cada
 * número pode ser conferido direto sobre a planta. A cena converte para metros com `escala`.
 */
export type Ponto = [x: number, y: number];
/** Retângulo [x1, y1, x2, y2] em pixels da planta */
export type Ret = [x1: number, y1: number, x2: number, y2: number];

export type TipoPiso = "grama" | "calcada" | "pavimento" | "piso" | "deck" | "madeira" | "quadra" | "playground" | "pista";

export interface Torre {
  nome: string;
  /** blocos de apartamentos; torres em degrau ou em H viram vários retângulos */
  partes: Ret[];
  /** escada e elevadores: mais escuro e um pouco mais alto que a cobertura */
  nucleo: Ret;
  andares: number;
}

export interface Construcao {
  ret: Ret;
  /** altura em metros */
  altura: number;
  /** pergolado: só pilares e cobertura vazada; garagem: edifício-garagem de concreto aberto */
  tipo?: "edificio" | "pergolado" | "garagem";
  /** placa com o nome do empreendimento (na guarita) */
  placa?: boolean;
}

export interface FileiraVagas {
  /** início e fim da fileira no eixo da fileira, e posição no outro eixo */
  de: number;
  ate: number;
  em: number;
  /** "h": fileira na horizontal (carros apontando norte–sul na planta); "v": fileira na vertical */
  sentido: "h" | "v";
  /** fração das vagas com carro, só para dar vida à cena */
  ocupacao: number;
}

export interface Rotulo {
  texto: string;
  em: Ponto;
  /** altura em metros acima do chão */
  altura?: number;
  /** escondido em telas estreitas, onde os nomes se sobrepõem */
  secundario?: boolean;
}

export interface Maquete {
  nome: string;
  /** imagem medida e largura usada nas medições */
  fonte: { imagem: string; largura: number };
  /** sem planta de implantação publicada: posições estimadas a partir da vista aérea */
  estimada?: boolean;
  /** pixels por metro, calibrado pela largura das vagas (2,5 m) ou pela profundidade das torres */
  escala: number;
  /** pé-direito médio por andar, em metros */
  peDireito: number;
  /** para onde aponta o norte, em graus no sentido horário a partir do topo da planta (lido na rosa dos ventos dela) */
  norte: number;
  /** de onde a câmera olha no início, em graus no sentido horário a partir do topo da planta (0 = de cima, 90 = da direita) */
  vista?: number;
  /** contorno do lote (calçada incluída) */
  lote: Ponto[];
  /** área dentro do muro */
  interno: Ponto[];
  /** piso de fundo da área interna (grama, se não informado) */
  chao?: TipoPiso;
  /** trechos de rua em volta do lote (só onde a planta mostra rua); polígono para rua em diagonal */
  ruas: (Ret | Ponto[])[];
  pisos: { tipo: TipoPiso; ret: Ret }[];
  /** trechos de muro; sem eles, o muro segue o contorno de `interno` */
  muros?: [x1: number, y1: number, x2: number, y2: number][];
  torres: Torre[];
  construcoes: Construcao[];
  piscinas: Ponto[][];
  /** caixas d'água azuis; `castelo` é a torre de concreto alta */
  reservatorios: { em: Ponto; raio: number; altura: number; castelo?: boolean }[];
  arvores: { em: Ponto; tipo: "copa" | "palmeira" | "ipe"; porte?: number }[];
  vagas: FileiraVagas[];
  guardaSois?: Ponto[];
  rotulos: Rotulo[];
  /** nome sobre cada torre; desligado quando são muitos blocos baixos */
  rotularTorres?: boolean;
  /** cores da fachada: parede, faixa (núcleo e pontas) e painéis coloridos ao lado das janelas */
  fachada: { parede: string; faixa: string; paineis: string[] };
  /** descrição em texto da maquete, para leitores de tela */
  descricao: string;
}

/** Ponto de referência da cidade, já com rumo (graus a partir do norte) e distância a partir do empreendimento */
export interface Referencia {
  nome: string;
  km: number;
  rumo: number;
  /** miniatura 3D do lugar (id do registro em components/empreendimento/maquete/marcos); sem ela, vira um pino */
  marco?: string;
}
