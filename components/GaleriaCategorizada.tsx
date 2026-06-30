"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Expand } from "lucide-react";
import type { GaleriaCategoria } from "@/data/empreendimentos";

/**
 * Layout do mosaico "bento" (a partir de `sm`, grade de 3 colunas).
 *
 * Cada imagem recebe um "footprint" (tamanho na grade). Eles são agrupados em
 * BANDAS que sempre preenchem linhas inteiras de 3 colunas — assim, somando
 * bandas, o mosaico SEMPRE fecha um retângulo perfeito (sem buracos na última
 * linha), para qualquer quantidade de imagens.
 *
 *   FEATURE (5 imgs, 3×3): destaque grande 2×2 + alto 1×2 + 3 menores
 *   TRIO    (3 imgs, 1 linha): 3 menores
 *   PAIR    (2 imgs, 1 linha): largo 2×1 + 1 menor
 *   SINGLE  (1 img): ocupa a linha inteira
 */
const SMALL = "";
const BIG = "sm:col-span-2 sm:row-span-2";
const TALL = "sm:row-span-2";
const WIDE = "sm:col-span-2";
const FULL = "sm:col-span-3";

const FEATURE = [BIG, TALL, SMALL, SMALL, SMALL];
const TRIO = [SMALL, SMALL, SMALL];
const PAIR = [WIDE, SMALL];
const SINGLE = [FULL];

function layoutMosaico(n: number): string[] {
  const bandas: string[][] = [];
  let resto = n;
  // Consome destaques enquanto sobrar o bastante para fechar o resto certinho.
  while (resto >= 8) {
    bandas.push(FEATURE);
    resto -= 5;
  }
  // Fecha o restante (0–7) só com bandas retangulares.
  if (resto === 1) bandas.push(SINGLE);
  else if (resto === 2) bandas.push(PAIR);
  else if (resto === 3) bandas.push(TRIO);
  else if (resto === 4) bandas.push(PAIR, PAIR);
  else if (resto === 5) bandas.push(FEATURE);
  else if (resto === 6) bandas.push(TRIO, TRIO);
  else if (resto === 7) bandas.push(FEATURE, PAIR);

  const footprints = bandas.flat();

  // Mobile (2 colunas): se for ímpar, o último tile ocupa a linha toda para
  // a grade também fechar um retângulo no celular.
  if (n % 2 === 1 && footprints.length > 0) {
    const ultimo = footprints.length - 1;
    footprints[ultimo] =
      footprints[ultimo] === FULL ? `col-span-2 ${FULL}` : "col-span-2 sm:col-span-1";
  }
  return footprints;
}

export default function GaleriaCategorizada({
  galeria,
}: {
  galeria: GaleriaCategoria[];
}) {
  const [catAtiva, setCatAtiva] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  // Guarda quem tinha o foco antes de abrir o lightbox, para devolver ao fechar.
  const focoAnterior = useRef<HTMLElement | null>(null);

  const imagens = galeria[catAtiva].imagens;
  const footprints = useMemo(() => layoutMosaico(imagens.length), [imagens.length]);

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

    // Lembra o elemento focado e move o foco para dentro do diálogo.
    focoAnterior.current = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();

    /** Elementos focáveis dentro do lightbox (botões de navegar/fechar). */
    const focaveis = () =>
      Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return fechar();
      if (e.key === "ArrowRight") return navegar(1);
      if (e.key === "ArrowLeft") return navegar(-1);
      // Focus trap: mantém o Tab circulando dentro do diálogo.
      if (e.key === "Tab") {
        const itens = focaveis();
        if (itens.length === 0) return;
        const primeiro = itens[0];
        const ultimo = itens[itens.length - 1];
        const ativo = document.activeElement;
        if (e.shiftKey && (ativo === primeiro || ativo === dialogRef.current)) {
          e.preventDefault();
          ultimo.focus();
        } else if (!e.shiftKey && ativo === ultimo) {
          e.preventDefault();
          primeiro.focus();
        }
      }
    };

    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      // Devolve o foco a quem abriu o lightbox.
      focoAnterior.current?.focus();
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
                : "border-ink/15 bg-surface text-ink-soft hover:border-ink/30"
            }`}
          >
            {cat.titulo}
          </button>
        ))}
      </div>

      {/* Mosaico bento — destaque grande + tiles ao redor, hover com legenda */}
      <div className="mt-6 grid auto-rows-[150px] grid-flow-dense grid-cols-2 gap-3 sm:auto-rows-[185px] sm:grid-cols-3 sm:gap-4 lg:auto-rows-[210px]">
        {imagens.map((img, i) => (
          <button
            key={img.src}
            type="button"
            onClick={() => setLightbox(i)}
            className={`group relative overflow-hidden rounded-2xl bg-sand-200 ${footprints[i] ?? ""}`}
            aria-label={`Ampliar: ${img.alt}`}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="(max-width: 640px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />

            {/* gradiente base sutil — dá profundidade mesmo sem hover */}
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-night/35 via-night/0 to-night/0 opacity-70 transition-opacity duration-300 group-hover:opacity-0"
            />

            {/* overlay no hover: escurece e revela legenda + botão */}
            <span
              aria-hidden="true"
              className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-night/55 p-4 text-center opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            >
              <span className="translate-y-2 font-serif text-base font-medium leading-snug text-white transition-transform duration-300 group-hover:translate-y-0 sm:text-lg">
                {img.alt}
              </span>
              <span className="inline-flex translate-y-2 items-center gap-1.5 rounded-full bg-[#ffffff] px-4 py-2 text-sm font-semibold text-[#0d4185] transition-transform duration-300 group-hover:translate-y-0">
                <Expand className="h-4 w-4" aria-hidden="true" />
                Ampliar
              </span>
            </span>
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          ref={dialogRef}
          tabIndex={-1}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-night/95 p-4 outline-none"
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
