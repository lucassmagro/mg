import Link from "next/link";
import Image from "next/image";
import { marca } from "@/lib/config";

/**
 * Logotipo da marca MG Incorporações.
 * - orientation "horizontal": marca + "INCORPORAÇÕES" lado a lado (cabeçalho).
 * - orientation "stacked": marca acima de "INCORPORAÇÕES" (rodapé).
 * A variante "light" inverte para uso sobre fundos escuros.
 */
export default function Logo({
  variant = "dark",
  orientation = "horizontal",
  className = "",
}: {
  variant?: "dark" | "light";
  orientation?: "horizontal" | "stacked";
  className?: string;
}) {
  const sources = {
    horizontal: {
      dark: "/logo/mg-horizontal.svg",
      light: "/logo/mg-horizontal-light.svg",
    },
    stacked: {
      dark: "/logo/mg-stacked.svg",
      light: "/logo/mg-stacked-light.svg",
    },
  } as const;

  const src = sources[orientation][variant];

  const dims =
    orientation === "stacked"
      ? { width: 150, height: 170, cls: "h-16 w-auto lg:h-20" }
      : { width: 210, height: 58, cls: "h-9 w-auto lg:h-10" };

  return (
    <Link
      href="/"
      aria-label={`${marca.nome} — página inicial`}
      className={`inline-flex items-center ${className}`}
    >
      <Image
        src={src}
        alt={marca.nome}
        width={dims.width}
        height={dims.height}
        priority
        unoptimized
        className={dims.cls}
      />
    </Link>
  );
}
