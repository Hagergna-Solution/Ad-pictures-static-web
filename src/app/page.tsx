import { FILMS, HERO_FILMS, RECENT_FILMS, stillsFor } from "@/lib/content";
import { Grain } from "@/components/Grain";
import { Loader } from "@/components/Loader";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { ReelRail } from "@/components/ReelRail";
import { StillsGallery } from "@/components/StillsGallery";
import { Studio } from "@/components/Studio";
import { Services } from "@/components/Services";
import { AcademyTeaser } from "@/components/AcademyTeaser";
import { Testimonials } from "@/components/Testimonials";
import { Faq } from "@/components/Faq";
import { BookingCTA } from "@/components/BookingCTA";
import { Footer } from "@/components/Footer";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";

export default function Home() {
  // Every photo, video and reel on the landing page comes from the static
  // asset domain (see R2_BASE in lib/content.ts).
  const portfolio = stillsFor();

  const featured = FILMS;
  const recent = RECENT_FILMS;

  return (
    <>
      <Grain />
      <Loader />
      <Nav />
      <Hero films={HERO_FILMS} />
      <Marquee />

      {featured.length > 0 && (
        <ReelRail
          id="films"
          films={featured}
          eyebrow="Featured Films"
          title="Recent reels."
          sub="Vertical, cinematic, made for the way people actually watch. Hover to preview, click to watch full screen."
        />
      )}

      <section className="rail-sec alt stills" id="work">
        <div className="rail-head">
          <div>
            <span className="eyebrow">The Contact Sheet</span>
            <h2>Stills.</h2>
            <p className="sub">Frames from recent weddings, events and portrait sessions. Click any photo to see it full screen.</p>
          </div>
        </div>
        <div className="stills-wrap">
          <StillsGallery items={portfolio} />
        </div>
      </section>

      <Studio />

      {recent.length > 0 && (
        <ReelRail
          films={recent}
          eyebrow="From the Edit Bay"
          title="More moments."
          sub="A rolling reel of weddings, send-offs and events, fresh from the timeline. Click to watch full screen."
        />
      )}

      <Services />
      <AcademyTeaser />
      <Testimonials />
      <Faq />
      <BookingCTA />
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
