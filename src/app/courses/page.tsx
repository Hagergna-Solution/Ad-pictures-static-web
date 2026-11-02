import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { site, absoluteUrl } from "@/lib/site";
import { COURSES, COURSE_FAQS, COURSE_LEVEL, COURSE_WEEKS, R2_BASE } from "@/lib/content";
import { breadcrumbSchema, courseListSchema, faqSchema } from "@/lib/schema";
import { JsonLd } from "@/components/JsonLd";
import { Grain } from "@/components/Grain";
import { Nav } from "@/components/Nav";
import { CourseRegistration } from "@/components/CourseRegistration";
import { Footer } from "@/components/Footer";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";

const TITLE = "Masterclasses: Wedding Photography & Videography Courses";
const DESCRIPTION = `Two-week basic masterclasses in wedding photography, videography and editing at ${site.name}, Bole Medhanialem, Addis Ababa. Register online in a minute.`;

export const metadata: Metadata = {
  title: TITLE,
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
        <header className="ac-hero">
          <Image
            className="ac-hero-bg"
            src={`${R2_BASE}/posters/img_1998-poster.jpg`}
            alt=""
            fill
            priority
            sizes="100vw"
            aria-hidden="true"
          />
          <div className="ac-hero-shade" aria-hidden="true" />
          <div className="wrap ac-hero-in">
            <Link className="back" href="/">
              ← Back home
            </Link>
            <span className="eyebrow">AD Pictures Academy · Think · Imagine · Create</span>
            <h1>
              Master<wbr />classes<span className="red">.</span>
            </h1>
            <p className="ac-tag">
              <span className="red">{COURSE_WEEKS} weeks</span> per masterclass · {COURSE_LEVEL}
            </p>
            <p className="ac-hero-lead">
              Learn wedding photography, videography and editing from the team behind 3,600+ stories. Small
              hands-on classes at our studio in Bole Medhanialem.
            </p>
            <div className="ac-hero-ctas">
              <a className="btn-primary" href="#register">
                Register now
              </a>
              <a className="btn-ghost" href="#masterclasses">
                See the courses
              </a>
            </div>
            <dl className="ac-facts">
              <div>
                <dt>Masterclasses</dt>
                <dd>{String(COURSES.length).padStart(2, "0")}</dd>
              </div>
              <div>
                <dt>Weeks each</dt>
                <dd>{String(COURSE_WEEKS).padStart(2, "0")}</dd>
              </div>
              <div>
                <dt>Level</dt>
                <dd>Basic</dd>
              </div>
              <div>
                <dt>Studio</dt>
                <dd>Bole</dd>
              </div>
            </dl>
          </div>
        </header>

        <CourseRegistration />

        <section className="faq ac-faq" id="faq">
          <div className="wrap">
            <span className="eyebrow">Good to know</span>
            <h2>Before you register.</h2>
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

        <p className="ac-motto wrap" aria-hidden="true">
          Learn. Shoot. Edit. <span className="red">Create.</span>
        </p>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
