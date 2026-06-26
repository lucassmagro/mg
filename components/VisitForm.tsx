"use client";

import { toast } from "react-toastify";

/**
 * Formulário de interesse no empreendimento — apenas visual (protótipo).
 * Não envia dados; exibe uma confirmação simulada (toast) ao enviar.
 */
export default function VisitForm({ titulo }: { titulo: string }) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.currentTarget.reset();
        toast.success(
          "Solicitação enviada! Nossa equipe de vendas entrará em contato.",
        );
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
