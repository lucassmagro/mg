"use server";

/**
 * Server Actions do painel — salvar, excluir e alternar destaque.
 * Usam o cliente Supabase do servidor (sessão via cookies); o RLS garante que
 * só usuários autenticados conseguem escrever.
 */
import { revalidatePath } from "next/cache";
import { criarClienteServer } from "@/lib/supabase/server";
import type { Empreendimento } from "@/data/empreendimentos";

export interface ResultadoAcao {
  ok: boolean;
  erro?: string;
}

/** Converte o objeto do formulário na linha do banco (snake_case). */
function empreendimentoParaLinha(e: Empreendimento) {
  return {
    id: e.id,
    nome: e.nome,
    subtitulo: e.subtitulo,
    tagline: e.tagline,
    status: e.status,
    categoria: e.categoria,
    tipo_imovel: e.tipoImovel,
    cidade: e.cidade,
    bairro: e.bairro,
    endereco: e.endereco,
    mapa_query: e.mapaQuery,
    resumo: e.resumo,
    capa: e.capa,
    cartao: e.cartao,
    cartao_pos: e.cartaoPos ?? "50% 50%",
    cartao_zoom: String(e.cartaoZoom ?? 1),
    capa_pos: e.capaPos ?? "50% 50%",
    capa_zoom: String(e.capaZoom ?? 1),
    preco_venda: e.precoVenda ?? null,
    preco_aluguel: e.precoAluguel ?? null,
    destaque: e.destaque,
    publicado: e.publicado,
    operacoes: e.operacoes,
    descricao: e.descricao,
    numeros: e.numeros,
    diferenciais: e.diferenciais,
    galeria: e.galeria,
    tipologias: e.tipologias,
    plantas_comuns: e.plantasComuns,
    videos: e.videos,
    ficha: e.ficha,
    localizacao: e.localizacao,
  };
}

function revalidarTudo(id: string) {
  revalidatePath("/");
  revalidatePath("/empreendimentos");
  revalidatePath(`/empreendimentos/${id}`);
  revalidatePath("/admin");
}

export async function salvarEmpreendimento(
  e: Empreendimento,
): Promise<ResultadoAcao> {
  if (!e.id?.trim()) return { ok: false, erro: "O identificador (slug) é obrigatório." };
  if (!e.nome?.trim()) return { ok: false, erro: "O nome é obrigatório." };

  const supabase = criarClienteServer();
  const linha = empreendimentoParaLinha(e);
  let { error } = await supabase
    .from("empreendimentos")
    .upsert(linha, { onConflict: "id" });

  // Antes da migração das colunas de enquadramento: salva sem elas para não
  // quebrar (o ajuste de posição/zoom só persiste após rodar o schema.sql).
  if (error && /cartao_pos|cartao_zoom|capa_pos|capa_zoom/.test(error.message)) {
    const semEnquadramento: Record<string, unknown> = { ...linha };
    for (const k of ["cartao_pos", "cartao_zoom", "capa_pos", "capa_zoom"]) {
      delete semEnquadramento[k];
    }
    ({ error } = await supabase
      .from("empreendimentos")
      .upsert(semEnquadramento, { onConflict: "id" }));
  }

  if (error) return { ok: false, erro: error.message };

  // Só um empreendimento pode ficar em destaque na home: desmarca os demais.
  if (e.destaque) {
    await supabase
      .from("empreendimentos")
      .update({ destaque: false })
      .neq("id", e.id);
  }

  revalidarTudo(e.id);
  return { ok: true };
}

export async function excluirEmpreendimento(id: string): Promise<ResultadoAcao> {
  const supabase = criarClienteServer();

  // Best-effort: remove os arquivos do empreendimento no Storage.
  const { data: arquivos } = await supabase.storage
    .from("empreendimentos")
    .list(id, { limit: 1000 });
  if (arquivos?.length) {
    // Lista recursivamente as subpastas conhecidas e remove tudo sob {id}/.
    const subpastas = ["capa", "cartao", "galeria", "tipologias", "plantas", "videos"];
    const caminhos: string[] = [];
    for (const sub of subpastas) {
      const { data } = await supabase.storage
        .from("empreendimentos")
        .list(`${id}/${sub}`, { limit: 1000 });
      data?.forEach((f) => caminhos.push(`${id}/${sub}/${f.name}`));
    }
    arquivos.forEach((f) => {
      if (f.id) caminhos.push(`${id}/${f.name}`);
    });
    if (caminhos.length) {
      await supabase.storage.from("empreendimentos").remove(caminhos);
    }
  }

  const { error } = await supabase.from("empreendimentos").delete().eq("id", id);
  if (error) return { ok: false, erro: error.message };

  revalidarTudo(id);
  return { ok: true };
}

export async function alternarDestaque(
  id: string,
  destaque: boolean,
): Promise<ResultadoAcao> {
  const supabase = criarClienteServer();

  // Só um pode ficar em destaque: ao ligar um, desliga todos os outros.
  if (destaque) {
    await supabase
      .from("empreendimentos")
      .update({ destaque: false })
      .neq("id", id);
  }

  const { error } = await supabase
    .from("empreendimentos")
    .update({ destaque })
    .eq("id", id);

  if (error) return { ok: false, erro: error.message };

  revalidarTudo(id);
  return { ok: true };
}
