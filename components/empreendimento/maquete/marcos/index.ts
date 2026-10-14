import type { ComponentType } from "react";
import type { Fabrica } from "../Cena";
import { Aeroporto } from "./Aeroporto";
import { Castelao } from "./Castelao";
import { Iguatemi } from "./Iguatemi";
import { Messejana } from "./Messejana";

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
};
