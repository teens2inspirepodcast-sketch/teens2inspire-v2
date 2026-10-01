import type { Metadata } from "next";
import Link from "next/link";
import { MessageSquareText, ShieldCheck } from "lucide-react";
import { requireUser, getOwnProfile } from "@/lib/auth";
import { createServerSupabase } from "@/lib/supabase/server";
import { getMembershipSnapshot } from "@/lib/membership";
import { CommunityComposer, ReportPostButton } from "@/components/community-actions";
export const metadata: Metadata = { title: "Community" };

export default async function CommunityPage() {
  const user = await requireUser();
  const profile = await getOwnProfile(user.id);
  const membership = await getMembershipSnapshot(user.id, profile);
  if (!membership.isActive) return <main className="community-page"><header className="page-intro"><span className="eyebrow">A place to connect</span><h1>A thoughtful community.</h1><p>Moderated conversations for members, built to keep privacy and care close.</p></header><section className="community-gate"><ShieldCheck size={25} aria-hidden="true" /><h2>Member space, by design.</h2><p>Community posts are available to active members. Every post is reviewed before it is shared.</p><Link className="button button-primary" href="/v2/membership">Explore membership <span aria-hidden="true">→</span></Link></section></main>;
  const supabase = await createServerSupabase();
  const { data: posts } = await supabase.from("community_posts").select("id, author_id, body, created_at").eq("status", "approved").order("created_at", { ascending: false }).limit(40);
  const { data: ownPending } = await supabase.from("community_posts").select("id, body, created_at").eq("author_id", user.id).eq("status", "pending").order("created_at", { ascending: false }).limit(10);
  return <main className="community-page"><header className="page-intro"><span className="eyebrow">A space to connect, with care</span><h1>Here, together.</h1><p>A place for encouragement, good questions, and the things we are figuring out along the way.</p></header><div className="community-safety"><ShieldCheck size={17} aria-hidden="true" /><p>Posts are reviewed before sharing. Keep your email, phone, school, and location private. Member-to-member direct messages are not available.</p><Link href="/v2/messages">Message the Teens2Inspire team <span aria-hidden="true">→</span></Link></div><CommunityComposer />{ownPending?.length ? <section className="pending-section"><span className="eyebrow">Your notes in review</span>{ownPending.map((post) => <article key={post.id} className="pending-post"><p>{post.body}</p><small>Waiting for moderation</small></article>)}</section> : null}<section className="community-feed"><div className="section-heading"><div><span className="eyebrow">Member notes</span><h2>Good things worth sharing.</h2></div><MessageSquareText size={18} aria-hidden="true" /></div>{posts?.length ? posts.map((post) => <article className="community-post" key={post.id}><div className="post-meta"><span className="avatar-initial" aria-hidden="true">T</span><span><strong>A Teens2Inspire member</strong><small>{new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(post.created_at))}</small></span></div><p>{post.body}</p><ReportPostButton postId={post.id} /></article>) : <div className="empty-inline"><h3>A fresh page for this community.</h3><p>There are no approved member notes here yet. You can send the first one for review.</p></div>}</section></main>;
}
