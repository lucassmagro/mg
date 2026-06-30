/**
 * Cliente Supabase para LEITURA PÚBLICA (Server Components das páginas do site).
 * Diferente de `criarClienteServer`, este NÃO lê cookies — por isso não força
 * renderização dinâmica, permitindo que as páginas públicas usem ISR (cache).
 * O RLS libera SELECT público (using true), então o anon key basta para ler.
 * Escrita e sessão do painel continuam no cliente com cookies (server.ts).
 */
import { createClient } from "@supabase/supabase-js";

export function criarClienteLeitura() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
