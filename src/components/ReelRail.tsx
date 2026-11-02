"use client";

import { useCallback, useState } from "react";
import type { Film } from "@/lib/content";
import { Rail } from "./Rail";
import { VideoCard } from "./VideoCard";
import { ReelViewer } from "./ReelViewer";

/** A rail of reel cards: hover previews muted, a click opens the full-screen player. */
export function ReelRail({
  films,
  id,
  eyebrow,
  title,
  sub,
  alt,
}: {
  films: Film[];
  id?: string;
  eyebrow: string;
  title: string;
  sub: string;
  alt?: boolean;
}) {
  const [open, setOpen] = useState<number | null>(null);
  const close = useCallback(() => setOpen(null), []);

  return (
    <>
      <Rail id={id} eyebrow={eyebrow} title={title} sub={sub} alt={alt}>
        {films.map((film, i) => (
          <VideoCard key={`${film.src}-${i}`} film={film} index={i} onOpen={() => setOpen(i)} />
        ))}
      </Rail>
      {open !== null && <ReelViewer films={films} index={open} onIndex={setOpen} onClose={close} />}
    </>
  );
}
