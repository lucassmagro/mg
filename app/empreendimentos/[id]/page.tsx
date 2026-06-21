import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChevronRight,
  MapPin,
  MessageCircle,
  Phone,
  Check,
  Play,
} from "lucide-react";
import {
  getEmpreendimento,
  getTodasImagens,
  empreendimentos,
  STATUS_LABEL,
} from "@/data/empreendimentos";
import { iconeDiferencial } from "@/lib/diferencialIcons";
import { marca, whatsappLink } from "@/lib/config";
import GaleriaCategorizada from "@/components/GaleriaCategorizada";
import Tipologias from "@/components/Tipologias";
import VisitForm from "@/components/VisitForm";

export function generateStaticParams() {
  return empreendimentos.map((e) => ({ id: e.id }));
}

export function generateMetadata({
  params,
}: {
  params: { id: string };
}): Metadata {
  const e = getEmpreendimento(params.id);
  if (!e) return { title: "Empreendimento não encontrado" };
  return {
    title: `${e.nome} — ${e.subtitulo}`,
    description: e.resumo,
  };
}

export default function EmpreendimentoPage({
  params,
}: {
  params: { id: string };
}) {
  const e = getEmpreendimento(params.id);
  if (!e) notFound();

  const totalImagens = getTodasImagens(e).length;
  const mapaQuery = encodeURIComponent(e.mapaQuery);
  const mensagemWpp = `Olá! Tenho interesse no ${e.nome}. Pode me passar mais informações?`;

  return (
    <div className="bg-sand-50">
      {/* HERO */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Image
            src={e.capa}
            alt={`Fachada do empreendimento ${e.nome}`}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/40 to-ink/80" />
        </div>

        <div className="container-x flex min-h-[520px] flex-col justify-end py-14 lg:min-h-[600px]">
          <nav
            aria-label="Trilha de navegação"
            className="mb-auto flex flex-wrap items-center gap-1.5 pt-6 text-sm text-white/70"
          >
            <Link href="/" className="hover:text-white">
              Início
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/empreendimentos" className="hover:text-white">
              Empreendimentos
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-white/90">{e.nome}</span>
          </nav>

          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-accent-600 px-3 py-1 text-xs font-semibold text-white">
              {STATUS_LABEL[e.status]}
            </span>
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
              {e.categoria}
            </span>
          </div>
          <h1 className="mt-4 font-serif text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
            {e.nome}
          </h1>
          <p className="mt-3 max-w-xl text-lg text-white/85">{e.subtitulo}</p>
          <p className="mt-2 flex items-center gap-1.5 text-sm text-white/75">
            <MapPin className="h-4 w-4" aria-hidden="true" />
            {e.endereco}
          </p>
        </div>
      </section>

      {/* NÚMEROS */}
      <section className="border-b border-ink/10 bg-white">
        <div className="container-x grid grid-cols-2 gap-6 py-10 sm:grid-cols-4">
          {e.numeros.map((n) => (
            <div key={n.label} className="text-center sm:text-left">
              <p className="font-serif text-3xl font-semibold text-accent-700 sm:text-4xl">
                {n.valor}
              </p>
              <p className="mt-1 text-sm text-ink-muted">{n.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SOBRE + CARD STICKY */}
      <div className="container-x grid gap-10 py-16 lg:grid-cols-[1fr_360px]">
        <div>
          <p className="eyebrow">O empreendimento</p>
          <h2 className="mt-2 font-serif text-3xl font-semibold text-ink">
            {e.tagline}
          </h2>
          <div className="mt-6 space-y-4 leading-relaxed text-ink-soft">
            {e.descricao.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          {/* Diferenciais */}
          <h3 className="mt-12 font-serif text-2xl text-ink">
            Estrutura & diferenciais
          </h3>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {e.diferenciais.map((d) => {
              const Icon = iconeDiferencial(d.icon);
              return (
                <div
                  key={d.titulo}
                  className="rounded-2xl border border-ink/10 bg-white p-6 shadow-card"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-600/10 text-accent-700">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h4 className="mt-4 font-serif text-lg text-ink">
                    {d.titulo}
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                    {d.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Card de contato */}
        <aside>
          <div className="sticky top-24 space-y-4">
            <div className="rounded-2xl border border-ink/10 bg-white p-6 shadow-card">
              <p className="font-serif text-xl text-ink">
                Interessado no {e.nome}?
              </p>
              <p className="mt-1 text-sm text-ink-soft">
                Fale com a nossa equipe de vendas e receba o material completo.
              </p>

              <a
                href={whatsappLink(mensagemWpp)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp mt-4 w-full"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                Tenho interesse
              </a>
              <a
                href={`tel:+55${marca.whatsapp.slice(2)}`}
                className="btn-outline mt-2 w-full"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                {marca.telefone}
              </a>

              <div className="my-5 border-t border-ink/10" />

              <VisitForm titulo={e.nome} />

              <p className="mt-4 text-center text-xs text-ink-muted">
                {marca.nome} · CNPJ {marca.cnpj}
              </p>
            </div>
          </div>
        </aside>
      </div>

      {/* GALERIA */}
      <section className="border-t border-ink/10 bg-white py-16">
        <div className="container-x">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="eyebrow">Galeria</p>
              <h2 className="mt-2 font-serif text-3xl font-semibold text-ink">
                Imagens do projeto
              </h2>
            </div>
            <p className="text-sm text-ink-muted">
              {totalImagens} imagens · clique para ampliar
            </p>
          </div>
          <div className="mt-8">
            <GaleriaCategorizada galeria={e.galeria} />
          </div>
        </div>
      </section>

      {/* TIPOLOGIAS */}
      <section className="container-x py-16">
        <p className="eyebrow">Plantas</p>
        <h2 className="mt-2 font-serif text-3xl font-semibold text-ink">
          Tipologias das salas
        </h2>
        <p className="mt-3 max-w-2xl text-ink-soft">
          Salas que se adaptam ao tamanho do seu negócio. Escolha uma tipologia
          e veja a opção individual ou unificada.
        </p>
        <div className="mt-8">
          <Tipologias tipologias={e.tipologias} />
        </div>

        {/* Plantas de áreas comuns */}
        <h3 className="mt-14 font-serif text-2xl text-ink">
          Pavimentos & áreas comuns
        </h3>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {e.plantasComuns.map((p) => (
            <a
              key={p.titulo}
              href={p.src}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-2xl border border-ink/10 bg-white p-4 shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-sand-100">
                <Image
                  src={p.src}
                  alt={`Planta — ${p.titulo}`}
                  fill
                  sizes="(max-width: 1024px) 50vw, 33vw"
                  className="object-contain p-2"
                />
              </div>
              <h4 className="mt-4 font-serif text-lg text-ink">{p.titulo}</h4>
              <p className="mt-1 text-sm text-ink-soft">{p.descricao}</p>
            </a>
          ))}
        </div>
      </section>

      {/* VÍDEOS */}
      <section className="border-t border-ink/10 bg-white py-16">
        <div className="container-x">
          <p className="eyebrow">Vídeos</p>
          <h2 className="mt-2 font-serif text-3xl font-semibold text-ink">
            Veja o {e.nome} em movimento
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {e.videos.map((v) => (
              <figure key={v.src}>
                <div className="relative overflow-hidden rounded-2xl bg-ink shadow-card">
                  <video
                    controls
                    preload="none"
                    poster={v.poster}
                    className="aspect-[9/16] w-full object-cover"
                  >
                    <source src={v.src} type="video/mp4" />
                    Seu navegador não suporta a reprodução de vídeo.
                  </video>
                </div>
                <figcaption className="mt-3 flex items-center gap-2 text-sm font-medium text-ink-soft">
                  <Play className="h-4 w-4 text-accent-600" aria-hidden="true" />
                  {v.titulo}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* LOCALIZAÇÃO + FICHA */}
      <section className="container-x py-16">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Localização</p>
            <h2 className="mt-2 font-serif text-3xl font-semibold text-ink">
              No coração de {e.cidade}
            </h2>
            <p className="mt-4 leading-relaxed text-ink-soft">
              {e.localizacao.descricao}
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {e.localizacao.pontos.map((p) => (
                <li
                  key={p}
                  className="flex items-center gap-2.5 text-sm text-ink-soft"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-600/10 text-accent-700">
                    <Check className="h-4 w-4" />
                  </span>
                  {p}
                </li>
              ))}
            </ul>

            <div className="mt-6 overflow-hidden rounded-2xl border border-ink/10">
              <iframe
                title={`Mapa de ${e.bairro}, ${e.cidade}`}
                src={`https://maps.google.com/maps?q=${mapaQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                width="100%"
                height="320"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="block"
              />
            </div>
          </div>

          {/* Ficha técnica */}
          <div>
            <p className="eyebrow">Ficha técnica</p>
            <h2 className="mt-2 font-serif text-3xl font-semibold text-ink">
              Resumo do empreendimento
            </h2>
            <dl className="mt-6 divide-y divide-ink/10 rounded-2xl border border-ink/10 bg-white">
              {e.ficha.map((f) => (
                <div
                  key={f.label}
                  className="flex items-center justify-between gap-4 px-5 py-4"
                >
                  <dt className="text-sm text-ink-muted">{f.label}</dt>
                  <dd className="text-right text-sm font-medium text-ink">
                    {f.valor}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-xs text-ink-muted">
              Informações de caráter comercial. Os dados oficiais constam do
              memorial de incorporação registrado em cartório.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-x pb-24">
        <div className="rounded-3xl bg-accent-700 px-8 py-14 text-center sm:px-14">
          <h2 className="mx-auto max-w-2xl font-serif text-3xl font-semibold text-white sm:text-4xl">
            Garanta a sua sala no {e.nome}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/85">
            Fale agora com a nossa equipe e receba plantas, tabela de valores e
            condições de pagamento.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href={whatsappLink(mensagemWpp)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn inline-flex bg-white px-7 py-4 text-accent-700 hover:bg-sand-100"
            >
              <MessageCircle className="h-5 w-5" aria-hidden="true" />
              Falar no WhatsApp
            </a>
            <Link
              href="/contato"
              className="btn inline-flex border border-white/40 px-7 py-4 text-white hover:bg-white/10"
            >
              Página de contato
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
