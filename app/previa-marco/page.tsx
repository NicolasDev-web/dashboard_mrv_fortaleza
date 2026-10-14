import { notFound } from "next/navigation";
import { PreviaMarco } from "@/components/empreendimento/maquete/PreviaMarco";

export const metadata = { robots: { index: false } };

/** Prévia de um marco 3D isolado; só existe em desenvolvimento */
export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  if (process.env.NODE_ENV === "production") notFound();
  const q = await searchParams;
  const n = (k: string, padrao: number) => (typeof q[k] === "string" ? Number(q[k]) : padrao);
  return <PreviaMarco id={typeof q.id === "string" ? q.id : ""} az={n("az", 210)} el={n("el", 30)} d={n("d", 130)} />;
}
