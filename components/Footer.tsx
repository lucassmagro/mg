import Link from "next/link";
import {
  Instagram,
  Facebook,
  Linkedin,
  MapPin,
  Phone,
  Mail,
  MessageCircle,
} from "lucide-react";
import Logo from "./Logo";
import { marca, navLinks, whatsappLink } from "@/lib/config";

export default function Footer() {
  const ano = new Date().getFullYear();

  return (
    <footer className="mt-24 bg-accent-950 text-sand-100">
      <div className="container-x grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:pr-6">
          <div className="inline-flex rounded-2xl bg-white p-5">
            <Logo variant="dark" orientation="stacked" />
          </div>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-sand-100/70">
            {marca.descricaoCurta}
          </p>
          <div className="mt-6 flex items-center gap-3">
            <a
              href={marca.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-white/40 hover:text-white"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a
              href={marca.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-white/40 hover:text-white"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a
              href={marca.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-white/40 hover:text-white"
            >
              <Facebook className="h-5 w-5" />
            </a>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-white/40 hover:text-white"
            >
              <MessageCircle className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
            Navegação
          </h3>
          <ul className="mt-5 space-y-3 text-sm">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sand-100/75 transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
            Contato
          </h3>
          <ul className="mt-5 space-y-4 text-sm text-sand-100/75">
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent-300" />
              <span>
                {marca.endereco}
                <br />
                {marca.bairro}, {marca.cidade} — {marca.uf}
                <br />
                CEP {marca.cep}
              </span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="h-4 w-4 shrink-0 text-accent-300" />
              <span>{marca.telefone}</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="h-4 w-4 shrink-0 text-accent-300" />
              <a
                href={`mailto:${marca.email}`}
                className="transition-colors hover:text-white"
              >
                {marca.email}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
            Atendimento
          </h3>
          <ul className="mt-5 space-y-3 text-sm text-sand-100/75">
            {marca.horario.map((h) => (
              <li key={h.dias} className="flex justify-between gap-4">
                <span>{h.dias}</span>
                <span className="text-sand-100/90">{h.horas}</span>
              </li>
            ))}
          </ul>
          <a
            href={whatsappLink("Olá! Gostaria de falar com a equipe da MG Incorporações.")}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp mt-6 w-full"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            Falar no WhatsApp
          </a>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-3 py-6 text-xs text-sand-100/60 sm:flex-row">
          <p>
            © {ano} {marca.nome}. Todos os direitos reservados.
          </p>
          <p>
            CNPJ {marca.cnpj} · Imagens meramente ilustrativas. Projeto sujeito
            a alterações.
          </p>
        </div>
      </div>
    </footer>
  );
}
