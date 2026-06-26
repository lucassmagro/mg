-- ============================================================================
-- MG Incorporações — schema do banco (Supabase / Postgres)
-- ============================================================================
-- Como usar:
--   1. No painel do Supabase, abra "SQL Editor".
--   2. Cole TODO este arquivo e clique em "Run".
--   3. Em seguida, crie o usuário admin em Authentication > Users > "Add user"
--      (e-mail + senha), ou rode o script scripts/seed-supabase.mjs.
-- Rodar este arquivo mais de uma vez é seguro (usa IF NOT EXISTS / drop policy).
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Tabela principal
-- ----------------------------------------------------------------------------
create table if not exists public.empreendimentos (
  -- slug usado na URL: /empreendimentos/{id}
  id            text primary key,
  nome          text not null,
  subtitulo     text not null default '',
  tagline       text not null default '',
  status        text not null default 'lancamento',  -- lancamento|em-obras|pronto|breve
  categoria     text not null default '',
  tipo_imovel   text not null default 'comercial',   -- residencial|comercial|industrial
  cidade        text not null default '',
  bairro        text not null default '',
  endereco      text not null default '',
  mapa_query    text not null default '',
  resumo        text not null default '',
  capa          text not null default '',            -- URL da imagem de capa (hero)
  cartao        text not null default '',            -- URL da imagem do card
  preco_venda   numeric,                             -- "a partir de" (opcional)
  preco_aluguel numeric,                             -- "a partir de" (opcional)
  destaque      boolean not null default false,
  ordem         integer not null default 0,          -- ordenação na listagem

  -- Estruturas aninhadas (espelham as interfaces de data/empreendimentos.ts)
  operacoes      jsonb not null default '[]'::jsonb,  -- string[]  (comprar|alugar|temporada)
  descricao      jsonb not null default '[]'::jsonb,  -- string[]  (parágrafos)
  numeros        jsonb not null default '[]'::jsonb,  -- { valor, label }[]
  diferenciais   jsonb not null default '[]'::jsonb,  -- { icon, titulo, desc }[]
  galeria        jsonb not null default '[]'::jsonb,  -- { id, titulo, imagens: { src, alt }[] }[]
  tipologias     jsonb not null default '[]'::jsonb,  -- { nome, area, resumo, destaques[], planta, plantaUnificada? }[]
  plantas_comuns jsonb not null default '[]'::jsonb,  -- { titulo, descricao, src }[]
  videos         jsonb not null default '[]'::jsonb,  -- { titulo, src, poster, formato }[]
  ficha          jsonb not null default '[]'::jsonb,  -- { label, valor }[]
  localizacao    jsonb not null default '{}'::jsonb,  -- { descricao, pontos[] }

  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists empreendimentos_ordem_idx on public.empreendimentos (ordem);
create index if not exists empreendimentos_destaque_idx on public.empreendimentos (destaque);

-- Mantém updated_at atualizado a cada UPDATE
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists empreendimentos_set_updated_at on public.empreendimentos;
create trigger empreendimentos_set_updated_at
  before update on public.empreendimentos
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- RLS: leitura pública; escrita apenas autenticado
-- ----------------------------------------------------------------------------
alter table public.empreendimentos enable row level security;

drop policy if exists "Leitura pública dos empreendimentos" on public.empreendimentos;
create policy "Leitura pública dos empreendimentos"
  on public.empreendimentos for select
  using (true);

drop policy if exists "Escrita apenas autenticado" on public.empreendimentos;
create policy "Escrita apenas autenticado"
  on public.empreendimentos for all
  to authenticated
  using (true)
  with check (true);

-- ----------------------------------------------------------------------------
-- Storage: bucket público "empreendimentos"
-- ----------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('empreendimentos', 'empreendimentos', true)
on conflict (id) do nothing;

-- Leitura pública dos arquivos
drop policy if exists "Leitura pública dos arquivos" on storage.objects;
create policy "Leitura pública dos arquivos"
  on storage.objects for select
  using (bucket_id = 'empreendimentos');

-- Upload / atualização / remoção apenas para usuários autenticados
drop policy if exists "Upload autenticado" on storage.objects;
create policy "Upload autenticado"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'empreendimentos');

drop policy if exists "Atualização autenticada" on storage.objects;
create policy "Atualização autenticada"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'empreendimentos')
  with check (bucket_id = 'empreendimentos');

drop policy if exists "Remoção autenticada" on storage.objects;
create policy "Remoção autenticada"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'empreendimentos');
