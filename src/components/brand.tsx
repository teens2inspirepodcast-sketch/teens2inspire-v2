import Link from "next/link";

export function Brand({ compact = false, light = false }: { compact?: boolean; light?: boolean }) {
  return (
    <Link className={`brand${light ? " brand-light" : ""}${compact ? " brand-compact" : ""}`} href="/" aria-label="Teens2Inspire home">
      <span className="brand-mark" aria-hidden="true"><span>2</span></span>
      {!compact && <span className="brand-name">Teens2Inspire</span>}
    </Link>
  );
}
