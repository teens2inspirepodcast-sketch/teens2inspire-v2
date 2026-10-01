import type { ReactNode } from "react";
import { requireUser, getOwnProfile } from "@/lib/auth";
import { V2Navigation } from "@/components/v2-navigation";

export const dynamic = "force-dynamic";

export default async function V2Layout({ children }: { children: ReactNode }) {
  const user = await requireUser();
  const profile = await getOwnProfile(user.id);
  return <div className="app-frame"><V2Navigation profile={profile} /><div className="app-main"><div className="app-topline"><span>Teens2Inspire <span aria-hidden="true">/</span> Your space</span><span className="topline-note">Made for your next chapter</span></div>{children}</div></div>;
}
