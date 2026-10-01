import "server-only";
import { createServerSupabase } from "@/lib/supabase/server";
import { publicR2AssetUrl } from "@/lib/r2";
import type { Database } from "@/types/database";

export type Content = Database["public"]["Tables"]["content"]["Row"];
export type ContentType = Content["type"];

export const contentTypeLabels: Record<string, string> = {
  podcast: "Podcast",
  video: "Video",
  article: "Article",
  resource: "Resource",
  printable: "Printable",
  event: "Event",
  recipe: "Recipe",
  pick: "Editor's pick",
  original: "Original",
};

export async function getPublishedContent(options: {
  type?: ContentType;
  types?: ContentType[];
  category?: string;
  search?: string;
  featured?: boolean;
  sort?: "newest" | "featured";
  limit?: number;
} = {}) {
  const supabase = await createServerSupabase();
  let query = supabase.from("content").select("*").eq("status", "published");
  if (options.type) query = query.eq("type", options.type);
  else if (options.types?.length) query = query.in("type", options.types);
  if (options.category) query = query.eq("category", options.category);
  if (options.featured) query = query.eq("featured", true);
  if (options.search) {
    const term = options.search.replace(/[^\p{L}\p{N}\s-]/gu, " ").trim().slice(0, 80).replace(/\s+/g, " ");
    if (term) query = query.or(`title.ilike.%${term}%,short_description.ilike.%${term}%,description.ilike.%${term}%,category.ilike.%${term}%`);
  }
  if (options.sort === "featured") query = query.order("featured", { ascending: false });
  const { data } = await query.order("published_at", { ascending: false }).limit(options.limit ?? 36);
  return data ?? [];
}

export async function getContentBySlug(slug: string) {
  const supabase = await createServerSupabase();
  const { data } = await supabase.from("content").select("*").eq("slug", slug).maybeSingle();
  return data;
}

export async function getFavoriteContent(userId: string) {
  const supabase = await createServerSupabase();
  const { data: favorites } = await supabase.from("favorites").select("content_id, created_at").eq("user_id", userId).order("created_at", { ascending: false });
  const ids = (favorites ?? []).map((favorite) => favorite.content_id);
  if (!ids.length) return [];
  const { data: items } = await supabase.from("content").select("*").in("id", ids);
  const byId = new Map((items ?? []).map((item) => [item.id, item]));
  return ids.map((id) => byId.get(id)).filter((item): item is Content => Boolean(item));
}

export async function getDashboardData(userId: string) {
  const supabase = await createServerSupabase();
  const [profileResult, contentResult, favoriteResult, progressResult, sectionsResult, eventResult] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
    supabase.from("content").select("*").eq("status", "published").order("published_at", { ascending: false }).limit(32),
    supabase.from("favorites").select("content_id").eq("user_id", userId),
    supabase.from("media_progress").select("content_id, position_seconds, duration_seconds, updated_at").eq("user_id", userId).order("updated_at", { ascending: false }).limit(8),
    supabase.from("sections").select("id, name, slug, description, display_order, max_items").eq("is_active", true).eq("show_on_homepage", true).order("display_order").limit(4),
    supabase.from("content").select("id, title, slug, description, short_description, type, category, tags, cover_url, media_url, external_url, published_at, member_only, featured, duration_seconds, event_starts_at, event_ends_at, event_location, registration_url, status").eq("status", "published").eq("type", "event").gte("event_starts_at", new Date().toISOString()).order("event_starts_at").limit(3),
  ]);
  const items = contentResult.data ?? [];
  const favoriteIds = new Set((favoriteResult.data ?? []).map((row) => row.content_id));
  const progress = progressResult.data ?? [];
  const sections = sectionsResult.data ?? [];
  const sectionLinks = sections.length
    ? await supabase.from("section_content").select("section_id, content_id, display_order").in("section_id", sections.map((section) => section.id)).order("display_order")
    : { data: [] };
  const linkedIds = Array.from(new Set([...(sectionLinks.data ?? []).map((link) => link.content_id), ...progress.map((row) => row.content_id)]));
  const linkedContent = linkedIds.length
    ? await supabase.from("content").select("*").in("id", linkedIds).eq("status", "published")
    : { data: [] };
  const linkedContentById = new Map([...items, ...(linkedContent.data ?? [])].map((item) => [item.id, item]));
  const progressItems = progress.map((row) => ({ ...row, content: linkedContentById.get(row.content_id) ?? null })).filter((row) => row.content);
  const sectionShelves = sections.map((section) => ({
    section,
    items: (sectionLinks.data ?? []).filter((link) => link.section_id === section.id).map((link) => linkedContentById.get(link.content_id)).filter((item): item is Content => Boolean(item)).slice(0, section.max_items),
  })).filter((shelf) => shelf.items.length > 0);
  return {
    profile: profileResult.data,
    content: items,
    favoriteIds,
    progress: progressItems,
    sections: sectionsResult.data ?? [],
    sectionShelves,
    events: eventResult.data ?? [],
  };
}

export function formatDuration(seconds: number | null) {
  if (seconds === null || seconds <= 0) return "";
  const minutes = Math.round(seconds / 60);
  return minutes >= 60 ? `${Math.floor(minutes / 60)} hr ${minutes % 60} min` : `${minutes} min`;
}

export function contentArtwork(item: Pick<Content, "cover_url" | "r2_thumbnail_key">) {
  if (item.r2_thumbnail_key) return publicR2AssetUrl(item.r2_thumbnail_key);
  const value = item.cover_url?.trim();
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return null;
    if (url.hostname === "images.unsplash.com") return url.toString();
  } catch {
    return null;
  }
  return null;
}
