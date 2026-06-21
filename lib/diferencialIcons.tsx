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
