import type { Metadata } from "next";
import Link from "next/link";
import { Check, CreditCard, LockKeyhole, RefreshCw } from "lucide-react";
import { requireUser, getOwnProfile } from "@/lib/auth";
import { getMembershipSnapshot } from "@/lib/membership";
import { MembershipActions } from "@/components/membership-actions";
import { getStripe, stripeReadyForBilling } from "@/lib/stripe";

export const metadata: Metadata = { title: "Your membership", description: "Manage your Teens2Inspire membership and billing." };
export const dynamic = "force-dynamic";

async function getPlan() {
  if (!stripeReadyForBilling()) return null;
  try {
    const price = await getStripe().prices.retrieve(process.env.STRIPE_PRICE_ID!, { expand: ["product"] });
    if (!price.active || !price.recurring || price.unit_amount === null) return null;
    const amount = new Intl.NumberFormat("en-US", { style: "currency", currency: price.currency.toUpperCase(), maximumFractionDigits: 0 }).format(price.unit_amount / 100);
    return { amount, interval: price.recurring.interval };
  } catch { return null; }
}

export default async function V2MembershipPage({ searchParams }: { searchParams: Promise<{ checkout?: string }> }) {
  const user = await requireUser();
  const profile = await getOwnProfile(user.id);
  const [membership, plan, params] = await Promise.all([getMembershipSnapshot(user.id, profile), getPlan(), searchParams]);
  const sub = membership.subscription;
  const status = membership.activeSubscription ? "Active" : sub?.status ? sub.status.replaceAll("_", " ") : membership.activeLegacy ? "Active" : "Free account";
  const periodEnd = sub?.current_period_end ? new Intl.DateTimeFormat("en-US", { dateStyle: "long" }).format(new Date(sub.current_period_end)) : null;
  return <main className="settings-page membership-account-page"><header className="page-intro"><span className="eyebrow eyebrow-gold">A closer seat at the table</span><h1>Your membership.</h1><p>Your status, member experience, and billing details in one place.</p></header>
    {params.checkout === "complete" && <div className="membership-flash" role="status"><RefreshCw size={17} aria-hidden="true" /><div><strong>Payment received. Confirming your membership.</strong><span>Membership access appears after Stripe verifies the subscription and the webhook updates your account.</span></div></div>}
    {params.checkout === "cancelled" && <div className="membership-flash" role="status"><span><strong>Checkout was closed.</strong> You can return to membership whenever you are ready.</span></div>}
    <div className="membership-details-grid"><section className="profile-account membership-status-panel"><span className="eyebrow">Account status</span><h2>{status}</h2><div className="account-row"><span>Plan</span><strong>{membership.activeSubscription || membership.activeLegacy ? "Teens2Inspire membership" : "Free account"}</strong></div><div className="account-row"><span>Billing period</span><strong>{periodEnd ? `Through ${periodEnd}` : sub?.status === "active" ? "Managed by Stripe" : "No active billing period"}</strong></div><div className="account-row"><span>Renewal</span><strong>{sub?.cancel_at_period_end ? "Scheduled to end" : membership.activeSubscription ? "Renews automatically" : "Not subscribed"}</strong></div>
      <MembershipActions active={membership.isActive} canManage={Boolean(profile?.stripe_customer_id)} checkoutReady={stripeReadyForBilling()} />
    </section><section className="profile-account membership-benefits-panel"><span className="eyebrow">Made for your next chapter</span><h2>Keep the good things close.</h2><ul>{["A personal home for your saved stories and listening progress", "Member access to published members-only content", "A considered community where posts are reviewed before sharing", "Event registration and a private line to the Teens2Inspire team"].map((benefit) => <li key={benefit}><Check size={15} aria-hidden="true" />{benefit}</li>)}</ul>{plan && <p className="membership-price-inline"><strong>{plan.amount}</strong> / {plan.interval}</p>}{!plan && !membership.isActive && <p className="pricing-note">Membership checkout is being prepared by the Teens2Inspire team.</p>}<span className="membership-quiet"><LockKeyhole size={13} aria-hidden="true" /> Payments are handled by Stripe. Only verified subscription events change membership access.</span></section></div>
    <div className="membership-help"><CreditCard size={16} aria-hidden="true" /><span>Questions about your account?</span><Link href="/v2/messages" className="text-link">Message the Teens2Inspire team</Link></div>
  </main>;
}
