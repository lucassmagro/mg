import { MessageCircle } from "lucide-react";
import { whatsappLink } from "@/lib/config";

/** Botão flutuante de WhatsApp, fixo no canto inferior direito. */
export default function FloatingWhatsApp() {
  return (
    <a
      href={whatsappLink("Olá! Vim pelo site e gostaria de mais informações.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Conversar no WhatsApp"
      className="group fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-accent-600 text-white shadow-[0_10px_30px_-8px_rgba(15,78,159,0.6)] transition-[width,background-color] duration-300 hover:bg-accent-700 sm:bottom-7 sm:right-7 sm:hover:w-[190px] sm:hover:justify-start sm:hover:pl-[15px]"
    >
      <MessageCircle className="h-7 w-7 shrink-0" aria-hidden="true" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold opacity-0 transition-all duration-300 group-hover:ml-2.5 group-hover:max-w-[130px] group-hover:opacity-100">
        Fale conosco
      </span>
    </a>
  );
}
