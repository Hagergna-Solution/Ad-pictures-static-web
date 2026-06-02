import { TESTIMONIALS } from "@/lib/content";
import { StarIcon } from "./icons";

export function Testimonials() {
  return (
    <section className="testi">
      <div className="wrap">
        <span className="eyebrow">In their words</span>
        <div className="tgrid">
          {TESTIMONIALS.map((t) => (
            <div className="tcard" key={t.name}>
              <div className="stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon key={i} />
                ))}
              </div>
              {/* Quote carries trusted inline <span class="red"> emphasis from our own content file. */}
              <p
                className="q"
                dangerouslySetInnerHTML={{ __html: `“${t.quote}”` }}
              />
              <div className="who">
                <div className="av">{t.avatar}</div>
                <div>
                  <div className="nm">{t.name}</div>
                  <div className="role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
