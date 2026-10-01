import type { Metadata } from "next";
import Link from "next/link";
import { requireAdministrator } from "@/lib/auth";
import { createServerSupabase } from "@/lib/supabase/server";
import { AdminModeration } from "@/components/admin-moderation";
export const metadata: Metadata = { title: "Community moderation" };
export const dynamic = "force-dynamic";

export default async function AdminCommunityPage() {
  await requireAdministrator();
  const supabase = await createServerSupabase();
  const [postsResult, reportsResult, inquiriesResult] = await Promise.all([
    supabase.from("community_posts").select("*").eq("status", "pending").order("created_at", { ascending: true }).limit(100),
    supabase.from("community_reports").select("*").eq("status", "open").order("created_at", { ascending: true }).limit(100),
    supabase.from("member_inquiries").select("*").neq("status", "closed").order("updated_at", { ascending: false }).limit(100),
  ]);
  const ids = (inquiriesResult.data ?? []).map((inquiry) => inquiry.id);
  const messagesResult = ids.length ? await supabase.from("member_inquiry_messages").select("*").in("inquiry_id", ids).order("created_at", { ascending: true }) : { data: [] };
  return <main className="admin-page"><header className="admin-page-heading"><div><span className="eyebrow eyebrow-gold">Safety and care</span><h1>Community moderation.</h1><p>Review member posts, respond to private notes, and close reports.</p></div><Link href="/v2/admin" className="text-link">Content studio</Link></header><AdminModeration posts={postsResult.data ?? []} reports={reportsResult.data ?? []} inquiries={inquiriesResult.data ?? []} messages={messagesResult.data ?? []} /></main>;
}
