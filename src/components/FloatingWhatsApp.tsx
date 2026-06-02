import { waLink } from "@/lib/whatsapp";
import { WhatsAppIcon } from "./icons";

export function FloatingWhatsApp() {
  return (
    <a
      className="wa-float"
      href={waLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Book on WhatsApp"
    >
      <span className="ping" aria-hidden="true" />
      <WhatsAppIcon />
    </a>
  );
}
