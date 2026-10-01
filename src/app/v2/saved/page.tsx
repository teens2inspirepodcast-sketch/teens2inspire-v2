import type { Metadata } from "next";
import { requireUser } from "@/lib/auth";
import { getFavoriteContent } from "@/lib/content";
import { ContentCard } from "@/components/content-card";
export const metadata: Metadata = { title: "Saved" };
export default async function SavedPage() { const user = await requireUser(); const items = await getFavoriteContent(user.id); return <main className="saved-page"><header className="page-intro"><span className="eyebrow">Your personal library</span><h1>Keep the good ones close.</h1><p>Stories, voices, and ideas you have saved for another day.</p></header>{items.length ? <div className="content-grid">{items.map((item) => <ContentCard key={item.id} item={item} saved showSave basePath="/v2/content" />)}</div> : <div className="empty-state"><span className="empty-rule" /><h2>A little room for what you love.</h2><p>Tap the bookmark on anything you want to come back to. It will be waiting here.</p><a className="button button-primary" href="/v2/discover">Find something to save <span aria-hidden="true">→</span></a></div>}</main>; }
