## Role and goal

You are a senior frontend engineer and product designer. Build a **navigable
high-fidelity prototype** (not a backend, no database) of a website for a
Brazilian real estate agency ("imobiliária"). The purpose is to **present a draft
to a client** so they can click through and understand the look, feel, and
structure of the future site. Everything visible to the user must be in
**Brazilian Portuguese (pt-BR)**.

This is a **mockup with mock data and mock content** only. No login, no admin
panel, no real database. Property data comes from a local mock file.

## Tech stack

- **Next.js (App Router) + React + TypeScript**
- **Tailwind CSS** for styling
- **lucide-react** for icons
- Mock data in a local `data/imoveis.ts` (or `.json`) file
- No backend, no auth, no external API keys required
- Must run locally with a single `npm install && npm run dev`
- Fully **responsive and mobile-first** (most Brazilian property searches happen on mobile)

## Pages and routes

Build these routes, all linked through a shared header and footer:

1. **Home (`/`)** — the showcase page. Sections in order:
   - Hero with a strong architectural background photo, a short headline, and a
     prominent **property search bar** (see below).
   - "Imóveis em destaque" — a grid of 6 highlighted property cards.
   - A finalidade split section with two large cards: "Comprar" and "Alugar".
   - "Por que escolher a [Nome da Imobiliária]" — 3 to 4 trust points
     (atendimento, experiência no mercado, imóveis selecionados). Use icons.
   - A neighborhoods / city section highlighting the region (use a generic
     Chapecó-SC context, since that is the target city).
   - Final CTA band with WhatsApp button.

2. **Imóveis (`/imoveis`)** — the public listing/search results page:
   - Left (or top on mobile) **filter sidebar**: finalidade (Comprar/Alugar),
     tipo (Apartamento, Casa, Sala comercial, Terreno, Apartamento na planta),
     cidade, bairro, faixa de preço, quartos, vagas de garagem.
   - Results grid of property cards. Filters must **actually work** on the mock
     data (client-side filtering and sorting). Include a sort dropdown
     (menor preço, maior preço, mais recentes).
   - Results count ("X imóveis encontrados") and an empty state.

3. **Detalhe do imóvel (`/imoveis/[id]`)**:
   - Photo gallery (main image + thumbnails, clickable).
   - Title, neighborhood/city, price, finalidade badge.
   - Key specs row: quartos, banheiros, vagas, área (m²).
   - Full description (mock text), list of features ("Características":
     churrasqueira, sacada, mobiliado, etc.).
   - An embedded **Google Maps** location (use a simple iframe embed pointing at
     a Chapecó address — no API key needed).
   - A sticky contact card with **WhatsApp** button ("Tenho interesse") and a
     simple visit-request form (name, phone, message) that is visual only.
   - "Imóveis semelhantes" carousel/grid at the bottom.

4. **Sobre (`/sobre`)** — about the agency: history, mission, a team section
   with mock members, and some numbers (anos de experiência, imóveis vendidos,
   clientes atendidos).

5. **Serviços (`/servicos`)** — services offered: venda, locação,
   administração de imóveis, avaliação de imóveis, financiamento. Cards with
   icons and short descriptions.

6. **Contato (`/contato`)** — contact page: a visual contact form, address,
   phone, email, opening hours, WhatsApp button, social links, and a map.

## Global components

- **Header**: logo placeholder on the left, nav links (Início, Imóveis, Sobre,
  Serviços, Contato), and a WhatsApp call-to-action button. Sticky on scroll.
  Mobile hamburger menu.
- **Footer**: agency info, quick links, contact, social media icons
  (Instagram, Facebook, WhatsApp), and a CRECI placeholder line (Brazilian
  real estate agencies display their CRECI registration).
- **Floating WhatsApp button**: fixed bottom-right on all pages.
- **Property card** (reused everywhere): photo with finalidade tag
  (Venda/Locação), price, title, neighborhood, and a specs row with small icons
  (quartos, banheiros, vagas, m²). Consistent design across the whole site.

## Search bar component

A horizontal search bar (stacks on mobile) with: finalidade toggle
(Comprar / Alugar), tipo de imóvel select, cidade/bairro input, and a "Buscar"
button that navigates to `/imoveis` with the chosen filters applied.

## Design direction

Aim for a **premium, trustworthy, editorial** real estate aesthetic — think
award-winning agency sites, not a generic template.

- **Reference**: inspired by santamaria.com.br (a long-established Chapecó
  agency) — clean layout, confident use of a single strong accent color,
  large architectural photography, clear hierarchy. Also draw from
  award-winning real estate sites: generous whitespace, big confident
  typography, consistent card design, smooth but subtle interactions, and a
  strong property-search experience.
- **Color**: choose ONE refined accent color and use it with discipline against
  a neutral base (warm whites, soft greys, near-black text). A deep red or a
  deep green both read as serious and "imobiliária". Avoid purple/blue
  tech-gradient looks.
- **Typography**: pair a characterful serif or strong grotesque for headings
  with a clean readable sans for body. Avoid default system-font blandness.
- **Photography**: use real architecture/interior/real-estate photos from
  Unsplash (these are real photos, not AI-generated). Use consistent aspect
  ratios for property images. Pick warm, inviting, well-lit homes.
- **Motion**: subtle and tasteful only (gentle hover lifts on cards, smooth
  scroll). Nothing flashy or distracting.
- **Spacing and polish**: this needs to look intentional and hand-crafted, with
  careful alignment, consistent border radius, and a clear grid. It should NOT
  look like an auto-generated template.

## Mock data

Create **14 to 16 mock properties** in the data file, realistic for Chapecó-SC:

- Mix of finalidades: roughly half **Venda**, half **Locação**.
- Mix of tipos: apartamento, casa, sala comercial, terreno, apartamento na planta.
- Use real Chapecó neighborhoods for realism: Centro, Maria Goretti,
  São Cristóvão, Universitário, Efapi, Passo dos Fortes, Jardim Itália, Líder,
  Presidente Médici, Santa Maria, Seminário.
- Realistic BRL prices: venda from ~R$ 250.000 to ~R$ 1.500.000; locação from
  ~R$ 1.200 to ~R$ 6.000/mês. Format as Brazilian currency (R$ 1.250.000).
- Each property: id, título, finalidade, tipo, cidade, bairro, preço, quartos,
  banheiros, vagas, área (m²), short and long descriptions in pt-BR, a list of
  features, and an array of 3 to 5 image URLs.
- Write descriptions in natural, human Brazilian Portuguese, the way a real
  estate listing reads. Do NOT use robotic or "AI-sounding" phrasing.

Also include mock content for the agency: a placeholder name (e.g.
"Imobiliária Horizonte" — leave it easy to rename), tagline, about text, team
members, services, and contact details (mock phone, email, address in Chapecó).

## Hard constraints

- **Language**: 100% Brazilian Portuguese in everything the user sees (labels,
  buttons, descriptions, placeholders, error/empty states).
- **No AI elements whatsoever**: no chatbot widget, no "assistente virtual", no
  "AI"/"IA" badges, no AI-recommendation features, no auto-generated-looking
  filler copy. The site must read as a normal, professional human-made agency
  site. Avoid clichéd generic marketing phrases.
- **No backend / no auth / no admin** in this prototype. Visual forms only.
- Keep it **accessible**: semantic HTML, alt text in pt-BR, good color contrast,
  keyboard-navigable.
- Make it easy to rename the agency and swap the accent color from a single
  config/constants file.

## Deliverable

A running Next.js project. When done:

1. Give me the commands to run it locally.
2. Briefly list the routes and what each page shows.
3. Point out where to change the agency name, accent color, and mock data.

Build the whole thing now. Prioritize visual polish and a coherent, professional
result that will impress a client seeing their future website for the first time.
