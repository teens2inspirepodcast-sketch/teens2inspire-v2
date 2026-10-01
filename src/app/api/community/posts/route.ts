import { NextResponse } from "next/server";
import { communityPostSchema } from "@/lib/validation";
import { createServerSupabase } from "@/lib/supabase/server";
import { getMembershipSnapshot } from "@/lib/membership";

export async function POST(request: Request) {
  const parsed = communityPostSchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: "Write a short note before you submit." }, { status: 400 });
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in to post." }, { status: 401 });
  if (!(await getMembershipSnapshot(user.id)).isActive) return NextResponse.json({ error: "An active membership is required." }, { status: 403 });
  const { error } = await supabase.from("community_posts").insert({ author_id: user.id, body: parsed.data.body, status: "pending" });
  if (error) return NextResponse.json({ error: "Your note could not be submitted." }, { status: 500 });
  return NextResponse.json({ submitted: true }, { status: 201 });
}
