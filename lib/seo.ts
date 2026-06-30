/**
 * SEO — helpers de metadata, Open Graph e dados estruturados (JSON-LD).
 * Fonte única de URL: `marca.url` (lib/config.ts).
 */
import type { Empreendimento } from "@/data/empreendimentos";
import { getTodasImagens, STATUS_LABEL } from "@/data/empreendimentos";
import { marca } from "@/lib/config";

/** URL canônica base do site (sem barra final). */
export const siteUrl = marca.url;

/** Converte um caminho relativo (/...) numa URL absoluta. */
export function urlAbsoluta(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${siteUrl}${path.startsWith("/") ? "" : "/"}${path}`;
}

/**
 * Imagem OG padrão do site. É uma render landscape que já existe no projeto
 * (não foi gerada nem redimensionada) — a torre inserida na paisagem da cidade.
 * Dimensões reais declaradas para o scraper renderizar antes do download.
 */
export const OG_PADRAO = {
  url: "/projetos/valley-business/imgs/03-fachada-grande-plano-inserida-no-local.jpg",
  width: 2200,
  height: 1375,
  alt: "Valley Business — torre corporativa da MG Incorporações em Chapecó",
} as const;

/** Mapeia o status do empreendimento para schema.org ItemAvailability. */
function disponibilidade(status: Empreendimento["status"]): string {
  return status === "pronto"
    ? "https://schema.org/InStock"
    : "https://schema.org/PreOrder";
}

/**
 * JSON-LD da incorporadora (site-wide). RealEstateAgent é subtipo de
 * LocalBusiness — carrega nome, endereço, telefone, horário e redes.
 */
export function jsonLdOrganizacao() {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: marca.nome,
    url: siteUrl,
    image: urlAbsoluta(OG_PADRAO.url),
    logo: urlAbsoluta("/logo/icon-512.png"),
    telephone: `+${marca.whatsapp}`,
    email: marca.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${marca.endereco} — ${marca.complemento}`,
      addressLocality: marca.cidade,
      addressRegion: marca.uf,
      postalCode: marca.cep,
      addressCountry: "BR",
    },
    areaServed: `${marca.cidade} e região`,
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:30",
        closes: "18:30",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "09:00",
        closes: "13:00",
      },
    ],
    sameAs: [marca.instagram],
  };
}

/**
 * JSON-LD de um empreendimento (Product). Carrega nome, descrição, imagens,
 * categoria, oferta (preço/disponibilidade) e localização. Campos opcionais só
 * entram quando existem — nada de `undefined` no objeto serializado.
 */
export function jsonLdEmpreendimento(e: Empreendimento) {
  const imagens = getTodasImagens(e)
    .slice(0, 8)
    .map((img) => urlAbsoluta(img.src));
  const url = urlAbsoluta(`/empreendimentos/${e.id}`);

  const offer: Record<string, unknown> = {
    "@type": "Offer",
    priceCurrency: "BRL",
    availability: disponibilidade(e.status),
    url,
    areaServed: `${e.bairro}, ${e.cidade} — ${marca.uf}`,
  };
  if (typeof e.precoVenda === "number") offer.price = e.precoVenda;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: e.nome,
    description: e.resumo,
    ...(imagens.length ? { image: imagens } : {}),
    ...(e.categoria ? { category: e.categoria } : {}),
    url,
    brand: { "@type": "Organization", name: marca.nome },
    additionalProperty: {
      "@type": "PropertyValue",
      name: "Situação",
      value: STATUS_LABEL[e.status],
    },
    offers: offer,
  };
}
