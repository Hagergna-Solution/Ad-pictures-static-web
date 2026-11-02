import type { Metadata } from "next";
import Link from "next/link";
import { site, absoluteUrl } from "@/lib/site";
import { COURSES, COURSE_FAQS, COURSE_WEEKS } from "@/lib/content";
import { breadcrumbSchema, courseListSchema, faqSchema } from "@/lib/schema";
import { JsonLd } from "@/components/JsonLd";
import { Grain } from "@/components/Grain";
import { Nav } from "@/components/Nav";
import { CourseRegistration } from "@/components/CourseRegistration";
import { Footer } from "@/components/Footer";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";

const DESCRIPTION = `Two-week basic masterclasses in wedding photography, videography and editing at ${site.name}, Bole Medhanialem, Addis Ababa. Register online in a minute.`;

export const metadata: Metadata = {
  title: "Masterclasses",
  description: DESCRIPTION,
  alternates: { canonical: "/courses" },
  openGraph: {
    type: "website",
    title: `Masterclasses · ${site.name}`,
    description: DESCRIPTION,
    url: absoluteUrl("/courses"),
  },
};

export default function CoursesPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Masterclasses", path: "/courses" },
        ])}
      />
      <JsonLd data={courseListSchema(COURSES, COURSE_WEEKS)} />
      <JsonLd data={faqSchema(COURSE_FAQS)} />
      <Grain />
      <Nav />
      <main className="academy">
        <header className="rg-head">
          <div className="rg-wrap">
            <Link className="rg-back" href="/">
              ← Home
            </Link>
            <span className="eyebrow">AD Pictures Academy</span>
            <h1>Masterclasses</h1>
            <p className="rg-lead">
              Learn wedding photography, videography and editing with our team. Pick your courses, leave your
              number and we will call you to confirm the details.
            </p>
            <ul className="rg-facts">
              <li>{COURSE_WEEKS} weeks per course</li>
              <li>Basic level, no experience needed</li>
              <li>Studio in Bole Medhanialem</li>
            </ul>
          </div>
        </header>

        <section className="rg-body" id="register" aria-label="Register for a masterclass">
          <div className="rg-wrap">
            <CourseRegistration />
          </div>
        </section>

        <section className="rg-faq" aria-labelledby="rg-faq-title">
          <div className="rg-wrap">
            <h2 id="rg-faq-title">Good to know</h2>
            <div className="faq-list">
              {COURSE_FAQS.map((f) => (
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
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
