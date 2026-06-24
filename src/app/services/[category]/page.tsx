import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SERVICES, getServiceBySlug } from "@/lib/content";
import { getPortfolio } from "@/lib/api";
import { absoluteUrl } from "@/lib/site";
import { serviceSchema, breadcrumbSchema } from "@/lib/schema";
import { waLink } from "@/lib/whatsapp";
import { JsonLd } from "@/components/JsonLd";
import { Grain } from "@/components/Grain";
import { Nav } from "@/components/Nav";
import { PortfolioCard } from "@/components/PortfolioCard";
import { BookingCTA } from "@/components/BookingCTA";
import { Footer } from "@/components/Footer";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";

type Params = { category: string };

export function generateStaticParams(): Params[] {
  return SERVICES.map((s) => ({ category: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { category } = await params;
  const service = getServiceBySlug(category);
  if (!service) return {};
  const path = `/services/${category}`;
  return {
    // The "%s · AD Pictures" template in the root layout adds the brand.
    title: service.name,
    description: `${service.name} by AD Pictures, a wedding & event film studio in Addis Ababa, Ethiopia. ${service.blurb}`,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      title: `${service.name} · AD Pictures`,
      description: service.blurb,
      url: absoluteUrl(path),
    },
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { category } = await params;
  const service = getServiceBySlug(category);
  if (!service) notFound();

  // Pull the public portfolio gallery, filtered to this service's category.
  const photos = await getPortfolio(category);

  return (
    <>
      <JsonLd data={serviceSchema(service)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Services", path: "/#services" },
          { name: service.name, path: `/services/${category}` },
        ])}
      />
      <Grain />
      <Nav />
      <main className="detail">
        <header className="detail-head wrap">
          <Link className="back" href="/#services">
            ← All services
          </Link>
          <span className="eyebrow">{service.meta}</span>
          <h1>{service.name}</h1>
          <p className="lead">{service.blurb}</p>
        </header>

        <section className="wrap detail-body">
          {photos.length === 0 ? (
            <div className="media-empty">
              <p>New work for this category is on the way.</p>
              <a
                className="btn-ghost"
                href={waLink()}
                target="_blank"
                rel="noopener noreferrer"
              >
                Ask us what we have
              </a>
            </div>
          ) : (
            <div className="media-grid">
              {photos.map((item, i) => (
                <PortfolioCard key={`${item.title}-${i}`} item={item} index={i} />
              ))}
            </div>
          )}
        </section>
      </main>
      <BookingCTA />
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
