"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import type { MediaItem, Tone } from "@/lib/content";
import { isFilm } from "@/lib/content";
import { PlayIcon } from "./icons";

const TONES: Tone[] = ["warm", "cool", "red", "high", "low"];

export function MediaCard({ item, index }: { item: MediaItem; index: number }) {
  const tone = TONES[index % TONES.length];
  const film = isFilm(item);
  const videoRef = useRef<HTMLVideoElement>(null);
  const loadedRef = useRef(false);
  const [playing, setPlaying] = useState(false);

  const playable = film && Boolean(item.url);

  const start = () => {
    const video = videoRef.current;
    if (!video || !item.url) return;
    if (!loadedRef.current) {
      loadedRef.current = true;
      video.src = item.url;
    }
    video.play().catch(() => {});
    setPlaying(true);
  };

  const stop = () => {
    videoRef.current?.pause();
    setPlaying(false);
  };

  return (
    <article
      className={`mcard${playing ? " playing" : ""}${playable ? " playable" : ""}`}
      onMouseEnter={playable ? start : undefined}
      onMouseLeave={playable ? stop : undefined}
      onClick={playable ? () => (playing ? stop() : start()) : undefined}
    >
      <div className={`tone tone-${tone}`}>
        <div className="gr" />
        <div className="wm">
          <Image src="/assets/logo-mark.png" alt="" width={545} height={500} aria-hidden="true" />
        </div>
      </div>

      {item.url && !film && (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="mfill" src={item.url} alt={item.title} loading="lazy" />
      )}
      {film && <video ref={videoRef} muted loop playsInline preload="none" />}

      <div className="ov">
        <div className="top">
          <span className="pn">{item.type.toUpperCase()}</span>
          {film && (
            <span className="play">
              <PlayIcon />
            </span>
          )}
        </div>
        <div className="bot">
          <div className="t">{item.title}</div>
          {item.description && <div className="d">{item.description}</div>}
        </div>
      </div>
    </article>
  );
}
