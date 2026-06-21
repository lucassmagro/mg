"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

/** Alterna entre tema claro e escuro, persistindo a escolha em localStorage. */
export default function ThemeToggle({
  className = "",
}: {
  className?: string;
}) {
  const [dark, setDark] = useState(false);
  const [montado, setMontado] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
    setMontado(true);
  }, []);

  function alternar() {
    const novo = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", novo);
    try {
      localStorage.setItem("theme", novo ? "dark" : "light");
    } catch {}
    setDark(novo);
  }

  return (
    <button
      type="button"
      onClick={alternar}
      aria-label={dark ? "Ativar tema claro" : "Ativar tema escuro"}
      title={dark ? "Tema claro" : "Tema escuro"}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 text-ink-soft transition-colors hover:text-ink ${className}`}
    >
      {/* evita flash de ícone errado antes de montar */}
      {montado && dark ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </button>
  );
}
