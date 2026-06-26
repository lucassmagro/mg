"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { LogOut, Building2 } from "lucide-react";
import { criarClienteBrowser } from "@/lib/supabase/client";

/**
 * Barra superior do painel. Oculta na tela de login. Permite sair da sessão.
 */
export default function AdminTopbar() {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/admin/login") return null;

  async function sair() {
    const supabase = criarClienteBrowser();
    await supabase.auth.signOut();
    toast.success("Sessão encerrada.");
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-30 border-b border-ink/10 bg-surface">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link
          href="/admin"
          className="flex items-center gap-2 font-serif text-lg font-semibold text-ink"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-600 text-white">
            <Building2 className="h-4 w-4" />
          </span>
          Painel · MG Incorporações
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="hidden text-sm font-medium text-ink-muted hover:text-brand sm:inline"
          >
            Ver site
          </Link>
          <button
            type="button"
            onClick={sair}
            className="inline-flex items-center gap-1.5 rounded-lg border border-ink/15 px-3 py-1.5 text-sm font-medium text-ink-soft transition-colors hover:bg-sand-100"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </div>
      </div>
    </header>
  );
}
