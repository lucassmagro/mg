"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Search, ChevronDown, Building2, Tag, Wallet, ArrowUpRight } from "lucide-react";
import EmpreendimentoCard from "./EmpreendimentoCard";
import {
  type Empreendimento,
  type Operacao,
  type TipoImovel,
  TIPO_IMOVEL_LABEL,
} from "@/data/empreendimentos";
import { whatsappLink } from "@/lib/config";

/** Faixas de valor do dropdown, conforme a operação (compra x aluguel/temporada). */
const FAIXAS_VENDA = [
  { label: "Até R$ 300 mil", max: 300_000 },
  { label: "Até R$ 500 mil", max: 500_000 },
  { label: "Até R$ 1 milhão", max: 1_000_000 },
  { label: "Acima de R$ 1 milhão", max: Infinity },
];

const FAIXAS_ALUGUEL = [
  { label: "Até R$ 2.000", max: 2_000 },
  { label: "Até R$ 4.000", max: 4_000 },
  { label: "Até R$ 8.000", max: 8_000 },
  { label: "Acima de R$ 8.000", max: Infinity },
];

/** Segmentos de atuação da empresa (sem "industrial"). */
const FINALIDADES: TipoImovel[] = ["residencial", "comercial"];

export default function HeroBusca({
  destaque,
  lista,
  categorias,
}: {
  destaque: Empreendimento;
  lista: Empreendimento[];
  categorias: string[];
}) {
  const [operacao, setOperacao] = useState<Operacao>("comprar");
  const [finalidade, setFinalidade] = useState<TipoImovel | null>(null);
  const [categoria, setCategoria] = useState<string>("todos");
  const [valorMaxIdx, setValorMaxIdx] = useState<number | null>(null);
  const [buscou, setBuscou] = useState(false);

  const faixas = operacao === "comprar" ? FAIXAS_VENDA : FAIXAS_ALUGUEL;

  // Imóveis que aceitam a operação atual — base para os filtros dinâmicos.
  const disponiveis = useMemo(
    () => lista.filter((e) => e.operacoes.includes(operacao)),
    [lista, operacao],
  );

  // O "Tipo" (categoria) ainda se adapta à operação/finalidade escolhida.
  const categoriasDisp = useMemo(
    () =>
      categorias.filter((c) =>
        disponiveis.some(
          (e) =>
            e.categoria === c && (!finalidade || e.tipoImovel === finalidade),
        ),
      ),
    [categorias, disponiveis, finalidade],
  );

  function trocarOperacao(op: Operacao) {
    setOperacao(op);
    setValorMaxIdx(null); // as faixas mudam entre comprar e alugar
    setFinalidade(null); // finalidades/tipos se adaptam à nova operação
    setCategoria("todos");
  }

  const resultados = useMemo(() => {
    const valorMax = valorMaxIdx === null ? null : faixas[valorMaxIdx].max;
    return lista.filter((e) => {
      if (!e.operacoes.includes(operacao)) return false;
      if (finalidade && e.tipoImovel !== finalidade) return false;
      if (categoria !== "todos" && e.categoria !== categoria) return false;
      if (valorMax !== null && valorMax !== Infinity) {
        const preco = operacao === "comprar" ? e.precoVenda : e.precoAluguel;
        if (preco == null || preco > valorMax) return false;
      }
      return true;
    });
  }, [lista, operacao, finalidade, categoria, valorMaxIdx, faixas]);

  const labelValor = operacao === "comprar" ? "Valor até" : "Aluguel até";

  return (
    <>
      {/* HERO com busca sobreposta */}
      <section className="px-4 pt-4 sm:px-6 sm:pt-6 lg:px-8">
        <div className="relative isolate overflow-hidden rounded-3xl">
          <div className="absolute inset-0 -z-10">
            <Image
              src={destaque.capa || destaque.cartao}
              alt={`Vista do empreendimento ${destaque.nome}`}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            {/* gradiente: escuro à esquerda (texto legível) → transparente à direita */}
            <div className="absolute inset-0 bg-gradient-to-r from-night/85 via-night/55 to-night/10" />
            <div className="absolute inset-0 bg-gradient-to-t from-night/60 via-night/10 to-transparent" />
          </div>

          <div className="flex min-h-[620px] flex-col justify-between gap-12 px-6 py-12 sm:px-10 lg:min-h-[720px] lg:px-14 lg:py-16">
            {/* topo: chamada */}
            <div className="max-w-2xl pt-6">
              <p className="eyebrow text-accent-200">
                Lançamento · {destaque.cidade} — SC
              </p>
              <h1 className="mt-4 font-serif text-4xl font-semibold leading-[1.05] text-white sm:text-5xl lg:text-6xl">
                {destaque.tagline}
              </h1>
              <p className="mt-5 max-w-xl text-lg text-white/85">
                {destaque.resumo}
              </p>
            </div>

            {/* base: card de busca (igual à referência) */}
            <div className="w-full max-w-4xl">
              {/* abas estilo "pasta" coladas no topo do card */}
              <div className="flex gap-1">
                {(["alugar", "comprar"] as Operacao[]).map((op) => {
                  const ativo = operacao === op;
                  return (
                    <button
                      key={op}
                      role="tab"
                      aria-selected={ativo}
                      onClick={() => trocarOperacao(op)}
                      className={`-mb-px rounded-t-xl border border-b-0 px-6 py-2.5 text-sm font-semibold backdrop-blur-md transition-colors ${
                        ativo
                          ? "border-white/20 bg-white/10 text-white"
                          : "border-white/15 bg-white/5 text-white/70 hover:bg-white/15 hover:text-white"
                      }`}
                    >
                      {op === "alugar" ? "Alugar" : "Comprar"}
                    </button>
                  );
                })}
              </div>

              <div className="rounded-2xl rounded-tl-none border border-t-0 border-white/20 bg-white/10 p-4 shadow-2xl backdrop-blur-md sm:p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
                  {/* Finalidade — chips */}
                  <div className="flex-1">
                    <span className="label flex items-center gap-1.5 text-white/80">
                      <Building2 className="h-3.5 w-3.5 text-accent-200" aria-hidden="true" />
                      Finalidade
                    </span>
                    <div className="mt-1.5 flex min-h-[4.75rem] flex-wrap content-center gap-2">
                      {FINALIDADES.map((f) => {
                        const ativo = finalidade === f;
                        return (
                          <button
                            key={f}
                            onClick={() => {
                              setFinalidade(ativo ? null : f);
                              setCategoria("todos"); // tipos se ajustam à finalidade
                            }}
                            aria-pressed={ativo}
                            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                              ativo
                                ? "border-white/70 bg-white/25 text-white"
                                : "border-white/25 text-white/80 hover:border-white/50 hover:text-white"
                            }`}
                          >
                            {TIPO_IMOVEL_LABEL[f]}
                          </button>
                        );
                      })}
                      <button
                        onClick={() =>
                          trocarOperacao(
                            operacao === "temporada" ? "comprar" : "temporada",
                          )
                        }
                        aria-pressed={operacao === "temporada"}
                        className={`inline-flex items-center gap-1 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                          operacao === "temporada"
                            ? "border-white/70 bg-white/25 text-white"
                            : "border-white/25 text-white/80 hover:border-white/50 hover:text-white"
                        }`}
                      >
                        Por temporada
                        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>

                  <div className="hidden w-px self-stretch bg-white/20 lg:block" />

                  {/* Tipo do imóvel */}
                  <div className="lg:w-44">
                    <span className="label flex items-center gap-1.5 text-white/80">
                      <Tag className="h-3.5 w-3.5 text-accent-200" aria-hidden="true" />
                      Tipo
                    </span>
                    <SelectField
                      value={categoria}
                      onChange={setCategoria}
                      ariaLabel="Tipo do imóvel"
                    >
                      <option value="todos">Tipo do imóvel</option>
                      {categoriasDisp.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </SelectField>
                  </div>

                  {/* Valor */}
                  <div className="lg:w-44">
                    <span className="label flex items-center gap-1.5 text-white/80">
                      <Wallet className="h-3.5 w-3.5 text-accent-200" aria-hidden="true" />
                      {labelValor}
                    </span>
                    <SelectField
                      value={valorMaxIdx === null ? "" : String(valorMaxIdx)}
                      onChange={(v) => setValorMaxIdx(v === "" ? null : Number(v))}
                      ariaLabel={labelValor}
                    >
                      <option value="">Escolha o valor</option>
                      {faixas.map((f, i) => (
                        <option key={f.label} value={i}>
                          {f.label}
                        </option>
                      ))}
                    </SelectField>
                  </div>

                  {/* Buscar */}
                  <button
                    onClick={() => setBuscou(true)}
                    className="btn-primary h-[46px] shrink-0 px-7 lg:self-end"
                  >
                    Buscar imóveis
                    <Search className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Resultados da busca */}
      {buscou && (
        <section className="container-x pt-10">
          <p className="text-sm text-ink-muted">
            {resultados.length === 0
              ? "Nenhum imóvel encontrado com esses filtros."
              : `${resultados.length} ${
                  resultados.length === 1 ? "imóvel encontrado" : "imóveis encontrados"
                }`}
          </p>

          {resultados.length > 0 ? (
            <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {resultados.map((e) => (
                <EmpreendimentoCard key={e.id} empreendimento={e} />
              ))}
            </div>
          ) : (
            <div className="mt-5 rounded-2xl border border-dashed border-ink/20 bg-surface/60 p-8 text-center">
              <p className="text-ink-soft">
                Ainda não temos um imóvel com exatamente esse perfil disponível.
                Fale com a nossa equipe. Podemos avisar você assim que surgir uma
                oportunidade.
              </p>
              <a
                href={whatsappLink(
                  "Olá! Estou procurando um imóvel e gostaria de ajuda da equipe da MG Incorporações.",
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp mt-5 px-6 py-3"
              >
                Falar com a equipe
              </a>
            </div>
          )}
        </section>
      )}
    </>
  );
}

/** Select estilizado com chevron, reaproveitando a classe `.field`. */
function SelectField({
  value,
  onChange,
  ariaLabel,
  children,
}: {
  value: string;
  onChange: (v: string) => void;
  ariaLabel: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative mt-1.5">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={ariaLabel}
        className="field h-[46px] cursor-pointer appearance-none border-white/25 bg-white/10 pr-9 text-white backdrop-blur-md [&>option]:text-night"
      >
        {children}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60"
        aria-hidden="true"
      />
    </div>
  );
}
