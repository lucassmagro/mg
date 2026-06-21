import Link from "next/link";
import Image from "next/image";
import { marca } from "@/lib/config";

/**
 * Logotipo da marca MG Incorporações.
 * - orientation "horizontal": marca + "INCORPORAÇÕES" lado a lado (cabeçalho).
 * - orientation "stacked": marca acima de "INCORPORAÇÕES" (rodapé).
 * - variant "dark"/"light": versão para fundo claro/escuro.
 * - themed: troca automaticamente conforme o tema (preta no claro, branca no
 *   escuro) — usado no cabeçalho.
 */
export default function Logo({
  variant = "dark",
  orientation = "horizontal",
  themed = false,
  className = "",
}: {
  variant?: "dark" | "light";
  orientation?: "horizontal" | "stacked";
  themed?: boolean;
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
      {themed ? (
        <>
          <Image
            src={sources[orientation].dark}
            alt={marca.nome}
            width={dims.width}
            height={dims.height}
            priority
            unoptimized
            className={`${dims.cls} dark:hidden`}
          />
          <Image
            src={sources[orientation].light}
            alt={marca.nome}
            width={dims.width}
            height={dims.height}
            priority
            unoptimized
            className={`${dims.cls} hidden dark:block`}
          />
        </>
      ) : (
        <Image
          src={sources[orientation][variant]}
          alt={marca.nome}
          width={dims.width}
          height={dims.height}
          priority
          unoptimized
          className={dims.cls}
        />
      )}
    </Link>
  );
}
