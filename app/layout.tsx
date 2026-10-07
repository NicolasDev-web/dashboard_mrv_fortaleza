import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import { BarraInferior, Cabecalho } from "@/components/layout/Navegacao";
import "./globals.css";

// Provisório até a MRV enviar a Averta licenciada para web (guia, seção 4.2).
const marca = Manrope({ subsets: ["latin"], variable: "--font-marca", display: "swap", weight: ["400", "600", "800"] });

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: "Descubra seu MRV", template: "%s · Descubra seu MRV" },
  description: "Responda 9 perguntas rápidas e veja os empreendimentos MRV da Grande Fortaleza que mais combinam com a sua rotina.",
  // Produto interno: fora dos buscadores, mas com título e capa caprichados para links compartilhados.
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
  openGraph: { type: "website", locale: "pt_BR", siteName: "Descubra seu MRV" },
};

export const viewport: Viewport = {
  themeColor: "#006b3f",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={marca.variable}>
      <body className="flex min-h-dvh flex-col">
        <a href="#conteudo" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:shadow-e2">
          Pular para o conteúdo
        </a>
        <Cabecalho />
        <main id="conteudo" className="flex-1">
          {children}
        </main>
        <BarraInferior />
      </body>
    </html>
  );
}
