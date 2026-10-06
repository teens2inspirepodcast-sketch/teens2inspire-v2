import Link from "next/link";
import { ArrowRight, CalendarDays, School, Users } from "lucide-react";

export default function HomePage() {
  return (
    <main>
      <section className="site-hero-simple">
        <div className="site-hero-simple-inner">
          <span className="eyebrow eyebrow-gold"><span className="eyebrow-line" />Teens2Inspire</span>
          <h1>A space for<br /><em>Jewish teen girls.</em></h1>
          <p>Inspiration, connection, and experiences created with Jewish teen girls in mind.</p>
          <div className="hero-actions">
            <Link href="/signup" className="button button-primary">Join Teens2Inspire <ArrowRight size={16} aria-hidden="true" /></Link>
            <Link href="/about" className="text-link">Our story <span aria-hidden="true">→</span></Link>
          </div>
        </div>
      </section>

      <section className="site-story section-frame">
        <div>
          <span className="eyebrow">Our story</span>
          <h2>Created for girls who want a place that feels <em>theirs.</em></h2>
        </div>
        <div className="site-story-copy">
          <p>Teens2Inspire is a platform created by Goldie Fishbaum for Jewish teen girls. It is a place to discover meaningful ideas, connect with inspiring people, and take part in experiences made for this stage of life.</p>
          <Link href="/about" className="text-link">Learn more about Teens2Inspire <ArrowRight size={15} aria-hidden="true" /></Link>
        </div>
      </section>

      <section className="site-app section-frame">
        <div className="site-app-copy">
          <span className="eyebrow eyebrow-gold">The Teens2Inspire app</span>
          <h2>Your account starts here.<br /><em>The experience continues in the app.</em></h2>
          <p>Teens2Inspire.org is your account hub. Once your account is ready, the separate Teens2Inspire media app is where the full content experience will live.</p>
          <Link href="/download" className="button button-outline">Get the app <ArrowRight size={15} aria-hidden="true" /></Link>
        </div>
        <div className="site-app-placeholder" aria-hidden="true">
          <div className="app-placeholder-top"><span>Teens2Inspire</span><span /></div>
          <div className="app-placeholder-body"><span className="eyebrow eyebrow-gold">Coming to the app</span><strong>Made for Jewish teen girls.</strong><span className="placeholder-line" /><span className="placeholder-line short" /></div>
        </div>
      </section>

      <section className="site-membership section-frame">
        <div>
          <span className="eyebrow eyebrow-gold">Three ways to join</span>
          <h2>Choose what works<br /><em>for you.</em></h2>
          <p>School access is free with a valid school code. Personal and Family memberships are paid subscriptions.</p>
        </div>
        <div className="plan-grid">
          <article>
            <span>School</span>
            <strong>Free</strong>
            <p>For girls whose school participates in Teens2Inspire.</p>
            <Link href="/school" className="text-link">Learn about schools <ArrowRight size={14} aria-hidden="true" /></Link>
          </article>
          <article>
            <span>Personal</span>
            <strong>$7.99<span>/month</span></strong>
            <p>One profile for one member.</p>
            <Link href="/signup?plan=personal" className="text-link">Choose Personal <ArrowRight size={14} aria-hidden="true" /></Link>
          </article>
          <article>
            <span>Family</span>
            <strong>$9.99<span>/month</span></strong>
            <p>Up to three profiles under one membership.</p>
            <Link href="/signup?plan=family" className="text-link">Choose Family <ArrowRight size={14} aria-hidden="true" /></Link>
          </article>
        </div>
      </section>

      <section className="site-pillars section-frame">
        <div className="section-heading section-heading-large">
          <div>
            <span className="eyebrow">More to come</span>
            <h2>A growing space for <em>Jewish teen girls.</em></h2>
          </div>
        </div>
        <div className="pillar-cards">
          <article><span className="pillar-icon"><Users size={19} aria-hidden="true" /></span><h3>Community</h3><p>Meaningful connection and a place to feel part of something.</p></article>
          <article><span className="pillar-icon"><School size={19} aria-hidden="true" /></span><h3>Schools</h3><p>Programs that bring Teens2Inspire into participating schools.</p></article>
          <article><span className="pillar-icon"><CalendarDays size={19} aria-hidden="true" /></span><h3>Events</h3><p>Live experiences, gatherings, Shabbatons, and more.</p></article>
        </div>
      </section>

      <section className="site-cta"><span className="eyebrow eyebrow-gold">Start here</span><h2>Join the Teens2Inspire<br /><em>community.</em></h2><p>Create your account on the website, then get the app.</p><Link href="/signup" className="button button-primary">Create an account <ArrowRight size={16} aria-hidden="true" /></Link></section>
    </main>
  );
}
