import { NextResponse } from "next/server";
import { getCurrentUser, getOwnProfile } from "@/lib/auth";
import { createR2ReadUrl } from "@/lib/r2";
import { isSafeR2Key } from "@/lib/r2-keys";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Sign in to view your profile photo." }, { status: 401 });
  const profile = await getOwnProfile(user.id);
  const key = profile?.avatar_path;
  if (!key || !key.startsWith(`avatars/${user.id}/`) || !isSafeR2Key(key)) return NextResponse.json({ error: "Profile photo not found." }, { status: 404 });
  try {
    const response = NextResponse.redirect(await createR2ReadUrl(key), 307);
    response.headers.set("Cache-Control", "private, no-store, max-age=0");
    response.headers.set("Referrer-Policy", "no-referrer");
    return response;
  } catch {
    return NextResponse.json({ error: "Profile photo storage is not configured." }, { status: 503 });
  }
}
