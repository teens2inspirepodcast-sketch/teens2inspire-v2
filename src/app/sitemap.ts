import type { MetadataRoute } from "next";
import { siteOrigin } from "@/lib/env";
import { getPublishedContent } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = siteOrigin();
  const [base, content] = await Promise.all([
    Promise.resolve(["", "/about", "/membership", "/discover", "/podcasts", "/videos", "/articles", "/resources", "/events"].map((path) => ({ url: `${origin}${path}`, changeFrequency: "weekly" as const, priority: path === "" ? 1 : 0.7 }))),
    getPublishedContent({ limit: 1000 }),
  ]);
  return [...base, ...content.map((item) => ({ url: `${origin}/content/${item.slug}`, lastModified: item.updated_at, changeFrequency: "monthly" as const, priority: 0.55 }))];
}
