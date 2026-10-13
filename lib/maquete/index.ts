import type { Maquete } from "./tipos";
import { parqueMarista } from "./parque-marista";

export type { Maquete } from "./tipos";

/** Maquetes 3D já levantadas; os demais empreendimentos seguem sem a seção. */
const maquetes: Record<string, Maquete> = {
  "parque-marista": parqueMarista,
};

export const maquetePorSlug = (slug: string): Maquete | undefined => maquetes[slug];
