import Image from "next/image";
import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import type { Empreendimento } from "@/data/empreendimentos";
import { STATUS_LABEL } from "@/data/empreendimentos";

/**
 * Card de empreendimento reutilizado na home e na listagem.
 * Toda a área do card é clicável: um único link "esticado" (after:inset-0)
 * cobre o `article`, melhorando o toque em smartphones.
 */
export default function EmpreendimentoCard({
  empreendimento: e,
  priority = false,
}: {
  empreendimento: Empreendimento;
  priority?: boolean;
}) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-ink/10 bg-surface shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
      <div className="relative block aspect-[4/3] overflow-hidden rounded-t-2xl bg-sand-100">
        <div className="absolute inset-0 transform-gpu transition-transform duration-500 group-hover:scale-105">
          <Image
            src={e.cartao}
            alt={`Imagem do empreendimento ${e.nome}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={priority}
            style={{
              objectPosition: e.cartaoPos || "center",
              transform: `scale(${e.cartaoZoom ?? 1})`,
              transformOrigin: e.cartaoPos || "center",
            }}
            className="object-contain"
          />
        </div>
        <div className="absolute left-3 top-3 flex gap-2">
          <span className="rounded-full bg-accent-600 px-3 py-1 text-xs font-semibold text-white shadow-sm">
            {STATUS_LABEL[e.status]}
          </span>
          <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-night backdrop-blur-sm">
            {e.categoria}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-serif text-2xl text-ink">
          <Link
            href={`/empreendimentos/${e.id}`}
            className="transition-colors after:absolute after:inset-0 group-hover:text-brand focus-visible:outline-none"
          >
            {e.nome}
          </Link>
        </h3>
        <p className="mt-1 text-sm font-medium text-brand">{e.subtitulo}</p>

        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-ink-muted">
          <MapPin className="h-4 w-4 text-brand" aria-hidden="true" />
          {e.bairro}, {e.cidade}
        </p>

        <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-ink-soft">
          {e.resumo}
        </p>

        <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand">
          Conhecer o empreendimento
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </article>
  );
}
