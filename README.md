# MG Incorporações — site + painel de empreendimentos

Site institucional da **MG Incorporações**, com destaque para o empreendimento
real **Valley Business** (torre corporativa de salas comerciais). Tem **backend
Supabase** (banco + storage + autenticação) e um **painel em `/admin`** onde o
cliente cadastra e edita os empreendimentos sozinho — sem mexer no código.

Construído com **Next.js 14 (App Router) + React + TypeScript + Tailwind CSS** e
ícones **lucide-react**. Tudo em **português do Brasil**.

- Arquitetura e convenções: [`CLAUDE.md`](CLAUDE.md)
- Histórico de decisões do CMS: [`docs/plano-cms-empreendimentos.md`](docs/plano-cms-empreendimentos.md)

## Como rodar localmente

```bash
npm install
cp .env.example .env.local   # preencha as chaves do Supabase
npm run dev                  # http://localhost:3000
```

Para a build de produção: `npm run build` e depois `npm start`.

Variáveis (em `.env.local` — **nunca** versionar):

| Variável | Onde achar | Uso |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API | site + painel |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | idem | site + painel |
| `SUPABASE_SERVICE_ROLE_KEY` | idem (secreta) | **só** o `npm run seed` (local) |

## Configurar o Supabase (uma vez)

1. Crie um projeto em [supabase.com](https://supabase.com).
2. **SQL Editor** → cole todo o [`supabase/schema.sql`](supabase/schema.sql) →
   **Run** (cria a tabela `empreendimentos`, o RLS e o bucket de Storage).
3. **Authentication → Sign In / Providers → Email** → **desligue** "Allow new
   users to sign up" (impede cadastro público; o RLS dá escrita a qualquer
   usuário autenticado).
4. **Authentication → Users → Add user** → e-mail + senha do administrador.
5. (Opcional) `npm run seed` → grava o **Valley Business** de exemplo a partir de
   [`data/empreendimentos.ts`](data/empreendimentos.ts).

## Deploy na Vercel

1. **Add New → Project** → importe o repositório (framework Next.js detectado).
2. **Settings → Environment Variables** (Production, Preview e Development):
   - `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
   - **Não** adicione a `SUPABASE_SERVICE_ROLE_KEY` (usada só no seed local).
   - ⚠️ As `NEXT_PUBLIC_*` são embutidas no **build** — se adicioná-las depois de
     um deploy, faça **Redeploy**.
3. **Supabase → Authentication → URL Configuration → Site URL**: o domínio de
   produção (ex.: `https://seu-dominio.vercel.app`).
4. Cada `git push` na `main` dispara um deploy automático.

O site lê do Supabase em tempo real (render dinâmico): publicações no painel
aparecem ao recarregar, sem novo deploy. As imagens do painel ficam no Storage
(`*.supabase.co`, já liberado em [`next.config.mjs`](next.config.mjs)).

## Usar o painel (`/admin`)

1. Acesse **`/admin`** (há um link discreto "Painel" no rodapé do site).
2. Entre com o e-mail/senha criado no Supabase.
3. **Novo empreendimento** → preencha os campos e envie imagens, plantas e vídeos
   → **Salvar**. Edite, exclua ou marque/desmarque **destaque** pela lista.

Campos: identificação (nome, slug, status, finalidade, operações, preços,
destaque), localização, imagens de capa/card, textos, números, diferenciais,
galeria por categorias, tipologias com plantas, plantas de áreas comuns, vídeos
e ficha técnica.

> **Vídeos:** enviados como MP4 para o Storage. O plano gratuito do Supabase tem
> ~1 GB — prefira vídeos curtos/leves; reveja o plano se o uso crescer.

## Rotas

| Rota | Página | O que mostra |
| --- | --- | --- |
| `/` | Início | Hero do destaque, apresentação da incorporadora, empreendimento em destaque, faixa de imagens e CTA de WhatsApp. |
| `/empreendimentos` | Portfólio | Cards dos empreendimentos + bloco de próximos lançamentos. |
| `/empreendimentos/[slug]` | Empreendimento | Hero, números, descrição, diferenciais, galeria com lightbox, tipologias com plantas, plantas de áreas comuns, vídeos, localização com mapa e ficha técnica. |
| `/sobre` | A incorporadora | História, números, missão/visão/valores e processo. |
| `/contato` | Contato | Formulário visual, endereço, telefone, e-mail, horários, redes e mapa. |
| `/admin` | Painel | Login, lista e formulário de cadastro/edição (protegido). |

## Onde personalizar

- **Marca, telefone, CNPJ, endereço, redes, WhatsApp:** [`lib/config.ts`](lib/config.ts) (objeto `marca`).
- **Cor de destaque (accent):** [`tailwind.config.ts`](tailwind.config.ts) (`#0f4e9f`).
- **Empreendimentos:** pelo painel `/admin` (fonte de dados). O array em
  [`data/empreendimentos.ts`](data/empreendimentos.ts) é apenas seed/exemplo.
- **Logotipo:** SVGs em [`public/logo/`](public/logo).
- **Tipografia:** [`app/layout.tsx`](app/layout.tsx) (Fraunces nos títulos, Inter no texto).

## Assets & pipeline

Arquivos-fonte (renders, plantas, logos) em [`assets/`](assets); os scripts em
[`scripts/`](scripts) otimizam e copiam para [`public/`](public):

```bash
node scripts/optimize-assets.mjs   # redimensiona/comprime renders, plantas e capa
node scripts/logos2.mjs            # gera os SVGs do logo recortados + favicons
```

> A mídia do Valley Business é servida de `public/`. Empreendimentos novos
> (cadastrados no painel) usam o Supabase Storage.

## Observações

- Os formulários de **contato e interesse** são apenas visuais (confirmação
  simulada; não enviam dados).
- O mapa usa um `iframe` público do Google Maps, sem chave de API.
- Imagens meramente ilustrativas; dados oficiais constam do memorial de
  incorporação.
