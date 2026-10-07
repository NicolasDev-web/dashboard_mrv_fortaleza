"use client";

import { useEffect } from "react";
import { Button, LinkButton } from "@/components/ui/Button";
import { Shape } from "@/components/ui/Shape";

/** Erro inesperado numa página: mesma cara da 404, com a opção de tentar de novo sem perder a URL (e as respostas). */
export default function Erro({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="contem flex flex-col items-center py-20 text-center">
      <Shape variante="quiz" className="w-20" />
      <h1 className="t-h2 mt-6 text-green-900">Algo não saiu como esperado</h1>
      <p className="mt-3 max-w-sm text-muted">Não conseguimos mostrar esta página agora. Tente de novo; suas respostas continuam no endereço.</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button onClick={() => retry()}>Tentar de novo</Button>
        <LinkButton href="/" variante="ghost">Ir para o início</LinkButton>
      </div>
    </div>
  );
}
