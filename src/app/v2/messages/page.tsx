import type { Metadata } from "next";
import { requireUser } from "@/lib/auth";
import { createServerSupabase } from "@/lib/supabase/server";
import { InquiryForm } from "@/components/community-actions";
export const metadata: Metadata = { title: "Messages" };

export default async function MessagesPage() {
  const user = await requireUser();
  const supabase = await createServerSupabase();
  const { data: inquiries } = await supabase.from("member_inquiries").select("id, subject, status, created_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(30);
  const ids = (inquiries ?? []).map((inquiry) => inquiry.id);
  const { data: messages } = ids.length ? await supabase.from("member_inquiry_messages").select("id, inquiry_id, sender_id, body, created_at").in("inquiry_id", ids).order("created_at", { ascending: true }) : { data: [] };
  return <main className="messages-page"><header className="page-intro"><span className="eyebrow">A private line to the team</span><h1>Your messages.</h1><p>Notes and replies from the Teens2Inspire support team stay visible only to you and our administrators.</p></header><div className="messages-layout"><section className="message-threads"><div className="section-heading"><div><span className="eyebrow">Your conversations</span><h2>Support inbox</h2></div></div>{inquiries?.length ? inquiries.map((inquiry) => <article className="support-thread" key={inquiry.id}><div className="thread-head"><h3>{inquiry.subject}</h3><span className={`thread-status thread-${inquiry.status}`}>{inquiry.status}</span></div><div className="thread-transcript">{(messages ?? []).filter((message) => message.inquiry_id === inquiry.id).map((message) => <div className={`thread-message${message.sender_id === user.id ? " thread-message-own" : ""}`} key={message.id}><span className="eyebrow">{message.sender_id === user.id ? "You" : "Teens2Inspire team"}</span><p>{message.body}</p><small>{new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(new Date(message.created_at))}</small></div>)}</div>{inquiry.status === "open" && <InquiryForm inquiryId={inquiry.id} />}</article>) : <div className="empty-inline"><h3>Nothing in your inbox yet.</h3><p>Send the Teens2Inspire team a private question below.</p></div>}</section><aside className="new-message-panel"><span className="eyebrow">Start a conversation</span><h2>How can we help?</h2><InquiryForm /></aside></div></main>;
}
