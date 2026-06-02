import { site, absoluteUrl } from "./site";
import type { Service } from "./content";

type Json = Record<string, unknown>;

const ORG_ID = `${site.url}/#organization`;
const WEBSITE_ID = `${site.url}/#website`;

/**
 * The business as a LocalBusiness (a subtype of Organization), so it doubles as
 * the brand entity. `@id` lets other nodes reference it instead of repeating it.
 */
function localBusiness(): Json {
  return {
    "@type": ["LocalBusiness", "ProfessionalService"],
    "@id": ORG_ID,
    name: site.name,
    legalName: site.legalName,
    url: site.url,
    description: site.description,
    slogan: site.slogan,
    image: absoluteUrl("/assets/logo-lockup.png"),
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/assets/logo-lockup.png"),
      width: 1090,
      height: 590,
    },
    telephone: site.phones[0],
    email: site.email,
    priceRange: site.priceRange,
    foundingDate: site.foundingYear,
    knowsLanguage: site.inLanguage,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.locality,
      addressRegion: site.address.region,
      addressCountry: site.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.geo.lat,
      longitude: site.geo.lng,
    },
    areaServed: site.areaServed.map((name) => ({ "@type": "Place", name })),
    openingHours: site.openingHours,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: site.phones[0],
      contactType: "customer service",
      areaServed: site.address.country,
      availableLanguage: ["English", "Amharic"],
    },
    sameAs: site.sameAs,
  };
}

function website(): Json {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: site.url,
    name: site.name,
    description: site.description,
    inLanguage: site.inLanguage,
    publisher: { "@id": ORG_ID },
  };
}

/** Sitewide graph: the business entity + the website that publishes it. */
export function siteGraph(): Json {
  return {
    "@context": "https://schema.org",
    "@graph": [localBusiness(), website()],
  };
}

export function serviceSchema(service: Service): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    serviceType: service.name,
    description: service.blurb,
    url: absoluteUrl(`/services/${service.slug}`),
    provider: { "@id": ORG_ID },
    areaServed: site.areaServed.map((name) => ({ "@type": "Place", name })),
  };
}

export function breadcrumbSchema(
  items: { name: string; path: string }[],
): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqSchema(faqs: { q: string; a: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
