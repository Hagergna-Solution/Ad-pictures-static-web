"use client";

import { useMemo, useState } from "react";
import type { MediaItem } from "@/lib/content";
import { isFilm } from "@/lib/content";
import { waLink } from "@/lib/whatsapp";
import { MediaCard } from "./MediaCard";

type Filter = "all" | "film" | "image";

export function MediaGallery({ items }: { items: MediaItem[] }) {
  const [filter, setFilter] = useState<Filter>("all");

  const films = useMemo(() => items.filter(isFilm), [items]);
  const photos = useMemo(() => items.filter((m) => m.type === "image"), [items]);

  const shown = filter === "all" ? items : filter === "film" ? films : photos;

  if (items.length === 0) {
    return (
      <div className="media-empty">
        <p>New work for this category is on the way.</p>
        <a className="btn-ghost" href={waLink()} target="_blank" rel="noopener noreferrer">
          Ask us what we have
        </a>
      </div>
    );
  }

  const tabs: { id: Filter; label: string; count: number }[] = [
    { id: "all", label: "All", count: items.length },
    { id: "film", label: "Films", count: films.length },
    { id: "image", label: "Photos", count: photos.length },
  ];

  return (
    <>
      <div className="media-tabs" role="tablist" aria-label="Filter media">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={filter === t.id}
            className={`media-tab${filter === t.id ? " on" : ""}`}
            onClick={() => setFilter(t.id)}
            disabled={t.count === 0}
          >
            {t.label}
            <span className="ct">{t.count}</span>
          </button>
        ))}
      </div>

      <div className="media-grid">
        {shown.map((item, i) => (
          <MediaCard key={item._id ?? item.key} item={item} index={i} />
        ))}
      </div>
    </>
  );
}
