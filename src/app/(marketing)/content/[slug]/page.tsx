import type { Metadata } from "next";
import { ContentDetail } from "@/components/content-detail";
import { getContentBySlug } from "@/lib/content";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await getContentBySlug(slug);
  if (!item) return { title: "Member story" };
  const description = item.short_description || item.description || "A story from Teens2Inspire.";
  return { title: item.title, description, openGraph: { title: item.title, description } };
}
export default async function ContentPage({ params }: Props) { const { slug } = await params; return <ContentDetail slug={slug} />; }
