/**
 * Confete nas cores MRV (wrapper do canvas-confetti, como o Confetti do Magic UI).
 * A biblioteca só é baixada na hora do disparo. As cores vêm dos tokens do globals.css
 * (o canvas não lê classes); o canvas não recebe cliques e fica acima da revelação.
 */
const TOKENS = ["--color-green-300", "--color-green-500", "--color-orange-300", "--color-sage-200"];

export async function soltarConfete() {
  if (typeof window === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const { default: confetti } = await import("canvas-confetti");
  const css = getComputedStyle(document.documentElement);
  const cores = [...TOKENS.map((t) => css.getPropertyValue(t).trim()).filter(Boolean), "#ffffff"];
  const base = { colors: cores, zIndex: 60, ticks: 240, scalar: 1.1, disableForReducedMotion: true };
  // dois canhões nos cantos de baixo e, logo depois, uma chuva do alto
  confetti({ ...base, particleCount: 80, angle: 60, spread: 65, startVelocity: 62, origin: { x: 0, y: 0.85 } });
  confetti({ ...base, particleCount: 80, angle: 120, spread: 65, startVelocity: 62, origin: { x: 1, y: 0.85 } });
  setTimeout(() => confetti({ ...base, particleCount: 60, spread: 120, startVelocity: 28, gravity: 0.8, origin: { x: 0.5, y: 0.1 } }), 280);
}
