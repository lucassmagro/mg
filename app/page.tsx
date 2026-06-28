import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  MessageCircle,
  MapPin,
  Building2,
  ShieldCheck,
  Compass,
  TrendingUp,
} from "lucide-react";
import {
  getDestaques,
  getCategorias,
  listarEmpreendimentos,
} from "@/lib/empreendimentos";
import { getTodasImagens } from "@/data/empreendimentos";
import CarrosselRenders from "@/components/CarrosselRenders";
import HeroBusca from "@/components/HeroBusca";
import { iconeDiferencial } from "@/lib/diferencialIcons";
import { marca, whatsappLink } from "@/lib/config";

const valores = [
  {
    icon: Building2,
    titulo: "Projetos com propósito",
    desc: "Empreendimentos pensados do conceito à entrega, unindo arquitetura, funcionalidade e qualidade construtiva.",
  },
  {
    icon: Compass,
    titulo: "Localização estratégica",
    desc: "Endereços escolhidos a dedo, em regiões com infraestrutura, mobilidade e potencial de valorização.",
  },
  {
    icon: ShieldCheck,
    titulo: "Segurança e transparência",
    desc: "Memorial descritivo claro, documentação em ordem e acompanhamento próximo em cada etapa.",
  },
  {
    icon: TrendingUp,
    titulo: "Valorização do investimento",
    desc: "Imóveis que se sustentam pela localização, pela estrutura e por uma marca comprometida com o resultado.",
  },
];

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [destaques, lista, categorias] = await Promise.all([
    getDestaques(),
    listarEmpreendimentos(),
    getCategorias(),
  ]);
  const destaque = destaques[0] ?? lista[0];

  // Sem nenhum empreendimento cadastrado ainda — evita quebra na primeira carga.
  if (!destaque) {
    return (
      <section className="container-x flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
        <h1 className="font-serif text-3xl font-semibold text-ink sm:text-4xl">
          Em breve, novos empreendimentos
        </h1>
        <p className="mt-4 max-w-md text-ink-soft">
          Estamos preparando o conteúdo. Volte em instantes para conhecer os
          projetos da {marca.nome}.
        </p>
      </section>
    );
  }

  // Renders do carrossel: usa as imagens da galeria (com fallback seguro).
  const rendersCarrossel = getTodasImagens(destaque).slice(0, 9);

  return (
    <>
      {/* HERO + BUSCA DE IMÓVEIS */}
      <HeroBusca destaque={destaque} lista={lista} categorias={categorias} />

      {/* QUEM SOMOS */}
      <section className="container-x py-20">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="eyebrow">A incorporadora</p>
            <h2 className="mt-2 font-serif text-3xl font-semibold text-ink sm:text-4xl">
              Construímos endereços para a próxima década
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-ink-soft">
              A {marca.nome} se dedica a empreendimentos que fazem diferença na
              rotina das pessoas e dos negócios. Localizações privilegiadas,
              espaços bem pensados e um cuidado constante com a qualidade da
              execução estão no centro de cada projeto.
            </p>
            <p className="mt-4 leading-relaxed text-ink-soft">
              Acreditamos que um bom imóvel é, antes de tudo, uma boa decisão,
              que valoriza com o tempo e melhora o dia a dia de quem o ocupa.
            </p>

            {/* Selo de solidez */}
            <div className="mt-7 inline-flex items-center gap-4 rounded-2xl border border-accent-200 bg-accent-50 py-3 pl-3 pr-5">
              <span className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-full bg-accent-600 text-white">
                <span className="font-serif text-lg font-semibold leading-none">
                  20+
                </span>
                <span className="text-[9px] font-semibold uppercase tracking-wider text-white/85">
                  anos
                </span>
              </span>
              <span className="text-sm font-semibold text-brand">
                Mais de 20 anos de atuação
                <span className="mt-0.5 block text-xs font-normal text-ink-muted">
                  Solidez e tradição desde {marca.fundadaEm}.
                </span>
              </span>
            </div>

            <Link
              href="/sobre"
              className="group mt-7 flex items-center gap-2 text-sm font-semibold text-brand"
            >
              Conheça a {marca.nomeCurto}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {valores.map((v) => (
              <div
                key={v.titulo}
                className="rounded-2xl border border-ink/10 bg-surface p-6 shadow-card"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-600/10 text-brand">
                  <v.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-serif text-lg text-ink">{v.titulo}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EMPREENDIMENTO EM DESTAQUE */}
      <section className="bg-surface py-20">
        <div className="container-x">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Empreendimento em destaque</p>
              <h2 className="mt-2 font-serif text-3xl font-semibold text-ink sm:text-4xl">
                {destaque.nome}
              </h2>
            </div>
            <Link
              href="/empreendimentos"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-brand"
            >
              Ver todos os empreendimentos
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-2 lg:items-center">
            <Link
              href={`/empreendimentos/${destaque.id}`}
              className="group relative block aspect-[3/4] overflow-hidden rounded-3xl"
            >
              <Image
                src="/projetos/valley-business/imgs/04-fachada-sunset.jpg"
                alt={`Fachada do ${destaque.nome} ao entardecer`}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </Link>

            <div>
              <p className="flex items-center gap-1.5 text-sm text-ink-muted">
                <MapPin className="h-4 w-4 text-brand" />
                {destaque.bairro}, {destaque.cidade}
              </p>
              <p className="mt-4 leading-relaxed text-ink-soft">
                {destaque.descricao[0]}
              </p>
              <ul className="mt-6 grid grid-cols-2 gap-3">
                {destaque.diferenciais.slice(0, 6).map((d) => {
                  const Icon = iconeDiferencial(d.icon);
                  return (
                    <li
                      key={d.titulo}
                      className="flex items-center gap-2.5 text-sm text-ink-soft"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-600/10 text-brand">
                        <Icon className="h-4 w-4" />
                      </span>
                      {d.titulo}
                    </li>
                  );
                })}
              </ul>
              <Link
                href={`/empreendimentos/${destaque.id}`}
                className="btn-primary mt-8 px-7 py-3.5"
              >
                Conhecer o empreendimento
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CARROSSEL DE RENDERS */}
      {rendersCarrossel.length > 0 && (
        <section className="container-x py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Um tour pelo {destaque.nome}</p>
              <h2 className="mt-2 max-w-2xl font-serif text-3xl font-semibold text-ink sm:text-4xl">
                Estrutura corporativa do térreo ao rooftop
              </h2>
            </div>
            <Link
              href={`/empreendimentos/${destaque.id}`}
              className="group inline-flex items-center gap-2 text-sm font-semibold text-brand"
            >
              Ver galeria completa
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="mt-10">
            <CarrosselRenders imagens={rendersCarrossel} />
          </div>
        </section>
      )}

      {/* CTA BAND */}
      <section className="container-x pb-24">
        <div className="relative overflow-hidden rounded-3xl bg-accent-700 px-8 py-14 sm:px-14 sm:py-16">
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/5" />
          <div className="absolute -bottom-20 -left-10 h-72 w-72 rounded-full bg-white/5" />
          <div className="relative flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <h2 className="font-serif text-3xl font-semibold text-white sm:text-4xl">
                Quer conhecer o {destaque.nome} de perto?
              </h2>
              <p className="mt-4 text-lg text-white/85">
                Fale com a nossa equipe de vendas pelo WhatsApp e receba o
                material completo do empreendimento, plantas e condições.
              </p>
            </div>
            <a
              href={whatsappLink(
                `Olá! Gostaria de receber o material do ${destaque.nome}.`,
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="btn inline-flex shrink-0 bg-[#ffffff] px-7 py-4 text-base text-[#0d4185] hover:bg-accent-50"
            >
              <MessageCircle className="h-5 w-5" aria-hidden="true" />
              Falar no WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
