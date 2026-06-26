import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import SiteChrome from "@/components/SiteChrome";
import { marca } from "@/lib/config";

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
  title: {
    default: `${marca.nome} — ${marca.tagline}`,
    template: `%s · ${marca.nome}`,
  },
  description:
    "MG Incorporações — incorporadora de empreendimentos de alto padrão. Conheça o Valley Business, torre corporativa com salas comerciais, rooftop e infraestrutura completa.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="flex min-h-screen flex-col font-sans">
        <SiteChrome>{children}</SiteChrome>
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
