import Link from "next/link";
import Image from "next/image";
import { marca } from "@/lib/config";

/**
 * Logotipo da marca MG Incorporações.
 * - orientation "horizontal": marca + "INCORPORAÇÕES" lado a lado (cabeçalho).
 * - orientation "stacked": marca acima de "INCORPORAÇÕES" (rodapé).
 * - variant "dark"/"light": versão para fundo claro/escuro.
 * - themed: usa SEMPRE o logo colorido oficial; no tema escuro ele fica sobre
 *   uma placa branca (não existe versão branca da marca) — usado no cabeçalho.
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
        // Logo colorido oficial; no tema escuro, sobre placa branca para
        // manter o lettering legível (não há versão branca da marca).
        <span className="inline-flex items-center rounded-lg dark:bg-white dark:px-2.5 dark:py-1.5">
          <Image
            src={sources[orientation].dark}
            alt={marca.nome}
            width={dims.width}
            height={dims.height}
            priority
            unoptimized
            className={dims.cls}
          />
        </span>
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
