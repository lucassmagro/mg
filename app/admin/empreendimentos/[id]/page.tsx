import { notFound } from "next/navigation";
import { getEmpreendimento } from "@/lib/empreendimentos";
import EmpreendimentoForm from "@/components/admin/EmpreendimentoForm";

export const dynamic = "force-dynamic";

export default async function EditarEmpreendimentoPage({
  params,
}: {
  params: { id: string };
}) {
  const e = await getEmpreendimento(params.id, { semCache: true });
  if (!e) notFound();

  return <EmpreendimentoForm inicial={e} isEdit />;
}
