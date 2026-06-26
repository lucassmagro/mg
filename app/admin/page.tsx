import Link from "next/link";
import { Plus } from "lucide-react";
import { listarEmpreendimentos } from "@/lib/empreendimentos";
import ListaAdmin from "@/components/admin/ListaAdmin";

export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  const empreendimentos = await listarEmpreendimentos({ todos: true });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-ink">
            Empreendimentos
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            {empreendimentos.length}{" "}
            {empreendimentos.length === 1 ? "cadastrado" : "cadastrados"}
          </p>
        </div>
        <Link href="/admin/empreendimentos/novo" className="btn-primary">
          <Plus className="h-4 w-4" />
          Novo empreendimento
        </Link>
      </div>

      <div className="mt-6">
        <ListaAdmin empreendimentos={empreendimentos} />
      </div>
    </div>
  );
}
