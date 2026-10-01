import type { Metadata } from "next";
import { AuthForm } from "@/components/auth-form";
export const metadata: Metadata = { title: "Choose a new password" };
export default function UpdatePasswordPage() { return <main className="auth-page auth-recovery"><div className="auth-photo-panel"><span className="eyebrow eyebrow-gold">A fresh start</span><h2>One more step<br />and you are <em>back.</em></h2></div><div className="auth-panel"><AuthForm mode="new-password" /></div></main>; }
