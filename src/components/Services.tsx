import Link from "next/link";
import { SERVICES } from "@/lib/content";
import { ArrowIcon } from "./icons";

export function Services() {
  return (
    <section className="services alt" id="services">
      <div className="wrap">
        <span className="eyebrow">What we do</span>
        <div className="svc-list">
          {SERVICES.map((s, i) => (
            <Link key={s.slug} className="svc" href={`/services/${s.slug}`}>
              <span className="idx">{`0${i + 1}`}</span>
              <span className="nm">{s.name}</span>
              <span className="meta">{s.meta}</span>
              <span className="go">
                <ArrowIcon />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
