"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { PortfolioItem } from "@/lib/content";
import { useBodyLock, useSwipe } from "@/lib/useViewer";
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon } from "./icons";

const LABELS: Record<string, string> = {
  wedding: "Weddings",
  event: "Events",
  portrait: "Portraits",
  commercial: "Commercial",
  reels: "Reels",
};

function label(category?: string) {
  const c = (category ?? "").toLowerCase();
  return LABELS[c] ?? (c ? c[0].toUpperCase() + c.slice(1) : "");
}

/** Full-screen photo viewer with arrows, keys and swipes. */
function Lightbox({
  items,
  index,
  onIndex,
  onClose,
}: {
  items: PortfolioItem[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  const item = items[index];
  const go = useCallback((step: number) => onIndex((index + step + items.length) % items.length), [index, items.length, onIndex]);
  useBodyLock(true);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, onClose]);

  const swipeRef = useSwipe<HTMLDivElement>({ left: () => go(1), right: () => go(-1), down: onClose });
  // Preload the neighbours so arrows and swipes feel instant.
  useEffect(() => {
    for (const n of [items[(index + 1) % items.length], items[(index - 1 + items.length) % items.length]]) {
      if (n?.url) new Image().src = n.url;
    }
  }, [index, items]);

  return (
    <div className="lb" role="dialog" aria-modal="true" aria-label={`${item.title}, photo ${index + 1} of ${items.length}`}>
      <div className="lb-stage" ref={swipeRef} onClick={(e) => e.target === e.currentTarget && onClose()}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img key={item.url} className="lb-img" src={item.url} alt={item.title} />
      </div>
      <div className="lb-top">
        <span className="lb-count">
          {String(index + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
        </span>
        <button type="button" className="rv-btn" onClick={onClose} aria-label="Close" autoFocus>
          <CloseIcon />
        </button>
      </div>
      <div className="lb-caption">
        <strong>{item.title}</strong>
        {item.category && <span>{label(item.category)}</span>}
      </div>
      {items.length > 1 && (
        <>
          <button type="button" className="rv-nav prev" onClick={() => go(-1)} aria-label="Previous photo">
            <ChevronLeftIcon />
          </button>
          <button type="button" className="rv-nav next" onClick={() => go(1)} aria-label="Next photo">
            <ChevronRightIcon />
          </button>
        </>
      )}
    </div>
  );
}

/** Tile shape in the grid: the first photo is a 2×2 feature, landscapes span 2 columns. */
function shape(p: PortfolioItem, i: number): "feature" | "wide" | "tall" {
  const landscape = Boolean(p.width && p.height && p.width > p.height);
  if (i === 0 && !landscape) return "feature";
  return landscape ? "wide" : "tall";
}

const CELLS = { feature: 4, wide: 2, tall: 1 } as const;

/**
 * How many photos to show so the grid ends on complete rows (4 columns on
 * desktop, 2 on phones): at least `min` photos, then up to the next multiple of 4 cells.
 */
function fullRows(items: PortfolioItem[], min: number): number {
  let cells = 0;
  for (let i = 0; i < items.length; i += 1) {
    cells += CELLS[shape(items[i], i)];
    if (i + 1 >= min && cells % 4 === 0) return i + 1;
  }
  return items.length;
}

/**
 * Editorial grid: even row heights, a large feature tile, landscapes across
 * two columns; optional category filters, "show more", and a full-screen
 * viewer on click.
 */
export function StillsGallery({
  items,
  filters = true,
  initial = 12,
}: {
  items: PortfolioItem[];
  filters?: boolean;
  initial?: number;
}) {
  const photos = useMemo(() => items.filter((i) => Boolean(i.url)), [items]);
  const categories = useMemo(() => {
    const seen = new Set<string>();
    for (const p of photos) if (p.category) seen.add(p.category.toLowerCase());
    return [...seen];
  }, [photos]);

  const [cat, setCat] = useState("all");
  const [limit, setLimit] = useState(initial);
  const [open, setOpen] = useState<number | null>(null);
  const close = useCallback(() => setOpen(null), []);

  const shown = cat === "all" ? photos : photos.filter((p) => p.category?.toLowerCase() === cat);
  const visible = shown.slice(0, fullRows(shown, limit));

  return (
    <div className="sg">
      {filters && categories.length > 1 && (
        <div className="sg-filters" role="tablist" aria-label="Filter photos">
          {["all", ...categories].map((c) => {
            const n = c === "all" ? photos.length : photos.filter((p) => p.category?.toLowerCase() === c).length;
            return (
              <button
                key={c}
                type="button"
                role="tab"
                aria-selected={cat === c}
                className={`sg-chip${cat === c ? " on" : ""}`}
                onClick={() => {
                  setCat(c);
                  setLimit(initial);
                }}
              >
                {c === "all" ? "All" : label(c)}
                <span>{n}</span>
              </button>
            );
          })}
        </div>
      )}

      <div className="sg-grid">
        {visible.map((p, i) => (
          <button
            key={`${p.url}-${i}`}
            type="button"
            className={`sg-item ${shape(p, i)}`}
            onClick={() => setOpen(i)}
            aria-label={`Open ${p.title}`}
            style={{ animationDelay: `${Math.min(i, 11) * 40}ms` }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={p.url}
              alt={p.title}
              loading={i < 5 ? "eager" : "lazy"}
              decoding="async"
              style={p.focus ? { objectPosition: p.focus } : undefined}
            />
            <span className="sg-ov">
              <span className="sg-t">{p.title}</span>
              {p.category && <span className="sg-c">{label(p.category)}</span>}
            </span>
          </button>
        ))}
      </div>

      {shown.length > visible.length && (
        <div className="sg-more">
          <button type="button" className="btn-ghost" onClick={() => setLimit(visible.length + 8)}>
            Show more photos <span>({shown.length - visible.length})</span>
          </button>
        </div>
      )}

      {open !== null && <Lightbox items={visible} index={open} onIndex={setOpen} onClose={close} />}
    </div>
  );
}
