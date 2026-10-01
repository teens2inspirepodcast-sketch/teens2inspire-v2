import Link from "next/link";
import { ArrowRight, ArrowUpRight, BookOpen, Headphones, ShieldCheck } from "lucide-react";
import { EditorialPhoto } from "@/components/artwork";
import { ContentCard } from "@/components/content-card";
import { getPublishedContent } from "@/lib/content";

export default async function HomePage() {
  const [featured, recent, reads] = await Promise.all([
    getPublishedContent({ featured: true, limit: 4 }),
    getPublishedContent({ limit: 8 }),
    getPublishedContent({ type: "article", limit: 3 }),
  ]);
  const spotlight = featured[0] ?? recent[0];
  return (
    <main>
      <section className="home-hero">
        <div className="home-hero-copy">
          <span className="eyebrow eyebrow-gold"><span className="eyebrow-line" />A space to find your own voice</span>
          <h1>A little more <em>inspiration</em> for wherever you are.</h1>
          <p>Stories that stay with you. Voices you want to hear. A place to think about what matters to you, with a community that gets it.</p>
          <div className="hero-actions"><Link href="/discover" className="button button-primary">Find your next favorite <ArrowRight size={16} aria-hidden="true" /></Link><Link href="/about" className="text-link">Get to know us <span aria-hidden="true">→</span></Link></div>
          <div className="hero-note"><span className="note-rule" />Made with Jewish teen girls in mind</div>
        </div>
        <div className="home-hero-visual">
          <EditorialPhoto src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1120&q=86" alt="A young woman enjoying an unhurried moment outdoors" className="hero-photo" />
          <div className="hero-photo-wash" />
          <div className="hero-caption"><span>On growing into yourself</span><span>Stories for real life</span></div>
          <div className="hero-stamp"><span>YOUR<br />VOICE<br /><i>MATTERS</i></span><span className="stamp-rule" /></div>
          {spotlight && <Link className="hero-feature" href={`/v2/content/${spotlight.slug}`}><span className="feature-kicker">A place to start</span><span className="feature-title">{spotlight.title}</span><span className="feature-link">Explore story <ArrowUpRight size={15} aria-hidden="true" /></span></Link>}
        </div>
      </section>

      <section className="home-intro section-frame">
        <span className="eyebrow">You are already becoming</span>
        <h2>Curiosity looks good<br /><em>on you.</em></h2>
        <div className="intro-note"><p>Some days call for a good conversation. Some for a fresh perspective, a new voice, or the reminder that you do not have to have it all figured out.</p><p>Come as you are. Find something that feels like yours.</p><Link className="text-link" href="/about">A little about Teens2Inspire <span aria-hidden="true">→</span></Link></div>
      </section>

      {recent.length > 0 && <section className="home-library section-frame"><div className="section-heading section-heading-large"><div><span className="eyebrow">The good stuff, thoughtfully gathered</span><h2>Something to take with you</h2><p>Press play, turn a page, or save an idea for later.</p></div><Link className="text-link" href="/discover">Explore the library <ArrowUpRight size={14} aria-hidden="true" /></Link></div><div className="editorial-grid">{recent.slice(0, 4).map((item, index) => <ContentCard key={item.id} item={item} variant={index === 0 ? "wide" : "standard"} />)}</div></section>}

      <section className="home-pillars section-frame"><div className="pillar-heading"><span className="eyebrow">A space made for your kind of curious</span><h2>Different ways to<br /><em>feel inspired.</em></h2></div><div className="pillar-list"><Link href="/podcasts"><span className="pillar-icon"><Headphones size={19} aria-hidden="true" /></span><span><strong>Listen in</strong><small>Good conversations for walks, rides, and everything in between.</small></span><ArrowRight size={17} aria-hidden="true" /></Link><Link href="/articles"><span className="pillar-icon"><BookOpen size={19} aria-hidden="true" /></span><span><strong>Read a little</strong><small>Fresh perspectives for all the questions on your mind.</small></span><ArrowRight size={17} aria-hidden="true" /></Link><Link href="/membership"><span className="pillar-icon"><ShieldCheck size={19} aria-hidden="true" /></span><span><strong>Find your people</strong><small>Make room for a more connected, considered experience.</small></span><ArrowRight size={17} aria-hidden="true" /></Link></div></section>

      {reads.length > 0 && <section className="home-reading section-frame"><div className="reading-photo-wrap"><EditorialPhoto src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1000&q=82" alt="A quiet reading space filled with natural light" className="reading-photo" /><span className="reading-photo-note">A minute for yourself</span></div><div className="reading-copy"><span className="eyebrow eyebrow-gold">A good place to pause</span><h2>Room for big questions. <em>And little joys.</em></h2><p>There is no one right way to grow. Find words, ideas, and people that help you be a little more yourself.</p><Link href="/articles" className="button button-outline">Browse the latest reads <ArrowRight size={16} aria-hidden="true" /></Link></div></section>}

      <section className="home-cta"><span className="eyebrow eyebrow-gold">Come on in</span><h2>Your next favorite<br /><em>might be one click away.</em></h2><Link href="/signup" className="button button-primary">Find your place here <ArrowRight size={16} aria-hidden="true" /></Link><span className="cta-brand">Teens2Inspire</span></section>
    </main>
  );
}
