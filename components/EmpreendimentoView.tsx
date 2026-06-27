import Image from "next/image";
import Link from "next/link";
import {
  ChevronRight,
  MapPin,
  MessageCircle,
  Phone,
  Check,
  Play,
} from "lucide-react";
import type { Empreendimento } from "@/data/empreendimentos";
import { getTodasImagens, STATUS_LABEL } from "@/data/empreendimentos";
import { iconeDiferencial } from "@/lib/diferencialIcons";
import { marca, whatsappLink } from "@/lib/config";
import GaleriaCategorizada from "@/components/GaleriaCategorizada";
import HeroCarrossel from "@/components/HeroCarrossel";
import Tipologias from "@/components/Tipologias";

/**
 * Texto editável "no lugar". Fora do modo de edição, renderiza o texto puro
 * (seguro para Server Component). No modo edição (só no painel), vira um campo
 * contentEditable que confirma a alteração ao perder o foco (sem pular o cursor).
 */
function Campo({
  editavel,
  value,
  onCommit,
  className = "",
}: {
  editavel?: boolean;
  value: string;
  onCommit?: (v: string) => void;
  className?: string;
}) {
  if (!editavel) return <>{value}</>;
  return (
    <span
      contentEditable
      suppressContentEditableWarning
      onBlur={(ev) => onCommit?.(ev.currentTarget.textContent ?? "")}
      className={`cursor-text rounded-sm outline-none ring-amber-400/0 transition-[box-shadow] hover:bg-amber-100/40 focus:bg-amber-50 focus:ring-2 focus:ring-amber-400 ${className}`}
      title="Clique para editar"
    >
      {value}
    </span>
  );
}

/**
 * Renderização completa da página de um empreendimento. Componente "compartilhado"
 * (sem diretiva): é usado tanto pela página pública (server) quanto pela
 * pré-visualização ao vivo do painel (client). Em `editavel`, os textos viram
 * campos editáveis e cada alteração chama `onChange` com o objeto atualizado.
 */
export default function EmpreendimentoView({
  e,
  editavel = false,
  onChange,
}: {
  e: Empreendimento;
  editavel?: boolean;
  onChange?: (e: Empreendimento) => void;
}) {
  /** aplica um patch raso e emite o objeto atualizado */
  const ed = (patch: Partial<Empreendimento>) => onChange?.({ ...e, ...patch });
  /** atualiza um item de um array de strings (descrição, pontos) */
  const edArr = (campo: "descricao", i: number, val: string) =>
    ed({ [campo]: e[campo].map((x, j) => (j === i ? val : x)) } as Partial<Empreendimento>);

  const totalImagens = getTodasImagens(e).length;
  const mapaQuery = encodeURIComponent(e.mapaQuery);
  const mensagemWpp = `Olá! Tenho interesse no ${e.nome}. Pode me passar mais informações?`;
  // Imagens do banner: 1ª categoria da galeria; se vazia, cai para a capa.
  const heroImagens = e.galeria[0]?.imagens?.length
    ? e.galeria[0].imagens
    : e.capa
      ? [{ src: e.capa, alt: e.nome }]
      : [];

  return (
    <div className="bg-sand-50">
      {/* HERO */}
      <section className="relative isolate overflow-hidden">
        <HeroCarrossel imagens={heroImagens} />

        <div className="container-x flex min-h-[80vh] flex-col justify-end py-14 lg:min-h-[88vh]">
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
              <Campo editavel={editavel} value={e.categoria} onCommit={(v) => ed({ categoria: v })} />
            </span>
          </div>
          <h1 className="mt-4 font-serif text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
            <Campo editavel={editavel} value={e.nome} onCommit={(v) => ed({ nome: v })} />
          </h1>
          <p className="mt-3 max-w-xl text-lg text-white/85">
            <Campo editavel={editavel} value={e.subtitulo} onCommit={(v) => ed({ subtitulo: v })} />
          </p>
          <p className="mt-2 flex items-center gap-1.5 text-sm text-white/75">
            <MapPin className="h-4 w-4" aria-hidden="true" />
            <Campo editavel={editavel} value={e.endereco} onCommit={(v) => ed({ endereco: v })} />
          </p>
        </div>
      </section>

      {/* NÚMEROS */}
      {e.numeros.length > 0 && (
        <section className="border-b border-ink/10 bg-surface">
          <div className="container-x grid grid-cols-2 gap-6 py-10 sm:grid-cols-4">
            {e.numeros.map((n, i) => (
              <div key={i} className="text-center sm:text-left">
                <p className="font-serif text-3xl font-semibold text-brand sm:text-4xl">
                  <Campo
                    editavel={editavel}
                    value={n.valor}
                    onCommit={(v) =>
                      ed({ numeros: e.numeros.map((x, j) => (j === i ? { ...x, valor: v } : x)) })
                    }
                  />
                </p>
                <p className="mt-1 text-sm text-ink-muted">
                  <Campo
                    editavel={editavel}
                    value={n.label}
                    onCommit={(v) =>
                      ed({ numeros: e.numeros.map((x, j) => (j === i ? { ...x, label: v } : x)) })
                    }
                  />
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SOBRE + CARD STICKY */}
      <div className="container-x grid gap-10 py-16 lg:grid-cols-[1fr_360px]">
        <div>
          <p className="eyebrow">O empreendimento</p>
          <h2 className="mt-2 font-serif text-3xl font-semibold text-ink">
            <Campo editavel={editavel} value={e.tagline} onCommit={(v) => ed({ tagline: v })} />
          </h2>
          <div className="mt-6 space-y-4 leading-relaxed text-ink-soft">
            {e.descricao.map((p, i) => (
              <p key={i}>
                <Campo
                  editavel={editavel}
                  value={p}
                  onCommit={(v) => edArr("descricao", i, v)}
                />
              </p>
            ))}
          </div>

          {/* Diferenciais */}
          {e.diferenciais.length > 0 && (
            <>
              <h3 className="mt-12 font-serif text-2xl text-ink">
                Estrutura & diferenciais
              </h3>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {e.diferenciais.map((d, i) => {
                  const Icon = iconeDiferencial(d.icon);
                  return (
                    <div
                      key={i}
                      className="rounded-2xl border border-ink/10 bg-surface p-6 shadow-card"
                    >
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-600/10 text-brand">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <h4 className="mt-4 font-serif text-lg text-ink">
                        <Campo
                          editavel={editavel}
                          value={d.titulo}
                          onCommit={(v) =>
                            ed({ diferenciais: e.diferenciais.map((x, j) => (j === i ? { ...x, titulo: v } : x)) })
                          }
                        />
                      </h4>
                      <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                        <Campo
                          editavel={editavel}
                          value={d.desc}
                          onCommit={(v) =>
                            ed({ diferenciais: e.diferenciais.map((x, j) => (j === i ? { ...x, desc: v } : x)) })
                          }
                        />
                      </p>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Card de contato */}
        <aside>
          <div className="sticky top-32 space-y-4">
            <div className="rounded-2xl border border-ink/10 bg-surface p-6 shadow-card">
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

              <p className="mt-6 text-center text-xs text-ink-muted">
                {marca.nome} · CNPJ {marca.cnpj}
              </p>
            </div>
          </div>
        </aside>
      </div>

      {/* GALERIA */}
      {totalImagens > 0 && (
        <section className="border-t border-ink/10 bg-surface py-16">
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
      )}

      {/* TIPOLOGIAS + PLANTAS */}
      {(e.tipologias.length > 0 || e.plantasComuns.length > 0) && (
        <section className="container-x py-16">
          {e.tipologias.length > 0 && (
            <>
              <p className="eyebrow">Plantas</p>
              <h2 className="mt-2 font-serif text-3xl font-semibold text-ink">
                Tipologias das salas
              </h2>
              <p className="mt-3 max-w-2xl text-ink-soft">
                Salas que se adaptam ao tamanho do seu negócio. Escolha uma
                tipologia e veja a opção individual ou unificada.
              </p>
              <div className="mt-8">
                <Tipologias tipologias={e.tipologias} />
              </div>
            </>
          )}

          {/* Plantas de áreas comuns */}
          {e.plantasComuns.length > 0 && (
            <>
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
                    className="group rounded-2xl border border-ink/10 bg-surface p-4 shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover"
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
                    <h4 className="mt-4 font-serif text-lg text-ink">
                      {p.titulo}
                    </h4>
                    <p className="mt-1 text-sm text-ink-soft">{p.descricao}</p>
                  </a>
                ))}
              </div>
            </>
          )}
        </section>
      )}

      {/* VÍDEOS */}
      {e.videos.length > 0 && (
        <section className="border-t border-ink/10 bg-surface py-16">
          <div className="container-x">
            <p className="eyebrow">Vídeos</p>
            <h2 className="mt-2 font-serif text-3xl font-semibold text-ink">
              Veja o {e.nome} em movimento
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {e.videos.map((v, i) => (
                <figure key={i}>
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
                    <Play className="h-4 w-4 text-brand" aria-hidden="true" />
                    <Campo
                      editavel={editavel}
                      value={v.titulo}
                      onCommit={(val) =>
                        ed({ videos: e.videos.map((x, j) => (j === i ? { ...x, titulo: val } : x)) })
                      }
                    />
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* LOCALIZAÇÃO + FICHA */}
      <section className="container-x py-16">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Localização</p>
            <h2 className="mt-2 font-serif text-3xl font-semibold text-ink">
              <Campo
                editavel={editavel}
                value={e.localizacao.titulo || `No coração de ${e.cidade}`}
                onCommit={(v) => ed({ localizacao: { ...e.localizacao, titulo: v } })}
              />
            </h2>
            <p className="mt-4 leading-relaxed text-ink-soft">
              <Campo
                editavel={editavel}
                value={e.localizacao.descricao}
                onCommit={(v) => ed({ localizacao: { ...e.localizacao, descricao: v } })}
              />
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {e.localizacao.pontos.map((p, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2.5 text-sm text-ink-soft"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-600/10 text-brand">
                    <Check className="h-4 w-4" />
                  </span>
                  <Campo
                    editavel={editavel}
                    value={p}
                    onCommit={(v) =>
                      ed({
                        localizacao: {
                          ...e.localizacao,
                          pontos: e.localizacao.pontos.map((x, j) => (j === i ? v : x)),
                        },
                      })
                    }
                  />
                </li>
              ))}
            </ul>

            {e.mapaQuery && (
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
            )}
          </div>

          {/* Ficha técnica */}
          {e.ficha.length > 0 && (
            <div>
              <p className="eyebrow">Ficha técnica</p>
              <h2 className="mt-2 font-serif text-3xl font-semibold text-ink">
                Resumo do empreendimento
              </h2>
              <dl className="mt-6 divide-y divide-ink/10 rounded-2xl border border-ink/10 bg-surface">
                {e.ficha.map((f, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-4 px-5 py-4"
                  >
                    <dt className="text-sm text-ink-muted">
                      <Campo
                        editavel={editavel}
                        value={f.label}
                        onCommit={(v) =>
                          ed({ ficha: e.ficha.map((x, j) => (j === i ? { ...x, label: v } : x)) })
                        }
                      />
                    </dt>
                    <dd className="text-right text-sm font-medium text-ink">
                      <Campo
                        editavel={editavel}
                        value={f.valor}
                        onCommit={(v) =>
                          ed({ ficha: e.ficha.map((x, j) => (j === i ? { ...x, valor: v } : x)) })
                        }
                      />
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 text-xs text-ink-muted">
                Informações de caráter comercial. Os dados oficiais constam do
                memorial de incorporação registrado em cartório.
              </p>
            </div>
          )}
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
              className="btn inline-flex bg-[#ffffff] px-7 py-4 text-[#0d4185] hover:bg-accent-50"
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
