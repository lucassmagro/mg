"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "react-toastify";
import {
  Plus,
  Trash2,
  Loader2,
  GripVertical,
  ChevronUp,
  ChevronDown,
  Pencil,
  Eye,
  Globe,
  FileText,
} from "lucide-react";
import type {
  Empreendimento,
  StatusEmpreendimento,
  TipoImovel,
  Operacao,
} from "@/data/empreendimentos";
import { DIFERENCIAL_ICONS } from "@/lib/diferencialIcons";
import { salvarEmpreendimento } from "@/app/admin/actions";
import CampoUpload from "@/components/admin/CampoUpload";
import EmpreendimentoView from "@/components/EmpreendimentoView";

const STATUS: { v: StatusEmpreendimento; l: string }[] = [
  { v: "lancamento", l: "Lançamento" },
  { v: "em-obras", l: "Em obras" },
  { v: "pronto", l: "Pronto para morar" },
  { v: "breve", l: "Em breve" },
];

const TIPOS: { v: TipoImovel; l: string }[] = [
  { v: "residencial", l: "Residencial" },
  { v: "comercial", l: "Comercial" },
  { v: "industrial", l: "Industrial" },
];

const OPERACOES: { v: Operacao; l: string }[] = [
  { v: "comprar", l: "Comprar" },
  { v: "alugar", l: "Alugar" },
  { v: "temporada", l: "Por temporada" },
];

const ICONES = Object.keys(DIFERENCIAL_ICONS);

/** Estado inicial para um empreendimento novo. */
function vazio(): Empreendimento {
  return {
    id: "",
    nome: "",
    subtitulo: "",
    tagline: "",
    status: "lancamento",
    categoria: "",
    tipoImovel: "comercial",
    operacoes: ["comprar"],
    cidade: "",
    bairro: "",
    endereco: "",
    mapaQuery: "",
    capa: "",
    cartao: "",
    cartaoPos: "50% 50%",
    cartaoZoom: 1,
    capaPos: "50% 50%",
    capaZoom: 1,
    resumo: "",
    descricao: [],
    numeros: [],
    diferenciais: [],
    galeria: [],
    tipologias: [],
    plantasComuns: [],
    videos: [],
    ficha: [],
    localizacao: { descricao: "", pontos: [] },
    destaque: false,
    publicado: false,
  };
}

function slugify(s: string) {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function EmpreendimentoForm({
  inicial,
  isEdit = false,
}: {
  inicial?: Empreendimento;
  isEdit?: boolean;
}) {
  const router = useRouter();
  const [e, setE] = useState<Empreendimento>(inicial ?? vazio());
  const [slugTocado, setSlugTocado] = useState(isEdit);
  const [salvando, setSalvando] = useState<null | "rascunho" | "publicar">(null);
  const [aba, setAba] = useState<"editar" | "preview">("editar");

  function set<K extends keyof Empreendimento>(k: K, v: Empreendimento[K]) {
    setE((prev) => ({ ...prev, [k]: v }));
  }

  function aoMudarNome(nome: string) {
    setE((prev) => ({
      ...prev,
      nome,
      id: slugTocado ? prev.id : slugify(nome),
    }));
  }

  // Imagens marcadas para o banner do topo, na ordem atual do carrossel.
  const bannerSelecionadas = e.galeria
    .flatMap((c) => c.imagens)
    .filter((img) => img.banner)
    .sort((a, b) => (a.bannerOrdem ?? 0) - (b.bannerOrdem ?? 0));

  /** Troca de posição uma imagem do banner e reescreve a ordem na galeria. */
  function moverBanner(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= bannerSelecionadas.length) return;
    const lista = [...bannerSelecionadas];
    [lista[i], lista[j]] = [lista[j], lista[i]];
    const ordemPorSrc = new Map(lista.map((img, idx) => [img.src, idx]));
    set(
      "galeria",
      e.galeria.map((c) => ({
        ...c,
        imagens: c.imagens.map((img) =>
          img.banner && ordemPorSrc.has(img.src)
            ? { ...img, bannerOrdem: ordemPorSrc.get(img.src) }
            : img,
        ),
      })),
    );
  }

  function toggleOperacao(op: Operacao) {
    set(
      "operacoes",
      e.operacoes.includes(op)
        ? e.operacoes.filter((o) => o !== op)
        : [...e.operacoes, op],
    );
  }

  async function salvar(publicar: boolean) {
    setSalvando(publicar ? "publicar" : "rascunho");
    const r = await salvarEmpreendimento({ ...e, publicado: publicar });
    if (!r.ok) {
      toast.error(r.erro ?? "Erro ao salvar.");
      setSalvando(null);
      return;
    }
    toast.success(publicar ? "Empreendimento publicado!" : "Rascunho salvo!");
    router.push("/admin");
    router.refresh();
  }

  const slug = e.id || "rascunho";

  const acoes = (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => router.push("/admin")}
        className="btn-outline"
      >
        Cancelar
      </button>
      <button
        type="button"
        onClick={() => salvar(false)}
        disabled={!!salvando}
        className="btn-outline disabled:opacity-60"
      >
        {salvando === "rascunho" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <FileText className="h-4 w-4" />
        )}
        Salvar rascunho
      </button>
      <button
        type="button"
        onClick={() => salvar(true)}
        disabled={!!salvando}
        className="btn-primary disabled:opacity-60"
      >
        {salvando === "publicar" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Globe className="h-4 w-4" />
        )}
        Publicar
      </button>
    </div>
  );

  return (
    <div className="pb-10">
      {/* Barra de ações fixa: título, status, abas e botões */}
      <div className="sticky top-0 z-20 border-b border-ink/10 bg-sand-50/95 backdrop-blur">
        <div className="mx-auto max-w-4xl px-4 py-3 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <h1 className="font-serif text-xl font-semibold text-ink">
                {isEdit ? "Editar empreendimento" : "Novo empreendimento"}
              </h1>
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                  e.publicado
                    ? "bg-green-100 text-green-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {e.publicado ? "Publicado" : "Rascunho"}
              </span>
            </div>
            {acoes}
          </div>

          {/* Abas Editar / Pré-visualizar */}
          <div className="mt-3 flex gap-1">
            {([
              { id: "editar", label: "Editar", icon: Pencil },
              { id: "preview", label: "Pré-visualizar", icon: Eye },
            ] as const).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setAba(t.id)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  aba === t.id
                    ? "bg-accent-600 text-white"
                    : "text-ink-soft hover:bg-sand-100"
                }`}
              >
                <t.icon className="h-4 w-4" />
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* PRÉ-VISUALIZAÇÃO ao vivo e EDITÁVEL: renderiza a página real do site */}
      {aba === "preview" && (
        <div className="border-t border-ink/10">
          {!e.nome ? (
            <p className="mx-auto max-w-4xl px-4 py-16 text-center text-ink-muted sm:px-6">
              Preencha ao menos o nome para ver a pré-visualização.
            </p>
          ) : (
            <>
              <p className="bg-amber-50 px-4 py-2 text-center text-xs text-amber-800">
                Clique nos textos (destacados em amarelo) para editar direto na
                página. Imagens, galeria, tipologias e adicionar/remover itens
                ficam na aba <strong>Editar</strong>. Lembre de{" "}
                <strong>Salvar</strong> ao terminar.
              </p>
              <EmpreendimentoView e={e} editavel onChange={setE} />
            </>
          )}
        </div>
      )}

      <form
        onSubmit={(ev) => ev.preventDefault()}
        className={`mx-auto max-w-4xl px-4 py-8 sm:px-6 ${
          aba === "preview" ? "hidden" : ""
        }`}
      >
        {/* ---- Identificação ---- */}
      <Secao titulo="Identificação">
        <div className="grid gap-4 sm:grid-cols-2">
          <Texto label="Nome" value={e.nome} onChange={aoMudarNome} required />
          <Texto
            label="Identificador na URL (slug)"
            value={e.id}
            onChange={(v) => {
              setSlugTocado(true);
              set("id", slugify(v));
            }}
            disabled={isEdit}
            dica={isEdit ? "Não pode ser alterado depois de criado." : "/empreendimentos/" + slug}
            required
          />
          <Texto
            label="Subtítulo"
            value={e.subtitulo}
            onChange={(v) => set("subtitulo", v)}
          />
          <Texto
            label="Tagline (frase de impacto)"
            value={e.tagline}
            onChange={(v) => set("tagline", v)}
          />
          <Texto
            label="Categoria (ex.: Salas comerciais)"
            value={e.categoria}
            onChange={(v) => set("categoria", v)}
          />
          <Selecao
            label="Status"
            value={e.status}
            onChange={(v) => set("status", v as StatusEmpreendimento)}
            opcoes={STATUS.map((s) => ({ v: s.v, l: s.l }))}
          />
          <Selecao
            label="Finalidade do imóvel"
            value={e.tipoImovel}
            onChange={(v) => set("tipoImovel", v as TipoImovel)}
            opcoes={TIPOS.map((t) => ({ v: t.v, l: t.l }))}
          />
          <div>
            <span className="label">Operações disponíveis</span>
            <div className="mt-1.5 flex flex-wrap gap-2">
              {OPERACOES.map((op) => (
                <button
                  key={op.v}
                  type="button"
                  onClick={() => toggleOperacao(op.v)}
                  className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                    e.operacoes.includes(op.v)
                      ? "border-brand bg-accent-50 text-brand"
                      : "border-ink/20 text-ink-muted hover:border-ink/40"
                  }`}
                >
                  {op.l}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Moeda
            label="Preço de venda — a partir de (R$)"
            value={e.precoVenda}
            onChange={(v) => set("precoVenda", v)}
          />
          <Moeda
            label="Preço de aluguel — a partir de (R$/mês)"
            value={e.precoAluguel}
            onChange={(v) => set("precoAluguel", v)}
          />
        </div>

        <label className="mt-4 flex items-center gap-2 text-sm text-ink-soft">
          <input
            type="checkbox"
            checked={e.destaque}
            onChange={(ev) => set("destaque", ev.target.checked)}
            className="h-4 w-4 rounded border-ink/30"
          />
          Exibir como empreendimento em destaque na home (apenas um por vez —
          marcar este desmarca os outros)
        </label>
      </Secao>

      {/* ---- Localização ---- */}
      <Secao titulo="Localização">
        <div className="grid gap-4 sm:grid-cols-2">
          <Texto label="Cidade" value={e.cidade} onChange={(v) => set("cidade", v)} />
          <Texto label="Bairro" value={e.bairro} onChange={(v) => set("bairro", v)} />
          <Texto
            label="Endereço completo"
            value={e.endereco}
            onChange={(v) => set("endereco", v)}
            className="sm:col-span-2"
          />
          <Texto
            label="Consulta do mapa (endereço para o Google Maps)"
            value={e.mapaQuery}
            onChange={(v) => set("mapaQuery", v)}
            className="sm:col-span-2"
          />
        </div>
        <div className="mt-4">
          <Texto
            label="Título da seção de localização"
            value={e.localizacao.titulo ?? ""}
            onChange={(v) => set("localizacao", { ...e.localizacao, titulo: v })}
            dica={`Vazio usa o padrão: "No coração de ${e.cidade || "Cidade"}"`}
          />
        </div>
        <div className="mt-4">
          <Area
            label="Texto da localização"
            value={e.localizacao.descricao}
            onChange={(v) => set("localizacao", { ...e.localizacao, descricao: v })}
          />
        </div>
        <div className="mt-4">
          <span className="label">Pontos de destaque da localização</span>
          <ListaTexto
            itens={e.localizacao.pontos}
            onChange={(pontos) => set("localizacao", { ...e.localizacao, pontos })}
            placeholder="Ex.: Região nobre e valorizada"
          />
        </div>
      </Secao>

      {/* ---- Imagens principais ---- */}
      <Secao titulo="Imagens principais">
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <CampoUpload
              label="Capa (destaque na home)"
              valor={e.capa}
              onChange={(v) => set("capa", v)}
              pasta="capa"
              slug={slug}
            />
            <p className="mt-1.5 text-xs text-ink-muted">
              Fundo do topo da página inicial quando este empreendimento está
              marcado como destaque. Também serve de reserva caso não haja
              galeria. O banner da página do empreendimento é definido na galeria,
              com a opção "Mostrar no banner do topo".
            </p>
            <AjusteImagem
              src={e.capa}
              pos={e.capaPos ?? "50% 50%"}
              zoom={e.capaZoom ?? 1}
              onPos={(v) => set("capaPos", v)}
              onZoom={(v) => set("capaZoom", v)}
              aspectClass="aspect-[16/9]"
              nota="A pré-visualização é aproximada; na home o topo é mais largo."
            />
          </div>
          <div>
            <CampoUpload
              label="Imagem do card"
              valor={e.cartao}
              onChange={(v) => set("cartao", v)}
              pasta="cartao"
              slug={slug}
            />
            <p className="mt-1.5 text-xs text-ink-muted">
              Miniatura usada nos cards de listagem (home e portfólio).
            </p>
            <AjusteImagem
              src={e.cartao}
              pos={e.cartaoPos ?? "50% 50%"}
              zoom={e.cartaoZoom ?? 1}
              onPos={(v) => set("cartaoPos", v)}
              onZoom={(v) => set("cartaoZoom", v)}
            />
          </div>
        </div>
      </Secao>

      {/* ---- Textos ---- */}
      <Secao titulo="Textos">
        <Area
          label="Resumo (aparece no card e na busca)"
          value={e.resumo}
          onChange={(v) => set("resumo", v)}
          rows={3}
        />
        <div className="mt-4">
          <span className="label">Descrição (parágrafos)</span>
          <ListaTexto
            itens={e.descricao}
            onChange={(d) => set("descricao", d)}
            multiline
            placeholder="Um parágrafo da descrição do empreendimento"
          />
        </div>
      </Secao>

      {/* ---- Números ---- */}
      <Secao titulo="Números em destaque">
        <Repetivel
          itens={e.numeros}
          onChange={(v) => set("numeros", v)}
          novo={{ valor: "", label: "" }}
          rotuloAdd="Adicionar número"
          render={(item, _i, up) => (
            <div className="grid flex-1 gap-3 sm:grid-cols-2">
              <Texto label="Valor (ex.: 262)" value={item.valor} onChange={(v) => up({ ...item, valor: v })} />
              <Texto label="Rótulo (ex.: vagas)" value={item.label} onChange={(v) => up({ ...item, label: v })} />
            </div>
          )}
        />
      </Secao>

      {/* ---- Diferenciais ---- */}
      <Secao titulo="Estrutura & diferenciais">
        <Repetivel
          itens={e.diferenciais}
          onChange={(v) => set("diferenciais", v)}
          novo={{ icon: ICONES[0], titulo: "", desc: "" }}
          rotuloAdd="Adicionar diferencial"
          render={(item, _i, up) => (
            <div className="grid flex-1 gap-3">
              <div className="grid gap-3 sm:grid-cols-[180px_1fr]">
                <Selecao
                  label="Ícone"
                  value={item.icon}
                  onChange={(v) => up({ ...item, icon: v })}
                  opcoes={ICONES.map((k) => ({ v: k, l: k }))}
                />
                <Texto label="Título" value={item.titulo} onChange={(v) => up({ ...item, titulo: v })} />
              </div>
              <Area label="Descrição" value={item.desc} onChange={(v) => up({ ...item, desc: v })} rows={2} />
            </div>
          )}
        />
      </Secao>

      {/* ---- Galeria ---- */}
      <Secao titulo="Galeria (por categorias)">
        <Repetivel
          itens={e.galeria}
          onChange={(v) => set("galeria", v)}
          novo={{ id: "", titulo: "", imagens: [] }}
          rotuloAdd="Adicionar categoria"
          render={(cat, _i, up) => (
            <div className="flex-1">
              <div className="grid gap-3 sm:grid-cols-2">
                <Texto
                  label="Título da categoria"
                  value={cat.titulo}
                  onChange={(v) => up({ ...cat, titulo: v, id: cat.id || slugify(v) })}
                />
                <Texto label="ID (gerado do título)" value={cat.id} onChange={(v) => up({ ...cat, id: slugify(v) })} />
              </div>
              <div className="mt-3">
                <span className="label">Imagens</span>
                <Repetivel
                  itens={cat.imagens}
                  onChange={(imgs) => up({ ...cat, imagens: imgs })}
                  novo={{ src: "", alt: "" }}
                  rotuloAdd="Adicionar imagem"
                  render={(img, _j, upImg) => (
                    <div className="grid flex-1 gap-3 sm:grid-cols-[200px_1fr]">
                      <CampoUpload
                        valor={img.src}
                        onChange={(v) => upImg({ ...img, src: v })}
                        pasta={`galeria/${cat.id || "cat"}`}
                        slug={slug}
                      />
                      <div className="space-y-2">
                        <Area
                          label="Texto alternativo (alt)"
                          value={img.alt}
                          onChange={(v) => upImg({ ...img, alt: v })}
                          rows={2}
                        />
                        <label className="flex items-center gap-2 text-sm text-ink-soft">
                          <input
                            type="checkbox"
                            checked={!!img.banner}
                            onChange={(ev) => upImg({ ...img, banner: ev.target.checked })}
                            className="h-4 w-4 rounded border-ink/30"
                          />
                          Mostrar no banner do topo
                        </label>
                      </div>
                    </div>
                  )}
                />
              </div>
            </div>
          )}
        />
      </Secao>

      {/* ---- Ordem do banner do topo ---- */}
      <Secao titulo="Ordem do banner do topo">
        {bannerSelecionadas.length === 0 ? (
          <p className="text-sm text-ink-muted">
            Marque imagens com “Mostrar no banner do topo” na galeria acima para
            ordená-las aqui. O carrossel do topo segue esta ordem (de cima para
            baixo).
          </p>
        ) : (
          <ol className="space-y-2">
            {bannerSelecionadas.map((img, i) => (
              <li
                key={img.src}
                className="flex items-center gap-3 rounded-xl border border-ink/10 bg-sand-50 p-2"
              >
                <span className="w-5 text-center text-sm font-semibold text-ink-muted">
                  {i + 1}
                </span>
                <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-sand-100">
                  {img.src && (
                    <Image src={img.src} alt="" fill sizes="80px" className="object-cover" />
                  )}
                </div>
                <span className="flex-1 truncate text-sm text-ink-soft">
                  {img.alt || img.src.split("/").pop()}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moverBanner(i, -1)}
                    disabled={i === 0}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-ink/15 text-ink-muted hover:text-brand disabled:opacity-30"
                    title="Mover para cima"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moverBanner(i, 1)}
                    disabled={i === bannerSelecionadas.length - 1}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-ink/15 text-ink-muted hover:text-brand disabled:opacity-30"
                    title="Mover para baixo"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ol>
        )}
      </Secao>

      {/* ---- Tipologias ---- */}
      <Secao titulo="Tipologias (plantas das unidades)">
        <Repetivel
          itens={e.tipologias}
          onChange={(v) => set("tipologias", v)}
          novo={{ nome: "", area: "", resumo: "", destaques: [], planta: "", plantaUnificada: "" }}
          rotuloAdd="Adicionar tipologia"
          render={(t, _i, up) => (
            <div className="flex-1">
              <div className="grid gap-3 sm:grid-cols-2">
                <Texto label="Nome (ex.: Salas Tipo A)" value={t.nome} onChange={(v) => up({ ...t, nome: v })} />
                <Texto label="Área (ex.: aprox. 30 m²)" value={t.area} onChange={(v) => up({ ...t, area: v })} />
              </div>
              <div className="mt-3">
                <Area label="Resumo" value={t.resumo} onChange={(v) => up({ ...t, resumo: v })} rows={2} />
              </div>
              <div className="mt-3">
                <span className="label">Destaques</span>
                <ListaTexto
                  itens={t.destaques}
                  onChange={(d) => up({ ...t, destaques: d })}
                  placeholder="Ex.: Vista panorâmica"
                />
              </div>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                <CampoUpload
                  label="Planta (individual)"
                  valor={t.planta}
                  onChange={(v) => up({ ...t, planta: v })}
                  pasta="tipologias"
                  slug={slug}
                />
                <CampoUpload
                  label="Planta unificada (opcional)"
                  valor={t.plantaUnificada ?? ""}
                  onChange={(v) => up({ ...t, plantaUnificada: v })}
                  pasta="tipologias"
                  slug={slug}
                />
              </div>
            </div>
          )}
        />
      </Secao>

      {/* ---- Plantas de áreas comuns ---- */}
      <Secao titulo="Plantas de áreas comuns">
        <Repetivel
          itens={e.plantasComuns}
          onChange={(v) => set("plantasComuns", v)}
          novo={{ titulo: "", descricao: "", src: "" }}
          rotuloAdd="Adicionar planta"
          render={(p, _i, up) => (
            <div className="grid flex-1 gap-3 sm:grid-cols-[200px_1fr]">
              <CampoUpload
                valor={p.src}
                onChange={(v) => up({ ...p, src: v })}
                pasta="plantas"
                slug={slug}
              />
              <div className="grid gap-3">
                <Texto label="Título" value={p.titulo} onChange={(v) => up({ ...p, titulo: v })} />
                <Area label="Descrição" value={p.descricao} onChange={(v) => up({ ...p, descricao: v })} rows={2} />
              </div>
            </div>
          )}
        />
      </Secao>

      {/* ---- Vídeos ---- */}
      <Secao titulo="Vídeos">
        <p className="mb-3 text-xs text-ink-muted">
          Envie arquivos de vídeo (MP4). Mantenha vídeos curtos/leves — o
          armazenamento gratuito é limitado.
        </p>
        <Repetivel
          itens={e.videos}
          onChange={(v) => set("videos", v)}
          novo={{ titulo: "", src: "", poster: "", formato: "vertical" as const }}
          rotuloAdd="Adicionar vídeo"
          render={(v, _i, up) => (
            <div className="flex-1">
              <div className="grid gap-3 sm:grid-cols-2">
                <Texto label="Título" value={v.titulo} onChange={(val) => up({ ...v, titulo: val })} />
                <Selecao
                  label="Formato"
                  value={v.formato}
                  onChange={(val) => up({ ...v, formato: val as "horizontal" | "vertical" })}
                  opcoes={[
                    { v: "vertical", l: "Vertical (9:16)" },
                    { v: "horizontal", l: "Horizontal (16:9)" },
                  ]}
                />
              </div>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                <CampoUpload
                  label="Arquivo de vídeo"
                  valor={v.src}
                  onChange={(val) => up({ ...v, src: val })}
                  pasta="videos"
                  slug={slug}
                  tipo="video"
                />
                <CampoUpload
                  label="Imagem de capa do vídeo (poster)"
                  valor={v.poster}
                  onChange={(val) => up({ ...v, poster: val })}
                  pasta="videos"
                  slug={slug}
                />
              </div>
            </div>
          )}
        />
      </Secao>

      {/* ---- Ficha técnica ---- */}
      <Secao titulo="Ficha técnica">
        <Repetivel
          itens={e.ficha}
          onChange={(v) => set("ficha", v)}
          novo={{ label: "", valor: "" }}
          rotuloAdd="Adicionar item"
          render={(f, _i, up) => (
            <div className="grid flex-1 gap-3 sm:grid-cols-2">
              <Texto label="Rótulo" value={f.label} onChange={(val) => up({ ...f, label: val })} />
              <Texto label="Valor" value={f.valor} onChange={(val) => up({ ...f, valor: val })} />
            </div>
          )}
        />
      </Secao>

        <div className="mt-8 flex justify-end">{acoes}</div>
      </form>
    </div>
  );
}

/* ===================== primitivos de UI ===================== */

function Secao({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="mt-6 rounded-2xl border border-ink/10 bg-surface p-5 shadow-card sm:p-6">
      <h2 className="font-serif text-lg font-semibold text-ink">{titulo}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

/** Lê "X% Y%" em [x, y] numéricos (padrão 50, 50). */
function parsePos(pos: string): [number, number] {
  const m = pos.match(/(-?\d+(?:\.\d+)?)%\s+(-?\d+(?:\.\d+)?)%/);
  return m ? [Number(m[1]), Number(m[2])] : [50, 50];
}

/** Controle de posição e zoom de uma imagem, com pré-visualização ao vivo. */
function AjusteImagem({
  src,
  pos,
  zoom,
  onPos,
  onZoom,
  aspectClass = "aspect-[4/3]",
  nota,
}: {
  src: string;
  pos: string;
  zoom: number;
  onPos: (v: string) => void;
  onZoom: (v: number) => void;
  aspectClass?: string;
  nota?: string;
}) {
  const [x, y] = parsePos(pos);

  return (
    <div className="mt-3 rounded-xl border border-ink/10 bg-sand-50 p-3">
      <span className="label">Enquadramento</span>

      <div className="mt-2 grid gap-3 sm:grid-cols-[200px_1fr] sm:items-start">
        <div className={`relative overflow-hidden rounded-lg border border-ink/10 bg-sand-100 ${aspectClass}`}>
          {src ? (
            <Image
              src={src}
              alt=""
              fill
              sizes="220px"
              style={{
                objectPosition: pos || "center",
                transform: `scale(${zoom})`,
                transformOrigin: pos || "center",
              }}
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center px-2 text-center text-xs text-ink-muted">
              Envie a imagem para pré-visualizar
            </div>
          )}
        </div>

        <div className="space-y-3">
          <label className="block text-sm text-ink-soft">
            Posição horizontal (esquerda e direita)
            <input
              type="range"
              min={0}
              max={100}
              value={x}
              onChange={(ev) => onPos(`${Number(ev.target.value)}% ${y}%`)}
              className="mt-1 w-full accent-brand"
            />
          </label>
          <label className="block text-sm text-ink-soft">
            Posição vertical (topo e base)
            <input
              type="range"
              min={0}
              max={100}
              value={y}
              onChange={(ev) => onPos(`${x}% ${Number(ev.target.value)}%`)}
              className="mt-1 w-full accent-brand"
            />
          </label>
          <label className="block text-sm text-ink-soft">
            Zoom ({Math.round(zoom * 100)}%)
            <input
              type="range"
              min={100}
              max={250}
              step={5}
              value={Math.round(zoom * 100)}
              onChange={(ev) => onZoom(Number(ev.target.value) / 100)}
              className="mt-1 w-full accent-brand"
            />
          </label>
          <button
            type="button"
            onClick={() => {
              onPos("50% 50%");
              onZoom(1);
            }}
            className="text-xs font-medium text-brand hover:underline"
          >
            Redefinir
          </button>
        </div>
      </div>

      {nota && <p className="mt-2 text-xs text-ink-muted">{nota}</p>}
    </div>
  );
}

function Texto({
  label,
  value,
  onChange,
  required,
  disabled,
  dica,
  className,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  disabled?: boolean;
  dica?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="label">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        disabled={disabled}
        className="field mt-1.5 disabled:opacity-60"
      />
      {dica && <p className="mt-1 text-xs text-ink-muted">{dica}</p>}
    </div>
  );
}

/** Formata um número em reais com separador de milhar e centavos: 332000 -> "332.000,00". */
function formatarReais(v?: number): string {
  if (v === undefined || Number.isNaN(v)) return "";
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(v);
}

/** Lê um texto digitado (ex.: "332.000,00", "332000", "350.000,5") em número de reais. */
function parseReais(texto: string): number | undefined {
  const limpo = texto.replace(/[^\d,]/g, "").replace(",", ".");
  if (limpo === "") return undefined;
  const n = Number(limpo);
  return Number.isNaN(n) ? undefined : n;
}

/** Campo de moeda BRL: mostra "332.000,00" e salva o número em reais. */
function Moeda({
  label,
  value,
  onChange,
}: {
  label: string;
  value?: number;
  onChange: (v: number | undefined) => void;
}) {
  const [texto, setTexto] = useState(formatarReais(value));
  const [focado, setFocado] = useState(false);

  // Reflete mudanças externas no valor quando o campo não está em edição.
  useEffect(() => {
    if (!focado) setTexto(formatarReais(value));
  }, [value, focado]);

  return (
    <div>
      <label className="label">{label}</label>
      <div className="relative mt-1.5">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-ink-muted">
          R$
        </span>
        <input
          type="text"
          inputMode="decimal"
          value={texto}
          onFocus={() => {
            setFocado(true);
            setTexto(value === undefined ? "" : String(value).replace(".", ","));
          }}
          onChange={(ev) => setTexto(ev.target.value)}
          onBlur={() => {
            setFocado(false);
            const n = parseReais(texto);
            onChange(n);
            setTexto(formatarReais(n));
          }}
          className="field pl-9"
        />
      </div>
    </div>
  );
}

function Area({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <div>
      <label className="label">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="field mt-1.5"
      />
    </div>
  );
}

function Selecao({
  label,
  value,
  onChange,
  opcoes,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  opcoes: { v: string; l: string }[];
}) {
  return (
    <div>
      <label className="label">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="field mt-1.5"
      >
        {opcoes.map((o) => (
          <option key={o.v} value={o.v}>
            {o.l}
          </option>
        ))}
      </select>
    </div>
  );
}

/** Lista de textos simples (parágrafos / itens). */
function ListaTexto({
  itens,
  onChange,
  placeholder,
  multiline,
}: {
  itens: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
  multiline?: boolean;
}) {
  return (
    <div className="mt-1.5 space-y-2">
      {itens.map((item, i) => (
        <div key={i} className="flex items-start gap-2">
          {multiline ? (
            <textarea
              value={item}
              rows={2}
              placeholder={placeholder}
              onChange={(e) =>
                onChange(itens.map((it, j) => (j === i ? e.target.value : it)))
              }
              className="field flex-1"
            />
          ) : (
            <input
              type="text"
              value={item}
              placeholder={placeholder}
              onChange={(e) =>
                onChange(itens.map((it, j) => (j === i ? e.target.value : it)))
              }
              className="field flex-1"
            />
          )}
          <button
            type="button"
            onClick={() => onChange(itens.filter((_, j) => j !== i))}
            className="mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...itens, ""])}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:underline"
      >
        <Plus className="h-4 w-4" />
        Adicionar
      </button>
    </div>
  );
}

/** Grupo repetível genérico (adicionar / remover). */
function Repetivel<T>({
  itens,
  onChange,
  novo,
  rotuloAdd,
  render,
}: {
  itens: T[];
  onChange: (v: T[]) => void;
  novo: T;
  rotuloAdd: string;
  render: (item: T, i: number, update: (novo: T) => void) => React.ReactNode;
}) {
  function update(i: number, val: T) {
    onChange(itens.map((it, j) => (j === i ? val : it)));
  }
  function remover(i: number) {
    onChange(itens.filter((_, j) => j !== i));
  }
  function mover(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= itens.length) return;
    const copia = [...itens];
    [copia[i], copia[j]] = [copia[j], copia[i]];
    onChange(copia);
  }

  return (
    <div className="space-y-3">
      {itens.map((item, i) => (
        <div
          key={i}
          className="flex items-start gap-3 rounded-xl border border-ink/10 bg-sand-50 p-3"
        >
          <div className="flex flex-col items-center gap-1 pt-1">
            <button
              type="button"
              onClick={() => mover(i, -1)}
              className="text-ink-muted hover:text-brand disabled:opacity-30"
              disabled={i === 0}
              title="Mover para cima"
            >
              <GripVertical className="h-4 w-4" />
            </button>
          </div>
          {render(item, i, (val) => update(i, val))}
          <button
            type="button"
            onClick={() => remover(i)}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
            title="Remover"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...itens, structuredClone(novo)])}
        className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-ink/30 px-3 py-2 text-sm font-medium text-brand hover:bg-accent-50"
      >
        <Plus className="h-4 w-4" />
        {rotuloAdd}
      </button>
    </div>
  );
}
