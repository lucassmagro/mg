import type { MetadataRoute } from "next";
import { listarEmpreendimentos } from "@/lib/empreendimentos";
import { siteUrl } from "@/lib/seo";

// Revalida junto com as páginas públicas (o painel também revalida ao salvar).
export const revalidate = 3600;

/**
 * Sitemap dinâmico: páginas fixas + uma entrada por empreendimento publicado
 * (listarEmpreendimentos já filtra rascunhos).
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const empreendimentos = await listarEmpreendimentos();
  const agora = new Date();

  const fixas: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, lastModified: agora, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/empreendimentos`, lastModified: agora, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/sobre`, lastModified: agora, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/contato`, lastModified: agora, changeFrequency: "monthly", priority: 0.6 },
  ];

  const dinamicas: MetadataRoute.Sitemap = empreendimentos.map((e) => ({
    url: `${siteUrl}/empreendimentos/${e.id}`,
    lastModified: agora,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...fixas, ...dinamicas];
}
