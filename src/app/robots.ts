import type { MetadataRoute } from "next";
import { siteOrigin } from "@/lib/env";
export default function robots(): MetadataRoute.Robots { return { rules: [{ userAgent: "*", allow: ["/", "/about", "/events", "/school", "/contact", "/login", "/signup", "/download", "/privacy", "/terms"], disallow: ["/api", "/auth"] }], sitemap: `${siteOrigin()}/sitemap.xml` }; }
