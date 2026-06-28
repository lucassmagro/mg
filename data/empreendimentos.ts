/**
 * DADOS DOS EMPREENDIMENTOS — protótipo de alta fidelidade (sem backend).
 * Para adicionar/editar um empreendimento, altere o array `empreendimentos`.
 * As imagens, plantas e vídeos são arquivos reais do projeto, em /public.
 * Os textos foram redigidos para a apresentação e podem ser substituídos.
 */

export type StatusEmpreendimento =
  | "lancamento"
  | "em-obras"
  | "pronto"
  | "breve";

export const STATUS_LABEL: Record<StatusEmpreendimento, string> = {
  lancamento: "Lançamento",
  "em-obras": "Em obras",
  pronto: "Pronto para morar",
  breve: "Em breve",
};

/** Formas de negociação disponíveis no empreendimento (busca da home). */
export type Operacao = "comprar" | "alugar" | "temporada";

export const OPERACAO_LABEL: Record<Operacao, string> = {
  comprar: "Comprar",
  alugar: "Alugar",
  temporada: "Por temporada",
};

/** Finalidade do imóvel (chips de "Finalidade" na busca). */
export type TipoImovel = "residencial" | "comercial" | "industrial";

export const TIPO_IMOVEL_LABEL: Record<TipoImovel, string> = {
  residencial: "Residencial",
  comercial: "Comercial",
  industrial: "Industrial",
};

export interface Numero {
  valor: string;
  label: string;
}

export interface Diferencial {
  /** chave de ícone resolvida na página (ver ICONS em app/.../page) */
  icon: string;
  titulo: string;
  desc: string;
}

export interface GaleriaImagem {
  src: string;
  alt: string;
  /** Quando true, a imagem entra no carrossel do banner (hero) do topo. */
  banner?: boolean;
}

export interface GaleriaCategoria {
  id: string;
  titulo: string;
  imagens: GaleriaImagem[];
}

export interface Tipologia {
  nome: string;
  area: string;
  resumo: string;
  destaques: string[];
  planta: string;
  plantaUnificada?: string;
}

export interface PlantaComum {
  titulo: string;
  descricao: string;
  src: string;
}

export interface VideoItem {
  titulo: string;
  src: string;
  poster: string;
  formato: "horizontal" | "vertical";
}

export interface FichaItem {
  label: string;
  valor: string;
}

export interface Empreendimento {
  id: string;
  nome: string;
  subtitulo: string;
  tagline: string;
  status: StatusEmpreendimento;
  categoria: string; // ex.: "Salas comerciais"
  /** Finalidade do imóvel — usado nos filtros da busca da home. */
  tipoImovel: TipoImovel;
  /** Formas de negociação disponíveis (abas Comprar/Alugar/Por temporada). */
  operacoes: Operacao[];
  /** Valores "a partir de" — ilustrativos (protótipo); alimentam o filtro de preço. */
  precoVenda?: number;
  precoAluguel?: number;
  cidade: string;
  bairro: string;
  endereco: string;
  mapaQuery: string;
  capa: string; // hero
  cartao: string; // imagem do card
  resumo: string;
  descricao: string[]; // parágrafos
  numeros: Numero[];
  diferenciais: Diferencial[];
  galeria: GaleriaCategoria[];
  tipologias: Tipologia[];
  plantasComuns: PlantaComum[];
  videos: VideoItem[];
  ficha: FichaItem[];
  localizacao: {
    /** Título da seção (ex.: "No coração de Chapecó"). Vazio usa o padrão. */
    titulo?: string;
    descricao: string;
    pontos: string[];
  };
  destaque: boolean;
  /** Rascunho (false) não aparece no site público; só na pré-visualização do painel. */
  publicado: boolean;
}

const IMG = "/projetos/valley-business/imgs";
const PLANTA = "/projetos/valley-business/plantas";
const VIDEO = "/projetos/valley-business/videos"; // só o poster.jpg ainda vem daqui
const CAPA = "/projetos/valley-business/capa";
// Vídeos comprimidos servidos do Supabase Storage (bucket público).
const VIDEO_CDN =
  "https://aajhklcmblpqffanvjuq.supabase.co/storage/v1/object/public/empreendimentos/valley-business/videos";

export const empreendimentos: Empreendimento[] = [
  {
    id: "valley-business",
    nome: "Valley Business Center",
    subtitulo: "Salas comerciais flexíveis e integráveis",
    tagline: "O novo centro da vida urbana de Chapecó.",
    status: "lancamento",
    categoria: "Salas comerciais",
    tipoImovel: "comercial",
    operacoes: ["comprar"],
    precoVenda: 250000, // a partir de (ilustrativo)
    cidade: "Chapecó",
    bairro: "Maria Goretti",
    endereco: "Rua Assis Brasil, 140 — Maria Goretti, Chapecó/SC",
    mapaQuery: "Rua Assis Brasil, 140, Maria Goretti, Chapecó - SC",
    capa: `${CAPA}/06-voo-do-passaro-detalhe.jpg`,
    cartao: `${IMG}/01-fachada-frontal.jpg`,
    resumo:
      "Salas comerciais flexíveis e integráveis, de 20 a 64 m², em uma das regiões mais nobres de Chapecó. Negócios, lazer e estilo de vida reunidos em um só endereço.",
    descricao: [
      "O Valley é o lugar onde tudo converge: morar perto, trabalhar perto, viver melhor. Um espaço que conecta negócios, lazer e estilo de vida: o novo centro da vida urbana de Chapecó.",
      "Localizado em uma das regiões mais nobres da cidade, na Rua Assis Brasil, 140, no bairro Maria Goretti, o Valley ocupa um endereço privilegiado e ainda pouco explorado por prédios comerciais.",
      "São salas comerciais de 20 a 64 m² de área privativa, em três tipologias que podem ser integradas para acompanhar o crescimento da sua empresa, todas com vista panorâmica e opções em diferentes orientações solares.",
      "Do térreo, com café aberto ao público, ao rooftop bar com vista panorâmica, o empreendimento reúne auditório para até 80 pessoas, salas de reunião, espaço de eventos multiuso, academia no conceito Studio Personal, mini mercado self-service e espaço de descompressão. No Valley, cada minuto vale mais: para sua empresa, para sua vida, para o seu futuro.",
    ],
    numeros: [
      { valor: "20–64 m²", label: "salas (área privativa)" },
      { valor: "262", label: "vagas de garagem" },
      { valor: "80", label: "lugares no auditório" },
      { valor: "2030", label: "entrega prevista" },
    ],
    diferenciais: [
      {
        icon: "rooftop",
        titulo: "Rooftop bar",
        desc: "Bar no topo da torre, com vista panorâmica para a cidade, ideal para receber clientes ou celebrar resultados.",
      },
      {
        icon: "auditorio",
        titulo: "Auditório para 80 pessoas",
        desc: "Auditório com foyer de apoio para palestras, treinamentos e apresentações.",
      },
      {
        icon: "reuniao",
        titulo: "Salas de reunião",
        desc: "Meeting rooms para encontros privados, sem ocupar a sua sala.",
      },
      {
        icon: "eventos",
        titulo: "Espaço de eventos multiuso",
        desc: "Ambiente flexível para workshops, palestras e reuniões sociais.",
      },
      {
        icon: "cafe",
        titulo: "Café no térreo",
        desc: "Espaço de espera e café aberto ao público, logo na entrada do edifício.",
      },
      {
        icon: "academia",
        titulo: "Academia Studio Personal",
        desc: "Academia de alta performance no conceito Studio Personal.",
      },
      {
        icon: "descompressao",
        titulo: "Espaço de descompressão",
        desc: "Área para pausas e descanso ao longo do dia de trabalho.",
      },
      {
        icon: "mercado",
        titulo: "Mini mercado self-service",
        desc: "Conveniência self-service para o dia a dia de quem trabalha no prédio.",
      },
      {
        icon: "mobilidade",
        titulo: "Mobilidade urbana",
        desc: "Bicicletário, área de embarque e desembarque e carregadores elétricos para bikes e carros.",
      },
      {
        icon: "localizacao",
        titulo: "Endereço privilegiado",
        desc: "No Maria Goretti, uma das regiões mais nobres de Chapecó, com fácil acesso.",
      },
    ],
    galeria: [
      {
        id: "fachada",
        titulo: "Fachada & implantação",
        imagens: [
          { src: `${IMG}/01-fachada-frontal.jpg`, alt: "Fachada frontal do Valley Business" },
          { src: `${IMG}/04-fachada-sunset.jpg`, alt: "Fachada do Valley Business ao entardecer" },
          { src: `${IMG}/02-pax-fachada-geral-noite.jpg`, alt: "Vista geral da fachada à noite" },
          { src: `${IMG}/05-fachada-noturna.jpg`, alt: "Fachada noturna iluminada", banner: true },
          { src: `${IMG}/03-fachada-grande-plano-inserida-no-local.jpg`, alt: "A torre inserida na paisagem da cidade" },
          { src: `${IMG}/06-voo-do-passaro-detalhe.jpg`, alt: "Vista aérea em detalhe do empreendimento" },
          { src: `${IMG}/07-embasamento-vista-observador.jpg`, alt: "Embasamento visto do nível da rua" },
          { src: `${IMG}/08-embasamento-noturna.jpg`, alt: "Embasamento iluminado à noite" },
        ],
      },
      {
        id: "areas-comuns",
        titulo: "Recepção & convivência",
        imagens: [
          { src: `${IMG}/09-recepcao-hall.jpg`, alt: "Hall de recepção do Valley Business" },
          { src: `${IMG}/10-recepcao-angulo-2-sala-de-espera.jpg`, alt: "Sala de espera da recepção" },
          { src: `${IMG}/11-cafe.jpg`, alt: "Café na recepção do edifício" },
          { src: `${IMG}/12-foyer.jpg`, alt: "Foyer de acesso ao auditório" },
        ],
      },
      {
        id: "auditorio",
        titulo: "Auditório",
        imagens: [
          { src: `${IMG}/13-auditorio-angulo-01.jpg`, alt: "Auditório, primeiro ângulo" },
          { src: `${IMG}/14-auditorio-angulo-02.jpg`, alt: "Auditório, segundo ângulo" },
          { src: `${IMG}/15-auditorio-area-de-convivencia.jpg`, alt: "Área de convivência junto ao auditório" },
        ],
      },
      {
        id: "corporativo",
        titulo: "Salas & espaços corporativos",
        imagens: [
          { src: `${IMG}/16-sala-de-reuniao.jpg`, alt: "Sala de reunião equipada" },
          { src: `${IMG}/17-sala-de-podcast.jpg`, alt: "Estúdio de podcast" },
          { src: `${IMG}/26-sala-03-e-04.jpg`, alt: "Salas comerciais tipo, unidades 03 e 04" },
          { src: `${IMG}/27-sala-10.jpg`, alt: "Sala comercial tipo, unidade 10" },
          { src: `${IMG}/25-copa-minimarket.jpg`, alt: "Copa e minimarket de conveniência" },
        ],
      },
      {
        id: "lazer",
        titulo: "Rooftop, terraço & academia",
        imagens: [
          { src: `${IMG}/18-rooftop-aerea.jpg`, alt: "Vista aérea do rooftop", banner: true },
          { src: `${IMG}/19-rooftop-bar.jpg`, alt: "Bar do rooftop" },
          { src: `${IMG}/20-terraco-angulo-1.jpg`, alt: "Terraço, primeiro ângulo", banner: true },
          { src: `${IMG}/21-terraco-angulo-2.jpg`, alt: "Terraço, segundo ângulo", banner: true },
          { src: `${IMG}/22-descompressao.jpg`, alt: "Espaço de descompressão" },
          { src: `${IMG}/23-academia-angulo-1.jpg`, alt: "Academia, primeiro ângulo" },
          { src: `${IMG}/24-academia-angulo-2.jpg`, alt: "Academia, segundo ângulo" },
        ],
      },
    ],
    tipologias: [
      {
        nome: "Salas Tipo A",
        area: "aprox. 30 m²",
        resumo:
          "Planta compacta e eficiente, ideal para escritórios, consultórios e profissionais liberais.",
        destaques: ["Vista panorâmica", "Diferentes orientações solares", "Possibilidade de integração"],
        planta: `${PLANTA}/ph-04-planta-salas-tipo-a.jpg`,
        plantaUnificada: `${PLANTA}/ph-05-planta-salas-tipo-a-unificada.jpg`,
      },
      {
        nome: "Salas Tipo B",
        area: "aprox. 30 m²",
        resumo:
          "Tipologia versátil, com layout que se adapta a ambientes de atendimento e trabalho.",
        destaques: ["Vista panorâmica", "Diferentes orientações solares", "Possibilidade de integração"],
        planta: `${PLANTA}/ph-06-planta-salas-tipo-b.jpg`,
        plantaUnificada: `${PLANTA}/ph-07-planta-salas-tipo-b-unificada.jpg`,
      },
      {
        nome: "Salas Tipo C",
        area: "aprox. 45 m²",
        resumo:
          "A maior tipologia, pensada para equipes maiores e empresas em expansão. Salas integráveis chegam a 64 m².",
        destaques: ["Mais metragem privativa", "Vista panorâmica", "Possibilidade de integração"],
        planta: `${PLANTA}/ph-08-planta-salas-tipo-c.jpg`,
        plantaUnificada: `${PLANTA}/ph-09-planta-salas-tipo-c-unificada.jpg`,
      },
    ],
    plantasComuns: [
      {
        titulo: "Térreo",
        descricao: "Recepção, espaço de espera e café aberto ao público.",
        src: `${PLANTA}/ph-01-terreo.jpg`,
      },
      {
        titulo: "Pavimento de convivência",
        descricao: "Áreas de apoio, eventos e convivência corporativa.",
        src: `${PLANTA}/ph-02-recreacao-7-pav.jpg`,
      },
      {
        titulo: "Rooftop",
        descricao: "Bar com vista panorâmica e áreas de lazer no topo da torre.",
        src: `${PLANTA}/ph-03-recreacao-32-pav.jpg`,
      },
    ],
    // Vídeos comprimidos e hospedados no Supabase Storage (os MP4 originais,
    // ~390 MB, não cabem no GitHub nem no Storage grátis). Posters seguem em /public.
    videos: [
      {
        titulo: "Valley Business",
        src: `${VIDEO_CDN}/valley-filme.mp4`,
        poster: `${VIDEO}/poster.jpg`,
        formato: "vertical",
      },
      {
        titulo: "Tour pela torre",
        src: `${VIDEO_CDN}/valley-reels-1.mp4`,
        poster: `${IMG}/18-rooftop-aerea.jpg`,
        formato: "vertical",
      },
      {
        titulo: "Áreas de convivência",
        src: `${VIDEO_CDN}/valley-reels-2.mp4`,
        poster: `${IMG}/19-rooftop-bar.jpg`,
        formato: "vertical",
      },
    ],
    ficha: [
      { label: "Categoria", valor: "Salas comerciais" },
      { label: "Áreas privativas", valor: "20 a 64 m²" },
      { label: "Tipologias", valor: "Salas Tipo A, B e C (integráveis)" },
      { label: "Vagas", valor: "262 (220 privativas + 42 rotativas)" },
      { label: "Garagem", valor: "6 pavimentos + subsolo" },
      { label: "Lazer corporativo", valor: "Rooftop bar, auditório, academia e mais" },
      { label: "Arquitetura", valor: "Leonardo Cabral" },
      { label: "Entrega prevista", valor: "2030" },
      { label: "Situação", valor: "Lançamento" },
      { label: "Endereço", valor: "Rua Assis Brasil, 140 — Maria Goretti, Chapecó/SC" },
    ],
    localizacao: {
      descricao:
        "No bairro Maria Goretti, uma das regiões mais nobres de Chapecó, na Rua Assis Brasil, 140. Um endereço privilegiado e tranquilo, ainda pouco explorado por prédios comerciais, com fácil acesso ao restante da cidade.",
      pontos: [
        "Região nobre e valorizada",
        "Endereço pouco explorado por comércios",
        "Fácil acesso e boa mobilidade",
        "Próximo a serviços e ao Centro",
      ],
    },
    destaque: true,
    publicado: true,
  },
];

export function getEmpreendimento(id: string): Empreendimento | undefined {
  return empreendimentos.find((e) => e.id === id);
}

export function getDestaques(): Empreendimento[] {
  return empreendimentos.filter((e) => e.destaque);
}

/** Todas as imagens da galeria, achatadas (para lightbox e contagem). */
export function getTodasImagens(e: Empreendimento) {
  return e.galeria.flatMap((c) => c.imagens);
}

/**
 * Imagens do carrossel do banner (hero), na ordem da galeria.
 * Usa as marcadas como `banner`; se nenhuma estiver marcada, cai para a 1ª
 * categoria e, por fim, para a capa — preservando o comportamento antigo.
 */
export function getImagensBanner(e: Empreendimento): GaleriaImagem[] {
  const marcadas = getTodasImagens(e).filter((img) => img.banner);
  if (marcadas.length) return marcadas;
  if (e.galeria[0]?.imagens?.length) return e.galeria[0].imagens;
  return e.capa ? [{ src: e.capa, alt: e.nome }] : [];
}

/** Categorias distintas disponíveis (alimenta o dropdown "Tipo" da busca). */
export function getCategorias(): string[] {
  return Array.from(new Set(empreendimentos.map((e) => e.categoria))).sort();
}
