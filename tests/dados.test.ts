import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { empreendimentos } from "@/lib/data";
import type { Lazer } from "@/lib/types";
import lazerJson from "@/data/curated/lazer.json";
import {
  FOTO_GRUPO,
  GRUPOS,
  conferirLazer,
  gruposDosItens,
  gruposNosTextos,
  separarDiferenciais,
  type ArquivoLazer,
  type Diferencial,
} from "@/scripts/lazer-regras";

/** Conferência do lazer (docs/duvidas/Conferencia-lazer.md). Roda sobre data/empreendimentos.json já gerado. */

const curado = lazerJson as unknown as ArquivoLazer;
const RAW = path.resolve(import.meta.dirname, "../data/raw/mrv");
type Bruto = { ordem: number; descricao: string | null; apresentacao: string | null; proximoA: string | null; diferenciais: Diferencial[] };
const brutos = new Map<number, Bruto>(
  readdirSync(RAW)
    .filter((f) => /^\d+\.json$/.test(f))
    .map((f) => JSON.parse(readFileSync(path.join(RAW, f), "utf-8")) as Bruto)
    .map((b) => [b.ordem, b]),
);
const emp = (slug: string) => {
  const e = empreendimentos.find((x) => x.slug === slug);
  if (!e) throw new Error(`slug ${slug} não existe`);
  return e;
};
const decisao = (slug: string, g: Lazer) => curado.empreendimentos[slug]?.grupos?.[g];

describe("academia: só academia de verdade", () => {
  it("Forte Alencar tem academia (informado pelo time MRV, pendente de reconferência)", () => {
    expect(emp("forte-alencar").lazer).toContain("academia");
    expect(emp("forte-alencar").lazerItens).toContain("Academia");
    const d = decisao("forte-alencar", "academia");
    expect(d?.tem).toBe(true);
    expect(d?.fonte).toMatch(/site oficial MRV/);
    expect(d?.pendente).toBe(true);
  });

  it.each(["residencial-fortitudine", "ville-de-lisboa", "ville-de-porto"])("%s não tem academia (só espaço funcional ao ar livre)", (slug) => {
    const e = emp(slug);
    expect(e.lazer).not.toContain("academia");
    expect(e.lazerItens).toContain("Espaço funcional ao ar livre");
    expect(e.lazerItens.some((i) => /academia|fitness/i.test(i))).toBe(false);
  });

  it("Farol do Atlântico tem academia (Academia Coberta)", () => {
    expect(emp("residencial-farol-do-atlantico").lazer).toContain("academia");
    expect(emp("residencial-farol-do-atlantico").lazerItens).toContain("Academia Coberta");
  });

  it("espaço funcional nunca aparece com nome ou foto de academia", () => {
    for (const e of empreendimentos) {
      expect(e.lazerItens.filter((i) => /funcional/i.test(i)).every((i) => !/academia|fitness/i.test(i))).toBe(true);
      expect(e.lazerItens).not.toContain("Espaço Funcional Descoberto");
      for (const f of e.imagens.galeria) if (/funcional/i.test(f.alt)) expect(f.tipo).not.toBe("fitness");
    }
  });
});

describe("conflitos resolvidos na conferência de 08/10/2026", () => {
  it("Torre do Mar tem piscina (descrição, implantação e fotos)", () => {
    expect(emp("torre-do-mar").lazer).toContain("piscina");
    expect(emp("torre-do-mar").lazerItens).toEqual(expect.arrayContaining(["Piscina Adulto", "Piscina Infantil"]));
  });

  it("Sensia Reserva Vila do Sol tem academia (descrição e implantação)", () => {
    expect(emp("sensia-reserva-vila-do-sol").lazer).toContain("academia");
  });

  it("Ville de Lisboa tem playground (vinha como 'Diferenciais de Card')", () => {
    expect(emp("ville-de-lisboa").lazer).toContain("kids");
    expect(emp("ville-de-lisboa").lazerItens).toEqual(expect.arrayContaining(["Playground", "Playbaby"]));
  });
});

describe("coerência foto ↔ lazer", () => {
  it("toda foto de piscina, fitness, kids, pet, gourmet ou festas tem o grupo no lazer (ou decisão explícita com fonte)", () => {
    const furos: string[] = [];
    for (const e of empreendimentos) {
      for (const f of e.imagens.galeria) {
        const g = FOTO_GRUPO[f.tipo];
        if (!g || e.lazer.includes(g)) continue;
        const d = decisao(e.slug, g);
        if (d && d.tem === false && d.fonte.trim()) continue;
        furos.push(`${e.slug} ${f.id} (${f.tipo}) sem "${g}"`);
      }
    }
    expect(furos).toEqual([]);
  });
});

describe("toda afirmação de lazer tem fonte", () => {
  it("cada grupo em lazer vem da lista oficial ou de decisão com fonte em lazer.json", () => {
    const semFonte: string[] = [];
    for (const e of empreendimentos) {
      const oficiais = gruposDosItens(separarDiferenciais(brutos.get(e.ordem)!.diferenciais).lazerItens);
      for (const g of e.lazer) {
        const d = decisao(e.slug, g);
        const temFonte = d ? d.tem === true && !!d.fonte.trim() : oficiais.includes(g);
        if (!temFonte) semFonte.push(`${e.slug}/${g}`);
      }
    }
    expect(semFonte).toEqual([]);
  });

  it("lazer.json: toda decisão, item extra e correção de foto tem fonte e data", () => {
    for (const [slug, c] of Object.entries(curado.empreendimentos)) {
      expect(empreendimentos.some((e) => e.slug === slug), slug).toBe(true);
      for (const [g, d] of Object.entries(c.grupos ?? {})) {
        expect(GRUPOS, `${slug}/${g}`).toContain(g);
        expect(typeof d.tem, `${slug}/${g}`).toBe("boolean");
        expect(d.fonte.trim().length, `${slug}/${g}`).toBeGreaterThan(0);
        expect(d.conferidoEm, `${slug}/${g}`).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      }
      for (const x of c.itensExtras ?? []) expect(x.fonte.trim().length, `${slug}: ${x.item}`).toBeGreaterThan(0);
      for (const [id, f] of Object.entries(c.fotos ?? {})) expect(f.fonte.trim().length, `${slug}: ${id}`).toBeGreaterThan(0);
    }
  });
});

describe("'Próximo a' (entorno) nunca alimenta o lazer", () => {
  it("academias, parques e piscinas citados só no entorno não viram lazer", () => {
    const r = conferirLazer({
      nome: "teste",
      textos: { descricao: null, apresentacao: null, diferenciais: [], proximoA: "Próximo a academias, Parque do Cocó, piscina pública, playground" },
      fotos: [],
    });
    expect(r.lazer).toEqual([]);
    expect(r.erros).toEqual([]);
    expect(gruposNosTextos({ descricao: null, apresentacao: null, diferenciais: [], proximoA: "academias" }).size).toBe(0);
  });

  it("nos 16, apagar o proximoA não muda nenhum lazer", () => {
    for (const e of empreendimentos) {
      const b = brutos.get(e.ordem)!;
      const fotos = e.imagens.galeria;
      const curadoE = curado.empreendimentos[e.slug];
      const com = conferirLazer({ nome: e.nome, textos: { ...b, proximoA: b.proximoA }, fotos, curado: curadoE });
      const sem = conferirLazer({ nome: e.nome, textos: { ...b, proximoA: null }, fotos, curado: curadoE });
      expect(com.lazer, e.slug).toEqual(sem.lazer);
      expect(com.lazer, e.slug).toEqual(e.lazer);
    }
  });
});

describe("travas do build", () => {
  const base = { nome: "Teste", fotos: [] as { id: string; tipo: "piscina" | "fitness" | "lazer" }[] };

  it("falha quando o texto oficial cita um lazer que não está na lista nem em lazer.json", () => {
    const r = conferirLazer({ ...base, textos: { descricao: "lazer com piscina e academia", apresentacao: null, diferenciais: [] } });
    expect(r.erros.join("\n")).toMatch(/piscina/);
    expect(r.erros.join("\n")).toMatch(/academia/);
  });

  it("falha com foto de fitness ou piscina sem o grupo", () => {
    const r = conferirLazer({ ...base, textos: { descricao: null, apresentacao: null, diferenciais: [] }, fotos: [{ id: "99-01", tipo: "fitness" }, { id: "99-02", tipo: "piscina" }] });
    expect(r.erros).toHaveLength(2);
  });

  it("aceita decisão explícita com fonte e falha sem fonte", () => {
    const textos = { descricao: null, apresentacao: null, diferenciais: [] };
    const fotos = [{ id: "99-01", tipo: "fitness" as const }];
    const ok = conferirLazer({ ...base, textos, fotos, curado: { grupos: { academia: { tem: false, fonte: "conferido na foto", conferidoEm: "2026-10-08" } } } });
    expect(ok.erros).toEqual([]);
    const semFonte = conferirLazer({ ...base, textos, fotos, curado: { grupos: { academia: { tem: false, fonte: " ", conferidoEm: "2026-10-08" } } } });
    expect(semFonte.erros.join("\n")).toMatch(/sem "fonte"/);
  });

  it("pendente só avisa", () => {
    const r = conferirLazer({
      ...base,
      textos: { descricao: null, apresentacao: null, diferenciais: [] },
      curado: { grupos: { academia: { tem: true, fonte: "informado", conferidoEm: "2026-10-08", pendente: true } } },
    });
    expect(r.erros).toEqual([]);
    expect(r.avisos).toHaveLength(1);
    expect(r.lazer).toEqual(["academia"]);
  });

  it("'Espaço Funcional Descoberto' sozinho não vira academia", () => {
    const r = conferirLazer({ ...base, textos: { descricao: "espaço funcional", apresentacao: null, diferenciais: [{ titulo: "Espaço Funcional Descoberto", tipo: "Diferenciais de Lazer" }] } });
    expect(r.lazer).not.toContain("academia");
    expect(r.erros).toEqual([]);
  });
});
