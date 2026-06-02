import { FAQS } from "@/lib/content";
import { faqSchema } from "@/lib/schema";
import { JsonLd } from "./JsonLd";

export function Faq() {
  return (
    <section className="faq" id="faq">
      <JsonLd data={faqSchema(FAQS)} />
      <div className="wrap">
        <span className="eyebrow">Good to know</span>
        <h2>Questions, answered.</h2>
        <div className="faq-list">
          {FAQS.map((f) => (
            <details className="faq-item" key={f.q}>
              <summary>
                <span className="q">{f.q}</span>
                <span className="mk" aria-hidden="true" />
              </summary>
              <p className="a">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
