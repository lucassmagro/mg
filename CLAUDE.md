# CLAUDE.md — Contexto do projeto

> Arquivo de contexto para o Claude Code. Carregado automaticamente a cada
> sessão. Mantenha curto e atualizado. Para o plano de evolução (CMS), ver
> [`docs/plano-cms-empreendimentos.md`](docs/plano-cms-empreendimentos.md).

## O que é

Site institucional de alta fidelidade da **MG Incorporações** (incorporadora),
com destaque para o empreendimento real **Valley Business** (torre corporativa
de salas comerciais). Tem **backend Supabase** (banco + storage + auth) e um
**painel admin** (`/admin`) onde o cliente cadastra empreendimentos sozinho. As
páginas públicas leem do Supabase (render dinâmico). Tudo em **pt-BR**.

## Stack

- **Next.js 14 (App Router) + React 18 + TypeScript**
- **Tailwind CSS** (config em [`tailwind.config.ts`](tailwind.config.ts))
- **Supabase** — Postgres (dados), Storage (imagens/vídeos), Auth (login do
  admin). Clientes em [`lib/supabase/`](lib/supabase); leitura em
  [`lib/empreendimentos.ts`](lib/empreendimentos.ts).
- Ícones **lucide-react**
- Fontes: **Fraunces** (serifada, títulos) + **Inter** (sans, texto), em [`app/layout.tsx`](app/layout.tsx)
- `sharp` (devDep) — só para o pipeline de imagens; não é usado em runtime de app

## Comandos

```bash
npm run dev      # desenvolvimento (localhost:3000)
npm run build    # build de produção
npm start        # serve a build
npm run seed     # migra/insere o Valley Business no Supabase (usa .env.local)

# pipeline de assets (rodar só quando trocar imagens/logos de origem)
node scripts/optimize-assets.mjs   # otimiza renders/plantas/capa -> public/
node scripts/logos2.mjs            # gera SVGs do logo recortados + favicons
```

> **Configuração Supabase:** copie `.env.example` para `.env.local` e preencha
> as chaves (Project Settings > API). Rode `supabase/schema.sql` no SQL Editor
> do Supabase (cria tabela, RLS e bucket). Crie o usuário admin em
> Authentication > Users. Acesse o painel em `/admin`.

> Ao remover/renomear rotas, apague `.next/` antes de `build` (os tipos gerados
> ficam em cache e quebram o `tsc`).

## Estrutura

```
app/
  layout.tsx                 # shell: Header, Footer, FloatingWhatsApp, fontes, metadata
  page.tsx                   # Home (hero Valley Business + incorporadora + destaque)
  empreendimentos/page.tsx   # listagem/portfólio
  empreendimentos/[id]/page.tsx  # página do empreendimento (peça central)
  sobre/page.tsx             # "A incorporadora"
  contato/page.tsx           # contato (form visual + mapa)
  not-found.tsx              # 404
  globals.css                # camadas Tailwind + classes utilitárias do projeto
  icon.png / apple-icon.png  # favicons (gerados do logo)
components/
  Header.tsx                 # sticky, menu mobile, CTA WhatsApp
  Footer.tsx                 # institucional, navegação, contato, redes
  Logo.tsx                   # usa SVG da marca (variant dark/light)
  EmpreendimentoCard.tsx     # card reutilizado (home/listagem)
  GaleriaCategorizada.tsx    # galeria com abas de categoria + lightbox (client)
  Tipologias.tsx             # plantas das salas, alterna individual/unificada (client)
  VisitForm.tsx              # form de interesse (visual; client)
  ContactForm.tsx            # form de contato (visual; client)
  FloatingWhatsApp.tsx       # botão flutuante
  SiteChrome.tsx             # mostra Header/Footer no site; oculta em /admin (client)
  admin/                     # painel: AdminTopbar, ListaAdmin, EmpreendimentoForm, CampoUpload
app/admin/                   # painel protegido (login, lista, form novo/[id], actions.ts)
middleware.ts                # protege /admin (sessão Supabase); refresh de sessão
data/
  empreendimentos.ts         # TIPOS + constantes (STATUS_LABEL...) + seed (Valley) + getTodasImagens
lib/
  empreendimentos.ts         # LEITURA do Supabase (async): get/list/destaques/categorias + mapeamento
  supabase/client.ts         # cliente browser (anon) — @supabase/ssr
  supabase/server.ts         # cliente server (cookies) — @supabase/ssr
  config.ts                  # `marca` (branding/contato) + navLinks + whatsappLink()
  format.ts                  # formatBRL / formatArea
  diferencialIcons.tsx       # mapa chave->ícone lucide para diferenciais (lista fixa de chaves)
supabase/schema.sql          # tabela empreendimentos + RLS + bucket/policies de Storage
scripts/                     # pipeline de imagens/logos (sharp) + seed-supabase.ts
assets/                      # ARQUIVOS-FONTE (renders, plantas, vídeos, logos) — NÃO servidos
public/projetos/valley-business/  # mídia otimizada servida (imgs, plantas, capa, videos)
public/logo/                 # SVGs do logo + favicons
```

## Dados (modelo)

Os **tipos** (`Empreendimento` e afins) e as constantes (`STATUS_LABEL`,
`OPERACAO_LABEL`, `TIPO_IMOVEL_LABEL`) ficam em
[`data/empreendimentos.ts`](data/empreendimentos.ts), junto com o array do Valley
(usado como **seed**, via `npm run seed`) e `getTodasImagens(e)` (função pura).

A **fonte de dados em runtime é o Supabase**: as páginas chamam as funções async
de [`lib/empreendimentos.ts`](lib/empreendimentos.ts) (`getEmpreendimento`,
`listarEmpreendimentos`, `getDestaques`, `getCategorias`), que leem a tabela
`empreendimentos` e mapeiam a linha (colunas + JSONB) para o tipo `Empreendimento`.

Modelo da tabela: campos escalares/filtráveis são colunas (`id`/slug, `nome`,
`status`, `tipo_imovel`, `preco_venda`...); as estruturas aninhadas
(`descricao`, `numeros`, `diferenciais`, `galeria`, `tipologias`,
`plantas_comuns`, `videos`, `ficha`, `localizacao`, `operacoes`) são **JSONB**.
Imagens/vídeos guardam a **URL pública** do Storage (o Valley mantém caminhos
`/public/...`). Os componentes recebem `src` como string — não mudam.

## Painel admin (`/admin`)

- Login e-mail/senha (Supabase Auth); `middleware.ts` protege as rotas.
- [`EmpreendimentoForm`](components/admin/EmpreendimentoForm.tsx) edita **todos**
  os campos; uploads vão para o Storage via [`CampoUpload`](components/admin/CampoUpload.tsx).
- Salvar/excluir/destaque em [`app/admin/actions.ts`](app/admin/actions.ts)
  (server actions; RLS exige sessão autenticada).
- **Vídeos:** upload de MP4 no Storage (decisão do cliente). ⚠️ Plano grátis
  ~1 GB — orientar vídeos curtos/leves; rever se crescer.

## Branding / design system

- **Marca:** edite o objeto `marca` em [`lib/config.ts`](lib/config.ts) (nome,
  CNPJ, telefone, WhatsApp, endereço, redes). Tudo no site deriva daí.
- **Cor de destaque:** `accent` em [`tailwind.config.ts`](tailwind.config.ts) —
  azul da marca **#0f4e9f** (escala 50→950). Neutros: `sand` (off-whites) e
  `ink` (`DEFAULT/soft/muted`).
- **Logo:** SVGs em `public/logo/` — `mg-horizontal.svg` (fundo claro),
  `mg-horizontal-light.svg` (fundo escuro). Gerados de `assets/logo/*.svg`.
- **Classes utilitárias** (definidas em [`app/globals.css`](app/globals.css)):
  `container-x` (largura máx + padding), `btn` / `btn-primary` / `btn-outline` /
  `btn-whatsapp`, `eyebrow` (rótulo pequeno em caixa alta), `field` / `label`
  (formulários), `no-scrollbar`. Sombras: `shadow-card` / `shadow-card-hover`.
- **Tipografia:** `font-serif` (Fraunces) em títulos, `font-sans` (Inter) no corpo.
- **Tema único (claro):** tokens via CSS vars em [`app/globals.css`](app/globals.css)
  (`:root`). `sand` (fundos), `ink` (texto), `surface` (cartões) e `brand` (azul
  de texto/ícones). `night` é fixo (overlays sobre fotos). O site é
  predominantemente claro (sem modo noturno). Botões brancos sobre faixas azuis
  usam `bg-[#ffffff]`/`text-[#0d4185]` fixos.

## Convenções

- **100% pt-BR** em tudo que o usuário vê (labels, placeholders, alt, estados).
- **Sem elementos de "IA"**, sem chatbot/assistente — site profissional comum.
- **Imagens:** sempre `next/image` com `alt` descritivo, `sizes` e `priority` só
  no que está acima da dobra. Mídia local servida de `public/`.
- **Acessibilidade:** HTML semântico, foco visível, `aria-*` em controles.
- **Formulários são apenas visuais** (mostram confirmação simulada; não enviam).
- **Mapa:** `iframe` público do Google Maps (sem chave de API).
- Reaproveite os componentes existentes; siga o estilo/idioma do código ao redor.

## Mídia / assets

- Renders originais (~10–17 MB) em `assets/` → otimizados (~200–650 KB) para
  `public/` via `scripts/optimize-assets.mjs` (sharp). Plantas e capa idem.
- **Vídeos:** o **Valley** mantém MP4 em `public/.../videos`. **Novos**
  empreendimentos cadastrados no painel sobem o MP4 para o **Supabase Storage**
  (decisão do cliente, substitui a ideia anterior de YouTube). ⚠️ Plano grátis
  do Storage ~1 GB — orientar vídeos curtos; rever se crescer.

## Estado do CMS (implementado)

O cliente já cadastra empreendimentos sozinho em `/admin` (Supabase: banco +
storage + auth). `data/empreendimentos.ts` virou **seed/fallback**; as páginas
leem do Supabase via `lib/empreendimentos.ts`. Histórico de decisões e o plano
original em [`docs/plano-cms-empreendimentos.md`](docs/plano-cms-empreendimentos.md).
