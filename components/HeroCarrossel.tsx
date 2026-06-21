"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

type Img = { src: string; alt: string };

/**
 * Carrossel de fundo para o banner (hero) do empreendimento.
 * Faz crossfade automático entre os renders, com o gradiente por cima para
 * manter o texto legível. Respeita a preferência de movimento reduzido.
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
  }, [intervalo, total]);

  return (
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
      <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/40 to-ink/80" />

      {/* Indicadores */}
      <div className="absolute bottom-5 right-5 z-10 flex items-center gap-1.5 sm:right-8">
        {imagens.map((img, i) => (
          <span
            key={img.src}
            className={`h-1.5 rounded-full transition-all ${
              i === atual ? "w-5 bg-white" : "w-1.5 bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
