/**
 * CAMADA DE DADOS — lê os empreendimentos do Supabase.
 * Substitui as funções síncronas de data/empreendimentos.ts (que agora servem
 * só de tipos + seed). As páginas públicas usam estas funções assíncronas.
 *
 * O mapeamento converte a linha do banco (snake_case + colunas/JSONB) para o
 * tipo `Empreendimento` que os componentes já esperam (camelCase).
 */
import { criarClienteServer } from "@/lib/supabase/server";
import type {
  Empreendimento,
  StatusEmpreendimento,
  TipoImovel,
  Operacao,
} from "@/data/empreendimentos";

/** Linha como vem do Postgres (colunas + JSONB). */
export interface EmpreendimentoRow {
  id: string;
  nome: string;
  subtitulo: string;
  tagline: string;
  status: string;
  categoria: string;
  tipo_imovel: string;
  cidade: string;
  bairro: string;
  endereco: string;
  mapa_query: string;
  resumo: string;
  capa: string;
  cartao: string;
  preco_venda: number | null;
  preco_aluguel: number | null;
  destaque: boolean;
  publicado: boolean;
  ordem: number;
  operacoes: unknown;
  descricao: unknown;
  numeros: unknown;
  diferenciais: unknown;
  galeria: unknown;
  tipologias: unknown;
  plantas_comuns: unknown;
  videos: unknown;
  ficha: unknown;
  localizacao: unknown;
}

/** Converte a linha do banco no objeto usado pelas páginas/componentes. */
export function linhaParaEmpreendimento(row: EmpreendimentoRow): Empreendimento {
  return {
    id: row.id,
    nome: row.nome,
    subtitulo: row.subtitulo,
    tagline: row.tagline,
    status: row.status as StatusEmpreendimento,
    categoria: row.categoria,
    tipoImovel: row.tipo_imovel as TipoImovel,
    operacoes: (row.operacoes as Operacao[]) ?? [],
    precoVenda: row.preco_venda ?? undefined,
    precoAluguel: row.preco_aluguel ?? undefined,
    cidade: row.cidade,
    bairro: row.bairro,
    endereco: row.endereco,
    mapaQuery: row.mapa_query,
    capa: row.capa,
    cartao: row.cartao,
    resumo: row.resumo,
    descricao: (row.descricao as string[]) ?? [],
    numeros: (row.numeros as Empreendimento["numeros"]) ?? [],
    diferenciais: (row.diferenciais as Empreendimento["diferenciais"]) ?? [],
    galeria: (row.galeria as Empreendimento["galeria"]) ?? [],
    tipologias: (row.tipologias as Empreendimento["tipologias"]) ?? [],
    plantasComuns: (row.plantas_comuns as Empreendimento["plantasComuns"]) ?? [],
    videos: (row.videos as Empreendimento["videos"]) ?? [],
    ficha: (row.ficha as Empreendimento["ficha"]) ?? [],
    localizacao:
      (row.localizacao as Empreendimento["localizacao"]) ?? {
        descricao: "",
        pontos: [],
      },
    destaque: row.destaque,
    publicado: row.publicado ?? true,
  };
}

const SELECT = "*";

/** true se o erro for "coluna publicado não existe" (antes da migração). */
function colunaPublicadoFaltando(error: { code?: string; message?: string }) {
  return error?.code === "42703" || /publicado/i.test(error?.message ?? "");
}

/**
 * Lista empreendimentos ordenados. Por padrão retorna só os **publicados**;
 * passe `{ todos: true }` (uso do painel) para incluir rascunhos.
 */
export async function listarEmpreendimentos(opts?: {
  todos?: boolean;
}): Promise<Empreendimento[]> {
  const supabase = criarClienteServer();

  const consulta = (filtrarPublicado: boolean) => {
    let q = supabase
      .from("empreendimentos")
      .select(SELECT)
      .order("ordem", { ascending: true })
      .order("created_at", { ascending: true });
    if (filtrarPublicado) q = q.eq("publicado", true);
    return q;
  };

  let { data, error } = await consulta(!opts?.todos);
  // Antes da migração (coluna ausente): devolve tudo para não quebrar o site.
  if (error && !opts?.todos && colunaPublicadoFaltando(error)) {
    ({ data, error } = await consulta(false));
  }

  if (error) {
    console.error("Erro ao listar empreendimentos:", error.message);
    return [];
  }
  return (data as EmpreendimentoRow[]).map(linhaParaEmpreendimento);
}

/** Um empreendimento pelo slug (id). Retorna null se não existir. */
export async function getEmpreendimento(
  id: string,
): Promise<Empreendimento | null> {
  const supabase = criarClienteServer();
  const { data, error } = await supabase
    .from("empreendimentos")
    .select(SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Erro ao buscar empreendimento:", error.message);
    return null;
  }
  return data ? linhaParaEmpreendimento(data as EmpreendimentoRow) : null;
}

/** Empreendimentos em destaque (apenas publicados). */
export async function getDestaques(): Promise<Empreendimento[]> {
  const supabase = criarClienteServer();

  const consulta = (filtrarPublicado: boolean) => {
    let q = supabase
      .from("empreendimentos")
      .select(SELECT)
      .eq("destaque", true)
      .order("ordem", { ascending: true });
    if (filtrarPublicado) q = q.eq("publicado", true);
    return q;
  };

  let { data, error } = await consulta(true);
  if (error && colunaPublicadoFaltando(error)) {
    ({ data, error } = await consulta(false));
  }

  if (error) {
    console.error("Erro ao buscar destaques:", error.message);
    return [];
  }
  return (data as EmpreendimentoRow[]).map(linhaParaEmpreendimento);
}

/** Categorias distintas (alimenta o filtro "Tipo" da busca). */
export async function getCategorias(): Promise<string[]> {
  const lista = await listarEmpreendimentos();
  return Array.from(new Set(lista.map((e) => e.categoria).filter(Boolean))).sort();
}
