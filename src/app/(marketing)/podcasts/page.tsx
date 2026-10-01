import type { Metadata } from "next";
import { CatalogBrowser } from "@/components/catalog-browser";
export const metadata: Metadata = { title: "Podcasts", description: "Conversations and voices to bring along with you." };
export default async function PodcastsPage({ searchParams }: { searchParams: Promise<{ q?: string; category?: string; sort?: "newest" | "featured" }> }) { const { q, category, sort } = await searchParams; return <CatalogBrowser heading="Good company for the way." intro="Conversations, voices, and a little perspective for walks, rides, and whatever comes next." type="podcast" search={q} category={category} sort={sort === "featured" ? sort : "newest"} />; }
