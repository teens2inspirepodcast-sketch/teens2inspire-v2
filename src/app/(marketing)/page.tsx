import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CalendarDays, School, Sparkles } from "lucide-react";

export default function HomePage() {
  return (
    <main>
      <section className="site-hero">
        <div className="site-hero-copy">
          <span className="eyebrow eyebrow-gold"><span className="eyebrow-line" />Inspiring Jewish teen girls</span>
          <h1>A place to <em>inspire</em> you, connect you, and help you grow.</h1>
          <p>Teens2Inspire is a media and community platform made for Jewish teen girls — with conversations, stories, podcasts, videos, resources, events, and more.</p>
          <div className="hero-actions"><Link href="/signup" className="button button-primary">Join Teens2Inspire <ArrowRight size={16} aria-hidden="true" /></Link><Link href="/about" className="text-link">Our story <span aria-hidden="true">→</span></Link></div>
          <p className="hero-microcopy">Create your account here. Your media experience lives in the Teens2Inspire app.</p>
        </div>
        <div className="site-hero-brand-panel">
          <Image src="/teens2inspire-logo.png" alt="Teens2Inspire — A media platform for Jewish teen girls" width={1086} height={362} priority className="site-logo-hero" />
          <div className="hero-panel-rule" />
          <p>One account. One place to start. A whole world of inspiration waiting for you.</p>
        </div>
      </section>

      <section className="site-preview section-frame">
        <div className="preview-copy"><span className="eyebrow">Your Teens2Inspire experience</span><h2>Designed for the app.<br /><em>Built around you.</em></h2><p>The public website is your account hub. After you join, you’ll use the Teens2Inspire media app for all of the content.</p><Link href="/download" className="text-link">Learn how to get the app <ArrowRight size={15} aria-hidden="true" /></Link></div>
        <div className="preview-window" aria-label="Preview of the Teens2Inspire media app"><div className="preview-top"><span>Teens2Inspire</span><span className="preview-dot" /></div><div className="preview-hero"><span className="eyebrow eyebrow-gold">Made for your kind of curious</span><strong>Watch. Listen. Read.<br />Find something that speaks to you.</strong><span className="preview-button">Open the app</span></div><div className="preview-row"><span /><span /><span /></div><div className="preview-bottom"><span>Explore</span><span>Search</span><span>Library</span><span>Profile</span></div></div>
      </section>

      <section className="site-pillars section-frame">
        <div className="section-heading section-heading-large"><div><span className="eyebrow">A platform with room for everything</span><h2>There is more than one way to be <em>inspired.</em></h2></div></div>
        <div className="pillar-cards">
          <article><span className="pillar-icon"><Sparkles size={19} aria-hidden="true" /></span><h3>Media made for you</h3><p>Podcasts, videos, stories, resources, and original Teens2Inspire content — all in one member experience.</p></article>
          <article><span className="pillar-icon"><School size={19} aria-hidden="true" /></span><h3>School programs</h3><p>Schools can bring Teens2Inspire to their students with a school code and a dedicated free access program.</p></article>
          <article><span className="pillar-icon"><CalendarDays size={19} aria-hidden="true" /></span><h3>Real-life connection</h3><p>Events, live experiences, Shabbatons, and opportunities to connect beyond a screen.</p></article>
        </div>
      </section>

      <section className="site-membership section-frame">
        <div><span className="eyebrow eyebrow-gold">Choose your way in</span><h2>Three ways to join.</h2><p>School access is free with a valid school code. Personal and Family memberships are paid subscriptions.</p></div>
        <div className="plan-grid">
          <article><span>School</span><strong>Free</strong><p>For girls whose school participates in Teens2Inspire.</p><Link href="/school" className="text-link">For schools <ArrowRight size={14} /></Link></article>
          <article><span>Personal</span><strong>$7.99<span>/month</span></strong><p>One profile for one member.</p><Link href="/signup?plan=personal" className="text-link">Choose Personal <ArrowRight size={14} /></Link></article>
          <article><span>Family</span><strong>$9.99<span>/month</span></strong><p>Up to three profiles under one membership.</p><Link href="/signup?plan=family" className="text-link">Choose Family <ArrowRight size={14} /></Link></article>
        </div>
      </section>

      <section className="site-cta"><span className="eyebrow eyebrow-gold">Start here</span><h2>Join the Teens2Inspire<br /><em>community.</em></h2><p>Create your account on the website, then get the media app.</p><Link href="/signup" className="button button-primary">Create an account <ArrowRight size={16} /></Link></section>
    </main>
  );
}
