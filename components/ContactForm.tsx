"use client";

import { toast } from "react-toastify";
import { Send } from "lucide-react";

/** Formulário de contato — apenas visual (protótipo, não envia dados). */
export default function ContactForm() {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.currentTarget.reset();
        toast.success(
          "Mensagem enviada! Responderemos no menor tempo possível.",
        );
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
          <option>Tenho interesse no Valley Business Center</option>
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
