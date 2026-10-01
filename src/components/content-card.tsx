import Link from "next/link";
import { ArrowUpRight, Clock3 } from "lucide-react";
import { contentTypeLabels, formatDuration, type Content } from "@/lib/content";
import { Artwork } from "@/components/artwork";
import { FavoriteButton } from "@/components/favorite-button";

export function ContentCard({ item, saved = false, showSave = false, variant = "standard", basePath = "/content" }: {
  item: Content;
  saved?: boolean;
  showSave?: boolean;
  variant?: "standard" | "wide";
  basePath?: string;
}) {
  const duration = formatDuration(item.duration_seconds);
  return (
    <article className={`content-card content-card-${variant}`}>
        <Link className="content-card-main" href={`${basePath}/${item.slug}`} aria-label={`Open ${item.title}`}>
        <Artwork item={item} className="content-card-art" />
        <span className="content-kind">{contentTypeLabels[item.type] ?? "Story"}</span>
        <span className="content-card-title">{item.title}</span>
        <span className="content-card-meta">
          {duration && <span><Clock3 size={13} aria-hidden="true" />{duration}</span>}
          {item.category && <span>{item.category}</span>}
        </span>
      </Link>
      {showSave && <FavoriteButton contentId={item.id} initiallySaved={saved} className="content-card-save" />}
    </article>
  );
}

export function ContentShelf({ title, subtitle, items, savedIds, href, basePath = "/content" }: {
  title: string;
  subtitle?: string;
  items: Content[];
  savedIds?: Set<string>;
  href?: string;
  basePath?: string;
}) {
  if (!items.length) return null;
  return (
    <section className="content-shelf" aria-label={title}>
      <div className="section-heading">
        <div>
          <h2>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>
        {href && <Link className="text-link" href={href}>View all <ArrowUpRight size={14} aria-hidden="true" /></Link>}
      </div>
      <div className="shelf-track">
        {items.map((item) => <ContentCard key={item.id} item={item} saved={savedIds?.has(item.id)} showSave={Boolean(savedIds)} basePath={basePath} />)}
      </div>
    </section>
  );
}
