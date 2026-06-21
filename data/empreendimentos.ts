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

export interface GaleriaCategoria {
  id: string;
  titulo: string;
  imagens: { src: string; alt: string }[];
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
    descricao: string;
    pontos: string[];
  };
  destaque: boolean;
}

const IMG = "/projetos/valley-business/imgs";
const PLANTA = "/projetos/valley-business/plantas";
const VIDEO = "/projetos/valley-business/videos";
const CAPA = "/projetos/valley-business/capa";

export const empreendimentos: Empreendimento[] = [
  {
    id: "valley-business",
    nome: "Valley Business",
    subtitulo: "Torre corporativa de alto padrão",
    tagline: "O novo endereço dos negócios em Chapecó.",
    status: "lancamento",
    categoria: "Salas comerciais",
    cidade: "Chapecó",
    bairro: "Centro",
    endereco: "Av. Getúlio Vargas — Centro, Chapecó/SC",
    mapaQuery: "Centro, Chapecó - SC",
    capa: `${CAPA}/04-fachada-sunset.jpg`,
    cartao: `${IMG}/01-fachada-frontal.jpg`,
    resumo:
      "Uma torre comercial concebida para empresas que querem crescer com endereço, estrutura e visibilidade. Salas inteligentes, áreas compartilhadas de alto nível e um rooftop com vista para a cidade.",
    descricao: [
      "O Valley Business nasce para ser o ponto de encontro dos negócios na região. Mais do que um edifício de salas comerciais, é um ambiente pensado para a rotina de quem empreende: da chegada pela recepção de pé-direito generoso ao café que recebe clientes e equipes ao longo do dia.",
      "Cada pavimento foi planejado para se adaptar ao tamanho do seu negócio. As salas podem ser unificadas para acompanhar o crescimento da empresa, com infraestrutura preparada para ar-condicionado, dados e automação. A flexibilidade é o que permite que escritórios, clínicas e consultórios encontrem aqui o espaço certo.",
      "No topo da torre, o rooftop reúne lounge, bar e terraço com vista aberta — o lugar para celebrar conquistas, receber parceiros ou simplesmente respirar entre uma reunião e outra. Auditório, salas de reunião equipadas, estúdio de podcast, academia e minimarket completam uma infraestrutura que normalmente só grandes corporações têm.",
      "Localizado em um dos endereços mais valorizados da cidade, o Valley Business une mobilidade, prestígio e potencial de valorização. Um investimento que trabalha pela sua empresa todos os dias.",
    ],
    numeros: [
      { valor: "32", label: "pavimentos" },
      { valor: "30–120 m²", label: "salas flexíveis" },
      { valor: "2", label: "andares de lazer" },
      { valor: "100%", label: "infraestrutura corporativa" },
    ],
    diferenciais: [
      {
        icon: "rooftop",
        titulo: "Rooftop com bar e terraço",
        desc: "Lounge no topo da torre, com bar e vista panorâmica para a cidade — para receber clientes ou celebrar resultados.",
      },
      {
        icon: "auditorio",
        titulo: "Auditório",
        desc: "Espaço completo para palestras, treinamentos e apresentações, com foyer e área de convivência integrados.",
      },
      {
        icon: "reuniao",
        titulo: "Salas de reunião",
        desc: "Ambientes equipados e prontos para uso, para receber sua equipe ou seus clientes sem ocupar a sua sala.",
      },
      {
        icon: "podcast",
        titulo: "Estúdio de podcast",
        desc: "Sala preparada para gravações de áudio e vídeo, pensada para a comunicação e o marketing do seu negócio.",
      },
      {
        icon: "academia",
        titulo: "Academia",
        desc: "Espaço fitness equipado dentro do edifício, para cuidar da saúde sem sair do trabalho.",
      },
      {
        icon: "cafe",
        titulo: "Café & minimarket",
        desc: "Café na recepção e minimarket de conveniência para o dia a dia de quem trabalha no prédio.",
      },
      {
        icon: "seguranca",
        titulo: "Segurança e controle de acesso",
        desc: "Portaria, monitoramento e controle de acesso para a tranquilidade de empresas e visitantes.",
      },
      {
        icon: "localizacao",
        titulo: "Endereço privilegiado",
        desc: "No coração da cidade, com fácil acesso, comércio e serviços a poucos passos da porta.",
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
          { src: `${IMG}/05-fachada-noturna.jpg`, alt: "Fachada noturna iluminada" },
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
          { src: `${IMG}/18-rooftop-aerea.jpg`, alt: "Vista aérea do rooftop" },
          { src: `${IMG}/19-rooftop-bar.jpg`, alt: "Bar do rooftop" },
          { src: `${IMG}/20-terraco-angulo-1.jpg`, alt: "Terraço, primeiro ângulo" },
          { src: `${IMG}/21-terraco-angulo-2.jpg`, alt: "Terraço, segundo ângulo" },
          { src: `${IMG}/22-descompressao.jpg`, alt: "Espaço de descompressão" },
          { src: `${IMG}/23-academia-angulo-1.jpg`, alt: "Academia, primeiro ângulo" },
          { src: `${IMG}/24-academia-angulo-2.jpg`, alt: "Academia, segundo ângulo" },
        ],
      },
    ],
    tipologias: [
      {
        nome: "Salas Tipo A",
        area: "a partir de 30 m²",
        resumo:
          "A planta mais compacta e eficiente, ideal para escritórios enxutos, consultórios e profissionais liberais.",
        destaques: ["Layout otimizado", "Infra para ar-condicionado", "Opção de unificação"],
        planta: `${PLANTA}/ph-04-planta-salas-tipo-a.jpg`,
        plantaUnificada: `${PLANTA}/ph-05-planta-salas-tipo-a-unificada.jpg`,
      },
      {
        nome: "Salas Tipo B",
        area: "a partir de 42 m²",
        resumo:
          "Espaço intermediário, com flexibilidade para dividir ambientes de atendimento e trabalho.",
        destaques: ["Ambientes flexíveis", "Boa iluminação natural", "Opção de unificação"],
        planta: `${PLANTA}/ph-06-planta-salas-tipo-b.jpg`,
        plantaUnificada: `${PLANTA}/ph-07-planta-salas-tipo-b-unificada.jpg`,
      },
      {
        nome: "Salas Tipo C",
        area: "a partir de 55 m²",
        resumo:
          "A maior tipologia, pensada para equipes maiores, clínicas e empresas em expansão.",
        destaques: ["Mais metragem privativa", "Ideal para equipes", "Opção de unificação"],
        planta: `${PLANTA}/ph-08-planta-salas-tipo-c.jpg`,
        plantaUnificada: `${PLANTA}/ph-09-planta-salas-tipo-c-unificada.jpg`,
      },
    ],
    plantasComuns: [
      {
        titulo: "Térreo",
        descricao: "Recepção, café e acessos do embasamento.",
        src: `${PLANTA}/ph-01-terreo.jpg`,
      },
      {
        titulo: "Recreação — 7º pavimento",
        descricao: "Primeiro pavimento de convivência e apoio corporativo.",
        src: `${PLANTA}/ph-02-recreacao-7-pav.jpg`,
      },
      {
        titulo: "Recreação — 32º pavimento",
        descricao: "Rooftop com bar, terraço e áreas de lazer no topo da torre.",
        src: `${PLANTA}/ph-03-recreacao-32-pav.jpg`,
      },
    ],
    videos: [
      {
        titulo: "Valley Business — o filme",
        src: `${VIDEO}/valley-filme.mp4`,
        poster: `${VIDEO}/poster.jpg`,
        formato: "vertical",
      },
      {
        titulo: "Tour pela torre",
        src: `${VIDEO}/valley-reels-1.mp4`,
        poster: `${IMG}/18-rooftop-aerea.jpg`,
        formato: "vertical",
      },
      {
        titulo: "Áreas de convivência",
        src: `${VIDEO}/valley-reels-2.mp4`,
        poster: `${IMG}/19-rooftop-bar.jpg`,
        formato: "vertical",
      },
    ],
    ficha: [
      { label: "Categoria", valor: "Salas comerciais" },
      { label: "Pavimentos", valor: "32 pavimentos" },
      { label: "Tipologias", valor: "Salas Tipo A, B e C (unificáveis)" },
      { label: "Metragem", valor: "Salas de 30 a 120 m²" },
      { label: "Lazer corporativo", valor: "Rooftop, auditório, academia e mais" },
      { label: "Situação", valor: "Lançamento" },
      { label: "Cidade", valor: "Chapecó — SC" },
    ],
    localizacao: {
      descricao:
        "No Centro de Chapecó, o Valley Business está cercado por bancos, comércio, restaurantes e serviços — tudo a poucos passos. Um endereço de fácil acesso para clientes, equipes e parceiros.",
      pontos: [
        "Avenida principal da cidade",
        "Bancos e serviços a pé",
        "Restaurantes e cafés no entorno",
        "Estacionamentos e fácil acesso viário",
      ],
    },
    destaque: true,
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
