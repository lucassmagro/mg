"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  const total = imagens.length;

  const ir = useCallback(
    (dir: number) => setAtual((i) => (i + dir + total) % total),
    [total],
  );
  const irPara = useCallback((i: number) => setAtual(i), []);

  // Respeita prefers-reduced-motion
  const reduzido = useRef(false);
  useEffect(() => {
    reduzido.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
  }, []);

  // Autoplay
  useEffect(() => {
    if (pausado || reduzido.current || total <= 1) return;
    const id = setInterval(() => setAtual((i) => (i + 1) % total), intervalo);
    return () => clearInterval(id);
  }, [pausado, intervalo, total]);

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
            <Image
              src={img.src}
              alt={img.alt}
              fill
              priority={i === 0}
              sizes="(max-width: 1024px) 100vw, 1200px"
              className="object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-night/70 to-transparent p-5 pt-16 sm:p-8 sm:pt-20">
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
    </div>
  );
}
