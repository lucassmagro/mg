# Plano — Cliente cadastrando empreendimentos sozinho (CMS)

> **STATUS (implementado):** o CMS foi construído com **Supabase** (banco +
> storage + auth) e um **painel próprio em `/admin`** — não com Sanity. A
> comparação Sanity × Supabase abaixo é histórica. **Vídeos:** decisão final =
> **upload de MP4 no Supabase Storage** (não YouTube). Detalhes de uso/arquitetura
> no `CLAUDE.md`. Configuração: `.env.example` + `supabase/schema.sql` +
> `npm run seed`. O restante deste documento é o plano original.

> Objetivo: permitir que o cliente que receber o site cadastre/edite **todos os
> dados, textos, imagens, plantas e vídeos** dos próximos empreendimentos pelo
> navegador, **sem depender do desenvolvedor**.
>
> Este documento serve para (1) leitura e (2) ser entregue ao Claude Code como
> briefing de implementação. A seção final tem o passo a passo técnico pronto
> para execução.

---

## 1. Situação atual

- Site em **Next.js (App Router) + TypeScript + Tailwind**.
- O conteúdo do empreendimento está **fixo em código**, no arquivo
  [`data/empreendimentos.ts`](../data/empreendimentos.ts).
- Imagens/plantas otimizadas em `public/projetos/valley-business/...`
  (geradas pelos scripts em [`scripts/`](../scripts)).
- Vídeos grandes (até ~275 MB) em `public/.../videos`.

**Limitação:** só quem mexe em código consegue adicionar um empreendimento novo.

---

## 2. O que precisa mudar

| Hoje (protótipo) | Alvo (cliente autônomo) |
|---|---|
| Texto/dados em arquivo `.ts` | Banco de dados via CMS |
| Imagens em `/public` | CDN de imagens do CMS (upload pelo painel) |
| Vídeos em `/public` | Hospedagem de vídeo dedicada (link ou Mux) |
| Só o dev edita | Painel web com login; o cliente edita |
| Conteúdo estático fixo | Site lê do CMS e atualiza sozinho |

Três blocos novos: **(a) CMS/banco**, **(b) armazenamento de mídia**,
**(c) site dinâmico lendo do CMS**.

---

## 3. Recomendação

> **Decisões já tomadas pelo cliente do projeto:**
> - **CMS:** em definição — **Supabase OU Sanity** (ver comparação na seção 4).
> - **Vídeo:** o cliente sobe no **YouTube** e o site apenas **incorpora/indexa
>   o link** (embed). Não haverá upload de MP4 nem hospedagem de vídeo própria.
>   Isso simplifica tudo: nos schemas, vídeo é só um **campo de URL do YouTube**.

**Sanity CMS** (painel embutido em `seusite.com/studio`) + **Vercel**
(hospedagem) + **vídeo via link do YouTube (embed)**.

Motivos:
- O painel roda **dentro do próprio site** (`/studio`) — nada para instalar/entregar à parte.
- **Upload e otimização de imagens nativos** (resolve o problema dos renders pesados).
- Plano **gratuito** suficiente para um site desse porte.
- **Login e permissões** prontos: convida-se o cliente por e-mail.
- O modelo de conteúdo espelha quase 1:1 as `interface` que já existem no projeto.

### Vídeo (ponto crítico — arquivos muito grandes)
Vídeo **não** deve subir pelo CMS comum. Duas opções:
- **Simples e grátis (recomendado para começar):** cliente sobe no
  **YouTube/Vimeo** (não listado) e **cola o link** num campo. O site mostra o player.
- **Profissional:** plugin **`sanity-plugin-mux-input`** → o cliente arrasta o
  vídeo no próprio painel; o Mux faz o streaming. Tem custo por uso.

---

## 4. Alternativas (para comparação)

| Solução | Painel | Mídia/Vídeo | Esforço do dev | Custo |
|---|---|---|---|---|
| **Sanity** (recomendado) | hospedado, embutido em `/studio` | imagens nativas; vídeo via Vimeo/Mux | médio | grátis → baixo |
| **Payload CMS** | self-host, integra ao Next | imagens nativas; vídeo grande pede storage externo | médio-alto | servidor próprio |
| **Strapi** | self-host | idem | alto (operar servidor) | servidor próprio |
| **Supabase** (DB+storage+auth) | **admin construído do zero** | imagens/arquivos | alto | grátis → baixo |
| **WordPress headless** | familiar p/ clientes | plugins de mídia | médio | hospedagem WP |

Para "cliente autônomo com mínima manutenção do dev", **Sanity é o melhor custo-benefício**.

---

## 5. Mapeamento do conteúdo (schema espelhando o código atual)

O schema do Sanity deve reproduzir as interfaces de
[`data/empreendimentos.ts`](../data/empreendimentos.ts):

- **Documento `empreendimento`**
  - `nome` (string), `subtitulo` (string), `tagline` (string)
  - `slug` (gera o `id`/URL) ← hoje é o campo `id`
  - `status` (lista: `lancamento`, `em-obras`, `pronto`, `breve`)
  - `categoria` (string), `cidade`, `bairro`, `endereco`, `mapaQuery`
  - `resumo` (texto), `descricao` (array de parágrafos / portable text)
  - `capa` (imagem), `cartao` (imagem do card)
  - `numeros` (array de `{ valor, label }`)
  - `diferenciais` (array de `{ icon, titulo, desc }`) — `icon` como lista fixa
    (rooftop, auditorio, reuniao, podcast, academia, cafe, seguranca, localizacao)
  - `galeria` (array de **categorias** `{ id, titulo, imagens[] }`, cada imagem
    com `asset` + `alt`)
  - `tipologias` (array de `{ nome, area, resumo, destaques[], planta, plantaUnificada? }`)
  - `plantasComuns` (array de `{ titulo, descricao, planta }`)
  - `videos` (array de `{ titulo, fonte('link'|'mux'), url?, muxAsset?, poster, formato }`)
  - `ficha` (array de `{ label, valor }`)
  - `localizacao` (`{ descricao, pontos[] }`)
  - `destaque` (boolean)

Como é quase uma tradução das `interface` atuais, **os componentes visuais
(cards, galeria, tipologias) praticamente não mudam** — só muda a fonte dos dados.

---

## 6. Passo a passo (execução)

### Etapa 0 — Hospedar o site (uma vez)
1. Subir o repositório para o GitHub.
2. Conectar no **Vercel** (importa o Next.js automaticamente).
3. Apontar o domínio do cliente. A partir daqui, todo `git push` publica.

### Etapa 1 — Criar o projeto no Sanity
4. Criar conta em sanity.io e um projeto (anotar `projectId` e `dataset = production`).
5. Instalar no projeto:
   ```bash
   npm i sanity next-sanity @sanity/image-url @sanity/vision
   ```
6. Variáveis de ambiente (`.env.local` e na Vercel):
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=xxxx
   NEXT_PUBLIC_SANITY_DATASET=production
   SANITY_API_READ_TOKEN=xxxx        # se usar conteúdo de rascunho/preview
   SANITY_REVALIDATE_SECRET=xxxx     # segredo do webhook
   ```

### Etapa 2 — Modelar o conteúdo
7. Criar os schemas em `sanity/schemas/` conforme a seção 5 (documento
   `empreendimento` + objetos `numero`, `diferencial`, `categoriaGaleria`,
   `tipologia`, `plantaComum`, `video`, `ficha`).

### Etapa 3 — Publicar o painel (o que o cliente usa)
8. Configurar `sanity.config.ts` e a rota embutida `app/studio/[[...tool]]/page.tsx`
   (via `next-sanity`). O painel fica em `seusite.com/studio`.
9. Deploy. **Esse link é o "sistema" do cliente.**

### Etapa 4 — Conectar o site ao CMS
10. Criar `sanity/client.ts` (cliente de leitura) e as consultas **GROQ** que
    substituem as funções atuais:
    - `getEmpreendimento(slug)`, `getDestaques()`, lista de empreendimentos.
11. Trocar os imports nas páginas para buscar do Sanity em vez do arquivo:
    - [`app/page.tsx`](../app/page.tsx)
    - [`app/empreendimentos/page.tsx`](../app/empreendimentos/page.tsx)
    - [`app/empreendimentos/[id]/page.tsx`](../app/empreendimentos/%5Bid%5D/page.tsx)
    - Ajustar `generateStaticParams` para listar os slugs do Sanity.

### Etapa 5 — Imagens
12. Usar `@sanity/image-url` para gerar URLs já redimensionadas/otimizadas e
    configurar `next.config.mjs` para o domínio `cdn.sanity.io`. O cliente sobe o
    render original; o sistema otimiza. **Acaba a otimização manual.**

### Etapa 6 — Vídeos (YouTube)
13. No schema, `videos[]` tem só `{ titulo, youtubeUrl }`.
14. O cliente cria o vídeo no canal do YouTube e **cola a URL** no painel.
15. No site, extrair o ID da URL e renderizar o `iframe` de embed do YouTube
    (com `loading="lazy"`). Sem upload de arquivo, sem custo de hospedagem.

### Etapa 7 — Acesso do cliente
16. Em **Sanity → Members**, convidar o e-mail do cliente como **editor**.
    Login por Google/e-mail. Adicionar/revogar acesso a qualquer momento.

### Etapa 8 — Atualização automática (sem redeploy)
17. Criar rota `app/api/revalidate/route.ts` que chama `revalidateTag('empreendimentos')`.
18. Cadastrar um **webhook** no Sanity apontando para essa rota (com o
    `SANITY_REVALIDATE_SECRET`). Ao publicar, o site atualiza em segundos,
    **sem dev e sem novo deploy**.

### Etapa 9 — Migrar o Valley Business
19. Cadastrar o Valley Business no painel uma vez (conteúdo atual de
    `data/empreendimentos.ts`), para servir de exemplo e poder ser "duplicado".

### Etapa 10 — Entrega e treinamento
20. Gravar um vídeo curto ou PDF de 1 página: "como cadastrar um empreendimento".

---

## 7. Custos (ordem de grandeza)
- **Vercel:** grátis no início.
- **Sanity:** grátis no plano inicial.
- **Vídeo:** YouTube/Vimeo grátis; Vimeo Pro/Mux pago se quiser streaming sem marca de terceiros.

---

## 8. Briefing pronto para o Claude Code

> Cole isto (ou aponte este arquivo) para o Claude Code executar.

**Tarefa:** Integrar o site ao **Sanity CMS** para que o cliente cadastre
empreendimentos pelo painel, sem depender de código.

**Pré-requisitos que o usuário fornece:** conta Sanity criada, `projectId`,
`dataset`, e as variáveis de ambiente da Etapa 1.

**Fazer:**
1. Instalar `sanity next-sanity @sanity/image-url @sanity/vision` (+ `sanity-plugin-mux-input` se optar por Mux).
2. Criar `sanity/` com `client.ts`, `env.ts`, `image.ts` (helper de URL) e
   `schemas/` espelhando as interfaces de `data/empreendimentos.ts` (ver seção 5).
3. Criar `sanity.config.ts` e a rota `app/studio/[[...tool]]/page.tsx` (painel embutido).
4. Criar `sanity/queries.ts` com GROQ para: lista de empreendimentos, destaque(s)
   e empreendimento por slug. Manter os mesmos campos que os componentes usam.
5. Substituir nas páginas (`app/page.tsx`, `app/empreendimentos/page.tsx`,
   `app/empreendimentos/[id]/page.tsx`) as chamadas a `data/empreendimentos.ts`
   pelas funções de `sanity/queries.ts`. Ajustar `generateStaticParams`.
   **Manter os componentes visuais** (`EmpreendimentoCard`, `GaleriaCategorizada`,
   `Tipologias`) — apenas adaptar os tipos/props se necessário.
6. Trocar imagens para `@sanity/image-url`; adicionar `cdn.sanity.io` em
   `next.config.mjs` (`images.remotePatterns`).
7. Implementar vídeo por **link** (campo `url` no schema) com player embed; deixar
   o caminho do Mux documentado/opcional.
8. Criar `app/api/revalidate/route.ts` com `revalidateTag` e proteger por segredo;
   marcar as queries com `next: { tags: ['empreendimentos'] }`.
9. Migrar o conteúdo atual do Valley Business para um documento de exemplo
   (script de seed `scripts/seed-sanity.mjs` usando o conteúdo de `data/empreendimentos.ts`).
10. Atualizar o `README.md` com: como acessar `/studio`, como cadastrar um
    empreendimento e como convidar usuários.

**Critérios de aceite:**
- `npm run build` passa.
- Editar/publicar no `/studio` reflete no site em segundos (sem redeploy).
- Imagens enviadas pelo painel aparecem otimizadas.
- Um empreendimento novo criado só pelo painel aparece na home e na listagem.
- O arquivo `data/empreendimentos.ts` deixa de ser a fonte de dados (pode virar
  só seed/fallback).
