"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

/**
 * Mostra o cabeçalho/rodapé públicos em todo o site, EXCETO no painel /admin,
 * que tem o seu próprio shell. Evita mover as páginas para um route group.
 */
export default function SiteChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) return <>{children}</>;

  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
