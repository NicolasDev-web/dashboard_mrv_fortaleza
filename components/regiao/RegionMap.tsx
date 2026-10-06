import mapa from "@/data/mapa.json";
import type { RegiaoSlug } from "@/lib/types";
import { REGIAO_NOME } from "@/lib/rotulos";

type Props = {
  /** região em destaque (verde escuro); as outras ficam claras */
  destaque?: RegiaoSlug | null;
  contagens: Record<RegiaoSlug, number>;
  className?: string;
};

// Posição dos rótulos no sistema do mapa (0–1000 × 0–861, gerado por scripts/build-bairros.ts).
const ROTULO: Record<"oeste-centro" | "leste" | "sul", [number, number]> = {
  "oeste-centro": [300, 215],
  leste: [770, 330],
  sul: [400, 640],
};
// Caucaia fica a oeste da Barra do Ceará; Eusébio, a sudeste. Fora do contorno da cidade: marcadores.
const FORA: Record<"caucaia" | "eusebio", { x: number; y: number }> = {
  caucaia: { x: -250, y: 70 },
  eusebio: { x: 1030, y: 650 },
};

/** Mapa ilustrativo, não geográfico: serve para localizar as regiões, não para medir distâncias. */
export function RegionMap({ destaque, contagens, className = "" }: Props) {
  const cor = (r: RegiaoSlug) => (destaque ? (r === destaque ? "var(--color-green-900)" : "var(--color-sage-200)") : "var(--color-sage-200)");
  const texto = (r: RegiaoSlug) => (destaque === r ? "#fff" : "var(--color-ink)");
  const cidade = (["oeste-centro", "leste", "sul"] as const).map((r) => ({ r, bairros: mapa.bairros.filter((b) => b.regiao === r) }));
  return (
    <svg viewBox="-270 -10 1530 890" className={className} role="img" aria-label="Mapa das regiões com empreendimentos MRV na Grande Fortaleza">
      {cidade.map(({ r, bairros }) => (
        <a key={r} href={`/regioes/${r}`} aria-label={`${REGIAO_NOME[r]}: ${contagens[r]} empreendimentos`} className="group">
          <g className="transition-opacity duration-[var(--t-base)] group-hover:opacity-85">
            {bairros.map((b) => (
              <path key={b.id} d={b.d} fill={cor(r)} stroke="#fff" strokeWidth={1.5} strokeLinejoin="round" />
            ))}
          </g>
          <text x={ROTULO[r][0]} y={ROTULO[r][1]} textAnchor="middle" fontSize="46" fontWeight="800" fill={texto(r)}>
            {REGIAO_NOME[r]}
          </text>
          <text x={ROTULO[r][0]} y={ROTULO[r][1] + 50} textAnchor="middle" fontSize="36" fill={texto(r)} opacity={0.85}>
            {contagens[r]} {contagens[r] === 1 ? "empreendimento" : "empreendimentos"}
          </text>
        </a>
      ))}
      {(Object.keys(FORA) as ("caucaia" | "eusebio")[]).map((r) => {
        const { x, y } = FORA[r];
        const on = destaque === r;
        return (
          <a key={r} href={`/regioes/${r}`} aria-label={`${REGIAO_NOME[r]}: ${contagens[r]} empreendimentos`} className="group">
            <rect x={x} y={y} width={230} height={120} rx={28} fill={on ? "var(--color-green-900)" : "#fff"} stroke="var(--color-green-900)" strokeWidth={4} className="transition-opacity group-hover:opacity-85" />
            <text x={x + 115} y={y + 56} textAnchor="middle" fontSize="40" fontWeight="800" fill={on ? "#fff" : "var(--color-green-900)"}>
              {REGIAO_NOME[r]}
            </text>
            <text x={x + 115} y={y + 96} textAnchor="middle" fontSize="30" fill={on ? "#fff" : "var(--color-ink)"}>
              {contagens[r]} empreend.
            </text>
          </a>
        );
      })}
    </svg>
  );
}
