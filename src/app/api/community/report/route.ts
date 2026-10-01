import { NextResponse } from "next/server";
import { communityReportSchema } from "@/lib/validation";
import { createServerSupabase } from "@/lib/supabase/server";
import { getMembershipSnapshot } from "@/lib/membership";

export async function POST(request: Request) {
  const parsed = communityReportSchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: "Choose a reason and try again." }, { status: 400 });
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in to report a post." }, { status: 401 });
  if (!(await getMembershipSnapshot(user.id)).isActive) return NextResponse.json({ error: "An active membership is required." }, { status: 403 });
  const { error } = await supabase.from("community_reports").insert({ reporter_id: user.id, post_id: parsed.data.postId, reason: parsed.data.reason, status: "open" });
  if (error && error.code !== "23505") return NextResponse.json({ error: "We could not send that report." }, { status: 500 });
  return NextResponse.json({ received: true });
}
