import Image from "next/image";
import { waLink } from "@/lib/whatsapp";
import { WhatsAppIcon } from "./icons";

export function BookingCTA() {
  return (
    <section className="cta" id="book">
      <Image
        className="ring"
        src="/assets/logo-mark.png"
        alt=""
        width={545}
        height={500}
        aria-hidden="true"
      />
      <div className="wrap">
        <span className="eyebrow">Book the light</span>
        <h2>
          Got a date?
          <br />
          <span className="red">Let&apos;s film it.</span>
        </h2>
        <p className="lead">
          Tell us about your day on WhatsApp and we&apos;ll send availability,
          packages and a quote — usually within the hour.
        </p>
        <a
          className="big-btn"
          href={waLink()}
          target="_blank"
          rel="noopener noreferrer"
        >
          <WhatsAppIcon className="wa" />
          Message us on WhatsApp
        </a>
        <div className="phones">
          <span className="red">0908 030 809</span> &nbsp;·&nbsp; +251 988 130 030
        </div>
      </div>
    </section>
  );
}
