import type { Metadata } from "next";
import { CatalogBrowser } from "@/components/catalog-browser";
export const metadata: Metadata = { title: "Articles and stories", description: "Thoughtful reads for questions, ideas, and everything in between." };
export default async function ArticlesPage({ searchParams }: { searchParams: Promise<{ q?: string; category?: string; sort?: "newest" | "featured" }> }) { const { q, category, sort } = await searchParams; return <CatalogBrowser heading="A good page to turn." intro="Fresh perspectives for the things on your mind and the things you are still figuring out." type="article" search={q} category={category} sort={sort === "featured" ? sort : "newest"} />; }
