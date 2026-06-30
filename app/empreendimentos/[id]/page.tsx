import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Eye } from "lucide-react";
import { getEmpreendimento } from "@/lib/empreendimentos";
import { criarClienteServer } from "@/lib/supabase/server";
import EmpreendimentoView from "@/components/EmpreendimentoView";
import { jsonLdEmpreendimento } from "@/lib/seo";

// Conteúdo vem do Supabase. ISR: páginas publicadas ficam em cache e o salvar do
// painel revalida /empreendimentos/[id] (actions.ts), refletindo edições na hora.
// A pré-visualização de rascunho lê a sessão (cookies) e renderiza dinâmica.
export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const e = await getEmpreendimento(params.id);
  if (!e) return { title: "Empreendimento não encontrado" };
  const canonical = `/empreendimentos/${e.id}`;
  // Capa do empreendimento como imagem social (caminho relativo resolvido pelo
  // metadataBase). alt declarado; width/height não entram porque as dimensões
  // não ficam armazenadas no modelo (imagens podem vir do painel/Storage).
  const ogImagem = e.capa
    ? [{ url: e.capa, alt: `Fachada do ${e.nome}` }]
    : undefined;
  return {
    title: `${e.nome} — ${e.subtitulo}`,
    description: e.resumo,
    alternates: { canonical },
    openGraph: {
      url: canonical,
      ...(ogImagem ? { images: ogImagem } : {}),
    },
    ...(ogImagem ? { twitter: { images: ogImagem } } : {}),
    // Rascunho não deve ser indexado por buscadores.
    robots: e.publicado ? undefined : { index: false, follow: false },
  };
}

export default async function EmpreendimentoPage({
  params,
}: {
  params: { id: string };
}) {
  const e = await getEmpreendimento(params.id);
  if (!e) notFound();

  // Rascunho: só é visível para quem está logado no painel (pré-visualização).
  let preview = false;
  if (!e.publicado) {
    const supabase = criarClienteServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) notFound();
    preview = true;
  }

  return (
    <>
      {/* Dados estruturados (Product) — só para páginas publicadas/indexáveis. */}
      {!preview && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLdEmpreendimento(e)),
          }}
        />
      )}
      {preview && (
        <div className="sticky top-0 z-40 flex items-center justify-center gap-3 bg-amber-400 px-4 py-2 text-sm font-medium text-amber-950">
          <Eye className="h-4 w-4" />
          Pré-visualização de rascunho — ainda não publicado.
          <Link
            href={`/admin/empreendimentos/${e.id}`}
            className="underline underline-offset-2 hover:no-underline"
          >
            Editar
          </Link>
        </div>
      )}
      <EmpreendimentoView e={e} />
    </>
  );
}
