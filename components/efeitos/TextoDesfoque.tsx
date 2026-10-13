import { Fragment } from "react";

/**
 * Palavras que saem do desfoque em sequência (o efeito do Blur Text do React Bits, em CSS: sem JS por quadro).
 * Com `ativo`, some/aparece conforme ele (revelação); sem `ativo`, entra uma vez ao montar.
 * Com reduced motion, a regra global de 1 ms faz aparecer na hora.
 * O texto continua inteiro para o leitor de tela (as palavras são só spans).
 */
export function TextoDesfoque({ texto, ativo, atraso = 0, passo = 70 }: {
  texto: string;
  ativo?: boolean;
  /** ms antes da 1ª palavra */
  atraso?: number;
  /** ms entre palavras */
  passo?: number;
}) {
  return texto.split(" ").map((palavra, k) => (
    <Fragment key={k}>
      {k > 0 && " "}
      <span
        className={ativo === undefined ? "palavra-entra inline-block" : "inline-block transition-[opacity,filter,transform] duration-[700ms] ease-saida"}
        style={ativo === undefined ? { animationDelay: `${atraso + k * passo}ms` } : {
          opacity: ativo ? 1 : 0,
          filter: ativo ? "blur(0)" : "blur(12px)",
          transform: ativo ? "none" : "translateY(0.25em)",
          transitionDelay: ativo ? `${atraso + k * passo}ms` : "0ms",
        }}
      >
        {palavra}
      </span>
    </Fragment>
  ));
}
