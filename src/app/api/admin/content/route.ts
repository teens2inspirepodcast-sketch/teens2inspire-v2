import { NextResponse } from "next/server";
import { z } from "zod";
import { createServerSupabase } from "@/lib/supabase/server";
import { getCurrentUser, getOwnProfile } from "@/lib/auth";
import { isSafeR2Key } from "@/lib/r2-keys";

const optionalHttpsUrl = z.string().trim().max(1200).nullable().refine((value) => {
  if (!value) return true;
  try { return new URL(value).protocol === "https:"; } catch { return false; }
}, "Use a valid secure HTTPS URL.");
const optionalMediaUrl = z.string().trim().max(1200).nullable().refine((value) => {
  if (!value) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !(url.hostname.endsWith(".supabase.co") && url.pathname.includes("/storage/v1/object/"));
  } catch { return false; }
}, "Use an HTTPS external media link or upload the file to Cloudflare R2.");
const optionalArtworkUrl = optionalHttpsUrl.refine((value) => {
  if (!value) return true;
  const url = new URL(value);
  return !(url.hostname.endsWith(".supabase.co") && url.pathname.includes("/storage/v1/object/"));
}, "Upload artwork to Cloudflare R2 instead of Supabase Storage.");
const optionalR2Key = z.string().trim().max(1024).nullable().refine((value) => !value || isSafeR2Key(value), "Use a valid R2 object key.");

const schema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().trim().min(2).max(180),
  slug: z.string().trim().min(2).max(180).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  type: z.enum(["podcast", "video", "article", "resource", "printable", "pick", "event", "recipe", "original"]),
  status: z.enum(["draft", "published", "archived"]),
  short_description: z.string().trim().max(300).nullable(),
  description: z.string().trim().max(4000).nullable(),
  body: z.string().max(40000).nullable(),
  category: z.string().trim().max(80).nullable(),
  tags: z.array(z.string().trim().min(1).max(40)).max(12),
  creator_name: z.string().trim().max(120).nullable(),
  cover_url: optionalArtworkUrl,
  media_url: optionalMediaUrl,
  r2_media_key: optionalR2Key,
  r2_thumbnail_key: optionalR2Key,
  external_url: optionalHttpsUrl,
  duration_seconds: z.number().int().min(0).max(86400).nullable(),
  reading_time_minutes: z.number().int().min(0).max(600).nullable(),
  member_only: z.boolean(),
  featured: z.boolean(),
  category_id: z.string().uuid().nullable(),
  section_ids: z.array(z.string().uuid()).max(12),
  event_starts_at: z.string().datetime().nullable(),
  event_ends_at: z.string().datetime().nullable(),
  event_location: z.string().trim().max(240).nullable(),
  capacity: z.number().int().positive().max(100000).nullable(),
  registration_url: optionalHttpsUrl,
});

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Sign in to continue." }, { status: 401 });
  const profile = await getOwnProfile(user.id);
  if (!profile || !["administrator", "content_editor"].includes(profile.role)) return NextResponse.json({ error: "You do not have permission to manage content." }, { status: 403 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Check the content details and try again." }, { status: 400 });

  if (profile.role !== "administrator") return NextResponse.json({ error: "Only administrators can publish content." }, { status: 403 });
  const { id, section_ids, ...values } = parsed.data;
  const supabase = await createServerSupabase();
  let publishedAt: string | null = null;
  if (values.status === "published") {
    if (id) {
      const { data: existing } = await supabase.from("content").select("published_at, status").eq("id", id).maybeSingle();
      publishedAt = existing?.status === "published" && existing.published_at ? existing.published_at : new Date().toISOString();
    } else publishedAt = new Date().toISOString();
  }
  const valuesWithPublishDate = { ...values, published_at: publishedAt, updated_at: new Date().toISOString() };
  const result = id
    ? await supabase.from("content").update(valuesWithPublishDate).eq("id", id).select("id").maybeSingle()
    : await supabase.from("content").insert({ ...valuesWithPublishDate, created_by: user.id }).select("id").single();
  if (result.error || !result.data) return NextResponse.json({ error: "Content could not be saved. Check that its slug is unique." }, { status: 400 });
  const { error: assignmentError } = await supabase.rpc("replace_content_sections", { p_content_id: result.data.id, p_section_ids: section_ids });
  if (assignmentError) return NextResponse.json({ error: "Content was saved, but homepage assignments could not be updated." }, { status: 500 });
  return NextResponse.json({ id: result.data.id }, { status: id ? 200 : 201 });
}
