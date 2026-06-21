"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Img = { src: string; alt: string };

/**
 * Carrossel de fundo para o banner (hero) do empreendimento.
 * Faz crossfade automático entre os renders, com o gradiente por cima para
 * manter o texto legível. Setas (estilo glass) e indicadores permitem a
 * navegação manual. Respeita a preferência de movimento reduzido.
 */
export default function HeroCarrossel({
  imagens,
  intervalo = 5000,
}: {
  imagens: Img[];
  intervalo?: number;
}) {
  const [atual, setAtual] = useState(0);
  const total = imagens.length;
  const reduzido = useRef(false);

  const irPara = useCallback(
    (i: number) => setAtual(((i % total) + total) % total),
    [total],
  );
  const anterior = useCallback(() => irPara(atual - 1), [atual, irPara]);
  const proximo = useCallback(() => irPara(atual + 1), [atual, irPara]);

  useEffect(() => {
    reduzido.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
  }, []);

  useEffect(() => {
    if (reduzido.current || total <= 1) return;
    const id = setInterval(
      () => setAtual((i) => (i + 1) % total),
      intervalo,
    );
    return () => clearInterval(id);
    // `atual` reinicia o timer a cada navegação manual
  }, [intervalo, total, atual]);

  return (
    <>
      {/* Camada das imagens + gradiente (atrás do conteúdo) */}
      <div className="absolute inset-0 -z-10">
        {imagens.map((img, i) => (
          <Image
            key={img.src}
            src={img.src}
            alt={i === 0 ? img.alt : ""}
            aria-hidden={i !== 0}
            fill
            priority={i === 0}
            sizes="100vw"
            className={`object-cover transition-opacity duration-1000 ease-in-out ${
              i === atual ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-night/70 via-night/40 to-night/80" />
      </div>

      {total > 1 && (
        <>
          {/* Setas de navegação (glass frosted) */}
          <button
            type="button"
            onClick={anterior}
            aria-label="Imagem anterior"
            className="group absolute left-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white shadow-lg ring-1 ring-white/10 backdrop-blur-md transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:left-8 sm:h-12 sm:w-12"
          >
            <ChevronLeft
              className="h-5 w-5 transition-transform group-hover:-translate-x-0.5 sm:h-6 sm:w-6"
              aria-hidden="true"
            />
          </button>
          <button
            type="button"
            onClick={proximo}
            aria-label="Próxima imagem"
            className="group absolute right-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white shadow-lg ring-1 ring-white/10 backdrop-blur-md transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:right-8 sm:h-12 sm:w-12"
          >
            <ChevronRight
              className="h-5 w-5 transition-transform group-hover:translate-x-0.5 sm:h-6 sm:w-6"
              aria-hidden="true"
            />
          </button>

          {/* Indicadores */}
          <div className="absolute bottom-5 right-5 z-20 flex items-center gap-1.5 sm:right-8">
            {imagens.map((img, i) => (
              <button
                key={img.src}
                type="button"
                onClick={() => irPara(i)}
                aria-label={`Ir para a imagem ${i + 1}`}
                aria-current={i === atual}
                className={`h-1.5 rounded-full transition-all ${
                  i === atual ? "w-5 bg-white" : "w-1.5 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </>
  );
}
