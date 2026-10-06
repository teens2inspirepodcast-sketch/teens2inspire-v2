import type { Metadata } from "next";
import { CalendarDays, MapPin } from "lucide-react";
import { getPublishedContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Events",
  description: "Upcoming Teens2Inspire events and experiences.",
};

function formatEventDate(value: string | null) {
  if (!value) return null;
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
}

export default async function EventsPage() {
  const events = await getPublishedContent({ type: "event", limit: 48 });
  const upcoming = events.filter((event) => !event.event_starts_at || new Date(event.event_starts_at) >= new Date());

  return (
    <main className="events-page">
      <div className="page-intro">
        <span className="eyebrow eyebrow-gold">Teens2Inspire Events</span>
        <h1>Come together.</h1>
        <p>Teens2Inspire events are opportunities to gather, connect, and experience something together.</p>
      </div>

      {upcoming.length > 0 ? (
        <div className="events-simple-list">
          {upcoming.map((event) => (
            <article className="event-simple-card" key={event.id}>
              <div className="event-simple-date">
                <CalendarDays size={20} aria-hidden="true" />
                <span>{formatEventDate(event.event_starts_at)}</span>
              </div>
              <div>
                <span className="eyebrow">{event.category || "Teens2Inspire"}</span>
                <h2>{event.title}</h2>
                {event.short_description && <p>{event.short_description}</p>}
                <div className="event-meta">
                  {event.event_location && <span><MapPin size={13} aria-hidden="true" />{event.event_location}</span>}
                  {event.event_starts_at && <span><CalendarDays size={13} aria-hidden="true" />{formatEventDate(event.event_starts_at)}</span>}
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <section className="events-empty">
          <span className="empty-rule" />
          <h2>No upcoming events right now.</h2>
          <p>Check back here for future Teens2Inspire events and experiences.</p>
        </section>
      )}
    </main>
  );
}
