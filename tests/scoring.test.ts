import { describe, expect, it } from "vitest";
import { dadosScoring, empreendimentos } from "@/lib/data";
import { recomendar } from "@/lib/scoring/score";
import { codificar, decodificar } from "@/lib/quiz/url";
import { frasePerfil } from "@/lib/quiz/perfil";

const dados = dadosScoring();
const rodar = (q: string) => recomendar(decodificar(q), dados);
const bairro = (slug: string) => empreendimentos.find((e) => e.slug === slug)!.bairroNome;

describe("perfis de referência", () => {
  it("estudante da UFC Benfica sem carro recebe o Centro ou a Jacarecanga no topo", () => {
    const { top } = rodar("o=fortaleza&d=ufc_benfica&t=onibus&m=so&z=tanto_faz");
    expect(["parque-marista", "residencial-flor-do-sertao"]).toContain(top[0].slug);
  });

  it("quem vai à Unifor de ônibus recebe primeiro um empreendimento do Cocó", () => {
    const { top, regiao } = rodar("o=metropolitana&d=unifor&t=onibus&m=filhos&p=1&l=piscina,kids&b=escolas&z=logo");
    expect(bairro(top[0].slug)).toBe("Cocó");
    expect(regiao).toBe("leste");
  });

  it("quem vai à UFC Pici recebe o Antônio Bezerra no topo", () => {
    const { top } = rodar("o=metropolitana&d=ufc_pici&t=onibus&m=casal&z=tanto_faz");
    expect(bairro(top[0].slug)).toBe("Antônio Bezerra");
  });

  it("quem vai a Messejana de carro recebe a região Sul", () => {
    expect(rodar("o=metropolitana&d=messejana&t=carro&m=filhos&l=piscina&z=logo").regiao).toBe("sul");
  });
});

describe("regras", () => {
  it("'só Fortaleza' tira Caucaia e Eusébio", () => {
    const { ranking } = rodar("o=fortaleza&d=centro");
    expect(ranking).toHaveLength(13);
    expect(ranking.every((r) => empreendimentos.find((e) => e.slug === r.slug)!.cidade === "Fortaleza")).toBe(true);
  });

  it("filtro por regiões devolve só as regiões escolhidas", () => {
    const { ranking } = rodar("o=regioes&g=caucaia,eusebio");
    expect(ranking.map((r) => r.slug).sort()).toEqual(["eco-park", "ville-de-lisboa", "ville-de-porto"]);
  });

  it("de carro, empreendimento com menos de 0,5 vaga por unidade recebe aviso", () => {
    const { ranking } = rodar("d=centro&t=carro");
    const flor = ranking.find((r) => r.slug === "residencial-flor-do-sertao")!;
    expect(flor.atencoes.join(" ")).toMatch(/Vagas limitadas/);
    const eco = ranking.find((r) => r.slug === "eco-park")!;
    expect(eco.atencoes.join(" ")).not.toMatch(/Vagas/);
  });

  it("Caucaia e Eusébio usam tempo estimado e dizem isso", () => {
    const eco = rodar("d=messejana&t=onibus").ranking.find((r) => r.slug === "eco-park")!;
    expect(eco.tempo?.estimado).toBe(true);
    const parque = rodar("d=messejana&t=onibus").ranking.find((r) => r.slug === "parque-marista")!;
    expect(parque.tempo?.estimado).toBe(false);
  });

  it("o top nunca repete bairro quando há alternativa próxima", () => {
    for (const q of ["d=ufc_pici&t=onibus", "d=centro&t=onibus", "d=unifor&t=carro&l=piscina", "d=casa&z=logo"]) {
      const { top, ranking } = rodar(q);
      const bairros = top.map((t) => bairro(t.slug));
      const repetidos = bairros.filter((b, i) => bairros.indexOf(b) !== i);
      for (const b of repetidos) {
        const segundo = top.filter((t) => bairro(t.slug) === b)[1];
        const melhorOutro = ranking.find((r) => !top.includes(r) && !bairros.includes(bairro(r.slug)));
        if (melhorOutro) expect(segundo.score - melhorOutro.score).toBeGreaterThanOrEqual(5);
      }
    }
  });

  it("é determinístico", () => {
    const q = "o=metropolitana&d=aldeota&t=onibus&m=so&l=academia&z=medio";
    expect(rodar(q)).toEqual(rodar(q));
  });

  it("nenhum texto fala de segurança ou renda (decisão MRV)", () => {
    const textos = ["d=centro&t=onibus&b=saude,comercio", "d=unifor&t=carro&m=filhos&l=kids&b=escolas,lazer", "b=mobilidade&t=onibus"]
      .flatMap((q) => rodar(q).ranking.flatMap((r) => [...r.motivos, ...r.atencoes]));
    expect(textos.length).toBeGreaterThan(0);
    expect(textos.join(" ")).not.toMatch(/segur|renda|viol|crime/i);
  });
});

describe("URL e frase do perfil", () => {
  it("ida e volta pela URL preserva as respostas", () => {
    const r = decodificar("o=regioes&g=leste,sul&d=unifor&t=onibus&m=filhos&p=1&l=piscina,kids&b=saude&z=logo");
    expect(decodificar(codificar(r))).toEqual(r);
  });

  it("ignora valores desconhecidos e respeita o máximo de escolhas", () => {
    const r = decodificar("d=marte&t=jato&l=piscina,kids,academia,verde&b=saude,escolas,comercio");
    expect(r.destino).toBeUndefined();
    expect(r.transporte).toBeUndefined();
    expect(r.lazer).toHaveLength(3);
    expect(r.bairro).toHaveLength(2);
  });

  it("monta a frase do perfil", () => {
    expect(frasePerfil(decodificar("d=unifor&t=onibus&m=filhos&l=piscina"))).toBe("Você vai à Unifor de ônibus, tem crianças em casa e quer piscina.");
    expect(frasePerfil(decodificar("d=messejana&t=carro"))).toBe("Você vai à Messejana de carro.");
  });
});

describe("destino em qualquer bairro (os 121)", () => {
  it("todo bairro de Fortaleza tem tempo de ônibus a partir dos bairros com MRV", () => {
    for (const b of dados.bairros) expect(Object.keys(b.tempoAteBairro)).toHaveLength(121);
  });

  it("quem vai ao Cocó recebe os empreendimentos do próprio bairro", () => {
    const { top } = rodar("o=metropolitana&d=b11&t=onibus");
    expect(bairro(top[0].slug)).toBe("Cocó");
    expect(top[0].motivos[0]).toMatch(/próprio bairro Cocó/);
  });

  it("bairro sem tabela (Caucaia) usa estimativa pela distância até o centro do bairro", () => {
    const lisboa = rodar("d=b24&t=onibus").ranking.find((r) => r.slug === "ville-de-lisboa")!;
    expect(lisboa.tempo?.estimado).toBe(true);
    expect(lisboa.tempo!.minutos).toBeGreaterThan(40);
  });

  it("bairro inexistente não quebra: o deslocamento só sai da conta", () => {
    const { ranking } = rodar("d=b999&t=onibus");
    expect(ranking.every((r) => !r.criterios.some((c) => c.id === "deslocamento"))).toBe(true);
  });

  it("URL e frase do perfil com bairro", () => {
    const r = decodificar("d=b24&t=onibus");
    expect(r.destino).toBe("b24");
    expect(decodificar(codificar(r))).toEqual(r);
    expect(frasePerfil(r, dados.destinos)).toBe("Você vai todo dia para Meireles de ônibus.");
  });
});

describe("frases do mapa do quiz", () => {
  it("usa a contração certa para cada destino", async () => {
    const { destinoDe } = await import("@/lib/quiz/destino");
    expect(destinoDe("unifor", dados.destinos)).toBe("da Unifor");
    expect(destinoDe("centro", dados.destinos)).toBe("do Centro");
    expect(destinoDe("messejana", dados.destinos)).toBe("de Messejana");
    expect(destinoDe("b24", dados.destinos)).toBe("de Meireles");
  });

  it("o contador cai quando a resposta restringe e nada sai do mapa sem motivo", async () => {
    const { estadoDoMapa } = await import("@/lib/quiz/mapa");
    const inicio = estadoDoMapa(decodificar(""), dados);
    expect(inicio.combinam).toBe(16);
    const so = estadoDoMapa(decodificar("o=fortaleza"), dados, "onde");
    expect(so.combinam).toBe(13);
    expect(so.pinos["eco-park"].apagado).toBe(true);
    const unifor = estadoDoMapa(decodificar("o=fortaleza&d=unifor&t=onibus"), dados, "destino");
    expect(unifor.combinam).toBeLessThan(13);
    expect(unifor.frase).toBe("Acendem os bairros perto da Unifor.");
  });
});
