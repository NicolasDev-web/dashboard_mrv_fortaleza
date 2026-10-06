"use client";

import { useState } from "react";
import { Maximize2, ZoomIn, ZoomOut } from "lucide-react";
import type { Imagem } from "@/lib/types";
import { Img } from "@/components/ui/Img";
import { Sheet } from "@/components/ui/Sheet";

/**
 * Plantas e implantação têm texto embutido e pequeno: miniatura só para escolher, leitura sempre
 * em tela cheia, com zoom (botão ou pinça nativa, já que o contêiner rola nos dois eixos).
 */
export function FloorPlans({ nome, imagens, rotulo }: { nome: string; imagens: Imagem[]; rotulo: string }) {
  return (
    <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {imagens.map((img, i) => (
        <li key={img.id}>
          <Sheet
            modo="tela"
            titulo={`${rotulo} ${imagens.length > 1 ? `${i + 1} de ${imagens.length}` : ""} · ${nome}`}
            descricao="Imagem ilustrativa"
            trigger={
              <button type="button" className="group relative block w-full overflow-hidden rounded-lg border border-line bg-white text-left">
                <Img img={img} fit="contain" sizes="(min-width: 768px) 25vw, 50vw" className="aspect-[4/3] w-full bg-white" style={{ backgroundColor: "#fff" }} />
                <span className="absolute bottom-2 right-2 flex size-9 items-center justify-center rounded-full bg-white/95 text-green-900 shadow-e1">
                  <Maximize2 className="size-4" aria-hidden />
                </span>
                <span className="sr-only">Abrir {rotulo.toLowerCase()} {i + 1} em tela cheia</span>
              </button>
            }
          >
            <Visualizador img={img} />
          </Sheet>
        </li>
      ))}
    </ul>
  );
}

function Visualizador({ img }: { img: Imagem }) {
  const [zoom, setZoom] = useState(1);
  return (
    <>
      <div className="flex-1 overflow-auto bg-white" style={{ touchAction: "pan-x pan-y pinch-zoom" }}>
        <div style={{ width: `${zoom * 100}%` }} className="mx-auto transition-[width] duration-[var(--t-slow)] ease-mrv">
          <Img img={img} fit="contain" sizes="100vw" className="w-full" style={{ aspectRatio: `${img.w} / ${img.h}`, backgroundColor: "#fff" }} />
        </div>
      </div>
      <div className="flex justify-center gap-2 p-3 pb-[calc(12px+env(safe-area-inset-bottom))]">
        <button type="button" onClick={() => setZoom((z) => Math.max(1, z - 0.75))} disabled={zoom === 1} aria-label="Diminuir zoom" className="flex size-11 items-center justify-center rounded-full bg-white/10 disabled:opacity-40">
          <ZoomOut className="size-5" aria-hidden />
        </button>
        <button type="button" onClick={() => setZoom((z) => Math.min(3.25, z + 0.75))} disabled={zoom >= 3.25} aria-label="Aumentar zoom" className="flex size-11 items-center justify-center rounded-full bg-white/10 disabled:opacity-40">
          <ZoomIn className="size-5" aria-hidden />
        </button>
      </div>
    </>
  );
}
