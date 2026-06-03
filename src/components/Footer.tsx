import Image from "next/image";
import Link from "next/link";
import { waLink } from "@/lib/whatsapp";

export function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="fcols">
          <div>
            <Image
              className="flogo"
              src="/assets/logo-lockup.png"
              alt="AD Pictures"
              width={1090}
              height={590}
            />
            <p>Wedding &amp; event film studio. Think · Imagine · Create.</p>
          </div>
          <div>
            <div className="lab">Studio</div>
            <ul>
              <li>Bole Medhanialem</li>
              <li>Awlo Business Center, 3rd Floor</li>
              <li>Addis Ababa, Ethiopia</li>
            </ul>
          </div>
          <div>
            <div className="lab">Contact</div>
            <ul>
              <li className="mono">0908 030 809</li>
              <li className="mono">+251 988 130 030</li>
              <li>
                <a
                  className="fl"
                  href={waLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Book on WhatsApp
                </a>
              </li>
              <li>@adpictures_ethio</li>
            </ul>
          </div>
        </div>
        <div className="fbase">
          <span className="m">
            © 2026 AD PICTURES · ALL RIGHTS RESERVED ·{" "}
            <Link className="fl" href="/privacy">
              Privacy Policy
            </Link>
          </span>
          <div className="soc">
            <a
              href="https://instagram.com/adpictures_ethio"
              target="_blank"
              rel="noopener noreferrer"
            >
              IG
            </a>
            <a
              href="https://facebook.com/Adpicturesethio"
              target="_blank"
              rel="noopener noreferrer"
            >
              FB
            </a>
            <a href={waLink()} target="_blank" rel="noopener noreferrer">
              WA
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
