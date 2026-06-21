"use client";

import { useState } from "react";
import { Check } from "lucide-react";

/**
 * Formulário de interesse no empreendimento — apenas visual (protótipo).
 * Não envia dados; exibe uma confirmação simulada ao enviar.
 */
export default function VisitForm({ titulo }: { titulo: string }) {
  const [enviado, setEnviado] = useState(false);

  if (enviado) {
    return (
      <div className="rounded-xl border border-accent-200 bg-accent-50 p-5 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent-600 text-white">
          <Check className="h-6 w-6" />
        </span>
        <p className="mt-3 font-serif text-lg text-ink">Solicitação enviada!</p>
        <p className="mt-1 text-sm text-ink-soft">
          Nossa equipe de vendas entrará em contato para apresentar o
          empreendimento e tirar suas dúvidas.
        </p>
        <button
          type="button"
          onClick={() => setEnviado(false)}
          className="mt-4 text-sm font-semibold text-accent-700 hover:text-accent-800"
        >
          Enviar nova solicitação
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setEnviado(true);
      }}
      className="space-y-3"
    >
      <p className="text-sm font-semibold text-ink">Receba a apresentação</p>
      <div>
        <label htmlFor="visita-nome" className="sr-only">
          Nome
        </label>
        <input
          id="visita-nome"
          type="text"
          required
          placeholder="Seu nome"
          className="field"
        />
      </div>
      <div>
        <label htmlFor="visita-tel" className="sr-only">
          Telefone
        </label>
        <input
          id="visita-tel"
          type="tel"
          required
          placeholder="Telefone / WhatsApp"
          className="field"
        />
      </div>
      <div>
        <label htmlFor="visita-msg" className="sr-only">
          Mensagem
        </label>
        <textarea
          id="visita-msg"
          rows={3}
          placeholder={`Tenho interesse no ${titulo}. Gostaria de receber mais informações.`}
          className="field resize-none"
        />
      </div>
      <button type="submit" className="btn-primary w-full">
        Quero saber mais
      </button>
      <p className="text-center text-xs text-ink-muted">
        Ao enviar, você concorda em ser contatado pela nossa equipe.
      </p>
    </form>
  );
}
