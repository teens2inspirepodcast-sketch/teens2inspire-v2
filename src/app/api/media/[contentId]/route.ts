import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createServerSupabase } from "@/lib/supabase/server";
import { getCurrentUser, getOwnProfile } from "@/lib/auth";
import { getMembershipSnapshot } from "@/lib/membership";
import { createR2ReadUrl } from "@/lib/r2";

const idSchema = z.string().uuid();

export async function GET(request: NextRequest, { params }: { params: Promise<{ contentId: string }> }) {
  const { contentId } = await params;
  if (!idSchema.safeParse(contentId).success) return NextResponse.json({ error: "Media not found." }, { status: 404 });
  const user = await getCurrentUser();
  const supabase = await createServerSupabase();
  const { data: item } = await supabase.from("content").select("media_url, r2_media_key, member_only, type, status").eq("id", contentId).eq("status", "published").maybeSingle();
  if (!item) return NextResponse.json({ error: "Media not found." }, { status: 404 });

  if (item.member_only) {
    if (!user) return NextResponse.json({ error: "Sign in to access this media." }, { status: 401 });
    try {
      const profile = await getOwnProfile(user.id);
      const membership = await getMembershipSnapshot(user.id, profile);
      if (!membership.isActive && profile?.role !== "administrator") return NextResponse.json({ error: "An active membership is required." }, { status: 403 });
    } catch {
      return NextResponse.json({ error: "Membership access could not be verified." }, { status: 503 });
    }
  }

  if (item.r2_media_key) {
    try {
      const response = NextResponse.redirect(await createR2ReadUrl(item.r2_media_key), 307);
      response.headers.set("Cache-Control", "private, no-store, max-age=0");
      response.headers.set("Referrer-Policy", "no-referrer");
      return response;
    } catch {
      return NextResponse.json({ error: "Cloud media storage is not configured or the file is unavailable." }, { status: 503 });
    }
  }

  if (!item.media_url) return NextResponse.json({ error: "Media not found." }, { status: 404 });
  if (item.media_url.startsWith("storage://")) {
    return NextResponse.json({ error: "This older file must be re-uploaded to Teens2Inspire Cloud media before it can be played." }, { status: 410 });
  }
  try {
    const external = new URL(item.media_url);
    if (external.protocol !== "https:") return NextResponse.json({ error: "Media not found." }, { status: 404 });
    if (external.hostname.endsWith(".supabase.co") && external.pathname.includes("/storage/v1/object/")) {
      return NextResponse.json({ error: "This older file must be re-uploaded to Teens2Inspire Cloud media before it can be played." }, { status: 410 });
    }
    const response = NextResponse.redirect(external, 307);
    response.headers.set("Cache-Control", "private, no-store, max-age=0");
    response.headers.set("Referrer-Policy", "no-referrer");
    return response;
  } catch {
    return NextResponse.json({ error: "Media not found." }, { status: 404 });
  }
}
