/**
 * Cliente Supabase para o NAVEGADOR (componentes "use client").
 * Usa a chave pública (anon). A sessão é guardada em cookies pelo @supabase/ssr.
 */
import { createBrowserClient } from "@supabase/ssr";

export function criarClienteBrowser() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
