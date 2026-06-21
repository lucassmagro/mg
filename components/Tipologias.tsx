"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, Maximize2 } from "lucide-react";
import type { Tipologia } from "@/data/empreendimentos";

export default function Tipologias({
  tipologias,
}: {
  tipologias: Tipologia[];
}) {
  const [ativa, setAtiva] = useState(0);
  const [unificada, setUnificada] = useState(false);

  const tip = tipologias[ativa];
  const temUnificada = Boolean(tip.plantaUnificada);
  const plantaAtual = unificada && tip.plantaUnificada ? tip.plantaUnificada : tip.planta;

  return (
    <div>
      {/* Abas de tipologia */}
      <div className="flex flex-wrap gap-2">
        {tipologias.map((t, i) => (
          <button
            key={t.nome}
            type="button"
            onClick={() => {
              setAtiva(i);
              setUnificada(false);
            }}
            aria-pressed={i === ativa}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              i === ativa
                ? "border-accent-600 bg-accent-600 text-white"
                : "border-ink/15 bg-white text-ink-soft hover:border-ink/30"
            }`}
          >
            {t.nome}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
        {/* Planta */}
        <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-card">
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-sand-100">
            <Image
              key={plantaAtual}
              src={plantaAtual}
              alt={`Planta ${tip.nome}${unificada ? " — unificada" : ""}`}
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-contain p-2"
            />
            <a
              href={plantaAtual}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-ink/80 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition-colors hover:bg-ink"
            >
              <Maximize2 className="h-3.5 w-3.5" />
              Ver em tela cheia
            </a>
          </div>

          {temUnificada && (
            <div className="mt-4 inline-flex rounded-full bg-sand-100 p-1">
              <button
                type="button"
                onClick={() => setUnificada(false)}
                aria-pressed={!unificada}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                  !unificada ? "bg-accent-600 text-white shadow-sm" : "text-ink-soft hover:text-ink"
                }`}
              >
                Sala individual
              </button>
              <button
                type="button"
                onClick={() => setUnificada(true)}
                aria-pressed={unificada}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                  unificada ? "bg-accent-600 text-white shadow-sm" : "text-ink-soft hover:text-ink"
                }`}
              >
                Salas unificadas
              </button>
            </div>
          )}
        </div>

        {/* Descrição */}
        <div>
          <p className="eyebrow">{tip.area}</p>
          <h3 className="mt-2 font-serif text-2xl text-ink">{tip.nome}</h3>
          <p className="mt-3 leading-relaxed text-ink-soft">{tip.resumo}</p>
          <ul className="mt-5 space-y-2.5">
            {tip.destaques.map((d) => (
              <li key={d} className="flex items-center gap-2.5 text-sm text-ink-soft">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-600/10 text-accent-700">
                  <Check className="h-4 w-4" />
                </span>
                {d}
              </li>
            ))}
          </ul>
          <p className="mt-5 text-xs text-ink-muted">
            Plantas ilustrativas. Medidas e layout sujeitos ao memorial
            descritivo do empreendimento.
          </p>
        </div>
      </div>
    </div>
  );
}
