import { LinkButton } from "@/components/ui/Button";
import { Shape } from "@/components/ui/Shape";

export default function NaoEncontrado() {
  return (
    <div className="contem flex flex-col items-center py-20 text-center">
      <Shape variante="quiz" className="w-20" />
      <h1 className="t-h2 mt-6 text-green-900">Não encontramos esta página</h1>
      <p className="mt-3 max-w-sm text-muted">O endereço pode ter mudado. Que tal descobrir o empreendimento que combina com você?</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <LinkButton href="/descobrir">Começar o quiz</LinkButton>
        <LinkButton href="/empreendimentos" variante="ghost">Ver empreendimentos</LinkButton>
      </div>
    </div>
  );
}
