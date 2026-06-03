import type { Metadata } from "next";
import Link from "next/link";
import { site, absoluteUrl } from "@/lib/site";
import { breadcrumbSchema } from "@/lib/schema";
import { JsonLd } from "@/components/JsonLd";
import { Grain } from "@/components/Grain";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";

const UPDATED = "3 June 2026";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${site.name}, a wedding & event film studio in Addis Ababa, collects, uses and protects your personal information and footage.`,
  alternates: { canonical: "/privacy" },
  openGraph: {
    type: "website",
    title: `Privacy Policy · ${site.name}`,
    description: `How ${site.name} handles your personal information and footage.`,
    url: absoluteUrl("/privacy"),
  },
};

export default function PrivacyPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Privacy Policy", path: "/privacy" },
        ])}
      />
      <Grain />
      <Nav />
      <main className="detail">
        <header className="detail-head wrap">
          <Link className="back" href="/">
            ← Back home
          </Link>
          <span className="eyebrow">Legal</span>
          <h1>Privacy Policy</h1>
          <p className="lead">
            How we collect, use and protect your information — and the footage
            and photographs we capture for you.
          </p>
        </header>

        <section className="wrap detail-body legal">
          <p className="legal-meta">Last updated: {UPDATED}</p>

          <p>
            {site.legalName} (&ldquo;{site.name}&rdquo;, &ldquo;we&rdquo;,
            &ldquo;us&rdquo;) is a wedding and event film studio based at{" "}
            {site.address.street}, {site.address.locality}, Ethiopia. This policy
            explains what personal information we collect, how we use it, and the
            choices you have. By contacting us or booking a shoot, you agree to
            the practices described here.
          </p>

          <h2>Information we collect</h2>
          <ul>
            <li>
              <strong>Contact details</strong> you give us — name, phone number,
              email, event date and venue — when you message us on WhatsApp,
              email us or fill in an enquiry.
            </li>
            <li>
              <strong>Booking information</strong> — the services you request,
              package preferences and any notes you share to plan the shoot.
            </li>
            <li>
              <strong>Media we capture</strong> — the photographs and video we
              film at your wedding, event or session, which may include you,
              your guests and your venue.
            </li>
            <li>
              <strong>Basic site data</strong> — standard, anonymous information
              your browser sends (such as device and page views) if analytics is
              enabled, used only to understand and improve the website.
            </li>
          </ul>

          <h2>How we use your information</h2>
          <ul>
            <li>To respond to enquiries and provide quotes and availability.</li>
            <li>
              To plan, film, edit and deliver the photos and films you book.
            </li>
            <li>
              To arrange payment, scheduling and communication about your shoot.
            </li>
            <li>To keep records required for our business and tax purposes.</li>
          </ul>

          <h2>Your photographs and footage</h2>
          <p>
            We treat the images and films of your day with care. We will only
            use selected work in our portfolio, website or social media
            (for example Instagram and Facebook) with your permission. If you
            would prefer your photos and footage stay private, tell us at booking
            or any time afterwards and we will respect that. You can withdraw
            consent for future public use by contacting us — note that material
            already published elsewhere may take time to remove.
          </p>

          <h2>How we share information</h2>
          <p>
            We do not sell your personal information. We only share it where
            needed to deliver your work or run the studio — for example with
            trusted editors or crew on your project, payment providers, and
            storage or hosting services we use to back up and deliver your files.
            We may also disclose information where required by law.
          </p>

          <h2>Storage and retention</h2>
          <p>
            Your files are stored on secure cloud and local storage. We keep your
            contact and booking details, and your delivered media, for as long as
            needed to provide our service and meet legal obligations. You may ask
            us to delete your personal contact details once your project is
            complete.
          </p>

          <h2>Cookies and analytics</h2>
          <p>
            This website uses only essential functionality by default. If we
            enable analytics, it is used in aggregate to understand how the site
            is used and to improve it — not to identify you personally. You can
            block or delete cookies in your browser settings.
          </p>

          <h2>Your rights</h2>
          <p>
            You can ask us to access, correct or delete the personal information
            we hold about you, and to stop using your images publicly. To make a
            request, contact us using the details below and we will respond as
            soon as we reasonably can.
          </p>

          <h2>Children</h2>
          <p>
            Our services are arranged with adults. Where children appear in event
            or wedding footage, we rely on the consent of the parent, guardian or
            client who booked the shoot.
          </p>

          <h2>Changes to this policy</h2>
          <p>
            We may update this policy from time to time. The latest version will
            always be posted on this page with a revised date above.
          </p>

          <h2>Contact us</h2>
          <p>
            Questions about this policy or your information? Reach us at{" "}
            <a className="fl" href={`mailto:${site.email}`}>
              {site.email}
            </a>{" "}
            or on WhatsApp at +251 908 030 809. Studio: {site.address.street},{" "}
            {site.address.locality}, Ethiopia.
          </p>
        </section>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
