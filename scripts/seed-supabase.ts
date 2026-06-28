/**
 * SEED — migra o conteúdo atual (Valley Business) para o Supabase.
 * As imagens/vídeos do Valley continuam em /public; o seed só grava a linha
 * com os caminhos existentes. Serve de exemplo e pode ser "duplicado" no painel.
 *
 * Rodar:  npx tsx scripts/seed-supabase.ts
 * Requer .env.local com NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY.
 */
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";
import { empreendimentos } from "../data/empreendimentos";

// --- carrega .env.local (sem dependências externas) ---
function carregarEnv() {
  try {
    const txt = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
    for (const linha of txt.split("\n")) {
      const m = linha.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) {
        process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
      }
    }
  } catch {
    // sem .env.local — assume variáveis já no ambiente
  }
}
carregarEnv();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    "Faltam NEXT_PUBLIC_SUPABASE_URL e/ou SUPABASE_SERVICE_ROLE_KEY no .env.local.",
  );
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false },
});

function paraLinha(e: (typeof empreendimentos)[number], ordem: number) {
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
    preco_venda_ate: e.precoVendaAte ?? null,
    preco_aluguel_ate: e.precoAluguelAte ?? null,
    destaque: e.destaque,
    publicado: e.publicado,
    ordem,
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

async function main() {
  const linhas = empreendimentos.map((e, i) => paraLinha(e, i));
  const { error } = await supabase
    .from("empreendimentos")
    .upsert(linhas, { onConflict: "id" });

  if (error) {
    console.error("Erro no seed:", error.message);
    process.exit(1);
  }
  console.log(`Seed concluído: ${linhas.length} empreendimento(s) gravado(s).`);
}

main();
