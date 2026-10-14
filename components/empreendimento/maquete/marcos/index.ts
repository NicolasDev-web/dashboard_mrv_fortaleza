import type { ComponentType } from "react";
import type { Fabrica } from "../Cena";
import { Aeroporto } from "./Aeroporto";
import { Cambeba } from "./Cambeba";
import { Castelao } from "./Castelao";
import { Centro } from "./Centro";
import { Iguatemi } from "./Iguatemi";
import { Messejana } from "./Messejana";
import { NorthShopping } from "./NorthShopping";
import { PraiaDeIracema, PraiaDoFuturo } from "./Praias";
import { RioMarFortaleza, RioMarKennedy } from "./RioMar";
import { TerminalAntonioBezerra } from "./TerminalAntonioBezerra";
import { Unifor } from "./Unifor";

/**
 * Miniaturas 3D de lugares da cidade. Cada modelo é feito em metros, centrado na origem, com ~50 m de
 * pegada, base em y = 0 e o próprio norte em −z; a cena gira e posiciona. `altura` é onde a etiqueta
 * com o nome fica.
 */
export interface Marco {
  Modelo: ComponentType<{ fab: Fabrica }>;
  altura: number;
}

export const marcos: Record<string, Marco> = {
  castelao: { Modelo: Castelao, altura: 12 },
  aeroporto: { Modelo: Aeroporto, altura: 16 },
  iguatemi: { Modelo: Iguatemi, altura: 9 },
  messejana: { Modelo: Messejana, altura: 14 },
  northShopping: { Modelo: NorthShopping, altura: 13 },
  riomarFortaleza: { Modelo: RioMarFortaleza, altura: 22 },
  riomarKennedy: { Modelo: RioMarKennedy, altura: 15 },
  unifor: { Modelo: Unifor, altura: 7 },
  praiaIracema: { Modelo: PraiaDeIracema, altura: 7 },
  praiaFuturo: { Modelo: PraiaDoFuturo, altura: 6 },
  centro: { Modelo: Centro, altura: 19 },
  terminalAntonioBezerra: { Modelo: TerminalAntonioBezerra, altura: 5 },
  cambeba: { Modelo: Cambeba, altura: 7 },
};
