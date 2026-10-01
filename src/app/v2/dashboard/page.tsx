import Link from "next/link";
import { ArrowRight, ArrowUpRight, CalendarDays, LockKeyhole, Play, Radio } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { getDashboardData } from "@/lib/content";
import { getMembershipSnapshot } from "@/lib/membership";
import { Artwork } from "@/components/artwork";
import { ContentCard, ContentShelf } from "@/components/content-card";
import { createServerSupabase } from "@/lib/supabase/server";

function greeting() {
  const hour = new Date().getHours();
  return hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
}

export default async function DashboardPage() {
  const user = await requireUser();
  const data = await getDashboardData(user.id);
  const membership = await getMembershipSnapshot(user.id, data.profile);
  const featured = data.content.find((item) => item.featured) ?? data.content[0] ?? null;
  const name = data.profile?.display_name || data.profile?.first_name || "there";
  const interests = new Set((data.profile?.interests ?? []).map((interest) => interest.toLowerCase()));
  const recommended = data.content.filter((item) => item.id !== featured?.id && item.tags?.some((tag) => interests.has(tag.toLowerCase()))).slice(0, 8);
  const recent = data.content.filter((item) => item.id !== featured?.id).slice(0, 8);
  const continueItems = data.progress.filter((entry) => entry.content && (entry.content.type === "podcast" || entry.content.type === "video"));
  const community = membership.isActive ? await createServerSupabase().then((db) => db.from("community_posts").select("id, body, created_at").eq("status", "approved").order("created_at", { ascending: false }).limit(1)) : null;

  return (
    <main className="dashboard-page">
      <header className="dashboard-greeting"><div><span className="eyebrow">Your Teens2Inspire space</span><h1>{greeting()}, {name}.</h1><p>Here is a little inspiration for the day ahead.</p></div><Link className="avatar-link" href="/v2/profile" aria-label="Open your profile">{(name || "T").slice(0, 1).toUpperCase()}</Link></header>

      {featured ? <section className="dashboard-hero"><Artwork item={featured} className="dashboard-hero-art" priority /><div className="dashboard-hero-shade" /><div className="dashboard-hero-copy"><span className="eyebrow eyebrow-gold">A little something for you</span><h2>{featured.title}</h2><p>{featured.short_description || featured.description || "A story from the Teens2Inspire library."}</p><div className="hero-actions"><Link href={`/v2/content/${featured.slug}`} className="button button-primary"><Play size={15} fill="currentColor" aria-hidden="true" />Take a look</Link><Link href="/v2/discover" className="text-link">Explore everything <span aria-hidden="true">→</span></Link></div></div><span className="dashboard-hero-index">01 / FEATURED</span></section>
        : <section className="dashboard-empty-hero"><div><span className="eyebrow eyebrow-gold">A new season begins here</span><h2>Your next favorite<br /><em>is just ahead.</em></h2><p>Explore the Teens2Inspire library for something worth a listen, a read, or a second thought.</p><Link href="/v2/discover" className="button button-primary">Explore the library <ArrowRight size={15} /></Link></div><div className="empty-sun" aria-hidden="true" /></section>}

      {continueItems.length > 0 && <section className="continue-section"><div className="section-heading"><div><span className="eyebrow">Pick up where you left off</span><h2>Still with you</h2></div><span className="shelf-count">{continueItems.length} {continueItems.length === 1 ? "story" : "stories"}</span></div><div className="continue-grid">{continueItems.slice(0, 2).map((entry) => { const item = entry.content!; const percent = entry.duration_seconds ? Math.min(100, Math.round(entry.position_seconds / entry.duration_seconds * 100)) : 0; return <Link className="continue-card" key={item.id} href={`/v2/content/${item.slug}`}><Artwork item={item} className="continue-art" /><div className="continue-info"><span className="eyebrow">{item.type === "podcast" ? "Continue listening" : "Continue watching"}</span><h3>{item.title}</h3><div className="continue-progress"><span style={{ width: `${percent}%` }} /></div><small>{entry.position_seconds ? `${Math.floor(entry.position_seconds / 60)} min in` : "Ready when you are"}<span>Continue <ArrowRight size={13} /></span></small></div></Link>; })}</div></section>}

      <div className="dashboard-columns"><div className="dashboard-main-column">
        {data.sectionShelves.map(({ section, items }) => <ContentShelf key={section.id} title={section.name} subtitle={section.description ?? undefined} items={items} savedIds={data.favoriteIds} basePath="/v2/content" href="/v2/discover" />)}
        {recommended.length > 0 && <ContentShelf title="For your kind of curious" subtitle="A few ideas that fit what you are into." items={recommended} savedIds={data.favoriteIds} basePath="/v2/content" href="/v2/discover" />}
        {recent.length > 0 && <ContentShelf title="New in the library" subtitle="Fresh voices and perspectives, ready when you are." items={recent} savedIds={data.favoriteIds} basePath="/v2/content" href="/v2/discover" />}
        {!data.content.length && <div className="empty-state dashboard-empty-state"><span className="empty-rule" /><h2>The library is getting ready.</h2><p>There is not published content here just yet. Your saved content and event details will appear in this space as they become available.</p><Link href="/contact" className="text-link">Talk with the Teens2Inspire team <ArrowUpRight size={14} /></Link></div>}
      </div><aside className="dashboard-side-column">
        <section className="membership-card"><span className="eyebrow">Your membership</span><div className="member-status"><span className={`status-dot${membership.isActive ? " status-active" : ""}`} />{membership.isActive ? "Active membership" : "Free account"}</div><p>{membership.isActive ? "Your saved stories, member library, and community are ready." : "Make your library more personal with a Teens2Inspire membership."}</p><Link href="/v2/membership" className="text-link">{membership.isActive ? "Membership details" : "Explore membership"} <ArrowUpRight size={14} /></Link></section>
        <section className="dashboard-events"><div className="section-heading"><div><span className="eyebrow">Coming together</span><h2>On the calendar</h2></div><CalendarDays size={17} aria-hidden="true" /></div>{data.events.length ? data.events.map((event) => <Link href={`/v2/content/${event.slug}`} className="mini-event" key={event.id}><span>{event.event_starts_at ? new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(event.event_starts_at)) : "Date soon"}</span><strong>{event.title}</strong><small>{event.event_location || event.category || "Teens2Inspire gathering"}</small></Link>) : <div className="side-empty"><p>No upcoming events yet.</p><Link href="/v2/events">See all events <ArrowRight size={13} /></Link></div>}</section>
        <section className="community-peek"><div className="community-peek-title"><Radio size={16} aria-hidden="true" /><span className="eyebrow">A thoughtful community</span></div>{membership.isActive ? community?.data?.[0] ? <><p>“{community.data[0].body.slice(0, 120)}{community.data[0].body.length > 120 ? "…" : ""}”</p><Link href="/v2/community" className="text-link">Visit the community <ArrowRight size={13} /></Link></> : <><p>A quieter, more considered way to connect. Posts are reviewed before they are shared.</p><Link href="/v2/community" className="text-link">Visit the community <ArrowRight size={13} /></Link></> : <><p>Thoughtful conversations, with care built into the way they work.</p><Link href="/v2/membership" className="text-link"><LockKeyhole size={13} /> For members</Link></>}</section>
      </aside></div>
      {data.favoriteIds.size > 0 && <section className="dashboard-last-shelf"><div className="section-heading"><div><span className="eyebrow">For another day</span><h2>Saved for you</h2></div><Link href="/v2/saved" className="text-link">Your saved library <ArrowUpRight size={14} /></Link></div><div className="shelf-track">{data.content.filter((item) => data.favoriteIds.has(item.id)).slice(0, 5).map((item) => <ContentCard key={item.id} item={item} saved showSave basePath="/v2/content" />)}</div></section>}
    </main>
  );
}
