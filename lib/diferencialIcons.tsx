import {
  Wine,
  Presentation,
  Users,
  Mic,
  Dumbbell,
  Coffee,
  ShieldCheck,
  MapPin,
  Building2,
  CalendarDays,
  Sofa,
  ShoppingCart,
  Bike,
  type LucideIcon,
} from "lucide-react";

/** Resolve a chave de ícone usada nos dados dos diferenciais. */
export const DIFERENCIAL_ICONS: Record<string, LucideIcon> = {
  rooftop: Wine,
  auditorio: Presentation,
  reuniao: Users,
  podcast: Mic,
  academia: Dumbbell,
  cafe: Coffee,
  seguranca: ShieldCheck,
  localizacao: MapPin,
  eventos: CalendarDays,
  descompressao: Sofa,
  mercado: ShoppingCart,
  mobilidade: Bike,
};

export function iconeDiferencial(chave: string): LucideIcon {
  return DIFERENCIAL_ICONS[chave] ?? Building2;
}

/**
 * Rótulo do ícone: `nome` descreve o desenho (o que ele mostra) e `ex` é uma
 * sugestão de uso — o ícone pode representar outras coisas além disso.
 */
export const DIFERENCIAL_ICON_LABELS: Record<
  string,
  { nome: string; ex: string }
> = {
  rooftop: { nome: "Taça", ex: "rooftop, bar" },
  auditorio: { nome: "Apresentação", ex: "auditório, palestras" },
  reuniao: { nome: "Pessoas", ex: "reunião, coworking" },
  podcast: { nome: "Microfone", ex: "podcast, estúdio" },
  academia: { nome: "Halter", ex: "academia" },
  cafe: { nome: "Xícara de café", ex: "café, copa" },
  seguranca: { nome: "Escudo", ex: "segurança, portaria" },
  localizacao: { nome: "Pino de mapa", ex: "localização" },
  eventos: { nome: "Calendário", ex: "eventos, agenda" },
  descompressao: { nome: "Sofá", ex: "descompressão, lounge" },
  mercado: { nome: "Carrinho de compras", ex: "mercado, comércio" },
  mobilidade: { nome: "Bicicleta", ex: "mobilidade, bicicletário" },
};
