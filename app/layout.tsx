import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";
import { Analytics } from "@vercel/analytics/next";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import SiteChrome from "@/components/SiteChrome";
import { marca } from "@/lib/config";
import { OG_PADRAO, jsonLdOrganizacao, siteUrl } from "@/lib/seo";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: marca.nome,
    template: `%s · ${marca.nome}`,
  },
  description:
    "MG Incorporações — incorporadora de empreendimentos de alto padrão. Conheça o Valley Business, torre corporativa com salas comerciais, rooftop e infraestrutura completa.",
  // og:title e og:description derivam automaticamente do title/description de
  // cada página; aqui ficam só os campos comuns (imagem padrão, locale, etc.).
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: marca.nome,
    images: [OG_PADRAO],
  },
  twitter: {
    card: "summary_large_image",
    images: [OG_PADRAO],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="flex min-h-screen flex-col font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLdOrganizacao()),
          }}
        />
        <SiteChrome>{children}</SiteChrome>
        <Analytics />
        <ToastContainer
          position="top-right"
          autoClose={4000}
          theme="light"
          newestOnTop
          pauseOnHover
        />
      </body>
    </html>
  );
}
