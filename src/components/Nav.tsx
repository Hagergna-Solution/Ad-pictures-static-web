"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { waLink } from "@/lib/whatsapp";
import { WhatsAppIcon } from "./icons";

const LINKS = [
  { href: "/#films", label: "Films" },
  { href: "/#work", label: "Stills" },
  { href: "/#studio", label: "Studio" },
  { href: "/#services", label: "Services" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav id="nav" className={scrolled ? "scrolled" : undefined}>
      <a className="brand" href="/">
        <Image src="/assets/logo-lockup.png" alt="AD Pictures" width={1090} height={590} priority />
      </a>
      <div className="links">
        {LINKS.map((l) => (
          <a className="lnk" key={l.href} href={l.href}>
            {l.label}
          </a>
        ))}
        <a
          className="book-btn"
          href={waLink()}
          target="_blank"
          rel="noopener noreferrer"
        >
          <WhatsAppIcon className="wa" />
          Book a Shoot
        </a>
      </div>
    </nav>
  );
}
