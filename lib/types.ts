export type RegiaoSlug = "oeste-centro" | "leste" | "sul" | "caucaia" | "eusebio";
export type Status = "lancamento" | "em_construcao" | "pronto";
export type Cidade = "Fortaleza" | "Caucaia" | "Eusébio";

/** Grupos de lazer que o quiz consegue perguntar. "pet" existe nos 16: vira motivo, não diferencia. */
export type Lazer = "piscina" | "academia" | "kids" | "festas" | "esportes" | "verde" | "pet";

export type PoloId =
  | "centro" | "beira_mar" | "aldeota" | "papicu" | "iguatemi" | "unifor"
  | "centro_eventos" | "parangaba" | "messejana" | "ufc_benfica" | "ufc_pici" | "aeroporto";

/** Temas de entorno vindos do OpenStreetMap. Segurança e renda ficam fora por decisão da MRV. */
export type NotaBairro = "saude" | "lazer" | "mobilidade" | "escolas" | "comercio";

export type TipoImagem =
  | "fachada" | "portaria" | "aerea" | "implantacao" | "planta"
  | "piscina" | "pet" | "kids" | "gourmet" | "festas" | "fitness" | "lazer" | "interno";

export interface Imagem {
  id: string;
  n: number;
  tipo: TipoImagem;
  alt: string;
  w: number;
  h: number;
  cor: string;
  blur: string;
  larguras: number[];
  fallback: number;
  /** caminho base, sem largura e extensão: /img/<slug>/<id> */
  src: string;
}

export interface Regiao {
  slug: RegiaoSlug;
  nome: string;
  resumo: string;
}

export interface Bairro {
  id: number;
  nome: string;
  regional: number | null;
  /** posição do bairro entre os 121 de Fortaleza, 0 a 100 */
  notas: Record<NotaBairro, number | null>;
  /** minutos de ônibus/metrô (mediana, dia útil, saída 6h30–8h) */
  tempoAtePolo: Partial<Record<PoloId, number>>;
  /** idem, até cada um dos 121 bairros (chave = id do bairro) */
  tempoAteBairro: Record<string, number>;
}

/** Bairro de Fortaleza como destino da pergunta 2 (os 121), com o centro aproximado. */
export interface Destino {
  id: number;
  nome: string;
  slug: string;
  /** região de leitura (das 5) em que o bairro fica */
  regiao: RegiaoSlug;
  lat: number;
  lon: number;
}

/** Destino diário: um dos 12 lugares mais procurados ou um bairro ("b24" = bairro de id 24). */
export type DestinoId = PoloId | `b${number}`;

export interface Polo {
  id: PoloId;
  nome: string;
  lat: number;
  lon: number;
}

export type FaixaMcmv = 1 | 2 | 3 | 4;

export interface Empreendimento {
  slug: string;
  ordem: number;
  nome: string;
  linha: "mrv" | "sensia";
  cidade: Cidade;
  bairroNome: string;
  bairroId: number | null;
  regiao: RegiaoSlug;
  coord: { lat: number; lon: number };
  /** true quando o ponto é o centro do bairro, não o endereço exato */
  coordAproximada: boolean;
  endereco: string | null;
  status: Status;
  quartos: number[];
  suite: boolean;
  /** null quando a página oficial não informa */
  varanda: "sim" | "opcao" | null;
  areaMin: number | null;
  areaMax: number | null;
  elevador: boolean | null;
  unidades: number;
  vagas: number;
  vagasPorUnidade: number;
  lazer: Lazer[];
  lazerItens: string[];
  diferenciais: string[];
  proximoA: string | null;
  descricao: string[];
  mcmv: boolean;
  /** Preço de tabela (data/curated/precos.json). Uso interno: só o scoring lê, nunca vai para a tela. */
  preco: number | null;
  /** Faixas do Minha Casa Minha Vida que o imóvel atende; vazio = fora do MCMV. */
  faixasMcmv: FaixaMcmv[];
  urlOficial: string;
  imagens: {
    capa: Imagem;
    galeria: Imagem[];
    plantas: Imagem[];
    implantacao: Imagem[];
    aerea: Imagem[];
  };
  fonte: { extraidoEm: string };
}
