"use client";

import { useEffect, useRef, useState } from "react";

export function StudioVideo({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const loadedRef = useRef(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            if (!loadedRef.current) {
              loadedRef.current = true;
              video.src = src;
            }
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [src]);

  return (
    <video
      ref={ref}
      className={show ? "show" : undefined}
      muted
      loop
      playsInline
      preload="none"
      onLoadedData={() => setShow(true)}
    />
  );
}
