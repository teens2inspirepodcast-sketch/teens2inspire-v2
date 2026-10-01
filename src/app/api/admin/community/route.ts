import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser, getOwnProfile } from "@/lib/auth";
import { createServerSupabase } from "@/lib/supabase/server";

const schema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("post"), id: z.string().uuid(), status: z.enum(["approved", "rejected"]), moderator_note: z.string().trim().max(1000).nullable() }),
  z.object({ kind: z.literal("report"), id: z.string().uuid(), status: z.enum(["reviewed", "resolved"]) }),
  z.object({ kind: z.literal("inquiry"), id: z.string().uuid(), status: z.enum(["open", "resolved", "closed"]) }),
]);

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Sign in to continue." }, { status: 401 });
  const profile = await getOwnProfile(user.id);
  if (profile?.role !== "administrator") return NextResponse.json({ error: "Only administrators can moderate community content." }, { status: 403 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Check the moderation update and try again." }, { status: 400 });
  const supabase = await createServerSupabase();
  const input = parsed.data;
  const result = input.kind === "post"
    ? await supabase.from("community_posts").update({ status: input.status, moderator_note: input.moderator_note, reviewed_at: new Date().toISOString(), reviewed_by: user.id }).eq("id", input.id).select("id").maybeSingle()
    : input.kind === "report"
      ? await supabase.from("community_reports").update({ status: input.status }).eq("id", input.id).select("id").maybeSingle()
      : await supabase.from("member_inquiries").update({ status: input.status, updated_at: new Date().toISOString() }).eq("id", input.id).select("id").maybeSingle();
  if (result.error || !result.data) return NextResponse.json({ error: "That moderation update could not be saved." }, { status: 400 });
  return NextResponse.json({ updated: true });
}
