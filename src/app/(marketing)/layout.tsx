import type { ReactNode } from "react";
import { createServerSupabase } from "@/lib/supabase/server";
import { MarketingNav } from "@/components/marketing-nav";
import { MarketingFooter } from "@/components/marketing-footer";

export default async function MarketingLayout({ children }: { children: ReactNode }) {
  const supabase = await createServerSupabase();
  // This only controls a cosmetic navigation link; protected pages verify users with getUser().
  const { data: { session } } = await supabase.auth.getSession();
  return <><MarketingNav signedIn={Boolean(session)} />{children}<MarketingFooter /></>;
}
