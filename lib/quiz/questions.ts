import type { Respostas } from "./types";

/** Nome do ícone em components/quiz/icones.tsx */
export type Icone =
  | "cidade" | "regiao" | "mapa" | "casa" | "onibus" | "carro" | "bike" | "app"
  | "pessoa" | "casal" | "familia" | "pet" | "piscina" | "academia" | "kids" | "festas"
  | "esportes" | "verde" | "saude" | "escolas" | "comercio" | "parque" | "mobilidade"
  | "chave" | "calendario" | "tanto_faz";

export interface Opcao<V extends string = string> {
  valor: V;
  rotulo: string;
  descricao?: string;
  icone?: Icone;
}

export interface Pergunta {
  id: "onde" | "destino" | "transporte" | "moradores" | "lazer" | "bairro" | "prazo";
  titulo: string;
  ajuda?: string;
  tipo: "unica" | "multipla" | "destino";
  max?: number;
  opcoes: Opcao[];
}

export const PERGUNTAS: Pergunta[] = [
  {
    id: "onde",
    titulo: "Onde você topa morar?",
    tipo: "unica",
    opcoes: [
      { valor: "fortaleza", rotulo: "Só em Fortaleza", icone: "cidade" },
      { valor: "metropolitana", rotulo: "Fortaleza ou Região Metropolitana", descricao: "Inclui Caucaia e Eusébio", icone: "mapa" },
      { valor: "regioes", rotulo: "Quero escolher as regiões", icone: "regiao" },
    ],
  },
  {
    id: "destino",
    titulo: "Para onde você vai quase todo dia?",
    ajuda: "Trabalho, faculdade ou onde você mais circula. Vale qualquer bairro de Fortaleza.",
    tipo: "destino",
    opcoes: [
      { valor: "centro", rotulo: "Centro" },
      { valor: "aldeota", rotulo: "Aldeota" },
      { valor: "beira_mar", rotulo: "Beira-Mar" },
      { valor: "papicu", rotulo: "Papicu" },
      { valor: "iguatemi", rotulo: "Iguatemi" },
      { valor: "unifor", rotulo: "Unifor" },
      { valor: "centro_eventos", rotulo: "Centro de Eventos" },
      { valor: "messejana", rotulo: "Messejana" },
      { valor: "parangaba", rotulo: "Parangaba" },
      { valor: "ufc_benfica", rotulo: "UFC Benfica" },
      { valor: "ufc_pici", rotulo: "UFC Pici" },
      { valor: "aeroporto", rotulo: "Aeroporto" },
      { valor: "casa", rotulo: "Trabalho ou estudo de casa", icone: "casa" },
    ],
  },
  {
    id: "transporte",
    titulo: "Como você costuma se deslocar?",
    tipo: "unica",
    opcoes: [
      { valor: "onibus", rotulo: "Ônibus ou metrô", icone: "onibus" },
      { valor: "carro", rotulo: "Carro ou moto", descricao: "Vamos olhar a vaga de garagem", icone: "carro" },
      { valor: "bike", rotulo: "Bicicleta ou a pé", icone: "bike" },
      { valor: "app", rotulo: "Aplicativo", icone: "app" },
    ],
  },
  {
    id: "moradores",
    titulo: "Quem vai morar com você?",
    tipo: "unica",
    opcoes: [
      { valor: "so", rotulo: "Só eu", icone: "pessoa" },
      { valor: "casal", rotulo: "Eu e meu par", icone: "casal" },
      { valor: "filhos", rotulo: "Família com crianças", icone: "familia" },
    ],
  },
  {
    id: "lazer",
    titulo: "O que não pode faltar no condomínio?",
    ajuda: "Escolha até 3.",
    tipo: "multipla",
    max: 3,
    opcoes: [
      { valor: "piscina", rotulo: "Piscina", icone: "piscina" },
      { valor: "academia", rotulo: "Academia", icone: "academia" },
      { valor: "kids", rotulo: "Playground", icone: "kids" },
      { valor: "festas", rotulo: "Festas e churrasco", icone: "festas" },
      { valor: "esportes", rotulo: "Quadra ou jogos", icone: "esportes" },
      { valor: "verde", rotulo: "Área verde", icone: "verde" },
    ],
  },
  {
    id: "bairro",
    titulo: "E no bairro, o que pesa mais?",
    ajuda: "Escolha até 2.",
    tipo: "multipla",
    max: 2,
    opcoes: [
      { valor: "saude", rotulo: "Saúde por perto", icone: "saude" },
      { valor: "escolas", rotulo: "Escolas", icone: "escolas" },
      { valor: "comercio", rotulo: "Comércio do dia a dia", icone: "comercio" },
      { valor: "lazer", rotulo: "Praças e parques", icone: "parque" },
      { valor: "mobilidade", rotulo: "Ônibus fácil", icone: "mobilidade" },
    ],
  },
  {
    id: "prazo",
    titulo: "Quando você quer se mudar?",
    tipo: "unica",
    opcoes: [
      { valor: "logo", rotulo: "O quanto antes", icone: "chave" },
      { valor: "medio", rotulo: "Em 1 a 2 anos", icone: "calendario" },
      { valor: "tanto_faz", rotulo: "Tanto faz", icone: "tanto_faz" },
    ],
  },
];

/** Uma pergunta está respondida? Múltipla escolha aceita "nenhuma" explicitamente (lista vazia). */
export function respondida(p: Pergunta, r: Respostas): boolean {
  switch (p.id) {
    case "onde": return r.onde !== undefined && (r.onde !== "regioes" || !!r.regioes?.length);
    case "lazer": return r.lazer !== undefined;
    case "bairro": return r.bairro !== undefined;
    default: return r[p.id] !== undefined;
  }
}
