"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, MessageCircle } from "lucide-react";
import { marca, navLinks, whatsappLink } from "@/lib/config";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Histerese: liga em >24px, desliga só em <8px, para não "piscar" no limiar.
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled((s) => (s ? y > 8 : y > 24));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Fecha o menu mobile ao trocar de rota
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={`sticky top-0 z-50 border-b backdrop-blur-xl transition-all duration-300 ${
        scrolled
          ? "border-ink/10 bg-sand-50/75 shadow-card"
          : "border-transparent bg-sand-50/50"
      }`}
    >
      <div className="container-x flex h-20 items-center justify-between gap-4 lg:h-24">
        <Link
          href="/"
          aria-label={`${marca.nome} — página inicial`}
          className="inline-flex items-center"
        >
          <Image
            src="/logo/mark.svg"
            alt={marca.nome}
            width={130}
            height={114}
            priority
            unoptimized
            className="h-12 w-auto lg:h-16"
          />
        </Link>

        <nav
          aria-label="Navegação principal"
          className="hidden items-center gap-1 lg:flex"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                isActive(link.href)
                  ? "text-brand"
                  : "text-ink-soft hover:text-ink"
              }`}
            >
              {link.label}
              {isActive(link.href) && (
                <span className="absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full bg-accent-600" />
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={whatsappLink(
              "Olá! Vi o site e gostaria de mais informações.",
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp hidden px-5 py-2.5 sm:inline-flex"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            WhatsApp
          </a>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 text-ink lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      {open && (
        <div className="border-t border-ink/10 bg-sand-50/90 backdrop-blur-xl lg:hidden">
          <nav
            aria-label="Navegação principal"
            className="container-x flex flex-col gap-1 py-4"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`rounded-xl px-4 py-3 text-base font-medium ${
                  isActive(link.href)
                    ? "bg-accent-50 text-[#0d4185]"
                    : "text-ink-soft hover:bg-sand-100"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <a
              href={whatsappLink(
                "Olá! Vi o site e gostaria de mais informações.",
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp mt-2 w-full"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              Falar no WhatsApp
            </a>
            <p className="px-4 pt-2 text-xs text-ink-muted">
              {marca.telefone} · {marca.cidade} — {marca.uf}
            </p>
          </nav>
        </div>
      )}
    </header>
  );
}
