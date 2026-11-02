import Link from "next/link";
import { COURSES, COURSE_WEEKS } from "@/lib/content";
import { ArrowIcon } from "./icons";

/** Home-page band pointing to the masterclass registration page. */
export function AcademyTeaser() {
  return (
    <section className="rg-teaser" aria-labelledby="rg-teaser-title">
      <div className="wrap rg-teaser-in">
        <div>
          <span className="eyebrow">AD Pictures Academy</span>
          <h2 id="rg-teaser-title">Masterclasses are open</h2>
          <p>
            {COURSES.length} courses · {COURSE_WEEKS} weeks each · {COURSES.map((c) => c.name.replace("Wedding ", "")).join(", ")}
          </p>
        </div>
        <Link className="rg-btn" href="/courses">
          Register
          <ArrowIcon />
        </Link>
      </div>
    </section>
  );
}
