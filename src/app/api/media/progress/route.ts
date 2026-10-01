import { NextResponse } from "next/server";
import { z } from "zod";
import { createServerSupabase } from "@/lib/supabase/server";

const progressSchema = z.object({ contentId: z.string().uuid(), positionSeconds: z.number().int().min(0).max(86_400), durationSeconds: z.number().int().min(0).max(86_400).optional() });

export async function POST(request: Request) {
  const parsed = progressSchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: "Invalid playback progress." }, { status: 400 });
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in to save your place." }, { status: 401 });
  const { error } = await supabase.from("media_progress").upsert({ user_id: user.id, content_id: parsed.data.contentId, position_seconds: parsed.data.positionSeconds, duration_seconds: parsed.data.durationSeconds ?? null, updated_at: new Date().toISOString() }, { onConflict: "user_id,content_id" });
  if (error) return NextResponse.json({ error: "Playback progress could not be saved." }, { status: 500 });
  return NextResponse.json({ saved: true });
}
