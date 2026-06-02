import type { Still } from "@/lib/content";
import { ImageSlot } from "./ImageSlot";

export function StillCard({ still, index }: { still: Still; index: number }) {
  return (
    <article className="pcard">
      <div className={`tone tone-${still.tone}`}>
        <div className="gr" />
      </div>
      <ImageSlot id={still.id} placeholder={`Drop ${still.label.toLowerCase()} photo`} />
      <span className="num">{`·0${index + 1}`}</span>
      <div className="ov">
        <div className="t">{still.title}</div>
        <div className="row">
          <span className="c">{still.label}</span>
          <span className="x">{still.exif}</span>
        </div>
      </div>
    </article>
  );
}
