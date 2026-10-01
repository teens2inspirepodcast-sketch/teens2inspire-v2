import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AuthForm } from "@/components/auth-form";
export const metadata: Metadata = { title: "Log in" };
export default function LoginPage() { return <main className="auth-page"><div className="auth-photo-panel"><span className="eyebrow eyebrow-gold">Your space, just as you left it</span><h2>A good idea<br />is worth <em>coming back to.</em></h2><Link href="/discover" className="text-link">See what is new <span aria-hidden="true">→</span></Link></div><div className="auth-panel"><Suspense fallback={<div className="auth-loading">Opening your account…</div>}><AuthForm mode="login" /></Suspense></div></main>; }
