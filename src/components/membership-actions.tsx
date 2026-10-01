"use client";

import { useState } from "react";
import { ArrowUpRight, LoaderCircle } from "lucide-react";
import Link from "next/link";

export function MembershipActions({ active, canManage, checkoutReady }: { active: boolean; canManage: boolean; checkoutReady: boolean }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function open(endpoint: string) {
    setBusy(true); setError("");
    const response = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" }).catch(() => null);
    const payload = await response?.json().catch(() => null);
    if (response?.ok && payload?.url) window.location.assign(payload.url);
    else { setError(payload?.error ?? "Billing is temporarily unavailable. Please try again."); setBusy(false); }
  }
  if (active && canManage) return <div className="membership-action-stack"><button className="button button-primary" type="button" disabled={busy} onClick={() => open("/api/stripe/portal")}>{busy ? <LoaderCircle size={15} className="spin" /> : <>Manage billing <ArrowUpRight size={14} /></>}</button><p>Update your payment method, review invoices, or cancel through Stripe.</p>{error && <p className="form-error" role="alert">{error}</p>}</div>;
  if (active) return <div className="membership-action-stack"><p>Your Teens2Inspire membership is active. For billing changes, message the support team.</p><Link className="text-link" href="/v2/messages">Ask about membership billing</Link></div>;
  return <div className="membership-action-stack"><button className="button button-primary" type="button" disabled={busy || !checkoutReady} onClick={() => open("/api/stripe/checkout")}>{busy ? <LoaderCircle size={15} className="spin" /> : "Become a member"}</button>{!checkoutReady && <p>Checkout is not available yet. The Teens2Inspire team is connecting membership billing.</p>}{error && <p className="form-error" role="alert">{error}</p>}{checkoutReady && <p>Stripe securely handles payment. Your membership starts after payment is verified.</p>}</div>;
}
