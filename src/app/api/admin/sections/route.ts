import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser, getOwnProfile } from "@/lib/auth";
import { createServerSupabase } from "@/lib/supabase/server";

const schema = z.object({ name: z.string().trim().min(2).max(100), slug: z.string().trim().min(2).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), description: z.string().trim().max(240).nullable(), display_order: z.number().int().min(0).max(1000), max_items: z.number().int().min(1).max(24), show_on_homepage: z.boolean() });
const updateSchema = z.object({ id: z.string().uuid(), display_order: z.number().int().min(0).max(1000), max_items: z.number().int().min(1).max(24), show_on_homepage: z.boolean(), is_active: z.boolean() });

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Sign in to continue." }, { status: 401 });
  const profile = await getOwnProfile(user.id);
  if (profile?.role !== "administrator") return NextResponse.json({ error: "Only administrators can manage homepage sections." }, { status: 403 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Check the section details and try again." }, { status: 400 });
  const supabase = await createServerSupabase();
  const { error } = await supabase.from("sections").insert({ ...parsed.data, section_type: "content", card_style: "standard", is_active: true, show_in_navigation: false, see_all_label: "Explore", updated_at: new Date().toISOString() });
  if (error) return NextResponse.json({ error: "That section could not be added. Its slug may already be in use." }, { status: 400 });
  return NextResponse.json({ saved: true }, { status: 201 });
}

export async function PATCH(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Sign in to continue." }, { status: 401 });
  const profile = await getOwnProfile(user.id);
  if (profile?.role !== "administrator") return NextResponse.json({ error: "Only administrators can manage homepage sections." }, { status: 403 });
  const parsed = updateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Check the homepage section details." }, { status: 400 });
  const supabase = await createServerSupabase();
  const { id, ...values } = parsed.data;
  const { error } = await supabase.from("sections").update({ ...values, updated_at: new Date().toISOString() }).eq("id", id);
  if (error) return NextResponse.json({ error: "That homepage section could not be updated." }, { status: 400 });
  return NextResponse.json({ updated: true });
}
