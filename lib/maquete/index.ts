import type { Maquete } from "./tipos";
import { brisaDoMar } from "./brisa-do-mar";
import { ecoPark } from "./eco-park";
import { farolDoAtlantico } from "./farol-do-atlantico";
import { florDoSertao } from "./flor-do-sertao";
import { fortitudine } from "./fortitudine";
import { forteAlencar } from "./forte-alencar";
import { laSerena } from "./la-serena";
import { mandacaru } from "./mandacaru";
import { parqueMarista } from "./parque-marista";
import { portoDasMares } from "./porto-das-mares";
import { reservaDaLagoa } from "./reserva-da-lagoa";
import { sensiaVilaDoSol } from "./sensia-vila-do-sol";
import { torreDoMar } from "./torre-do-mar";
import { valparaiso } from "./valparaiso";
import { villeDeLisboa } from "./ville-de-lisboa";
import { villeDePorto } from "./ville-de-porto";

export type { Maquete } from "./tipos";

/** Maquetes 3D levantadas das plantas de implantação (a do Fortitudine, da vista aérea). */
const maquetes: Record<string, Maquete> = {
  "residencial-fortitudine": fortitudine,
  "residencial-flor-do-sertao": florDoSertao,
  "ville-de-lisboa": villeDeLisboa,
  "reserva-da-lagoa": reservaDaLagoa,
  "residencial-la-serena": laSerena,
  "forte-alencar": forteAlencar,
  "parque-marista": parqueMarista,
  "residencial-farol-do-atlantico": farolDoAtlantico,
  "sensia-reserva-vila-do-sol": sensiaVilaDoSol,
  "ville-de-porto": villeDePorto,
  "torre-do-mar": torreDoMar,
  "porto-das-mares": portoDasMares,
  "residencial-mandacaru": mandacaru,
  "reserva-brisa-do-mar": brisaDoMar,
  "residencial-valparaiso": valparaiso,
  "eco-park": ecoPark,
};

export const maquetePorSlug = (slug: string): Maquete | undefined => maquetes[slug];
