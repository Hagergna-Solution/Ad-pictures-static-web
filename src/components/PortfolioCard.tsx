import type { PortfolioItem, Tone } from "@/lib/content";

// Rotate through the cinematic tones so cards without a resolved image still
// read as a deliberate contact sheet rather than empty frames.
const TONES: Tone[] = ["high", "warm", "cool", "low", "red"];

export function PortfolioCard({
  item,
  index,
}: {
  item: PortfolioItem;
  index: number;
}) {
  const tone = TONES[index % TONES.length];
  const tags = item.tags?.slice(0, 2).join(" · ");

  return (
    <article className="pcard">
      <div className={`tone tone-${tone}`}>
        <div className="gr" />
      </div>
      {item.url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="pfill" src={item.url} alt={item.title} loading="lazy" />
      )}
      <span className="num">{`·0${index + 1}`}</span>
      <div className="ov">
        <div className="t">{item.title}</div>
        <div className="row">
          {item.category && <span className="c">{item.category}</span>}
          {tags && <span className="x">{tags}</span>}
        </div>
      </div>
    </article>
  );
}
