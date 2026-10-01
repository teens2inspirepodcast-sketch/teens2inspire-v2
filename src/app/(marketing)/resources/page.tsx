import type { Metadata } from "next";
import { CatalogBrowser } from "@/components/catalog-browser";
export const metadata: Metadata = { title: "Resources", description: "Thoughtful tools and resources from Teens2Inspire." };
export default async function ResourcesPage({ searchParams }: { searchParams: Promise<{ q?: string; category?: string; sort?: "newest" | "featured" }> }) { const { q, category, sort } = await searchParams; return <CatalogBrowser heading="Something to keep close." intro="Useful guides, printables, and small things you can bring into everyday life." type={["resource", "printable"]} search={q} category={category} sort={sort === "featured" ? sort : "newest"} />; }
