import { getPortfolio, getReels } from "@/lib/api";
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
  const [portfolio, reels] = await Promise.all([getPortfolio(), getReels()]);

  // Split the dynamic reels across the two rails; the hero rotates the first set.
  const featured = reels.slice(0, 4);
  const recent = reels.length > 4 ? reels.slice(4) : reels;

  return (
    <>
      <Grain />
      <Loader />
      <Nav />
      <Hero films={featured} />
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
