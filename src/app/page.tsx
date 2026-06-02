import { FILMS, RECENT_FILMS, STILLS } from "@/lib/content";
import { Grain } from "@/components/Grain";
import { Loader } from "@/components/Loader";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { Rail } from "@/components/Rail";
import { VideoCard } from "@/components/VideoCard";
import { StillCard } from "@/components/StillCard";
import { Studio } from "@/components/Studio";
import { Services } from "@/components/Services";
import { Testimonials } from "@/components/Testimonials";
import { Faq } from "@/components/Faq";
import { BookingCTA } from "@/components/BookingCTA";
import { Footer } from "@/components/Footer";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";

export default function Home() {
  return (
    <>
      <Grain />
      <Loader />
      <Nav />
      <Hero />
      <Marquee />

      <Rail
        id="films"
        eyebrow="Featured Films"
        title="Recent reels."
        sub="Vertical, cinematic, made for the way people actually watch. Hover or tap a reel to play."
      >
        {FILMS.map((film, i) => (
          <VideoCard key={film.title} film={film} index={i} />
        ))}
      </Rail>

      <Rail
        id="work"
        alt
        eyebrow="The Contact Sheet"
        title="Stills."
        sub="Drag your favourite AD Pictures photos onto any frame — they stay put."
      >
        {STILLS.map((still, i) => (
          <StillCard key={still.id} still={still} index={i} />
        ))}
      </Rail>

      <Studio />

      <Rail
        eyebrow="From the Edit Bay"
        title="More moments."
        sub="A rolling reel of weddings, send-offs and events — fresh from the timeline."
      >
        {RECENT_FILMS.map((film, i) => (
          <VideoCard key={`${film.title}-${i}`} film={film} index={i} />
        ))}
      </Rail>

      <Services />
      <Testimonials />
      <Faq />
      <BookingCTA />
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
