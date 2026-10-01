import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Teens2Inspire",
    short_name: "Teens2Inspire",
    description: "Stories, voices, and ideas for Jewish teen girls.",
    start_url: "/",
    display: "standalone",
    background_color: "#151412",
    theme_color: "#151412",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
  };
}
