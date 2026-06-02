"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "./icons";

interface RailProps {
  eyebrow: string;
  title: string;
  sub: string;
  children: ReactNode;
  id?: string;
  alt?: boolean;
}

export function Rail({ eyebrow, title, sub, children, id, alt }: RailProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const update = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    setAtStart(rail.scrollLeft < 8);
    setAtEnd(rail.scrollLeft + rail.clientWidth > rail.scrollWidth - 8);
  }, []);

  useEffect(() => {
    update();
    const rail = railRef.current;
    if (!rail) return;
    rail.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      rail.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  const scroll = (dir: 1 | -1) => {
    const rail = railRef.current;
    if (!rail) return;
    const amount = Math.max(rail.clientWidth * 0.8, 280);
    rail.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  return (
    <section className={`rail-sec${alt ? " alt" : ""}`} id={id}>
      <div className="rail-head">
        <div>
          <span className="eyebrow">{eyebrow}</span>
          <h2>{title}</h2>
          <p className="sub">{sub}</p>
        </div>
        <div className="rail-nav">
          <button onClick={() => scroll(-1)} disabled={atStart} aria-label="Previous">
            <ChevronLeftIcon />
          </button>
          <button onClick={() => scroll(1)} disabled={atEnd} aria-label="Next">
            <ChevronRightIcon />
          </button>
        </div>
      </div>
      <div className="rail" ref={railRef}>
        {children}
      </div>
    </section>
  );
}
