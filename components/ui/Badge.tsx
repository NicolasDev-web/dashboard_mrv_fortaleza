import type { ReactNode } from "react";
import type { Empreendimento } from "@/lib/types";
import { STATUS_ROTULO } from "@/lib/rotulos";

const TONS = {
  lancamento: "bg-green-300 text-ink",
  em_construcao: "bg-peach-100 text-ink",
  pronto: "bg-sage-200 text-ink",
  sensia: "bg-lilac-300 text-ink",
  match: "bg-green-900 text-white",
  neutro: "bg-white/95 text-ink",
} as const;

export function Badge({ tom, children, className = "" }: { tom: keyof typeof TONS; children: ReactNode; className?: string }) {
  return (
    <span className={`inline-flex h-6 items-center whitespace-nowrap rounded-full px-2.5 text-[13px] font-semibold leading-none ${TONS[tom]} ${className}`}>
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: Empreendimento["status"] }) {
  return <Badge tom={status}>{STATUS_ROTULO[status]}</Badge>;
}
