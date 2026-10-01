import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { createServerSupabase } from "@/lib/supabase/server";
import { EventRegistration } from "@/components/event-registration";
export const metadata: Metadata = { title: "Events" };

export default async function V2EventsPage() {
  const user = await requireUser();
  const supabase = await createServerSupabase();
  const [eventsResult, registrationsResult] = await Promise.all([
    supabase.from("content").select("*").eq("type", "event").eq("status", "published").order("event_starts_at", { ascending: true }).limit(50),
    supabase.from("event_registrations").select("content_id").eq("user_id", user.id),
  ]);
  const events = eventsResult.data ?? [];
  const registered = new Set((registrationsResult.data ?? []).map((row) => row.content_id));
  return <main className="events-page"><header className="page-intro"><span className="eyebrow">Gather a little closer</span><h1>Good things happen together.</h1><p>Thoughtful gatherings and moments to learn, make, and connect.</p></header>{events.length ? <div className="events-grid">{events.map((event) => <article className="event-card" key={event.id}><div className="event-date">{event.event_starts_at ? <><strong>{new Intl.DateTimeFormat("en-US", { day: "2-digit" }).format(new Date(event.event_starts_at))}</strong><span>{new Intl.DateTimeFormat("en-US", { month: "short" }).format(new Date(event.event_starts_at))}</span></> : <><CalendarDays size={18} /><span>Details soon</span></>}</div><div className="event-card-copy"><span className="eyebrow">{event.category || "Teens2Inspire event"}</span><h2><Link href={`/v2/content/${event.slug}`}>{event.title}</Link></h2><p>{event.short_description || event.description}</p><div className="event-meta">{event.event_starts_at && <span><CalendarDays size={14} />{new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(new Date(event.event_starts_at))}</span>}{event.event_location && <span><MapPin size={14} />{event.event_location}</span>}</div></div><EventRegistration eventId={event.id} initiallyRegistered={registered.has(event.id)} /></article>)}</div> : <div className="empty-state"><span className="empty-rule" /><h2>We will save you a seat.</h2><p>There are no upcoming events to register for right now. Check back soon.</p><Link href="/v2/discover" className="text-link">Explore the library <span aria-hidden="true">→</span></Link></div>}</main>;
}
