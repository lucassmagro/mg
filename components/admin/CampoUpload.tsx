"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { Upload, X, Loader2, FileVideo } from "lucide-react";
import { criarClienteBrowser } from "@/lib/supabase/client";

/** Remove acentos/espaços do nome do arquivo para um caminho seguro no Storage. */
function nomeSeguro(nome: string) {
  return nome
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // remove acentos combinados
    .replace(/[^a-zA-Z0-9.\-_]/g, "-")
    .toLowerCase();
}

/** Limite recomendado de tamanho de vídeo (MB) — alerta no plano grátis. */
const LIMITE_VIDEO_MB = 50;

export default function CampoUpload({
  valor,
  onChange,
  pasta,
  slug,
  tipo = "image",
  label,
}: {
  valor: string;
  onChange: (url: string) => void;
  pasta: string;
  slug: string;
  tipo?: "image" | "video";
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [enviando, setEnviando] = useState(false);
  async function aoSelecionar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (tipo === "video") {
      const mb = file.size / (1024 * 1024);
      if (mb > LIMITE_VIDEO_MB) {
        toast.warn(
          `Vídeo de ${mb.toFixed(0)} MB. Recomendamos até ${LIMITE_VIDEO_MB} MB para não estourar o armazenamento.`,
        );
      }
    }

    setEnviando(true);
    const supabase = criarClienteBrowser();
    const base = slug?.trim() || "rascunho";
    const caminho = `${base}/${pasta}/${Date.now()}-${nomeSeguro(file.name)}`;

    const { error } = await supabase.storage
      .from("empreendimentos")
      .upload(caminho, file, { upsert: true });

    if (error) {
      toast.error(`Falha no envio: ${error.message}`);
      setEnviando(false);
      return;
    }

    const { data } = supabase.storage
      .from("empreendimentos")
      .getPublicUrl(caminho);
    onChange(data.publicUrl);
    setEnviando(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  const aspect = tipo === "video" ? "aspect-[9/16] max-w-[160px]" : "aspect-[4/3]";

  return (
    <div>
      {label && <span className="label">{label}</span>}
      <div className={label ? "mt-1.5" : ""}>
        {valor ? (
          <div className={`relative overflow-hidden rounded-xl border border-ink/10 bg-sand-100 ${aspect}`}>
            {tipo === "video" ? (
              <video src={valor} controls className="h-full w-full object-cover" />
            ) : (
              <Image
                src={valor}
                alt=""
                fill
                sizes="240px"
                className="object-cover"
              />
            )}
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-night/70 text-white hover:bg-night"
              title="Remover"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={enviando}
            className={`flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-ink/25 bg-sand-50 text-ink-muted transition-colors hover:border-brand hover:text-brand disabled:opacity-60 ${aspect}`}
          >
            {enviando ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : tipo === "video" ? (
              <FileVideo className="h-6 w-6" />
            ) : (
              <Upload className="h-6 w-6" />
            )}
            <span className="text-xs font-medium">
              {enviando
                ? "Enviando…"
                : tipo === "video"
                  ? "Enviar vídeo"
                  : "Enviar imagem"}
            </span>
          </button>
        )}

        <input
          ref={inputRef}
          type="file"
          accept={tipo === "video" ? "video/*" : "image/*"}
          onChange={aoSelecionar}
          className="hidden"
        />
      </div>
    </div>
  );
}
