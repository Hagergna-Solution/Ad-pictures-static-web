"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import type { Film } from "@/lib/content";
import { PlayIcon } from "./icons";

export function VideoCard({ film, index }: { film: Film; index: number }) {
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
      onMouseEnter={start}
      onMouseLeave={stop}
      onClick={() => (playing ? stop() : start())}
    >
      <div className={`tone tone-${film.tone}`}>
        <div className="gr" />
        <div className="wm">
          <Image src="/assets/logo-mark.png" alt="" width={545} height={500} aria-hidden="true" />
        </div>
      </div>
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
