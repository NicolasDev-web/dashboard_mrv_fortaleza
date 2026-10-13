"use client";

import { useState, type CSSProperties } from "react";
import {
  AirVent, Bath, BedDouble, Bike, Blocks, Car, Cctv, CookingPot, Dumbbell, Fence, Gauge, Layers, Lightbulb, Pause, PawPrint, Play,
  Recycle, ShieldCheck, Sparkles, Sprout, Store, Trees, Trophy, UtensilsCrossed, Waves, Zap,
  type LucideIcon,
} from "lucide-react";
import type { Faixa } from "@/lib/destaques";
import { Button } from "@/components/ui/Button";

/** Primeiro que casar vence: a ordem importa ("Vestiário da piscina" é piscina, "Bancada do banheiro" é banheiro). */
const ICONES: [RegExp, LucideIcon][] = [
  [/piscina/i, Waves],
  [/academia|funcional|crossfit/i, Dumbbell],
  [/playground|playbaby|kids|brinquedo/i, Blocks],
  [/churrasqueira|gourmet|pizza|festas|happy/i, UtensilsCrossed],
  [/quadra|jogos|futmesa/i, Trophy],
  [/horta|pomar/i, Sprout],
  [/caminhada|piquenique|zen|pra[cç]a|gazebo|lazer/i, Trees],
  [/pet/i, PawPrint],
  [/banheiro|molhadas|tanque/i, Bath],
  [/bancada/i, CookingPot],
  [/ar condicionado/i, AirVent],
  [/su[ií]te/i, BedDouble],
  [/varanda/i, Fence],
  [/piso|cer[aâ]mica|laminado|revestimento/i, Layers],
  [/medi[cç][aã]o/i, Gauge],
  [/economizador|lumin[aá]ria/i, Lightbulb],
  [/circuito|tv/i, Cctv],
  [/cerca/i, Zap],
  [/guarita|seguran[cç]a|cancela/i, ShieldCheck],
  [/biciclet/i, Bike],
  [/coleta|recicl/i, Recycle],
  [/garagem|vaga|car wash/i, Car],
  [/market|mercado|loja/i, Store],
];

/** Abaixo disso a faixa fica parada: poucos itens rolando viram repetição. */
const MIN_ROLAR = 5;
/** Segundos por item: a velocidade de leitura é a mesma em faixas curtas e longas. */
const SEGUNDOS_POR_ITEM = 3.5;

function Cartao({ texto }: { texto: string }) {
  const I = ICONES.find(([re]) => re.test(texto))?.[1] ?? Sparkles;
  return (
    <li className="flex min-h-12 max-w-full shrink-0 items-center gap-2.5 rounded-lg border border-line bg-white py-1.5 pl-2 pr-4 text-[15px] leading-snug text-ink">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-bg-subtle text-green-900">
        <I className="size-[18px]" strokeWidth={1.75} aria-hidden />
      </span>
      {texto}
    </li>
  );
}

/**
 * Grade de faixas que rolam em sentidos opostos (lazer → apê ← condomínio).
 * A 1ª cópia de cada faixa é a lista lida pelo leitor de tela; a 2ª só fecha o laço da animação (aria-hidden).
 * Para no hover, tem botão de pausa (WCAG 2.2.2) e vira lista parada com reduced motion. CSS em app/globals.css (.marquee).
 */
export function FaixasDestaques({ faixas }: { faixas: Faixa[] }) {
  const [pausado, setPausado] = useState(false);
  // As faixas que rolam alternam o sentido entre si (as paradas não contam)
  const rolantes = faixas.filter((f) => f.itens.length >= MIN_ROLAR).map((f) => f.id);

  return (
    <div data-pausado={pausado || undefined}>
      <div className="space-y-5">
        {faixas.map((f) => {
          const rola = rolantes.includes(f.id);
          const sentido = rolantes.indexOf(f.id) % 2 === 1 ? "volta" : "vai";
          return (
            <div key={f.id}>
              <h3 className="mb-2 text-sm font-semibold text-ink">
                {f.titulo} <span className="font-normal text-muted">· {f.itens.length} {f.itens.length === 1 ? "item" : "itens"}</span>
              </h3>
              {rola ? (
                <div
                  className="marquee -mx-5 md:-mx-8 lg:mx-0"
                  data-sentido={sentido}
                  style={{ "--duracao": `${f.itens.length * SEGUNDOS_POR_ITEM}s` } as CSSProperties}
                >
                  <div className="marquee-trilha">
                    <ul className="marquee-grupo">{f.itens.map((t) => <Cartao key={t} texto={t} />)}</ul>
                    <ul className="marquee-grupo" aria-hidden>{f.itens.map((t) => <Cartao key={t} texto={t} />)}</ul>
                  </div>
                </div>
              ) : (
                <ul className="flex flex-wrap gap-3">{f.itens.map((t) => <Cartao key={t} texto={t} />)}</ul>
              )}
            </div>
          );
        })}
      </div>
      {rolantes.length > 0 && (
        <Button variante="ghost" tamanho="md" onClick={() => setPausado((p) => !p)} aria-pressed={pausado} className="marquee-pausa mt-3 -ml-4">
          {pausado ? <Play className="size-4" aria-hidden /> : <Pause className="size-4" aria-hidden />}
          {pausado ? "Retomar movimento" : "Pausar movimento"}
        </Button>
      )}
    </div>
  );
}
