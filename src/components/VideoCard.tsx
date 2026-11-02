"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import type { Film } from "@/lib/content";
import { PlayIcon } from "./icons";

export function VideoCard({ film, index, onOpen }: { film: Film; index: number; onOpen?: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const loadedRef = useRef(false);
  const [playing, setPlaying] = useState(false);

  const start = () => {
    const video = videoRef.current;
    if (!video) return;
    if (!loadedRef.current) {
      loadedRef.current = true;
      video.src = film.src;
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
      className={`vcard${playing ? " playing" : ""}`}
      // Hover previews the reel silently; a click (or tap) opens it full screen.
      onMouseEnter={start}
      onMouseLeave={stop}
      onClick={() => {
        stop();
        if (onOpen) onOpen();
        else start();
      }}
      role={onOpen ? "button" : undefined}
      tabIndex={onOpen ? 0 : undefined}
      aria-label={onOpen ? `Play ${film.title} full screen` : undefined}
      onKeyDown={(e) => {
        if (onOpen && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onOpen();
        }
      }}
    >
      <div className={`tone tone-${film.tone}`}>
        <div className="gr" />
        <div className="wm">
          <Image src="/assets/logo-mark.png" alt="" width={545} height={500} aria-hidden="true" />
        </div>
      </div>
      {film.poster && (
        <Image
          className="poster"
          src={film.poster}
          alt={film.title}
          fill
          sizes="(max-width:680px) 60vw, 278px"
        />
      )}
      <video ref={videoRef} muted loop playsInline preload="none" />
      <div className="ov">
        <div className="top">
          <span className="pn">{`REEL · 0${index + 1}`}</span>
          <span className="play">
            <PlayIcon />
          </span>
        </div>
        <div className="bot">
          <div className="t">{film.title}</div>
          <div className="meta">
            <span className="c">{film.category}</span>
            <span className="x">{film.exif}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
