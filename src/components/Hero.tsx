"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { FILMS } from "@/lib/content";
import { waLink } from "@/lib/whatsapp";
import { MutedIcon, PlayIcon, SoundIcon, WhatsAppIcon } from "./icons";

const ROTATE_MS = 9000;

export function Hero() {
  const [idx, setIdx] = useState(0);
  const [wantSound, setWantSound] = useState(false);
  const [show, setShow] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const wantSoundRef = useRef(false);

  const film = FILMS[idx];

  // Swap the source when the active film changes — hard cut, no fade.
  // The element holds the previous frame until the next one decodes, so reels
  // connect straight into each other.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !wantSoundRef.current;
    video.src = film.src;
    video.play().catch(() => {});
  }, [film.src]);

  // Auto-advance every ROTATE_MS; resets whenever the index changes.
  useEffect(() => {
    const t = setTimeout(() => setIdx((i) => (i + 1) % FILMS.length), ROTATE_MS);
    return () => clearTimeout(t);
  }, [idx]);

  const toggleSound = useCallback(() => {
    const next = !wantSoundRef.current;
    wantSoundRef.current = next;
    setWantSound(next);
    const video = videoRef.current;
    if (video) {
      video.muted = !next;
      if (next) video.play().catch(() => {});
    }
  }, []);

  return (
    <header className="hero" id="top">
      <div className="herobg">
        <div className={`rtone tone-${film.tone}`} id="reelTone">
          <span className="wm">
            <Image src="/assets/logo-mark.png" alt="" width={545} height={500} aria-hidden="true" />
          </span>
        </div>
        <video
          ref={videoRef}
          className={show ? "show" : undefined}
          muted
          loop
          playsInline
          preload="auto"
          onLoadedData={() => setShow(true)}
        />
        <div className="hero-scrim" />
      </div>
      <span className="hero-cc tl" />
      <span className="hero-cc tr" />
      <span className="hero-cc bl" />
      <span className="hero-cc br" />

      <div className="hero-inner">
        <div className="hcopy">
          <div className="eyebrow-live">
            <span className="dot" />
            Now showing · Featured film
          </div>
          <h1>
            Your day.
            <br />
            In <span className="red">motion.</span>
          </h1>
          <p className="lead">
            AD Pictures is a wedding &amp; event film studio in Addis Ababa. We
            don&apos;t just record the day — we direct it, light it, and cut it
            like cinema.
          </p>
          <div className="cluster">
            <a
              className="btn-primary"
              href={waLink()}
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsAppIcon className="wa" />
              Book on WhatsApp
            </a>
            <a className="btn-ghost" href="#films">
              <PlayIcon />
              Watch the films
            </a>
          </div>
        </div>

        <div className="hero-bar">
          <div className="hb-left">
            <div className="now">
              <span>Now playing</span>
              <span className="nm">{film.title}</span>
              <span>·</span>
              <span className="ex">{film.exif}</span>
            </div>
            <div className="thumbs">
              {FILMS.map((f, i) => (
                <button
                  key={f.title}
                  className={`thumb tone-${f.tone}${i === idx ? " on" : ""}`}
                  aria-label={`Play ${f.title}`}
                  onClick={() => setIdx(i)}
                >
                  <span className="pn">{`0${i + 1}`}</span>
                </button>
              ))}
            </div>
          </div>
          <button
            className={`mute-btn${wantSound ? " on" : ""}`}
            aria-label="Toggle sound"
            onClick={toggleSound}
          >
            {wantSound ? <SoundIcon /> : <MutedIcon />}
          </button>
        </div>
      </div>

      <div className="scrollcue">
        <span>SCROLL</span>
        <span className="bar" />
      </div>
    </header>
  );
}
