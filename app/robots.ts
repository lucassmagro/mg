import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

/** robots.txt: libera o site, bloqueia o painel e aponta para o sitemap. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/admin",
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
