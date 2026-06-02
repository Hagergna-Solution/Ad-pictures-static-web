const UNITS = Array.from({ length: 12 });

export function Marquee() {
  return (
    <div className="marquee">
      <div className="track">
        {UNITS.map((_, i) => (
          <span key={i}>
            Think <b className="dot">·</b> Imagine <b className="dot">·</b>{" "}
            <b className="fill">Create</b> <b className="dot">·</b>
          </span>
        ))}
      </div>
    </div>
  );
}
