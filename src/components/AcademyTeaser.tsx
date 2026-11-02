import Link from "next/link";
import { COURSES, COURSE_WEEKS } from "@/lib/content";
import { ArrowIcon } from "./icons";

/** Home-page band pointing to the masterclass registration page. */
export function AcademyTeaser() {
  return (
    <section className="ac-teaser" aria-labelledby="ac-teaser-title">
      <div className="wrap ac-teaser-in">
        <div>
          <span className="eyebrow">AD Pictures Academy</span>
          <h2 id="ac-teaser-title">
            Masterclasses. <span className="red">Now enrolling.</span>
          </h2>
          <p className="sub">
            {COURSE_WEEKS} weeks per masterclass · Basic course · Learn. Shoot. Edit. Create.
          </p>
        </div>
        <ol className="ac-teaser-list">
          {COURSES.map((c, i) => (
            <li key={c.code}>
              <Link href={`/courses?course=${c.code}#register`}>
                <span className="i">{String(i + 1).padStart(2, "0")}</span>
                <span className="t">{c.name}</span>
              </Link>
            </li>
          ))}
        </ol>
        <Link className="btn-primary" href="/courses">
          See the courses &amp; register
          <ArrowIcon className="ar" />
        </Link>
      </div>
    </section>
  );
}
