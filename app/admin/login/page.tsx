"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Building2, Loader2 } from "lucide-react";
import { criarClienteBrowser } from "@/lib/supabase/client";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect") || "/admin";

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setCarregando(true);

    const supabase = criarClienteBrowser();
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: senha,
    });

    if (error) {
      setErro("E-mail ou senha incorretos.");
      setCarregando(false);
      return;
    }

    router.replace(redirect);
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-600 text-white">
            <Building2 className="h-6 w-6" />
          </span>
          <h1 className="mt-4 font-serif text-2xl font-semibold text-ink">
            Painel administrativo
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            Acesse para gerenciar os empreendimentos.
          </p>
        </div>

        <form
          onSubmit={entrar}
          className="space-y-4 rounded-2xl border border-ink/10 bg-surface p-6 shadow-card"
        >
          <div>
            <label className="label" htmlFor="email">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="field mt-1.5"
              placeholder="voce@exemplo.com"
            />
          </div>
          <div>
            <label className="label" htmlFor="senha">
              Senha
            </label>
            <input
              id="senha"
              type="password"
              autoComplete="current-password"
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="field mt-1.5"
              placeholder="••••••••"
            />
          </div>

          {erro && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {erro}
            </p>
          )}

          <button
            type="submit"
            disabled={carregando}
            className="btn-primary w-full justify-center disabled:opacity-60"
          >
            {carregando && <Loader2 className="h-4 w-4 animate-spin" />}
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
