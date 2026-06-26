import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Eye } from "lucide-react";
import { getEmpreendimento } from "@/lib/empreendimentos";
import { criarClienteServer } from "@/lib/supabase/server";
import EmpreendimentoView from "@/components/EmpreendimentoView";

// Conteúdo vem do Supabase; renderiza dinamicamente para refletir edições na hora.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const e = await getEmpreendimento(params.id);
  if (!e) return { title: "Empreendimento não encontrado" };
  return {
    title: `${e.nome} — ${e.subtitulo}`,
    description: e.resumo,
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
