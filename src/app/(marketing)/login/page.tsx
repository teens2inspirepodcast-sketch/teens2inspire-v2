import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AuthForm } from "@/components/auth-form";
export const metadata: Metadata = { title: "Log in" };
export default function LoginPage() { return <main className="auth-page"><div className="auth-photo-panel"><span className="eyebrow eyebrow-gold">Teens2Inspire account</span><h2>One account.<br /><em>Your inspiration.</em></h2><p>Log in here, then continue to the Teens2Inspire media app.</p><Link href="/download" className="text-link">How the app works <span aria-hidden="true">→</span></Link></div><div className="auth-panel"><Suspense fallback={<div className="auth-loading">Opening your account…</div>}><AuthForm mode="login" /></Suspense></div></main>; }
