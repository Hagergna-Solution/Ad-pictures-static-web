import Image from "next/image";
import { FILMS } from "@/lib/content";
import { StudioVideo } from "./StudioVideo";

export function Studio() {
  return (
    <section className="manifesto" id="studio">
      <div className="wrap">
        <div className="grid">
          <div>
            <span className="eyebrow">The Studio</span>
            <h2>
              Every frame is built <span className="red">before</span> the
              shutter ever opens.
            </h2>
            <p>
              We treat your day like a film — planned, lit, and crafted. From a
              single portrait to a three-day wedding, AD Pictures directs light,
              mood and story. Based at Bole Medhanialem, working across Ethiopia
              and beyond.
            </p>
            <div className="stat-row">
              <div className="stat">
                <div className="n">78K+</div>
                <div className="l">Community</div>
              </div>
              <div className="stat">
                <div className="n">3,600+</div>
                <div className="l">Stories told</div>
              </div>
              <div className="stat">
                <div className="n">10+</div>
                <div className="l">Years behind the lens</div>
              </div>
            </div>
          </div>
          <div className="portrait">
            <div className="rtone tone-warm">
              <span className="wm">
                <Image src="/assets/logo-mark.png" alt="" width={545} height={500} aria-hidden="true" />
              </span>
            </div>
            <StudioVideo src={FILMS[3].src} />
            <div className="rscrim" />
          </div>
        </div>
      </div>
    </section>
  );
}
