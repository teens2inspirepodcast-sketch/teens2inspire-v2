import type { Metadata } from "next";
import { requireUser, getOwnProfile } from "@/lib/auth";
import { ProfileForm } from "@/components/profile-form";
export const metadata: Metadata = { title: "Your profile" };
export default async function ProfilePage() { const user = await requireUser(); const profile = await getOwnProfile(user.id); return <main className="settings-page"><header className="page-intro"><span className="eyebrow">Your account</span><h1>Make yourself at home.</h1><p>Your name and interests help shape a more personal Teens2Inspire space.</p></header><ProfileForm profile={profile} email={user.email ?? ""} /></main>; }
