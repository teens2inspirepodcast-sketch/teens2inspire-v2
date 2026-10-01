import Link from "next/link";
import { Brand } from "@/components/brand";

export function MarketingFooter() {
  return (
    <footer className="marketing-footer">
      <div className="footer-main">
        <div className="footer-brand-block"><Brand /><p>Ideas, voices, and stories for every part of who you are.</p></div>
        <div className="footer-links"><div><span className="eyebrow">Discover</span><Link href="/podcasts">Podcasts</Link><Link href="/videos">Videos</Link><Link href="/articles">Articles</Link><Link href="/events">Events</Link></div><div><span className="eyebrow">Teens2Inspire</span><Link href="/about">About</Link><Link href="/membership">Membership</Link><Link href="/contact">Contact</Link></div><div><span className="eyebrow">Your trust</span><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/contact?topic=safety">Safety support</Link></div></div>
      </div>
      <div className="footer-bottom"><span>Copyright {new Date().getFullYear()} Teens2Inspire</span><span>Made for a life in progress.</span></div>
    </footer>
  );
}
