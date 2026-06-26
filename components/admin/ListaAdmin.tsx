"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Star, Loader2, ExternalLink } from "lucide-react";
import type { Empreendimento } from "@/data/empreendimentos";
import { STATUS_LABEL } from "@/data/empreendimentos";
import { excluirEmpreendimento, alternarDestaque } from "@/app/admin/actions";

export default function ListaAdmin({
  empreendimentos,
}: {
  empreendimentos: Empreendimento[];
}) {
  const router = useRouter();
  const [pendente, startTransition] = useTransition();
  const [acaoId, setAcaoId] = useState<string | null>(null);

  function destacar(e: Empreendimento) {
    setAcaoId(e.id);
    startTransition(async () => {
      await alternarDestaque(e.id, !e.destaque);
      router.refresh();
      setAcaoId(null);
    });
  }

  function remover(e: Empreendimento) {
    if (
      !confirm(
        `Excluir "${e.nome}"? Esta ação remove o empreendimento e seus arquivos. Não pode ser desfeita.`,
      )
    )
      return;
    setAcaoId(e.id);
    startTransition(async () => {
      const r = await excluirEmpreendimento(e.id);
      if (!r.ok) alert(`Erro ao excluir: ${r.erro}`);
      router.refresh();
      setAcaoId(null);
    });
  }

  if (empreendimentos.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-ink/20 bg-surface/60 p-10 text-center">
        <p className="text-ink-soft">
          Nenhum empreendimento cadastrado ainda. Clique em{" "}
          <strong>Novo empreendimento</strong> para começar.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-ink/10 bg-surface shadow-card">
      <ul className="divide-y divide-ink/10">
        {empreendimentos.map((e) => {
          const ocupado = pendente && acaoId === e.id;
          return (
            <li
              key={e.id}
              className="flex flex-wrap items-center gap-4 px-4 py-3 sm:px-5"
            >
              <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-sand-100">
                {e.cartao ? (
                  <Image
                    src={e.cartao}
                    alt=""
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                ) : null}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-ink">{e.nome}</p>
                <p className="truncate text-xs text-ink-muted">
                  /{e.id} · {STATUS_LABEL[e.status]} · {e.cidade}
                </p>
              </div>

              <button
                type="button"
                onClick={() => destacar(e)}
                disabled={ocupado}
                title={e.destaque ? "Remover destaque" : "Marcar como destaque"}
                className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border transition-colors disabled:opacity-50 ${
                  e.destaque
                    ? "border-accent-300 bg-accent-50 text-accent-600"
                    : "border-ink/15 text-ink-muted hover:bg-sand-100"
                }`}
              >
                <Star
                  className="h-4 w-4"
                  fill={e.destaque ? "currentColor" : "none"}
                />
              </button>

              <Link
                href={`/empreendimentos/${e.id}`}
                target="_blank"
                title="Ver no site"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-ink/15 text-ink-muted transition-colors hover:bg-sand-100"
              >
                <ExternalLink className="h-4 w-4" />
              </Link>

              <Link
                href={`/admin/empreendimentos/${e.id}`}
                title="Editar"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-ink/15 text-ink-soft transition-colors hover:bg-sand-100"
              >
                <Pencil className="h-4 w-4" />
              </Link>

              <button
                type="button"
                onClick={() => remover(e)}
                disabled={ocupado}
                title="Excluir"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
              >
                {ocupado ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
