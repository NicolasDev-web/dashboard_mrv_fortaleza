import type { Fabrica } from "../Cena";

/** Esboço provisório d Shopping Iguatemi; substituído pelo modelo final */
export function Iguatemi({ fab }: { fab: Fabrica }) {
  return (
    <mesh position-y={6} castShadow material={fab.cor("#c9c5be")}>
      <boxGeometry args={[40, 12, 40]} />
    </mesh>
  );
}
