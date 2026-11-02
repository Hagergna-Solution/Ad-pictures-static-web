"use client";

import { useEffect, useRef } from "react";

/** Freeze page scroll while an overlay is open. */
export function useBodyLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prev;
    };
  }, [active]);
}

type Swipe = { left?: () => void; right?: () => void; up?: () => void; down?: () => void };

/** Touch swipes on an element: left/right/up/down after a 50px drag. */
export function useSwipe<T extends HTMLElement>(handlers: Swipe) {
  const ref = useRef<T>(null);
  const h = useRef(handlers);
  h.current = handlers;
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let x = 0;
    let y = 0;
    const start = (e: TouchEvent) => {
      x = e.touches[0].clientX;
      y = e.touches[0].clientY;
    };
    const end = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - x;
      const dy = e.changedTouches[0].clientY - y;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 50) return;
      if (Math.abs(dx) > Math.abs(dy)) (dx < 0 ? h.current.left : h.current.right)?.();
      else (dy < 0 ? h.current.up : h.current.down)?.();
    };
    el.addEventListener("touchstart", start, { passive: true });
    el.addEventListener("touchend", end, { passive: true });
    return () => {
      el.removeEventListener("touchstart", start);
      el.removeEventListener("touchend", end);
    };
  }, []);
  return ref;
}
