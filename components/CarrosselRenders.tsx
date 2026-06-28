"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, Expand } from "lucide-react";

type Img = { src: string; alt: string };

/**
 * Carrossel de renders com autoplay. Pausa ao passar o mouse/foco e respeita
 * a preferência de movimento reduzido do usuário.
 */
export default function CarrosselRenders({
  imagens,
  intervalo = 4500,
}: {
  imagens: Img[];
  intervalo?: number;
}) {
  const [atual, setAtual] = useState(0);
  const [pausado, setPausado] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const total = imagens.length;

  const ir = useCallback(
    (dir: number) => setAtual((i) => (i + dir + total) % total),
    [total],
  );
  const irPara = useCallback((i: number) => setAtual(i), []);

  const fechar = useCallback(() => setLightbox(null), []);
  const navegarLightbox = useCallback(
    (dir: number) =>
      setLightbox((i) => (i === null ? i : (i + dir + total) % total)),
    [total],
  );

  // Respeita prefers-reduced-motion
  const reduzido = useRef(false);
  useEffect(() => {
    reduzido.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
  }, []);

  // Autoplay (pausa enquanto o lightbox está aberto)
  useEffect(() => {
    if (pausado || reduzido.current || total <= 1 || lightbox !== null) return;
    const id = setInterval(() => setAtual((i) => (i + 1) % total), intervalo);
    return () => clearInterval(id);
  }, [pausado, intervalo, total, lightbox]);

  // Teclado + trava de scroll enquanto o lightbox está aberto
  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") fechar();
      if (e.key === "ArrowRight") navegarLightbox(1);
      if (e.key === "ArrowLeft") navegarLightbox(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, fechar, navegarLightbox]);

  return (
    <div
      className="group relative overflow-hidden rounded-3xl bg-sand-200 shadow-card"
      role="region"
      aria-roledescription="carrossel"
      aria-label="Renders do empreendimento"
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
      onFocusCapture={() => setPausado(true)}
      onBlurCapture={() => setPausado(false)}
    >
      {/* Trilho */}
      <div
        className="flex transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${atual * 100}%)` }}
      >
        {imagens.map((img, i) => (
          <div
            key={img.src}
            className="relative aspect-[16/9] w-full shrink-0"
            aria-roledescription="slide"
            aria-label={`${i + 1} de ${total}`}
            aria-hidden={i !== atual}
          >
            <button
              type="button"
              onClick={() => setLightbox(i)}
              tabIndex={i === atual ? 0 : -1}
              aria-label={`Ampliar imagem: ${img.alt}`}
              className="group/slide absolute inset-0 h-full w-full cursor-zoom-in"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                priority={i === 0}
                sizes="(max-width: 1024px) 100vw, 1200px"
                className="object-cover"
              />
              {/* Dica de ampliar (aparece no hover) */}
              <span className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-night/45 text-white opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover/slide:opacity-100 sm:right-5 sm:top-5">
                <Expand className="h-5 w-5" />
              </span>
            </button>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-night/70 to-transparent p-5 pt-16 sm:p-8 sm:pt-20">
              <p className="font-serif text-lg text-white sm:text-2xl">
                {img.alt}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Setas */}
      <button
        type="button"
        onClick={() => ir(-1)}
        aria-label="Imagem anterior"
        className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-night shadow-sm backdrop-blur-sm transition hover:bg-white sm:left-5"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        type="button"
        onClick={() => ir(1)}
        aria-label="Próxima imagem"
        className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-night shadow-sm backdrop-blur-sm transition hover:bg-white sm:right-5"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Indicadores */}
      <div className="absolute inset-x-0 bottom-4 flex items-center justify-center gap-2">
        {imagens.map((img, i) => (
          <button
            key={img.src}
            type="button"
            onClick={() => irPara(i)}
            aria-label={`Ir para a imagem ${i + 1}`}
            aria-current={i === atual}
            className={`h-1.5 rounded-full transition-all ${
              i === atual ? "w-6 bg-white" : "w-1.5 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>

      {/* Lightbox — imagem ampliada */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-night/95 p-4"
          onClick={fechar}
          role="dialog"
          aria-modal="true"
          aria-label="Imagem ampliada"
        >
          <button
            type="button"
            onClick={fechar}
            aria-label="Fechar"
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <X className="h-6 w-6" />
          </button>

          {total > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                navegarLightbox(-1);
              }}
              aria-label="Imagem anterior"
              className="absolute left-3 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:left-6"
            >
              <ChevronLeft className="h-7 w-7" />
            </button>
          )}

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
              {imagens[lightbox].alt} · {lightbox + 1}/{total}
            </p>
          </div>

          {total > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                navegarLightbox(1);
              }}
              aria-label="Próxima imagem"
              className="absolute right-3 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-6"
            >
              <ChevronRight className="h-7 w-7" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
