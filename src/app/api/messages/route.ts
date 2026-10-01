import { NextResponse } from "next/server";
import { inquiryReplySchema, inquirySchema } from "@/lib/validation";
import { createServerSupabase } from "@/lib/supabase/server";
import { getOwnProfile } from "@/lib/auth";

export async function POST(request: Request) {
  const payload: unknown = await request.json().catch(() => ({}));
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in to contact the team." }, { status: 401 });
  if (payload && typeof payload === "object" && "inquiryId" in payload) {
    const parsedReply = inquiryReplySchema.safeParse(payload);
    if (!parsedReply.success) return NextResponse.json({ error: "Add a short reply and try again." }, { status: 400 });
    const profile = await getOwnProfile(user.id);
    const { data: thread } = await supabase.from("member_inquiries").select("id, status").eq("id", parsedReply.data.inquiryId).maybeSingle();
    if (!thread) return NextResponse.json({ error: "That conversation could not be found." }, { status: 404 });
    if (thread.status !== "open" && profile?.role !== "administrator") return NextResponse.json({ error: "This conversation is closed. Start a new note if you need more help." }, { status: 409 });
    const { error } = await supabase.from("member_inquiry_messages").insert({ inquiry_id: thread.id, sender_id: user.id, body: parsedReply.data.body });
    if (error) return NextResponse.json({ error: "Your reply could not be delivered." }, { status: 500 });
    return NextResponse.json({ sent: true }, { status: 201 });
  }
  const parsed = inquirySchema.safeParse(payload);
  if (!parsed.success) return NextResponse.json({ error: "Add a subject and a short note." }, { status: 400 });
  const { data: inquiry, error: inquiryError } = await supabase.from("member_inquiries").insert({ user_id: user.id, subject: parsed.data.subject }).select("id").single();
  if (inquiryError || !inquiry) return NextResponse.json({ error: "We could not start that conversation." }, { status: 500 });
  const { error: messageError } = await supabase.from("member_inquiry_messages").insert({ inquiry_id: inquiry.id, sender_id: user.id, body: parsed.data.body });
  if (messageError) return NextResponse.json({ error: "Your note could not be delivered. Try again from this conversation." }, { status: 500 });
  return NextResponse.json({ sent: true }, { status: 201 });
}
