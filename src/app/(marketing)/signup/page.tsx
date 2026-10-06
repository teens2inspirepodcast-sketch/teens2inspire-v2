import type { Metadata } from "next";
import Link from "next/link";
import { AuthForm } from "@/components/auth-form";

export const metadata: Metadata = { title: "Join Teens2Inspire" };

export default function SignupPage() {
  return <main className="auth-page"><div className="auth-photo-panel auth-burgundy-panel signup-burgundy-panel"><span className="eyebrow eyebrow-gold">Join Teens2Inspire</span><h2>Make your account.<br />Then enter the <em>app.</em></h2><p>Choose school, personal, or family access. Your media experience lives in the Teens2Inspire app.</p><Link href="/school" className="text-link">Learn about school access <span aria-hidden="true">→</span></Link></div><div className="auth-panel"><AuthForm mode="signup" /></div></main>;
}
