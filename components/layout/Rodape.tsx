import { empreendimentos } from "@/lib/data";

const data = new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

export function Rodape() {
  const atualizado = empreendimentos.map((e) => e.fonte.extraidoEm).sort().at(-1)!;
  return (
    <footer className="border-t border-line py-8 text-sm text-muted">
      <div className="contem flex flex-col gap-2 md:flex-row md:justify-between">
        <p>Imagens ilustrativas. Informações das páginas oficiais da MRV, atualizadas em {data.format(new Date(atualizado))}.</p>
        <p>Tempos de ônibus estimados para dia útil, sem trânsito.</p>
      </div>
    </footer>
  );
}
