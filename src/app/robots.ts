import type { MetadataRoute } from "next";
import { siteOrigin } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: ["/", "/about", "/membership", "/discover", "/podcasts", "/videos", "/articles", "/resources", "/events"], disallow: ["/v2", "/api", "/auth", "/admin"] }],
    sitemap: `${siteOrigin()}/sitemap.xml`,
  };
}
