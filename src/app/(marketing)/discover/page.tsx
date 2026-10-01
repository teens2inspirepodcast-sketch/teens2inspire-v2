import type { Metadata } from "next";
import { CatalogBrowser } from "@/components/catalog-browser";

export const metadata: Metadata = { title: "Explore the library", description: "Explore podcasts, videos, stories, and resources from Teens2Inspire." };
export default async function DiscoverPage({ searchParams }: { searchParams: Promise<{ q?: string; category?: string; sort?: "newest" | "featured" }> }) {
  const { q, category, sort } = await searchParams;
  return <CatalogBrowser heading={q ? `A little about “${q}”` : "Find something that feels like yours."} intro="Good conversations, honest stories, new ideas, and thoughtful resources, all in one place." search={q} category={category} sort={sort === "featured" ? sort : "newest"} />;
}
