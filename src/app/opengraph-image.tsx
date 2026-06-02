import { ImageResponse } from "next/og";

export const alt =
  "AD Pictures — Wedding & Event Films in Addis Ababa, Ethiopia";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "radial-gradient(120% 120% at 78% 8%, #3a0c10 0%, #140607 46%, #0A0A0A 100%)",
          padding: "76px 84px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            color: "#FF2A2E",
            fontSize: 25,
            fontWeight: 700,
            letterSpacing: 7,
          }}
        >
          <div style={{ width: 56, height: 3, background: "#ED1C24", display: "flex" }} />
          WEDDING &amp; EVENT FILM STUDIO
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 158,
              fontWeight: 800,
              color: "#FFFFFF",
              lineHeight: 1,
              letterSpacing: -5,
            }}
          >
            AD PICTURES<span style={{ color: "#ED1C24" }}>.</span>
          </div>
          <div style={{ display: "flex", marginTop: 30, fontSize: 35, color: "#C9C9C9" }}>
            Addis Ababa, Ethiopia&nbsp;&nbsp;·&nbsp;&nbsp;Think · Imagine · Create.
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
