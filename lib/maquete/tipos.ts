/**
 * Maquete 3D montada a partir da planta de implantação. Todas as coordenadas estão em pixels da
 * imagem de implantação na largura indicada em `fonte` (x para a direita, y para baixo, norte para
 * cima): assim cada número pode ser conferido direto sobre a planta. A cena converte para metros
 * com `escala`.
 */
export type Ponto = [x: number, y: number];
/** Retângulo [x1, y1, x2, y2] em pixels da planta */
export type Ret = [x1: number, y1: number, x2: number, y2: number];

export type TipoPiso = "grama" | "calcada" | "pavimento" | "piso" | "deck" | "madeira" | "quadra" | "playground" | "pista";

export interface Torre {
  nome: string;
  ret: Ret;
  /** faixa x do núcleo (escada e elevadores), mais escuro e um pouco mais alto */
  nucleo: [x1: number, x2: number];
  andares: number;
}

export interface Construcao {
  ret: Ret;
  /** altura em metros */
  altura: number;
  /** pergolado: só pilares e cobertura vazada */
  tipo?: "edificio" | "pergolado";
}

export interface FileiraVagas {
  /** início e fim da fileira no eixo da fileira, e posição no outro eixo */
  de: number;
  ate: number;
  em: number;
  /** "h": fileira na horizontal (carros apontando norte–sul); "v": fileira na vertical */
  sentido: "h" | "v";
  /** fração das vagas com carro, só para dar vida à cena */
  ocupacao: number;
}

export interface Rotulo {
  texto: string;
  em: Ponto;
  /** altura em metros acima do chão */
  altura?: number;
}

export interface Maquete {
  /** imagem medida e largura usada nas medições */
  fonte: { imagem: string; largura: number };
  /** pixels por metro, calibrado pela largura das vagas (2,5 m) */
  escala: number;
  /** pé-direito médio por andar, em metros */
  peDireito: number;
  /** contorno do lote (calçada incluída) */
  lote: Ponto[];
  /** área dentro do muro */
  interno: Ponto[];
  /** rua ao redor do lote */
  rua: Ret;
  pisos: { tipo: TipoPiso; ret: Ret }[];
  muros: [x1: number, y1: number, x2: number, y2: number][];
  torres: Torre[];
  construcoes: Construcao[];
  piscinas: Ponto[][];
  reservatorios: { em: Ponto; raio: number; altura: number }[];
  arvores: { em: Ponto; tipo: "copa" | "palmeira" | "ipe"; porte?: number }[];
  vagas: FileiraVagas[];
  rotulos: Rotulo[];
  /** cores da fachada: parede, faixa escura (núcleo e pontas) e painéis coloridos ao lado das janelas */
  fachada: { parede: string; faixa: string; paineis: string[] };
  /** descrição em texto da maquete, para leitores de tela */
  descricao: string;
}
