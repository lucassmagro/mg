"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { GaleriaCategoria } from "@/data/empreendimentos";

export default function GaleriaCategorizada({
  galeria,
}: {
  galeria: GaleriaCategoria[];
}) {
  const [catAtiva, setCatAtiva] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);

  const imagens = galeria[catAtiva].imagens;

  const fechar = useCallback(() => setLightbox(null), []);
  const navegar = useCallback(
    (dir: number) =>
      setLightbox((i) =>
        i === null ? i : (i + dir + imagens.length) % imagens.length,
      ),
    [imagens.length],
  );

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") fechar();
      if (e.key === "ArrowRight") navegar(1);
      if (e.key === "ArrowLeft") navegar(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, fechar, navegar]);

  return (
    <div>
      {/* Abas de categoria */}
      <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        {galeria.map((cat, i) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setCatAtiva(i)}
            aria-pressed={i === catAtiva}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              i === catAtiva
                ? "border-accent-600 bg-accent-600 text-white"
                : "border-ink/15 bg-white text-ink-soft hover:border-ink/30"
            }`}
          >
            {cat.titulo}
          </button>
        ))}
      </div>

      {/* Grade de imagens — uniforme e alinhada */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        {imagens.map((img, i) => (
          <button
            key={img.src}
            type="button"
            onClick={() => setLightbox(i)}
            className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-sand-200"
            aria-label={`Ampliar: ${img.alt}`}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="(max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <span className="absolute inset-0 bg-ink/0 transition-colors group-hover:bg-ink/10" />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/95 p-4"
          onClick={fechar}
          role="dialog"
          aria-modal="true"
          aria-label="Galeria de imagens"
        >
          <button
            type="button"
            onClick={fechar}
            aria-label="Fechar"
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <X className="h-6 w-6" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              navegar(-1);
            }}
            aria-label="Imagem anterior"
            className="absolute left-3 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:left-6"
          >
            <ChevronLeft className="h-7 w-7" />
          </button>

          <div
            className="relative h-[80vh] w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              key={imagens[lightbox].src}
              src={imagens[lightbox].src}
              alt={imagens[lightbox].alt}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
            <p className="absolute inset-x-0 -bottom-9 text-center text-sm text-white/80">
              {imagens[lightbox].alt} · {lightbox + 1}/{imagens.length}
            </p>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              navegar(1);
            }}
            aria-label="Próxima imagem"
            className="absolute right-3 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-6"
          >
            <ChevronRight className="h-7 w-7" />
          </button>
        </div>
      )}
    </div>
  );
}
