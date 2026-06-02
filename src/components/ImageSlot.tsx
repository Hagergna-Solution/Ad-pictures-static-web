"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type DragEvent,
} from "react";

const ACCEPT = ["image/png", "image/jpeg", "image/webp", "image/avif"];
const MAX_DIM = 1200;
const storageKey = (id: string) => `adp-slot:${id}`;

// Re-encode through a canvas so the persisted bytes are downscaled (longest
// side capped at 2× the slot width and at MAX_DIM), keeping localStorage small.
async function toDataUrl(file: File, targetW: number): Promise<string> {
  const bitmap = await createImageBitmap(file);
  try {
    const cap = Math.min(MAX_DIM, Math.max(1, Math.round(targetW * 2)) || MAX_DIM);
    const scale = Math.min(1, cap / Math.max(bitmap.width, bitmap.height));
    const w = Math.max(1, Math.round(bitmap.width * scale));
    const h = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    canvas.getContext("2d")?.drawImage(bitmap, 0, 0, w, h);
    return canvas.toDataURL("image/webp", 0.85);
  } finally {
    bitmap.close?.();
  }
}

export function ImageSlot({ id, placeholder }: { id: string; placeholder: string }) {
  const [url, setUrl] = useState<string | null>(null);
  const [over, setOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const depthRef = useRef(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey(id));
      if (stored) setUrl(stored);
    } catch {
      /* storage unavailable — slot stays read-only for the session */
    }
  }, [id]);

  useEffect(() => {
    if (!error) return;
    const t = setTimeout(() => setError(null), 3000);
    return () => clearTimeout(t);
  }, [error]);

  const ingest = useCallback(
    async (file: File | undefined) => {
      setError(null);
      if (!file || ACCEPT.indexOf(file.type) < 0) {
        setError("Drop a PNG, JPEG, WebP, or AVIF image.");
        return;
      }
      try {
        const width = rootRef.current?.clientWidth || MAX_DIM;
        const dataUrl = await toDataUrl(file, width);
        setUrl(dataUrl);
        try {
          localStorage.setItem(storageKey(id), dataUrl);
        } catch {
          /* over quota — keep the session copy anyway */
        }
      } catch {
        setError("Could not read that image.");
      }
    },
    [id],
  );

  const clear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setUrl(null);
    try {
      localStorage.removeItem(storageKey(id));
    } catch {
      /* ignore */
    }
  };

  const onDragEnter = (e: DragEvent) => {
    e.preventDefault();
    depthRef.current += 1;
    setOver(true);
  };
  const onDragOver = (e: DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer) e.dataTransfer.dropEffect = "copy";
  };
  const onDragLeave = () => {
    depthRef.current -= 1;
    if (depthRef.current <= 0) {
      depthRef.current = 0;
      setOver(false);
    }
  };
  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    depthRef.current = 0;
    setOver(false);
    ingest(e.dataTransfer?.files?.[0]);
  };

  return (
    <div
      ref={rootRef}
      className="slot"
      data-over={over ? "" : undefined}
      data-filled={url ? "" : undefined}
      onDragEnter={onDragEnter}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={() => {
        if (!url) inputRef.current?.click();
      }}
    >
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="" draggable={false} />
      ) : (
        <div className="slot-empty">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="m21 15-5-5L5 21" />
          </svg>
          <div className="cap">{placeholder}</div>
          <div className="sub">or browse files</div>
        </div>
      )}
      <div className="slot-ring" />
      {url && (
        <div className="slot-ctl">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              inputRef.current?.click();
            }}
          >
            Replace
          </button>
          <button type="button" onClick={clear}>
            Remove
          </button>
        </div>
      )}
      {error && (
        <div
          style={{
            position: "absolute",
            left: 8,
            bottom: 8,
            right: 8,
            color: "#fff",
            background: "rgba(179,38,30,.9)",
            fontSize: 11,
            padding: "4px 6px",
            borderRadius: 5,
            pointerEvents: "none",
            zIndex: 6,
          }}
        >
          {error}
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT.join(",")}
        hidden
        onChange={(e) => {
          ingest(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
    </div>
  );
}
