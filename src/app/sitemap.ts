import type { MetadataRoute } from "next";
import { siteOrigin } from "@/lib/env";
export default function sitemap(): MetadataRoute.Sitemap { const origin = siteOrigin(); return ["", "/about", "/events", "/school", "/contact", "/login", "/signup", "/download", "/privacy", "/terms"].map((path) => ({ url: `${origin}${path}`, changeFrequency: "weekly" as const, priority: path === "" ? 1 : 0.6 })); }
