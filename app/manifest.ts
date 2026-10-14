import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Jalo",
    short_name: "Jalo",
    description: "Planes con amigos y gente nueva, armados por Jalo.",
    start_url: "/",
    display: "standalone",
    background_color: "#F7F6F3",
    theme_color: "#C2336A",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
