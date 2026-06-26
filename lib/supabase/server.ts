/**
 * Cliente Supabase para o SERVIDOR (Server Components, Server Actions, Route
 * Handlers). Lê/grava a sessão nos cookies via @supabase/ssr.
 */
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export function criarClienteServer() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Chamado a partir de um Server Component (sem permissão de escrever
            // cookies). O middleware cuida de renovar a sessão — pode ignorar.
          }
        },
      },
    },
  );
}
