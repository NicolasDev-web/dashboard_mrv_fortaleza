import type { Empreendimento } from "@/lib/types";
import { polos } from "@/lib/data";
import type { Referencia } from "./tipos";

type Lugar = { nome: string; lat: number; lon: number; marco?: string };

/**
 * Pontos conhecidos da cidade citados nos empreendimentos ou nas vistas aéreas da MRV. Coordenadas do
 * OpenStreetMap (Nominatim, out/2026); as marcadas com "aprox." não foram achadas lá e vêm do mapa,
 * com erro de algumas centenas de metros, o que não muda a direção vista de longe.
 */
const lugares: Record<string, Lugar> = {
  riomarFortaleza: { nome: "Shopping RioMar Fortaleza", lat: -3.7416, lon: -38.4733 },
  riomarKennedy: { nome: "RioMar Kennedy", lat: -3.7264, lon: -38.567 },
  northShopping: { nome: "North Shopping Fortaleza", lat: -3.7349, lon: -38.566 },
  praiaIracema: { nome: "Praia de Iracema", lat: -3.7181, lon: -38.5168 },
  praiaFuturo: { nome: "Praia do Futuro", lat: -3.7312, lon: -38.4564 },
  mercadoCentral: { nome: "Mercado Central", lat: -3.7234, lon: -38.524 },
  lagoaMessejana: { nome: "Lagoa de Messejana", lat: -3.8276, lon: -38.4962, marco: "messejana" },
  rachelQueiroz: { nome: "Parque Rachel de Queiroz", lat: -3.7451, lon: -38.5696 },
  centroFashion: { nome: "Centro Fashion", lat: -3.7191, lon: -38.5429 },
  parqueLiberdade: { nome: "Parque da Liberdade", lat: -3.7315, lon: -38.5258 },
  ijf: { nome: "Hospital IJF", lat: -3.7341, lon: -38.5313 },
  elzirCabral: { nome: "Estádio Elzir Cabral", lat: -3.7089, lon: -38.5885 },
  cucaJangurussu: { nome: "Cuca Jangurussu", lat: -3.8314, lon: -38.5205 },
  cambeba: { nome: "Centro Administrativo do Cambeba", lat: -3.8122, lon: -38.4875 },
  lagoaMaraponga: { nome: "Lagoa da Maraponga", lat: -3.7893, lon: -38.5689 },
  buenaVista: { nome: "Shopping Buena Vista", lat: -3.7656, lon: -38.5734 },
  unifanor: { nome: "UniFanor", lat: -3.7495, lon: -38.4628 },
  sescIparana: { nome: "Sesc Iparana", lat: -3.6925, lon: -38.6287 },
  cumbuco: { nome: "Praia do Cumbuco", lat: -3.6259, lon: -38.7256 },
  castelao: { nome: "Arena Castelão", lat: -3.8072, lon: -38.5222, marco: "castelao" }, // aprox.
  coco: { nome: "Parque do Cocó", lat: -3.7485, lon: -38.4875 }, // aprox.
  dragaoMar: { nome: "Dragão do Mar", lat: -3.7222, lon: -38.5205 }, // aprox.
  terminalAntonioBezerra: { nome: "Terminal Antônio Bezerra", lat: -3.7382, lon: -38.5885 }, // aprox.
  prefeituraEusebio: { nome: "Prefeitura do Eusébio", lat: -3.89, lon: -38.456 }, // aprox.
  centroCaucaia: { nome: "Centro de Caucaia", lat: -3.7361, lon: -38.6531 }, // aprox.
  icarai: { nome: "Praia do Icaraí", lat: -3.687, lon: -38.663 }, // aprox.
  // polos do quiz, com os nomes curtos usados no mapa
  iguatemi: { ...polo("iguatemi", "Shopping Iguatemi"), marco: "iguatemi" },
  beiraMar: polo("beira_mar", "Beira-Mar"),
  centro: polo("centro", "Centro"),
  unifor: polo("unifor", "Unifor"),
  centroEventos: polo("centro_eventos", "Centro de Eventos"),
  aeroporto: { ...polo("aeroporto", "Aeroporto"), marco: "aeroporto" },
  // o centro de Messejana divide a miniatura com a lagoa (igreja matriz + lagoa com a Iracema)
  messejana: { ...polo("messejana", "Centro de Messejana"), marco: "messejana" },
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

/** Em teste: só estes empreendimentos trocam o pino pela miniatura 3D do lugar */
const MARCOS_ATIVOS = new Set(["reserva-da-lagoa"]);

export function referenciasDe(e: Pick<Empreendimento, "slug" | "coord">): Referencia[] {
  const comMarco = MARCOS_ATIVOS.has(e.slug);
  return (porEmpreendimento[e.slug] ?? []).map((id) => {
    const l = lugares[id];
    return { nome: l.nome, ...rumoEDistancia(e.coord, l), ...(comMarco && l.marco ? { marco: l.marco } : {}) };
  });
}
