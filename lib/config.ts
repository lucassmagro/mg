/**
 * MARCA & CONTATO — fonte única de verdade para branding e dados de contato.
 * Para renomear a incorporadora ou trocar telefone/endereço/redes, altere aqui.
 * (A COR de destaque fica em `tailwind.config.ts`.)
 */
export const marca = {
  nome: "MG Incorporações",
  nomeCurto: "MG",
  segmento: "Incorporadora",
  tagline: "Empreendimentos que valorizam o seu futuro",
  descricaoCurta:
    "Incorporadora dedicada a projetos que unem arquitetura, localização e qualidade construtiva.",
  fundadaEm: 2009,

  // Registros (placeholders — substituir pelos reais)
  cnpj: "00.000.000/0001-00",
  creci: "CRECI/SC 0000-J",

  // Contato
  telefone: "(49) 3304-0094",
  whatsapp: "554933040094", // só dígitos, com DDI 55 — usado nos links wa.me
  whatsappLabel: "(49) 3304-0094",
  email: "adm.mgincorporacoes@gmail.com",

  // Endereço
  endereco: "Av. Getúlio Vargas, 1500 — 12º andar",
  bairro: "Centro",
  cidade: "Chapecó",
  uf: "SC",
  cep: "89802-000",

  // Horário de atendimento
  horario: [
    { dias: "Segunda a sexta", horas: "08h30 às 18h30" },
    { dias: "Sábado", horas: "09h00 às 13h00" },
    { dias: "Domingo", horas: "Fechado" },
  ],

  // Redes sociais (placeholders)
  instagram: "https://instagram.com",
  facebook: "https://facebook.com",
  linkedin: "https://linkedin.com",
} as const;

/** Monta um link wa.me com mensagem pré-preenchida. */
export function whatsappLink(mensagem?: string): string {
  const base = `https://wa.me/${marca.whatsapp}`;
  return mensagem ? `${base}?text=${encodeURIComponent(mensagem)}` : base;
}

export const navLinks = [
  { href: "/", label: "Início" },
  { href: "/empreendimentos", label: "Empreendimentos" },
  { href: "/sobre", label: "A incorporadora" },
  { href: "/contato", label: "Contato" },
] as const;
