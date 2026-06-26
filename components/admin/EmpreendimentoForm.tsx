"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Loader2, GripVertical } from "lucide-react";
import type {
  Empreendimento,
  StatusEmpreendimento,
  TipoImovel,
  Operacao,
} from "@/data/empreendimentos";
import { DIFERENCIAL_ICONS } from "@/lib/diferencialIcons";
import { salvarEmpreendimento } from "@/app/admin/actions";
import CampoUpload from "@/components/admin/CampoUpload";

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
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

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

  function toggleOperacao(op: Operacao) {
    set(
      "operacoes",
      e.operacoes.includes(op)
        ? e.operacoes.filter((o) => o !== op)
        : [...e.operacoes, op],
    );
  }

  async function enviar(ev: React.FormEvent) {
    ev.preventDefault();
    setErro(null);
    setSalvando(true);
    const r = await salvarEmpreendimento(e);
    if (!r.ok) {
      setErro(r.erro ?? "Erro ao salvar.");
      setSalvando(false);
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  const slug = e.id || "rascunho";

  return (
    <form onSubmit={enviar} className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-serif text-2xl font-semibold text-ink">
          {isEdit ? "Editar empreendimento" : "Novo empreendimento"}
        </h1>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => router.push("/admin")}
            className="btn-outline"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={salvando}
            className="btn-primary disabled:opacity-60"
          >
            {salvando && <Loader2 className="h-4 w-4 animate-spin" />}
            Salvar
          </button>
        </div>
      </div>

      {erro && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {erro}
        </p>
      )}

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
          <Numero
            label="Preço de venda — a partir de (R$)"
            value={e.precoVenda}
            onChange={(v) => set("precoVenda", v)}
          />
          <Numero
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
          Exibir como empreendimento em destaque na home
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
          <CampoUpload
            label="Capa (banner / hero)"
            valor={e.capa}
            onChange={(v) => set("capa", v)}
            pasta="capa"
            slug={slug}
          />
          <CampoUpload
            label="Imagem do card"
            valor={e.cartao}
            onChange={(v) => set("cartao", v)}
            pasta="cartao"
            slug={slug}
          />
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
                      <Area
                        label="Texto alternativo (alt)"
                        value={img.alt}
                        onChange={(v) => upImg({ ...img, alt: v })}
                        rows={2}
                      />
                    </div>
                  )}
                />
              </div>
            </div>
          )}
        />
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

      <div className="mt-8 flex justify-end gap-2">
        <button
          type="button"
          onClick={() => router.push("/admin")}
          className="btn-outline"
        >
          Cancelar
        </button>
        <button type="submit" disabled={salvando} className="btn-primary disabled:opacity-60">
          {salvando && <Loader2 className="h-4 w-4 animate-spin" />}
          Salvar
        </button>
      </div>
    </form>
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

function Numero({
  label,
  value,
  onChange,
}: {
  label: string;
  value?: number;
  onChange: (v: number | undefined) => void;
}) {
  return (
    <div>
      <label className="label">{label}</label>
      <input
        type="number"
        min={0}
        value={value ?? ""}
        onChange={(e) =>
          onChange(e.target.value === "" ? undefined : Number(e.target.value))
        }
        className="field mt-1.5"
      />
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
