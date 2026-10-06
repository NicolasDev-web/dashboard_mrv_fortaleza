import type { CSSProperties } from "react";
import type { Imagem } from "@/lib/types";

type Props = {
  img: Pick<Imagem, "src" | "alt" | "w" | "h" | "cor" | "blur" | "larguras" | "fallback">;
  /** atributo `sizes` do srcset; o padrão serve para cards em grade */
  sizes?: string;
  /** imagem do LCP: carrega cedo e com prioridade alta */
  priority?: boolean;
  className?: string;
  /** `cover` recorta para preencher (cards, capa); `contain` mostra inteira (plantas) */
  fit?: "cover" | "contain";
  alt?: string;
  style?: CSSProperties;
};

/**
 * <picture> com as variantes geradas por scripts/build-images.ts: AVIF em várias larguras e um WebP
 * de reserva. Enquanto baixa, mostra a cor dominante e um blur de ~300 bytes, no mesmo tamanho final
 * (sem salto de layout).
 */
export function Img({ img, sizes = "(min-width: 1024px) 400px, (min-width: 768px) 50vw, 100vw", priority, className = "", fit = "cover", alt, style }: Props) {
  const srcSet = img.larguras.map((l) => `${img.src}-${l}.avif ${l}w`).join(", ");
  return (
    <picture
      className={`block overflow-hidden ${className}`}
      style={{ backgroundColor: img.cor, backgroundImage: fit === "cover" ? `url(${img.blur})` : undefined, backgroundSize: "cover", backgroundPosition: "center", ...style }}
    >
      <source type="image/avif" srcSet={srcSet} sizes={sizes} />
      {/* variantes já otimizadas no build: sem Image Optimization da Vercel */}
      <img
        src={`${img.src}-${img.fallback}.webp`}
        alt={alt ?? img.alt}
        width={img.w}
        height={img.h}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        fetchPriority={priority ? "high" : "auto"}
        className={`h-full w-full ${fit === "cover" ? "object-cover" : "object-contain"}`}
      />
    </picture>
  );
}
