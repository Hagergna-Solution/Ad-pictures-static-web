import Link from "next/link";
import { Grain } from "@/components/Grain";
import { Nav } from "@/components/Nav";

export default function ServiceNotFound() {
  return (
    <>
      <Grain />
      <Nav />
      <main className="detail">
        <header className="detail-head wrap">
          <span className="eyebrow">404</span>
          <h1>No such service.</h1>
          <p className="lead">That category doesn&apos;t exist yet.</p>
          <Link className="back" href="/#services">
            ← All services
          </Link>
        </header>
      </main>
    </>
  );
}
