import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Target, Eye, HeartHandshake, MessageCircle, ArrowRight } from "lucide-react";
import { marca, whatsappLink } from "@/lib/config";

export const metadata: Metadata = {
  title: "A incorporadora",
  description:
    "Conheça a MG Incorporações: história, propósito e a forma de trabalhar de uma incorporadora dedicada a empreendimentos de alto padrão.",
  alternates: { canonical: "/sobre" },
};

const valores = [
  {
    icon: Target,
    titulo: "Missão",
    desc: "Desenvolver empreendimentos que valorizam as cidades e o patrimônio de quem investe, com qualidade construtiva e respeito ao cliente.",
  },
  {
    icon: Eye,
    titulo: "Visão",
    desc: "Ser referência regional em incorporação, reconhecida pela escolha de boas localizações e pela entrega daquilo que promete.",
  },
  {
    icon: HeartHandshake,
    titulo: "Valores",
    desc: "Transparência em cada etapa, compromisso com prazos e cuidado com os detalhes que fazem a diferença no dia a dia.",
  },
];

const etapas = [
  {
    n: "01",
    titulo: "Estudo & terreno",
    desc: "Selecionamos localizações estratégicas e estudamos o melhor aproveitamento para cada região.",
  },
  {
    n: "02",
    titulo: "Projeto & concepção",
    desc: "Trabalhamos arquitetura, áreas comuns e tipologias para criar empreendimentos que façam sentido.",
  },
  {
    n: "03",
    titulo: "Obra & qualidade",
    desc: "Acompanhamos a construção com padrão de qualidade e gestão de prazos do início ao fim.",
  },
  {
    n: "04",
    titulo: "Entrega & relacionamento",
    desc: "Entregamos o empreendimento e seguimos próximos dos clientes no pós-obra.",
  },
];

export default function SobrePage() {
  return (
    <div>
      {/* Hero */}
      <section className="border-b border-ink/10 bg-surface">
        <div className="container-x grid gap-10 py-14 lg:grid-cols-2 lg:items-center lg:py-20">
          <div>
            <p className="eyebrow">A incorporadora</p>
            <h1 className="mt-3 font-serif text-4xl font-semibold leading-tight text-ink sm:text-5xl">
              Uma incorporadora movida por bons projetos
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-ink-soft">
              A {marca.nome} nasceu em {marca.fundadaEm} com um objetivo claro:
              desenvolver empreendimentos que combinam localização, arquitetura
              e qualidade construtiva. São imóveis que valorizam com o tempo e
              melhoram a rotina de quem os ocupa.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-ink-soft">
              Nossa equipe acredita que incorporar é, antes de tudo, assumir um
              compromisso de longo prazo com a cidade e com o cliente.
            </p>
            <Link href="/empreendimentos" className="btn-primary mt-7 px-6 py-3.5">
              Ver empreendimentos
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
            <Image
              src="/projetos/valley-business/imgs/03-fachada-grande-plano-inserida-no-local.jpg"
              alt="Empreendimento da MG Incorporações inserido na paisagem da cidade"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Selo de solidez */}
      <section className="bg-accent-700">
        <div className="container-x flex flex-col items-center justify-center gap-6 py-14 text-center sm:flex-row sm:text-left">
          <span className="flex h-24 w-24 shrink-0 flex-col items-center justify-center rounded-full border-2 border-white/30 text-white">
            <span className="font-serif text-3xl font-semibold leading-none">
              20+
            </span>
            <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/80">
              anos
            </span>
          </span>
          <div>
            <p className="font-serif text-3xl font-semibold text-white sm:text-4xl">
              Mais de 20 anos de atuação
            </p>
            <p className="mt-2 max-w-xl text-white/80">
              Solidez e tradição construindo o futuro de {marca.cidade} desde{" "}
              {marca.fundadaEm}.
            </p>
          </div>
        </div>
      </section>

      {/* Missão / Visão / Valores */}
      <section className="container-x py-20">
        <div className="grid gap-6 md:grid-cols-3">
          {valores.map((v) => (
            <div
              key={v.titulo}
              className="rounded-2xl border border-ink/10 bg-surface p-8 shadow-card"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-600/10 text-brand">
                <v.icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <h2 className="mt-5 font-serif text-2xl text-ink">{v.titulo}</h2>
              <p className="mt-3 leading-relaxed text-ink-soft">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Como trabalhamos */}
      <section className="bg-surface py-20">
        <div className="container-x">
          <div className="max-w-2xl">
            <p className="eyebrow">Como trabalhamos</p>
            <h2 className="mt-2 font-serif text-3xl font-semibold text-ink sm:text-4xl">
              Da escolha do terreno à entrega das chaves
            </h2>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {etapas.map((e) => (
              <div key={e.n} className="rounded-2xl bg-sand-50 p-7">
                <p className="font-serif text-3xl font-semibold text-brand">
                  {e.n}
                </p>
                <h3 className="mt-3 font-serif text-lg text-ink">{e.titulo}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {e.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-x py-20">
        <div className="rounded-3xl bg-accent-950 px-8 py-14 text-center sm:px-14">
          <h2 className="mx-auto max-w-2xl font-serif text-3xl font-semibold text-white sm:text-4xl">
            Vamos conversar sobre o seu próximo investimento?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/80">
            Conheça o Valley Business Center e os próximos lançamentos da{" "}
            {marca.nome}.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href={whatsappLink("Olá! Gostaria de falar com a equipe da MG Incorporações.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              Falar no WhatsApp
            </a>
            <Link
              href="/contato"
              className="btn inline-flex bg-[#ffffff] px-6 py-3 text-[#0d4185] hover:bg-accent-50"
            >
              Página de contato
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
