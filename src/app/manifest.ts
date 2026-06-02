import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AD Pictures — Wedding & Event Films",
    short_name: "AD Pictures",
    description: site.shortDescription,
    start_url: "/",
    display: "standalone",
    background_color: "#0A0A0A",
    theme_color: "#0A0A0A",
    icons: [
      { src: "/assets/logo-mark.png", sizes: "545x500", type: "image/png" },
    ],
  };
}
