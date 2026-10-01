import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser, getOwnProfile } from "@/lib/auth";
import { createServerSupabase } from "@/lib/supabase/server";

const schema = z.object({ name: z.string().trim().min(2).max(80), slug: z.string().trim().min(2).max(80).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), description: z.string().trim().max(240).nullable(), content_type: z.enum(["podcast", "video", "article", "resource", "printable", "pick", "event", "recipe", "original"]).nullable() });

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Sign in to continue." }, { status: 401 });
  const profile = await getOwnProfile(user.id);
  if (profile?.role !== "administrator") return NextResponse.json({ error: "You do not have permission to manage categories." }, { status: 403 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Check the category details and try again." }, { status: 400 });
  const supabase = await createServerSupabase();
  const { error } = await supabase.from("categories").insert(parsed.data);
  if (error) return NextResponse.json({ error: "That category could not be added. Its slug may already be in use." }, { status: 400 });
  return NextResponse.json({ saved: true }, { status: 201 });
}
