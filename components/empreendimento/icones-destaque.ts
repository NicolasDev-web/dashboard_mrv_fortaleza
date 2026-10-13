import {
  AirVent, Bath, BedDouble, Bike, Blocks, Car, Cctv, CookingPot, Dumbbell, Fence, Gauge, Layers, Lightbulb, PawPrint,
  Recycle, ShieldCheck, Sprout, Store, Trees, Trophy, UtensilsCrossed, Waves, Zap,
  type LucideIcon,
} from "lucide-react";

/**
 * Ícone de cada item de lazer/diferencial, pelo texto da página oficial.
 * O primeiro que casar vence: a ordem importa ("Vestiário da piscina" é piscina, "Bancada do banheiro" é banheiro).
 * Sem casar, quem usa cai no ícone genérico (Sparkles).
 */
export const ICONES_DESTAQUE: [RegExp, LucideIcon][] = [
  [/piscina/i, Waves],
  [/academia|funcional|crossfit/i, Dumbbell],
  [/playground|playbaby|kids|brinquedo/i, Blocks],
  [/churrasqueira|gourmet|pizza|festas|happy/i, UtensilsCrossed],
  [/quadra|jogos|futmesa/i, Trophy],
  [/horta|pomar/i, Sprout],
  [/caminhada|piquenique|zen|pra[cç]a|gazebo|lazer/i, Trees],
  [/pet/i, PawPrint],
  [/banheiro|molhadas|tanque/i, Bath],
  [/bancada/i, CookingPot],
  [/ar condicionado/i, AirVent],
  [/su[ií]te/i, BedDouble],
  [/varanda/i, Fence],
  [/piso|cer[aâ]mica|laminado|revestimento/i, Layers],
  [/medi[cç][aã]o/i, Gauge],
  [/economizador|lumin[aá]ria/i, Lightbulb],
  [/circuito|tv/i, Cctv],
  [/cerca/i, Zap],
  [/guarita|seguran[cç]a|cancela/i, ShieldCheck],
  [/biciclet/i, Bike],
  [/coleta|recicl/i, Recycle],
  [/garagem|vaga|car wash/i, Car],
  [/market|mercado|loja/i, Store],
];
