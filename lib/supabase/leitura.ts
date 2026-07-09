/**
 * Cliente Supabase para LEITURA PÚBLICA (Server Components das páginas do site).
 * Diferente de `criarClienteServer`, este NÃO lê cookies — por isso não força
 * renderização dinâmica, permitindo que as páginas públicas usem ISR (cache).
 * O RLS libera SELECT público (using true), então o anon key basta para ler.
 * Escrita e sessão do painel continuam no cliente com cookies (server.ts).
 *
 * `semCache`: usado pelo painel admin. O fetch do supabase-js pode ser
 * cacheado pelo Data Cache do Next mesmo em rotas `force-dynamic` (o cache é
 * por chamada de fetch, não por rota) — sem isso, o admin pode continuar
 * vendo dados antigos depois de salvar. Páginas públicas não passam essa opção
 * para preservar o ISR.
 */
import { createClient } from "@supabase/supabase-js";

export function criarClienteLeitura(opts?: { semCache?: boolean }) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: { persistSession: false, autoRefreshToken: false },
      global: opts?.semCache
        ? { fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }) }
        : undefined,
    },
  );
}
