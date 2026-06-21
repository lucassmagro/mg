/** Formata um valor em Real brasileiro: 1250000 -> "R$ 1.250.000". */
export function formatBRL(valor: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(valor);
}

export function formatArea(area: number): string {
  return `${new Intl.NumberFormat("pt-BR").format(area)} m²`;
}
