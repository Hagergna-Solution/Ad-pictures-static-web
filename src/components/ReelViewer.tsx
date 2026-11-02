"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Film } from "@/lib/content";
import { useBodyLock, useSwipe } from "@/lib/useViewer";
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon, PauseIcon, PlayIcon, SoundOffIcon, SoundOnIcon } from "./icons";

/**
 * Full-screen reel player. Opens on the clicked reel with sound, goes
 * fullscreen where the browser allows it (an edge-to-edge overlay otherwise,
 * e.g. iPhone), and moves between reels with arrows, keys or swipes. A reel
 * that ends plays the next one.
 */
export function ReelViewer({
  films,
  index,
  onIndex,
  onClose,
}: {
  films: Film[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  const film = films[index];
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  const go = useCallback((step: number) => onIndex((index + step + films.length) % films.length), [index, films.length, onIndex]);
  const close = useCallback(() => {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    onClose();
  }, [onClose]);

  useBodyLock(true);

  // Fullscreen on open (still inside the click's user activation).
  useEffect(() => {
    const el = rootRef.current;
    el?.requestFullscreen?.()?.catch(() => {});
    el?.focus();
    // Leaving fullscreen with the browser's own Esc closes the viewer too.
    const onFs = () => {
      if (!document.fullscreenElement) onClose();
    };
    const t = setTimeout(() => document.addEventListener("fullscreenchange", onFs), 300);
    return () => {
      clearTimeout(t);
      document.removeEventListener("fullscreenchange", onFs);
    };
  }, [onClose]);

  // Start each reel from the top; fall back to muted if sound is blocked.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    setProgress(0);
    setPaused(false);
    v.currentTime = 0;
    v.muted = muted;
    v.play().catch(() => {
      v.muted = true;
      setMuted(true);
      v.play().catch(() => setPaused(true));
    });
    // muted is read once per reel on purpose
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().catch(() => {});
      setPaused(false);
    } else {
      v.pause();
      setPaused(true);
    }
  }, []);

  const toggleMute = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight" || e.key === "ArrowDown") go(1);
      else if (e.key === "ArrowLeft" || e.key === "ArrowUp") go(-1);
      else if (e.key === " ") {
        e.preventDefault();
        togglePlay();
      } else if (e.key.toLowerCase() === "m") toggleMute();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close, go, togglePlay, toggleMute]);

  const swipeRef = useSwipe<HTMLDivElement>({ left: () => go(1), up: () => go(1), right: () => go(-1), down: () => go(-1) });

  // Warm the next reel's still so swiping feels instant.
  const next = films[(index + 1) % films.length];
  useEffect(() => {
    if (next?.poster) new Image().src = next.poster;
  }, [next]);

  return (
    <div
      className="rv"
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${film.title} — reel ${index + 1} of ${films.length}`}
      tabIndex={-1}
    >
      {/* blurred poster behind the frame */}
      {film.poster && <div className="rv-bg" style={{ backgroundImage: `url(${film.poster})` }} aria-hidden="true" />}

      <div className="rv-stage" ref={swipeRef}>
        <video
          key={film.src}
          ref={videoRef}
          className="rv-video"
          src={film.src}
          poster={film.poster}
          playsInline
          preload="auto"
          onClick={togglePlay}
          onTimeUpdate={(e) => {
            const v = e.currentTarget;
            if (v.duration) setProgress(v.currentTime / v.duration);
          }}
          onEnded={() => go(1)}
        />
        {paused && (
          <button type="button" className="rv-bigplay" onClick={togglePlay} aria-label="Play">
            <PlayIcon />
          </button>
        )}
        <div className="rv-progress" aria-hidden="true">
          <span style={{ transform: `scaleX(${progress})` }} />
        </div>
        <div className="rv-caption">
          <span className="rv-count">
            {String(index + 1).padStart(2, "0")} / {String(films.length).padStart(2, "0")}
          </span>
          <h2>{film.title}</h2>
          <span className="rv-cat">{film.category}</span>
        </div>
      </div>

      <div className="rv-top">
        <button type="button" className="rv-btn" onClick={togglePlay} aria-label={paused ? "Play" : "Pause"}>
          {paused ? <PlayIcon /> : <PauseIcon />}
        </button>
        <button type="button" className="rv-btn" onClick={toggleMute} aria-label={muted ? "Turn sound on" : "Mute"}>
          {muted ? <SoundOffIcon /> : <SoundOnIcon />}
        </button>
        <button type="button" className="rv-btn" onClick={close} aria-label="Close">
          <CloseIcon />
        </button>
      </div>

      {films.length > 1 && (
        <>
          <button type="button" className="rv-nav prev" onClick={() => go(-1)} aria-label="Previous reel">
            <ChevronLeftIcon />
          </button>
          <button type="button" className="rv-nav next" onClick={() => go(1)} aria-label="Next reel">
            <ChevronRightIcon />
          </button>
        </>
      )}

    </div>
  );
}
