import type { Metadata } from "next";
import { AuthForm } from "@/components/auth-form";
export const metadata: Metadata = { title: "Reset your password" };
export default function ForgotPasswordPage() { return <main className="auth-page auth-recovery"><div className="auth-photo-panel"><span className="eyebrow eyebrow-gold">We will help you get back in</span><h2>Your library<br />is still <em>here.</em></h2></div><div className="auth-panel"><AuthForm mode="recovery" /></div></main>; }
