# CLAUDE.md — Contexto do projeto

> Arquivo de contexto para o Claude Code. Carregado automaticamente a cada
> sessão. Mantenha curto e atualizado. Para o plano de evolução (CMS), ver
> [`docs/plano-cms-empreendimentos.md`](docs/plano-cms-empreendimentos.md).

## O que é

Site institucional de alta fidelidade da **MG Incorporações** (incorporadora),
com destaque para o empreendimento real **Valley Business** (torre corporativa
de salas comerciais). É um **protótipo navegável**: sem backend, sem login, sem
banco — o conteúdo vem de um arquivo de dados local. Tudo em **pt-BR**.

## Stack

- **Next.js 14 (App Router) + React 18 + TypeScript**
- **Tailwind CSS** (config em [`tailwind.config.ts`](tailwind.config.ts))
- Ícones **lucide-react**
- Fontes: **Fraunces** (serifada, títulos) + **Inter** (sans, texto), em [`app/layout.tsx`](app/layout.tsx)
- `sharp` (devDep) — só para o pipeline de imagens; não é usado em runtime de app

## Comandos

```bash
npm run dev      # desenvolvimento (localhost:3000)
npm run build    # build de produção
npm start        # serve a build

# pipeline de assets (rodar só quando trocar imagens/logos de origem)
node scripts/optimize-assets.mjs   # otimiza renders/plantas/capa -> public/
node scripts/logos2.mjs            # gera SVGs do logo recortados + favicons
```

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
data/
  empreendimentos.ts         # FONTE DE DADOS + tipos + helpers (getEmpreendimento, getDestaques...)
lib/
  config.ts                  # `marca` (branding/contato) + navLinks + whatsappLink()
  format.ts                  # formatBRL / formatArea
  diferencialIcons.tsx       # mapa chave->ícone lucide para diferenciais
scripts/                     # pipeline de imagens/logos (sharp)
assets/                      # ARQUIVOS-FONTE (renders, plantas, vídeos, logos) — NÃO servidos
public/projetos/valley-business/  # mídia otimizada servida (imgs, plantas, capa, videos)
public/logo/                 # SVGs do logo + favicons
```

## Dados (modelo)

Tudo em [`data/empreendimentos.ts`](data/empreendimentos.ts). Tipo principal
`Empreendimento` com: `id`, `nome`, `subtitulo`, `tagline`, `status`
(`lancamento|em-obras|pronto|breve`), `categoria`, `cidade`, `bairro`,
`endereco`, `mapaQuery`, `capa`, `cartao`, `resumo`, `descricao[]`, `numeros[]`,
`diferenciais[]` (com chave de `icon`), `galeria[]` (categorias com imagens+alt),
`tipologias[]` (com `planta` e `plantaUnificada`), `plantasComuns[]`, `videos[]`,
`ficha[]`, `localizacao`, `destaque`. Helpers: `getEmpreendimento(id)`,
`getDestaques()`, `getTodasImagens(e)`, `STATUS_LABEL`.

As páginas leem **só** desse arquivo. Os componentes recebem os dados por props.

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
- **Dark mode:** `darkMode: "class"` + tokens via CSS vars em [`app/globals.css`](app/globals.css)
  (`:root` claro / `.dark` escuro). `sand` (fundos), `ink` (texto), `surface`
  (cartões) e `brand` (azul de texto/ícones) trocam sozinhos. `night` é fixo
  (overlays sobre fotos). Toggle: [`components/ThemeToggle.tsx`](components/ThemeToggle.tsx);
  script anti-flash em [`app/layout.tsx`](app/layout.tsx). Botões brancos sobre
  faixas azuis usam `bg-[#ffffff]`/`text-[#0d4185]` fixos.

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
- **Vídeos:** decisão do projeto — o cliente sobe no **YouTube** e o site apenas
  **incorpora/indexa o link** (embed). Não hospedar MP4 pesado no `public/` em
  produção. (Hoje, no protótipo, ainda há MP4 em `public/.../videos` — substituir
  por embed do YouTube na evolução.)

## Evolução planejada (não implementado ainda)

Permitir que o **cliente cadastre empreendimentos sozinho** via painel, sem o
desenvolvedor. CMS ainda **em definição: Supabase OU Sanity**. Vídeos serão
**links do YouTube** (campo de URL + embed). Plano completo e briefing de
implementação em [`docs/plano-cms-empreendimentos.md`](docs/plano-cms-empreendimentos.md).
Quando isso for feito, `data/empreendimentos.ts` deixa de ser a fonte de dados
(vira seed/fallback) e as páginas passam a ler do CMS.
