import type { Metadata } from "next";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Instagram,
  MessageCircle,
} from "lucide-react";
import { marca, whatsappLink } from "@/lib/config";

export const metadata: Metadata = {
  title: "Contato",
  description:
    "Fale com a MG Incorporações: endereço, telefone, e-mail, WhatsApp e horário de atendimento.",
  alternates: { canonical: "/contato" },
};

export default function ContatoPage() {
  const mapaQuery = encodeURIComponent(
    `${marca.endereco}, ${marca.bairro}, ${marca.cidade} - ${marca.uf}`,
  );

  return (
    <div className="bg-sand-50">
      {/* Hero */}
      <section className="border-b border-ink/10 bg-surface">
        <div className="container-x py-14 lg:py-16">
          <p className="eyebrow">Fale com a gente</p>
          <h1 className="mt-3 font-serif text-4xl font-semibold leading-tight text-ink sm:text-5xl">
            Contato
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-ink-soft">
            Quer conhecer o Valley Business Center, receber plantas e condições
            ou falar sobre os próximos lançamentos? Estamos por aqui para
            conversar com você.
          </p>
        </div>
      </section>

      <div className="container-x py-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <InfoCard
            icon={MapPin}
            titulo="Endereço"
            linhas={[
              marca.endereco,
              marca.complemento,
              `${marca.bairro}, ${marca.cidade} — ${marca.uf}`,
              `CEP ${marca.cep}`,
            ]}
          />
          <InfoCard
            icon={Phone}
            titulo="Telefone"
            linhas={[marca.telefone, `WhatsApp ${marca.whatsappLabel}`]}
          />
          <InfoCard icon={Mail} titulo="E-mail" linhas={[marca.email]} />
          <InfoCard
            icon={Clock}
            titulo="Horário de atendimento"
            linhas={marca.horario.map((h) => `${h.dias}: ${h.horas}`)}
          />

          <div className="flex flex-col items-center justify-center rounded-2xl border border-ink/10 bg-surface p-6 text-center shadow-card md:col-span-2 lg:col-span-2">
            <p className="font-serif text-xl text-ink">
              Prefere falar agora?
            </p>
            <p className="mt-1 text-sm text-ink-soft">
              Chame nossa equipe no WhatsApp e receba o material do Valley
              Business Center.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <a
                href={whatsappLink("Olá! Gostaria de mais informações.")}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp px-7"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                Falar no WhatsApp
              </a>
              <a
                href={marca.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/15 text-ink-soft transition-colors hover:border-accent-600 hover:text-brand"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Mapa */}
      <section className="container-x pb-20">
        <div className="overflow-hidden rounded-2xl border border-ink/10">
          <iframe
            title={`Mapa da ${marca.nome}`}
            src={`https://maps.google.com/maps?q=${mapaQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
            width="100%"
            height="420"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="block"
          />
        </div>
      </section>
    </div>
  );
}

function InfoCard({
  icon: Icon,
  titulo,
  linhas,
}: {
  icon: React.ComponentType<{ className?: string }>;
  titulo: string;
  linhas: string[];
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-ink/10 bg-surface p-6 text-center shadow-card">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-600/10 text-brand">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <h3 className="font-semibold text-ink">{titulo}</h3>
        <div className="mt-1 space-y-0.5 text-sm text-ink-soft">
          {linhas.map((l) => (
            <p key={l}>{l}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
