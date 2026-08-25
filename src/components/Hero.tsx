"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { FILMS as staticFilms, type Film } from "@/lib/content";
import { waLink } from "@/lib/whatsapp";
import { MutedIcon, PlayIcon, SoundIcon, WhatsAppIcon } from "./icons";

const ROTATE_MS = 9000;

/**
 * Enter a reel at its chosen in-point, so the hero opens on the shot the film
 * is actually about. Guarded: a clip shorter than its in-point just plays from
 * the top rather than seeking past its own end.
 */
function seekToStart(video: HTMLVideoElement, start?: number) {
  if (!start) return;
  const d = video.duration;
  if (Number.isFinite(d) && start < d - 1) video.currentTime = start;
}

export function Hero({ films: propFilms }: { films?: Film[] }) {
  // Drive the hero from dynamic reels when provided; otherwise the static set.
  const FILMS = propFilms?.length ? propFilms : staticFilms;
  const [idx, setIdx] = useState(0); // the reel we WANT on screen
  const [active, setActive] = useState(0); // layer currently shown: 0 = A, 1 = B
  const [wantSound, setWantSound] = useState(false);
  const [ready, setReady] = useState(false);
  const aRef = useRef<HTMLVideoElement>(null);
  const bRef = useRef<HTMLVideoElement>(null);
  const wantSoundRef = useRef(false);
  // Which film index each layer currently holds; -1 = empty.
  const layerFilm = useRef<[number, number]>([0, -1]);

  const film = FILMS[idx];

  // Load the first reel into layer A on mount, entering at its chosen in-point.
  useEffect(() => {
    const v = aRef.current;
    if (!v) return;
    v.muted = true;
    v.src = FILMS[0].src;
    const onReady = () => {
      seekToStart(v, FILMS[0].start);
      v.play().catch(() => {});
      setReady(true);
    };
    v.addEventListener("loadeddata", onReady, { once: true });
    return () => v.removeEventListener("loadeddata", onReady);
  }, []);

  // Double-buffered swap. `idx` is the single source of truth: when it changes,
  // decode that reel in the hidden layer first, then reveal it instantly (no
  // fade) and pause the old one — so there's never a blank frame and the reels
  // read as one continuous video. If idx changes again mid-load, the cleanup
  // cancels the stale reveal, so overlapping auto-rotate + clicks never desync.
  useEffect(() => {
    if (!ready) return;
    if (layerFilm.current[active] === idx) return; // already on screen
    const inactive = active === 0 ? 1 : 0;
    const incoming = (inactive === 0 ? aRef : bRef).current;
    const outgoing = (active === 0 ? aRef : bRef).current;
    if (!incoming) return;

    let cancelled = false;
    incoming.muted = !wantSoundRef.current;
    incoming.src = FILMS[idx].src;
    const reveal = () => {
      if (cancelled) return;
      layerFilm.current[inactive] = idx;
      seekToStart(incoming, FILMS[idx].start);
      incoming.play().catch(() => {});
      setActive(inactive);
      outgoing?.pause();
    };
    incoming.addEventListener("loadeddata", reveal, { once: true });
    incoming.load();
    return () => {
      cancelled = true;
      incoming.removeEventListener("loadeddata", reveal);
    };
  }, [idx, ready, active]);

  // Auto-advance every ROTATE_MS once the first reel is ready.
  useEffect(() => {
    if (!ready) return;
    const t = setTimeout(
      () => setIdx((i) => (i + 1) % FILMS.length),
      ROTATE_MS
    );
    return () => clearTimeout(t);
  }, [idx, ready]);

  const toggleSound = useCallback(() => {
    const next = !wantSoundRef.current;
    wantSoundRef.current = next;
    setWantSound(next);
    const video = (active === 0 ? aRef : bRef).current;
    if (video) {
      video.muted = !next;
      if (next) video.play().catch(() => {});
    }
  }, [active]);

  // Each layer keeps the focal point of the reel it currently holds, so the
  // crop follows the footage through a dissolve instead of snapping.
  const focusOf = (layer: 0 | 1) => {
    const i = layerFilm.current[layer];
    const f = i >= 0 && i < FILMS.length ? FILMS[i] : undefined;
    return f?.focus ? { objectPosition: f.focus } : undefined;
  };

  return (
    <header className="hero" id="top">
      <div className="herobg">
        <div className={`rtone tone-${film.tone}`} id="reelTone">
          <span className="wm">
            <Image src="/assets/logo-mark.png" alt="" width={545} height={500} aria-hidden="true" />
          </span>
        </div>
        {film.poster && (
          <Image
            className="herobg-poster"
            src={film.poster}
            alt=""
            aria-hidden="true"
            fill
            priority
            sizes="100vw"
            style={film.focus ? { objectPosition: film.focus } : undefined}
          />
        )}
        <video
          ref={aRef}
          className={ready && active === 0 ? "show" : undefined}
          style={focusOf(0)}
          muted
          loop
          playsInline
          preload="auto"
        />
        <video
          ref={bRef}
          className={ready && active === 1 ? "show" : undefined}
          style={focusOf(1)}
          muted
          loop
          playsInline
          preload="auto"
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
