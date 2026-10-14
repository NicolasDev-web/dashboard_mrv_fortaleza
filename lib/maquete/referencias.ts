import type { Empreendimento } from "@/lib/types";
import { polos } from "@/lib/data";
import type { Referencia } from "./tipos";

type Lugar = { nome: string; lat: number; lon: number; marco?: string; sobre?: string };

/**
 * Pontos conhecidos da cidade citados nos empreendimentos ou nas vistas aéreas da MRV. Coordenadas do
 * OpenStreetMap (Nominatim, out/2026); as marcadas com "aprox." não foram achadas lá e vêm do mapa,
 * com erro de algumas centenas de metros, o que não muda a direção vista de longe.
 */
const lugares: Record<string, Lugar> = {
  riomarFortaleza: { nome: "Shopping RioMar Fortaleza", lat: -3.7411, lon: -38.4718, marco: "riomarFortaleza", sobre: "Um dos maiores shoppings do Ceará, no Papicu, aberto em 2014: cerca de 385 lojas em vários pisos, com a Lagoa do Papicu ao lado." },
  riomarKennedy: { nome: "RioMar Kennedy", lat: -3.7262, lon: -38.567, marco: "riomarKennedy", sobre: "Shopping da Av. Sargento Hermínio, no Presidente Kennedy, aberto em 2016, com cerca de 275 lojas, hipermercado e um grande estacionamento descoberto." },
  northShopping: { nome: "North Shopping Fortaleza", lat: -3.7349, lon: -38.5663, marco: "northShopping", sobre: "O \"Nortão\", na Av. Bezerra de Menezes: lojas em dois pisos, cinema, supermercado e a área gastronômica ao ar livre do Quintal do Nortão." },
  praiaIracema: { nome: "Praia de Iracema", lat: -3.7181, lon: -38.5169, marco: "praiaIracema", sobre: "Bairro boêmio à beira-mar, com a Ponte dos Ingleses (píer de 1921 que virou mirante do pôr do sol), o calçadão e a estátua Iracema Guardiã no Aterro." },
  praiaFuturo: { nome: "Praia do Futuro", lat: -3.7312, lon: -38.4564, marco: "praiaFuturo", sobre: "A orla leste da cidade, com pouco mais de 7 km de areia e as grandes barracas de praia, que têm piscina, restaurante e música." },
  // o Mercado Central já faz parte da miniatura do Centro (com a Catedral e a Praça do Ferreira)
  mercadoCentral: { nome: "Mercado Central", lat: -3.7234, lon: -38.524, marco: "centro", sobre: "Prédio de vários andares com centenas de lojas de artesanato, rendas, castanha e produtos regionais, ao lado da Catedral." },
  lagoaMessejana: { nome: "Lagoa de Messejana", lat: -3.8276, lon: -38.4962, marco: "messejana", sobre: "Cartão-postal de Messejana, com calçadão em volta e a estátua \"Banho de Iracema\", de 12 m, dentro da água, que também funciona como fonte." },
  rachelQueiroz: { nome: "Parque Rachel de Queiroz", lat: -3.7451, lon: -38.5696 },
  centroFashion: { nome: "Centro Fashion", lat: -3.7191, lon: -38.5429 },
  parqueLiberdade: { nome: "Parque da Liberdade", lat: -3.7315, lon: -38.5258 },
  ijf: { nome: "Hospital IJF", lat: -3.7341, lon: -38.5313 },
  elzirCabral: { nome: "Estádio Elzir Cabral", lat: -3.7089, lon: -38.5885 },
  cucaJangurussu: { nome: "Cuca Jangurussu", lat: -3.8314, lon: -38.5205 },
  cambeba: { nome: "Centro Administrativo do Cambeba", lat: -3.8117, lon: -38.4874, marco: "cambeba", sobre: "Centro Administrativo Governador Virgílio Távora, junto à CE-402, onde ficam o Tribunal de Justiça, o Ministério Público e várias secretarias do estado. Foi a sede do governo de 1987 a 2011." },
  lagoaMaraponga: { nome: "Lagoa da Maraponga", lat: -3.7893, lon: -38.5689 },
  buenaVista: { nome: "Shopping Buena Vista", lat: -3.7656, lon: -38.5734 },
  unifanor: { nome: "UniFanor", lat: -3.7495, lon: -38.4628 },
  sescIparana: { nome: "Sesc Iparana", lat: -3.6925, lon: -38.6287 },
  cumbuco: { nome: "Praia do Cumbuco", lat: -3.6259, lon: -38.7256 },
  castelao: { nome: "Arena Castelão", lat: -3.8072, lon: -38.5222, marco: "castelao", sobre: "Estádio do Fortaleza e do Ceará, aberto em 1973 e reconstruído para a Copa de 2014, com cerca de 64 mil lugares. Recebe jogos, shows e grandes eventos." }, // aprox.
  coco: { nome: "Parque do Cocó", lat: -3.7485, lon: -38.4875 }, // aprox.
  dragaoMar: { nome: "Dragão do Mar", lat: -3.7222, lon: -38.5205 }, // aprox.
  terminalAntonioBezerra: { nome: "Terminal Antônio Bezerra", lat: -3.73752, lon: -38.58417, marco: "terminalAntonioBezerra", sobre: "Terminal de integração de ônibus na Av. Mister Hull, onde as linhas da zona oeste se encontram. Ao lado fica um Vapt Vupt, posto de serviços do governo do estado." },
  prefeituraEusebio: { nome: "Prefeitura do Eusébio", lat: -3.89, lon: -38.456 }, // aprox.
  centroCaucaia: { nome: "Centro de Caucaia", lat: -3.7361, lon: -38.6531 }, // aprox.
  icarai: { nome: "Praia do Icaraí", lat: -3.687, lon: -38.663 }, // aprox.
  // polos do quiz, com os nomes curtos usados no mapa
  iguatemi: { ...polo("iguatemi", "Shopping Iguatemi"), marco: "iguatemi", sobre: "Shopping da Av. Washington Soares, aberto em 1982 e ampliado várias vezes, com mais de 400 lojas, cinema e restaurantes, colado ao Parque do Cocó." },
  beiraMar: polo("beira_mar", "Beira-Mar"),
  centro: { ...polo("centro", "Centro"), marco: "centro", sobre: "O centro histórico e comercial da cidade, com a Catedral Metropolitana e suas agulhas de 75 m, a Praça do Ferreira com a Coluna da Hora e o comércio popular." },
  unifor: { ...polo("unifor", "Unifor"), marco: "unifor", sobre: "Universidade de Fortaleza, no Edson Queiroz: um campus de mais de 40 hectares, muito arborizado, com biblioteca, ginásio e pista de atletismo." },
  centroEventos: polo("centro_eventos", "Centro de Eventos"),
  aeroporto: { ...polo("aeroporto", "Aeroporto"), marco: "aeroporto", sobre: "Aeroporto Internacional Pinto Martins, a principal porta de entrada aérea do Ceará, com voos nacionais e internacionais e 15 pontes de embarque." },
  // o centro de Messejana divide a miniatura com a lagoa (igreja matriz + lagoa com a Iracema)
  messejana: { ...polo("messejana", "Centro de Messejana"), marco: "messejana", sobre: "Bairro tradicional do sudeste da cidade, com a Igreja Matriz de Nossa Senhora da Conceição, comércio e serviços em volta da lagoa." },
  parangaba: polo("parangaba", "Parangaba"),
  ufcPici: polo("ufc_pici", "UFC Pici"),
};

function polo(id: string, nome: string): Lugar {
  const p = polos.find((x) => x.id === id)!;
  return { nome, lat: p.lat, lon: p.lon };
}

/** Os mais citados no texto e nas vistas aéreas de cada empreendimento, no máximo seis */
const porEmpreendimento: Record<string, (keyof typeof lugares)[]> = {
  "residencial-fortitudine": ["northShopping", "riomarKennedy", "terminalAntonioBezerra", "rachelQueiroz", "ufcPici", "centro"],
  "residencial-flor-do-sertao": ["centroFashion", "praiaIracema", "riomarKennedy", "northShopping", "mercadoCentral", "centro"],
  "ville-de-lisboa": ["sescIparana", "centroCaucaia", "icarai", "northShopping", "terminalAntonioBezerra"],
  "reserva-da-lagoa": ["castelao", "aeroporto", "messejana", "lagoaMessejana", "iguatemi"],
  "residencial-la-serena": ["messejana", "lagoaMessejana", "cucaJangurussu", "castelao", "cambeba"],
  "forte-alencar": ["cambeba", "messejana", "lagoaMessejana", "castelao", "iguatemi", "unifor"],
  "parque-marista": ["praiaIracema", "beiraMar", "mercadoCentral", "dragaoMar", "parqueLiberdade", "ijf"],
  "residencial-farol-do-atlantico": ["iguatemi", "riomarFortaleza", "praiaFuturo", "coco", "unifor", "centroEventos"],
  "sensia-reserva-vila-do-sol": ["praiaFuturo", "coco", "iguatemi", "unifor", "riomarFortaleza"],
  "ville-de-porto": ["sescIparana", "centroCaucaia", "icarai", "cumbuco", "northShopping"],
  "torre-do-mar": ["lagoaMaraponga", "buenaVista", "parangaba", "aeroporto", "castelao"],
  "porto-das-mares": ["elzirCabral", "praiaIracema", "centro", "centroFashion", "riomarKennedy", "northShopping"],
  "residencial-mandacaru": ["terminalAntonioBezerra", "northShopping", "riomarKennedy", "rachelQueiroz", "ufcPici"],
  "reserva-brisa-do-mar": ["unifanor", "unifor", "centroEventos", "riomarFortaleza", "praiaFuturo", "iguatemi"],
  "residencial-valparaiso": ["messejana", "lagoaMessejana", "cucaJangurussu", "castelao", "cambeba"],
  "eco-park": ["prefeituraEusebio", "messejana", "unifor", "iguatemi"],
};

const rad = (g: number) => (g * Math.PI) / 180;

/** Rumo (graus a partir do norte, sentido horário) e distância em linha reta, em km */
function rumoEDistancia(de: { lat: number; lon: number }, para: Lugar) {
  const [f1, f2] = [rad(de.lat), rad(para.lat)];
  const dl = rad(para.lon - de.lon);
  const y = Math.sin(dl) * Math.cos(f2);
  const x = Math.cos(f1) * Math.sin(f2) - Math.sin(f1) * Math.cos(f2) * Math.cos(dl);
  const rumo = ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
  const a = Math.sin((f2 - f1) / 2) ** 2 + Math.cos(f1) * Math.cos(f2) * Math.sin(dl / 2) ** 2;
  const km = 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return { rumo: Math.round(rumo), km: Math.round(km * 10) / 10 };
}

export function referenciasDe(e: Pick<Empreendimento, "slug" | "coord">): Referencia[] {
  return (porEmpreendimento[e.slug] ?? []).map((id) => {
    const l = lugares[id];
    return { nome: l.nome, ...rumoEDistancia(e.coord, l), ...(l.marco ? { marco: l.marco } : {}), ...(l.sobre ? { sobre: l.sobre } : {}) };
  });
}
