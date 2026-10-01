import type { Metadata } from "next";
import { ContentDetail } from "@/components/content-detail";
import { getContentBySlug } from "@/lib/content";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> { const { slug } = await params; const item = await getContentBySlug(slug); return { title: item?.title ?? "Member story", description: item?.short_description || item?.description || "A story from Teens2Inspire." }; }
export default async function V2ContentPage({ params }: Props) { const { slug } = await params; return <ContentDetail slug={slug} basePath="/v2/content" />; }
