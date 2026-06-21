# MG Incorporações — site institucional (protótipo)

Site institucional de alta fidelidade da **MG Incorporações**, com destaque para
o empreendimento real **Valley Business** — torre corporativa de salas
comerciais. É um protótipo navegável (sem backend, sem login, sem banco de
dados), feito para apresentação ao cliente.

Construído com **Next.js (App Router) + React + TypeScript + Tailwind CSS** e
ícones **lucide-react**. Tudo em **português do Brasil**. Os textos foram
redigidos para a apresentação e podem ser substituídos a qualquer momento.

## Como rodar localmente

```bash
npm install
npm run dev
```

Acesse **http://localhost:3000**.

Para gerar a build de produção: `npm run build` e depois `npm start`.

## Rotas

| Rota | Página | O que mostra |
| --- | --- | --- |
| `/` | Início | Hero do Valley Business, apresentação da incorporadora, empreendimento em destaque, faixa de imagens e CTA de WhatsApp. |
| `/empreendimentos` | Portfólio | Cards dos empreendimentos + bloco de próximos lançamentos. |
| `/empreendimentos/valley-business` | Empreendimento | Hero, números, descrição, diferenciais, **galeria categorizada com lightbox**, **tipologias com plantas** (individual/unificada), plantas de áreas comuns, **vídeos**, localização com mapa e ficha técnica. |
| `/sobre` | A incorporadora | História, números, missão/visão/valores e processo de trabalho. |
| `/contato` | Contato | Formulário visual, endereço, telefone, e-mail, horários, redes sociais e mapa. |

Todas as rotas compartilham o **cabeçalho** (sticky, com menu mobile), o
**rodapé** e o **botão flutuante de WhatsApp**.

## Onde personalizar

- **Marca, telefone, CNPJ, endereço, redes sociais e WhatsApp:**
  [`lib/config.ts`](lib/config.ts) — edite o objeto `marca`.
- **Cor de destaque (accent):** [`tailwind.config.ts`](tailwind.config.ts), na
  constante `accent`. O padrão é o azul da marca (`#0f4e9f`).
- **Dados do empreendimento:** [`data/empreendimentos.ts`](data/empreendimentos.ts).
  Edite o array `empreendimentos` (textos, galeria, tipologias, vídeos, ficha).
- **Logotipo:** SVGs em [`public/logo/`](public/logo) (`mg-horizontal.svg` para
  fundo claro, `mg-horizontal-light.svg` para fundo escuro).
- **Tipografia:** [`app/layout.tsx`](app/layout.tsx) (Fraunces nos títulos,
  Inter no texto).

## Assets & pipeline

As imagens originais (renders, plantas, fotos de capa), os vídeos e os logos
estão em [`assets/`](assets) (arquivos-fonte). Os scripts em
[`scripts/`](scripts) otimizam e copiam tudo para [`public/`](public):

```bash
node scripts/optimize-assets.mjs   # redimensiona/comprime renders, plantas e capa
node scripts/logos2.mjs            # gera os SVGs do logo recortados + favicons
```

> Os renders originais (~10–17 MB cada) são reduzidos para versões web
> (~200–650 KB) com `sharp`. Os vídeos são copiados como estão e carregam
> apenas ao dar play (`preload="none"` + poster).

## Observações

- As imagens são **renders reais** do Valley Business, servidas localmente.
- Os formulários (contato e interesse) são **apenas visuais** — exibem uma
  confirmação simulada e não enviam dados.
- O mapa usa um `iframe` público do Google Maps, sem necessidade de chave de API.
- Imagens meramente ilustrativas; dados oficiais constam do memorial de
  incorporação.
