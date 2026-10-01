"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import { createBrowserSupabase } from "@/lib/supabase/browser";

type Mode = "login" | "signup" | "recovery" | "new-password";

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    setBusy(true);
    const form = new FormData(event.currentTarget);
    const supabase = createBrowserSupabase();
    const email = String(form.get("email") ?? "").trim().toLowerCase();
    const password = String(form.get("password") ?? "");
    try {
      if (mode === "login") {
        const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
        if (authError) throw authError;
        const next = new URLSearchParams(window.location.search).get("next");
        router.replace(next?.startsWith("/v2") ? next : "/v2/dashboard");
        router.refresh();
      } else if (mode === "signup") {
        const firstName = String(form.get("first_name") ?? "").trim();
        const displayName = String(form.get("display_name") ?? "").trim();
        const { data, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback?next=/v2/dashboard`,
            data: {
              first_name: firstName,
              display_name: displayName,
              age_group: "13plus",
              membership_tier: "personal",
              accepted_terms_at: new Date().toISOString(),
            },
          },
        });
        if (authError) throw authError;
        if (data.session) {
          router.replace("/v2/dashboard");
          router.refresh();
        } else {
          setMessage("Check your inbox for a secure link to finish creating your account.");
        }
      } else if (mode === "recovery") {
        const { error: authError } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/auth/callback?next=/update-password` });
        if (authError) throw authError;
        setMessage("If an account matches that address, a password reset link is on its way.");
      } else {
        const { error: authError } = await supabase.auth.updateUser({ password });
        if (authError) throw authError;
        setMessage("Your password has been updated.");
        window.setTimeout(() => router.replace("/v2/settings"), 900);
      }
    } catch {
      setError(mode === "login" ? "Those sign-in details did not work. Check them and try again." : mode === "signup" ? "We could not create your account. Check the form and try again." : "We could not complete that request. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  const title = mode === "login" ? "Welcome back" : mode === "signup" ? "Make this space yours" : mode === "recovery" ? "Reset your password" : "Choose a new password";
  const cta = mode === "login" ? "Log in" : mode === "signup" ? "Create my account" : mode === "recovery" ? "Send reset link" : "Save new password";

  return (
    <form className="auth-form" onSubmit={submit}>
      <div className="auth-heading"><span className="eyebrow">Teens2Inspire account</span><h1>{title}</h1><p>{mode === "login" ? "Your next listen, read, and good idea are right where you left them." : mode === "signup" ? "A thoughtful little corner for inspiration, good questions, and new perspectives." : mode === "recovery" ? "Enter the email address linked to your account." : "Your new password needs at least 10 characters."}</p></div>
      {mode === "signup" && <div className="form-row"><label>First name<input name="first_name" autoComplete="given-name" minLength={1} maxLength={60} required /></label><label>What should we call you?<input name="display_name" autoComplete="nickname" minLength={1} maxLength={40} required /></label></div>}
      {mode !== "new-password" && <label>Email address<input name="email" type="email" autoComplete="email" required maxLength={254} placeholder="you@example.com" /></label>}
      {mode !== "recovery" && <label>Password<span className="password-control"><input name="password" type={showPassword ? "text" : "password"} autoComplete={mode === "login" ? "current-password" : "new-password"} required minLength={10} maxLength={128} /><button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></span></label>}
      {mode === "signup" && <label className="consent-check"><input type="checkbox" required /><span>I am at least 13 years old. I have a parent or guardian’s permission to use Teens2Inspire if I am under 18.</span></label>}
      {error && <p className="form-error" role="alert">{error}</p>}
      {message && <p className="form-success" role="status">{message}</p>}
      <button className="button button-primary auth-submit" type="submit" disabled={busy}>{busy ? <><LoaderCircle size={17} className="spin" aria-hidden="true" />Working</> : cta}</button>
      {mode === "login" && <Link className="form-quiet-link" href="/forgot-password">Forgot your password?</Link>}
      {mode === "login" && <p className="auth-switch">New to Teens2Inspire? <Link href="/signup">Create an account</Link></p>}
      {mode === "signup" && <p className="auth-switch">Already have an account? <Link href="/login">Log in</Link></p>}
      {(mode === "recovery" || mode === "new-password") && <p className="auth-switch"><Link href="/login">Back to log in</Link></p>}
    </form>
  );
}
