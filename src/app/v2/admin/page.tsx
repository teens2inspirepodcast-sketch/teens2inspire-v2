import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAdministrator } from "@/lib/auth";
import { createServerSupabase } from "@/lib/supabase/server";
import { AdminStudio } from "@/components/admin-studio";

export const metadata: Metadata = { title: "Content studio" };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  await requireAdministrator();
  const supabase = await createServerSupabase();
  const [contentResult, categoriesResult, sectionsResult] = await Promise.all([
    supabase.from("content").select("*").order("updated_at", { ascending: false }).limit(100),
    supabase.from("categories").select("*").eq("is_active", true).order("display_order"),
    supabase.from("sections").select("*").order("display_order"),
  ]);
  if (contentResult.error || categoriesResult.error || sectionsResult.error) redirect("/v2/dashboard?notice=studio-unavailable");
  const ids = (contentResult.data ?? []).map((item) => item.id);
  const { data: assignments } = ids.length ? await supabase.from("section_content").select("content_id, section_id").in("content_id", ids) : { data: [] };
  const assignedSections: Record<string, string[]> = {};
  for (const assignment of assignments ?? []) assignedSections[assignment.content_id] = [...(assignedSections[assignment.content_id] ?? []), assignment.section_id];
  return <main className="admin-page"><header className="admin-page-heading"><div><span className="eyebrow eyebrow-gold">Teens2Inspire editorial</span><h1>Content studio.</h1><p>Publish stories, manage categories, and shape the member homepage.</p></div><div className="admin-header-actions"><span className="admin-badge">Administrator</span><Link href="/v2/admin/community" className="button button-secondary">Community moderation</Link></div></header><AdminStudio content={contentResult.data ?? []} categories={categoriesResult.data ?? []} sections={sectionsResult.data ?? []} assignments={assignedSections} /></main>;
}
