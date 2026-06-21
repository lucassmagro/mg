"use client";

import { useState } from "react";
import { Check, Send } from "lucide-react";

/** Formulário de contato — apenas visual (protótipo, não envia dados). */
export default function ContactForm() {
  const [enviado, setEnviado] = useState(false);

  if (enviado) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-accent-200 bg-accent-50 px-6 py-16 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-600 text-white">
          <Check className="h-7 w-7" />
        </span>
        <h3 className="mt-4 font-serif text-xl text-ink">
          Mensagem enviada com sucesso!
        </h3>
        <p className="mt-2 max-w-sm text-sm text-ink-soft">
          Obrigado pelo contato. Nossa equipe responderá no menor tempo
          possível, normalmente no mesmo dia útil.
        </p>
        <button
          type="button"
          onClick={() => setEnviado(false)}
          className="mt-5 text-sm font-semibold text-accent-700 hover:text-accent-800"
        >
          Enviar outra mensagem
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
      className="space-y-4"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="nome" className="label">
            Nome
          </label>
          <input
            id="nome"
            type="text"
            required
            placeholder="Seu nome completo"
            className="field"
          />
        </div>
        <div>
          <label htmlFor="telefone" className="label">
            Telefone / WhatsApp
          </label>
          <input
            id="telefone"
            type="tel"
            required
            placeholder="(49) 99999-0000"
            className="field"
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="label">
          E-mail
        </label>
        <input
          id="email"
          type="email"
          required
          placeholder="voce@email.com"
          className="field"
        />
      </div>

      <div>
        <label htmlFor="assunto" className="label">
          Assunto
        </label>
        <select
          id="assunto"
          className="field appearance-none bg-[length:16px] bg-[right_1rem_center] bg-no-repeat pr-10"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b6b63' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")",
          }}
        >
          <option>Tenho interesse no Valley Business</option>
          <option>Quero receber plantas e valores</option>
          <option>Próximos lançamentos</option>
          <option>Sou corretor / parceria</option>
          <option>Outro assunto</option>
        </select>
      </div>

      <div>
        <label htmlFor="mensagem" className="label">
          Mensagem
        </label>
        <textarea
          id="mensagem"
          rows={5}
          required
          placeholder="Conte como podemos ajudar você."
          className="field resize-none"
        />
      </div>

      <button type="submit" className="btn-primary w-full sm:w-auto sm:px-8">
        <Send className="h-4 w-4" aria-hidden="true" />
        Enviar mensagem
      </button>
    </form>
  );
}
