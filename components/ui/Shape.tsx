/**
 * Grafismo do sistema MRV: 2 a 3 formas em intersecção, uma preenchida e uma em linha, com cantos
 * arredondados e leve rotação (guia, seção 6). Desenho próprio; não deriva nem imita o logo.
 * Usado só em pontos de marca: Home, início do quiz e topo do resultado.
 */
type Props = {
  variante?: "home" | "quiz" | "resultado";
  /** "claro" sobre fundo branco, "escuro" sobre verde */
  sobre?: "claro" | "escuro";
  className?: string;
};

export function Shape({ variante = "home", sobre = "claro", className = "" }: Props) {
  const linha = sobre === "claro" ? "var(--color-green-900)" : "var(--color-green-300)";
  const cheio = sobre === "claro" ? "var(--color-green-500)" : "var(--color-green-700)";
  const acento = variante === "resultado" ? "var(--color-orange-300)" : sobre === "claro" ? "var(--color-green-300)" : "var(--color-green-500)";

  if (variante === "quiz") {
    return (
      <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
        <rect x="14" y="30" width="64" height="64" rx="18" fill={cheio} transform="rotate(-8 46 62)" />
        <circle cx="76" cy="50" r="32" fill="none" stroke={linha} strokeWidth="5" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 240 240" className={className} aria-hidden="true">
      <rect x="28" y="70" width="120" height="120" rx="34" fill={cheio} transform="rotate(-10 88 130)" />
      <circle cx="152" cy="98" r="62" fill="none" stroke={linha} strokeWidth="8" />
      <rect x="132" y="150" width="62" height="62" rx="18" fill={acento} transform="rotate(14 163 181)" />
    </svg>
  );
}
