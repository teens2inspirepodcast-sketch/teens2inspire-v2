import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { uuidSchema } from "@/lib/validation";

async function getAuthorizedFavorite(contentId: string) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { response: NextResponse.json({ error: "Sign in to save content." }, { status: 401 }) };
  const { data: item } = await supabase.from("content").select("id").eq("id", contentId).eq("status", "published").maybeSingle();
  if (!item) return { response: NextResponse.json({ error: "That content is not available." }, { status: 404 }) };
  return { supabase, user };
}

export async function POST(request: Request) {
  const parsed = uuidSchema.safeParse((await request.json().catch(() => ({}))).contentId);
  if (!parsed.success) return NextResponse.json({ error: "Choose a valid story." }, { status: 400 });
  const result = await getAuthorizedFavorite(parsed.data);
  if ("response" in result) return result.response;
  const { error } = await result.supabase.from("favorites").insert({ user_id: result.user.id, content_id: parsed.data });
  if (error && error.code !== "23505") return NextResponse.json({ error: "We could not save that story." }, { status: 500 });
  return NextResponse.json({ saved: true }, { status: 201 });
}

export async function DELETE(request: Request) {
  const parsed = uuidSchema.safeParse((await request.json().catch(() => ({}))).contentId);
  if (!parsed.success) return NextResponse.json({ error: "Choose a valid story." }, { status: 400 });
  const result = await getAuthorizedFavorite(parsed.data);
  if ("response" in result) return result.response;
  const { error } = await result.supabase.from("favorites").delete().eq("user_id", result.user.id).eq("content_id", parsed.data);
  if (error) return NextResponse.json({ error: "We could not update your saved list." }, { status: 500 });
  return NextResponse.json({ saved: false });
}
