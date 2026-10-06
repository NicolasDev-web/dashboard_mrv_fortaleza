import type { Metadata } from "next";
import { Suspense } from "react";
import { Comparar } from "@/components/comparar/Comparar";
import { Rodape } from "@/components/layout/Rodape";
import { dadosScoringResumidos } from "@/lib/data";

export const metadata: Metadata = { title: "Comparar" };

export default function CompararPage() {
  return (
    <>
      <Suspense fallback={<div className="contem py-16"><div className="esqueleto h-8 w-2/3 rounded" /></div>}>
        <Comparar dados={dadosScoringResumidos()} />
      </Suspense>
      <Rodape />
    </>
  );
}
