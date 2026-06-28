# MG Incorporações: site e painel de empreendimentos

Site institucional da MG Incorporações, com destaque para o empreendimento real
Valley Business, uma torre corporativa de salas comerciais. O projeto tem backend
no Supabase (banco, storage e autenticação) e um painel em `/admin` onde o cliente
cadastra e edita os empreendimentos sozinho, sem mexer no código.

Feito com Next.js 14 (App Router), React, TypeScript e Tailwind CSS, com ícones
lucide-react. Todo o conteúdo está em português do Brasil.

Documentação complementar:

- Arquitetura e convenções: [`CLAUDE.md`](CLAUDE.md)
- Histórico de decisões do CMS: [`docs/plano-cms-empreendimentos.md`](docs/plano-cms-empreendimentos.md)

## Como rodar localmente

```bash
npm install
cp .env.example .env.local   # preencha as chaves do Supabase
npm run dev                  # http://localhost:3000
```

Para gerar a build de produção, rode `npm run build` e depois `npm start`.

As variáveis ficam no arquivo `.env.local`, que não deve ser versionado:

| Variável | Onde achar | Uso |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase, em Project Settings, API | site e painel |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | mesmo lugar | site e painel |
| `SUPABASE_SERVICE_ROLE_KEY` | mesmo lugar, é a chave secreta | apenas o `npm run seed`, em ambiente local |

## Configurar o Supabase (uma vez)

1. Crie um projeto em [supabase.com](https://supabase.com).
2. No SQL Editor, cole todo o conteúdo de [`supabase/schema.sql`](supabase/schema.sql)
   e clique em Run. Isso cria a tabela `empreendimentos`, as políticas de RLS e o
   bucket de Storage.
3. Em Authentication, Sign In / Providers, Email, desligue a opção "Allow new users
   to sign up". Isso impede cadastro público, já que o RLS concede escrita a
   qualquer usuário autenticado.
4. Em Authentication, Users, Add user, crie o e-mail e a senha do administrador.
5. Opcional: rode `npm run seed` para gravar o Valley Business de exemplo a partir
   de [`data/empreendimentos.ts`](data/empreendimentos.ts).

## Deploy na Vercel

1. Em Add New, Project, importe o repositório. A Vercel detecta o Next.js
   automaticamente.
2. Em Settings, Environment Variables (para Production, Preview e Development),
   cadastre `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Não
   adicione a `SUPABASE_SERVICE_ROLE_KEY`, que serve apenas para o seed local.
3. As variáveis `NEXT_PUBLIC_*` são embutidas no momento do build. Se você
   adicioná-las depois de um deploy, faça um Redeploy para que passem a valer.
4. No Supabase, em Authentication, URL Configuration, Site URL, informe o domínio
   de produção (por exemplo, `https://seu-dominio.vercel.app`).
5. Cada `git push` na branch `main` dispara um deploy automático.

O site lê do Supabase em tempo real, com render dinâmico. As publicações feitas no
painel aparecem ao recarregar a página, sem precisar de novo deploy. As imagens
enviadas pelo painel ficam no Storage, no domínio `*.supabase.co`, já liberado em
[`next.config.mjs`](next.config.mjs).

## Usar o painel (`/admin`)

1. Acesse `/admin`. Há um link discreto chamado "Painel" no rodapé do site.
2. Entre com o e-mail e a senha criados no Supabase.
3. Em "Novo empreendimento", preencha os campos, envie imagens, plantas e vídeos e
   clique em Salvar. Pela lista você também edita, exclui ou marca um
   empreendimento como destaque.

Campos disponíveis: identificação (nome, slug, status, finalidade, operações,
preços e destaque), localização, imagens de capa e de card, textos, números,
diferenciais, galeria por categorias, tipologias com plantas, plantas de áreas
comuns, vídeos e ficha técnica.

Na galeria você marca quais imagens entram no carrossel do topo (o banner) e
define a sequência delas na seção "Ordem do banner do topo".

Sobre os vídeos: eles são enviados como MP4 para o Storage. O plano gratuito do
Supabase oferece cerca de 1 GB, então prefira vídeos curtos e leves e reveja o
plano se o uso crescer.

## Rotas

| Rota | Página | O que mostra |
| --- | --- | --- |
| `/` | Início | Hero do destaque, apresentação da incorporadora, empreendimento em destaque, faixa de imagens e CTA de WhatsApp. |
| `/empreendimentos` | Portfólio | Cards dos empreendimentos e bloco de próximos lançamentos. |
| `/empreendimentos/[slug]` | Empreendimento | Hero, números, descrição, diferenciais, galeria com lightbox, tipologias com plantas, plantas de áreas comuns, vídeos, localização com mapa e ficha técnica. |
| `/sobre` | A incorporadora | História, números, missão, visão, valores e processo. |
| `/contato` | Contato | Formulário visual, endereço, telefone, e-mail, horários, redes e mapa. |
| `/admin` | Painel | Login, lista e formulário de cadastro e edição, protegido por sessão. |

## Onde personalizar

- Marca, telefone, CNPJ, endereço, redes e WhatsApp: [`lib/config.ts`](lib/config.ts), no objeto `marca`.
- Cor de destaque (accent): [`tailwind.config.ts`](tailwind.config.ts), valor `#0f4e9f`.
- Empreendimentos: pelo painel `/admin`, que é a fonte de dados. O array em [`data/empreendimentos.ts`](data/empreendimentos.ts) serve apenas como seed e exemplo.
- Logotipo: SVGs em [`public/logo/`](public/logo).
- Tipografia: [`app/layout.tsx`](app/layout.tsx), com Fraunces nos títulos e Inter no texto.

## Assets e pipeline

Os arquivos-fonte (renders, plantas e logos) ficam em [`assets/`](assets). Os
scripts em [`scripts/`](scripts) otimizam e copiam esses arquivos para
[`public/`](public):

```bash
node scripts/optimize-assets.mjs   # redimensiona e comprime renders, plantas e capa
node scripts/logos2.mjs            # gera os SVGs do logo recortados e os favicons
```

A mídia do Valley Business é servida de `public/`. Empreendimentos novos,
cadastrados pelo painel, usam o Supabase Storage.

## Observações

- O formulário de contato é apenas visual. Ele mostra uma confirmação simulada e
  não envia dados.
- O mapa usa um iframe público do Google Maps, sem chave de API.
- As imagens são meramente ilustrativas. Os dados oficiais constam do memorial de
  incorporação.
