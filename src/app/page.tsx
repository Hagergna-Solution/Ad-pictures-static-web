import { getPortfolio } from "@/lib/api";
import { FILMS, HERO_FILMS, RECENT_FILMS } from "@/lib/content";
import { Grain } from "@/components/Grain";
import { Loader } from "@/components/Loader";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { Rail } from "@/components/Rail";
import { VideoCard } from "@/components/VideoCard";
import { PortfolioCard } from "@/components/PortfolioCard";
import { Studio } from "@/components/Studio";
import { Services } from "@/components/Services";
import { Testimonials } from "@/components/Testimonials";
import { Faq } from "@/components/Faq";
import { BookingCTA } from "@/components/BookingCTA";
import { Footer } from "@/components/Footer";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";

export default async function Home() {
  // The gallery (Stills) is the only backend-driven section; every video and
  // reel on the landing page comes from the static R2 assets.
  const portfolio = await getPortfolio();

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
        <Rail
          id="films"
          eyebrow="Featured Films"
          title="Recent reels."
          sub="Vertical, cinematic, made for the way people actually watch. Hover or tap a reel to play."
        >
          {featured.map((film, i) => (
            <VideoCard key={`${film.title}-${i}`} film={film} index={i} />
          ))}
        </Rail>
      )}

      <Rail
        id="work"
        alt
        eyebrow="The Contact Sheet"
        title="Stills."
        sub="A selection of frames from recent weddings, events and portrait sessions."
      >
        {portfolio.map((item, i) => (
          <PortfolioCard key={`${item.title}-${i}`} item={item} index={i} />
        ))}
      </Rail>

      <Studio />

      {recent.length > 0 && (
        <Rail
          eyebrow="From the Edit Bay"
          title="More moments."
          sub="A rolling reel of weddings, send-offs and events — fresh from the timeline."
        >
          {recent.map((film, i) => (
            <VideoCard key={`recent-${film.title}-${i}`} film={film} index={i} />
          ))}
        </Rail>
      )}

      <Services />
      <Testimonials />
      <Faq />
      <BookingCTA />
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
