import type { Metadata } from "next";
import Link from "next/link";
import { Check, LockKeyhole } from "lucide-react";
import { getStripe } from "@/lib/stripe";

export const metadata: Metadata = { title: "Membership", description: "Explore a more personal Teens2Inspire experience." };

async function getPublishedPlan() {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_PRICE_ID) return null;
  try {
    const stripe = getStripe();
    const price = await stripe.prices.retrieve(process.env.STRIPE_PRICE_ID, { expand: ["product"] });
    if (!price.active || !price.recurring || price.unit_amount === null) return null;
    const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: price.currency.toUpperCase(), maximumFractionDigits: 0 });
    return { price: currency.format(price.unit_amount / 100), interval: price.recurring.interval };
  } catch { return null; }
}

export default async function MembershipPage() {
  const plan = await getPublishedPlan();
  return <main className="membership-page"><section className="membership-hero"><div className="membership-lead"><span className="eyebrow eyebrow-gold">A closer seat at the table</span><h1>More room to<br /><em>make it yours.</em></h1><p>For when you want more ways to listen, learn, save, and be part of the conversation.</p><div className="membership-price">{plan ? <><strong>{plan.price}</strong><span> / {plan.interval === "year" ? "year" : plan.interval === "month" ? "month" : plan.interval}</span></> : <><strong>Membership</strong><span> made for you</span></>}<small>{plan ? "Billed through Stripe. Cancel any time." : "Plan pricing is set by the Teens2Inspire team."}</small></div><Link href="/signup?next=/v2/membership" className="button button-primary">Create your account <span aria-hidden="true">→</span></Link><span className="membership-quiet"><LockKeyhole size={13} aria-hidden="true" /> Private by design. Stripe-secured checkout.</span></div><div className="membership-aside"><span className="membership-aside-number">01 <span>/ 03</span></span><p>Thoughtful things to watch, hear, read, and return to.</p><span className="membership-aside-rule" /><p>A personal library to save the ideas you want to keep close.</p><span className="membership-aside-rule" /><p>A moderated space shaped around community and care.</p></div></section><section className="membership-includes"><div><span className="eyebrow">A little more of what you love</span><h2>Keep the good things <em>close.</em></h2></div><ul>{["A personal home for your saved stories and listening progress", "Member access to published members-only content", "Community posts reviewed by the Teens2Inspire moderation team", "Event details, member registration, and a private line to our team"].map((line) => <li key={line}><span><Check size={15} aria-hidden="true" /></span>{line}</li>)}</ul></section>{!plan && <p className="pricing-note">Membership checkout will open as soon as the Teens2Inspire Stripe plan is connected. No membership is activated from a button or success page; verified subscription events are required.</p>}</main>;
}
