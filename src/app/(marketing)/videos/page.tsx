import type { Metadata } from "next";
import { CatalogBrowser } from "@/components/catalog-browser";
export const metadata: Metadata = { title: "Videos", description: "Watch stories and ideas from Teens2Inspire." };
export default async function VideosPage({ searchParams }: { searchParams: Promise<{ q?: string; category?: string; sort?: "newest" | "featured" }> }) { const { q, category, sort } = await searchParams; return <CatalogBrowser heading="A different way to see it." intro="Personal stories, good questions, and voices worth sitting with." type="video" search={q} category={category} sort={sort === "featured" ? sort : "newest"} />; }
