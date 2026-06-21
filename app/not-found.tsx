import Link from "next/link";
import { Home, Building2 } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container-x flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="eyebrow">Erro 404</p>
      <h1 className="mt-3 font-serif text-4xl font-semibold text-ink sm:text-5xl">
        Página não encontrada
      </h1>
      <p className="mt-4 max-w-md text-ink-soft">
        O endereço que você acessou não existe ou pode ter sido movido. Que tal
        voltar e conhecer os nossos empreendimentos?
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn-outline">
          <Home className="h-4 w-4" />
          Voltar ao início
        </Link>
        <Link href="/empreendimentos" className="btn-primary">
          <Building2 className="h-4 w-4" />
          Ver empreendimentos
        </Link>
      </div>
    </div>
  );
}
