import type { Metadata } from "next";
import { Clock } from "lucide-react";
import { empreendimentos } from "@/data/empreendimentos";
import EmpreendimentoCard from "@/components/EmpreendimentoCard";
import { marca } from "@/lib/config";

export const metadata: Metadata = {
  title: "Empreendimentos",
  description:
    "Conheça os empreendimentos da MG Incorporações, com destaque para o Valley Business — torre corporativa de salas comerciais em Chapecó.",
};

export default function EmpreendimentosPage() {
  return (
    <div className="bg-sand-50">
      <section className="border-b border-ink/10 bg-white">
        <div className="container-x py-12 sm:py-16">
          <p className="eyebrow">Portfólio</p>
          <h1 className="mt-2 font-serif text-3xl font-semibold text-ink sm:text-4xl">
            Nossos empreendimentos
          </h1>
          <p className="mt-3 max-w-2xl text-ink-soft">
            Projetos da {marca.nome} pensados para morar, trabalhar e investir.
            Conheça o que está em comercialização e o que vem por aí.
          </p>
        </div>
      </section>

      <div className="container-x py-14">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {empreendimentos.map((e, i) => (
            <EmpreendimentoCard
              key={e.id}
              empreendimento={e}
              priority={i === 0}
            />
          ))}

          {/* Teaser — próximos lançamentos */}
          <div className="flex flex-col items-start justify-center rounded-2xl border border-dashed border-ink/20 bg-white/60 p-8">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-600/10 text-accent-700">
              <Clock className="h-6 w-6" />
            </span>
            <h3 className="mt-5 font-serif text-xl text-ink">
              Novos lançamentos em breve
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              Estamos preparando os próximos empreendimentos da {marca.nomeCurto}.
              Cadastre seu interesse e seja avisado em primeira mão.
            </p>
            <a
              href={`https://wa.me/${marca.whatsapp}?text=${encodeURIComponent(
                "Olá! Gostaria de ser avisado sobre os próximos lançamentos da MG Incorporações.",
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline mt-6 px-5 py-2.5 text-sm"
            >
              Quero ser avisado
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
