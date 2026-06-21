import Image from "next/image";
import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import type { Empreendimento } from "@/data/empreendimentos";
import { STATUS_LABEL } from "@/data/empreendimentos";

/** Card de empreendimento reutilizado na home e na listagem. */
export default function EmpreendimentoCard({
  empreendimento: e,
  priority = false,
}: {
  empreendimento: Empreendimento;
  priority?: boolean;
}) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
      <Link
        href={`/empreendimentos/${e.id}`}
        className="relative block aspect-[4/3] overflow-hidden"
      >
        <Image
          src={e.cartao}
          alt={`Imagem do empreendimento ${e.nome}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={priority}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex gap-2">
          <span className="rounded-full bg-accent-600 px-3 py-1 text-xs font-semibold text-white shadow-sm">
            {STATUS_LABEL[e.status]}
          </span>
          <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-ink-soft backdrop-blur-sm">
            {e.categoria}
          </span>
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-serif text-2xl text-ink">
          <Link
            href={`/empreendimentos/${e.id}`}
            className="transition-colors hover:text-accent-700"
          >
            {e.nome}
          </Link>
        </h3>
        <p className="mt-1 text-sm font-medium text-accent-700">{e.subtitulo}</p>

        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-ink-muted">
          <MapPin className="h-4 w-4 text-accent-600" aria-hidden="true" />
          {e.bairro}, {e.cidade}
        </p>

        <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-ink-soft">
          {e.resumo}
        </p>

        <Link
          href={`/empreendimentos/${e.id}`}
          className="group/link mt-5 inline-flex items-center gap-2 text-sm font-semibold text-accent-700"
        >
          Conhecer o empreendimento
          <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
        </Link>
      </div>
    </article>
  );
}
