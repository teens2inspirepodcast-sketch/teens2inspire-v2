import type { Metadata } from "next";
import Link from "next/link";
import { AuthForm } from "@/components/auth-form";
export const metadata: Metadata = { title: "Create an account" };
export default function SignupPage() { return <main className="auth-page"><div className="auth-photo-panel signup-photo"><span className="eyebrow eyebrow-gold">A fresh page</span><h2>More curious.<br />More <em>you.</em></h2><p>A place to follow a thought, hear a new voice, and save what speaks to you.</p><Link href="/about" className="text-link">What Teens2Inspire is about <span aria-hidden="true">→</span></Link></div><div className="auth-panel"><AuthForm mode="signup" /></div></main>; }
