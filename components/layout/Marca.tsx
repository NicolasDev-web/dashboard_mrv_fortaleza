import Link from "next/link";

/**
 * Logo oficial (arquivos em logos/, recortados sem alteração para public/brand/ — guia, seção 14):
 * positivo sobre branco, negativo sobre verde escuro, 28 px de altura (~100 px de largura, acima do
 * mínimo digital de 70 px) e área de proteção garantida pelo espaço até o divisor.
 */
export function Marca({ sobre = "claro" }: { sobre?: "claro" | "escuro" }) {
  const claro = sobre === "claro";
  return (
    <Link href="/" className={`inline-flex items-center gap-3 py-1.5 ${claro ? "text-green-900" : "text-white"}`} aria-label="Descubra seu MRV, página inicial">
      {/* eslint-disable-next-line @next/next/no-img-element -- PNG de marca já no tamanho final */}
      <img src={claro ? "/brand/mrv.png" : "/brand/mrv-branca.png"} alt="MRV" width={100} height={28} className="h-7 w-auto" />
      <span aria-hidden className={`h-6 w-px ${claro ? "bg-line-strong" : "bg-white/40"}`} />
      <span className="text-[15px] font-semibold leading-none">Descubra</span>
    </Link>
  );
}
