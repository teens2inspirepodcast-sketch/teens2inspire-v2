import type { Metadata } from "next";
import Link from "next/link";
import { Check, LockKeyhole } from "lucide-react";
import { getStripe, stripePriceIds } from "@/lib/stripe";

export const metadata: Metadata = {
  title: "Membership",
  description: "Explore a more personal Teens2Inspire experience.",
};

type Plan = {
  id: "personal" | "family";
  name: string;
  price: string;
  interval: string;
  description: string;
};

async function getPublishedPlans(): Promise<Plan[]> {
  const ids = stripePriceIds();
  if (!process.env.STRIPE_SECRET_KEY || !ids.personal || !ids.family) return [];

  try {
    const stripe = getStripe();
    const prices = await Promise.all([
      stripe.prices.retrieve(ids.personal, { expand: ["product"] }),
      stripe.prices.retrieve(ids.family, { expand: ["product"] }),
    ]);

    return prices.flatMap((price, index) => {
      if (!price.active || !price.recurring || price.unit_amount === null) return [];
      const id = index === 0 ? "personal" : "family";
      const amount = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: price.currency.toUpperCase(),
        maximumFractionDigits: 2,
      }).format(price.unit_amount / 100);
      return [{
        id,
        name: id === "personal" ? "Personal" : "Family",
        price: amount,
        interval: price.recurring.interval,
        description: id === "personal"
          ? "Your own Teens2Inspire membership."
          : "Membership for your household.",
      }];
    });
  } catch {
    return [];
  }
}

export default async function MembershipPage() {
  const plans = await getPublishedPlans();

  return (
    <main className="membership-page">
      <section className="membership-hero">
        <div className="membership-lead">
          <span className="eyebrow eyebrow-gold">A closer seat at the table</span>
          <h1>More room to<br /><em>make it yours.</em></h1>
          <p>For when you want more ways to listen, learn, save, and be part of the conversation.</p>

          <div className="membership-plan-options">
            {(plans.length ? plans : [
              { id: "personal" as const, name: "Personal", price: "$7.99", interval: "month", description: "Your own Teens2Inspire membership." },
              { id: "family" as const, name: "Family", price: "$9.99", interval: "month", description: "Membership for your household." },
            ]).map((plan) => (
              <div className="membership-plan-option" key={plan.id}>
                <span>
                  <strong>{plan.name}</strong>
                  <small>{plan.description}</small>
                </span>
                <span><strong>{plan.price}</strong> / {plan.interval}</span>
              </div>
            ))}
          </div>

          <div className="membership-price">
            <strong>{plans.length ? "Choose your plan" : "Membership"}</strong>
            <span> made for you</span>
            <small>{plans.length ? "Billed through Stripe. Cancel any time." : "Plan pricing is set by the Teens2Inspire team."}</small>
          </div>

          <div className="membership-plan-options">
            {["personal", "family"].map((plan) => (
              <Link
                key={plan}
                href={`/signup?next=${encodeURIComponent(`/v2/membership?plan=${plan}`)}`}
                className="button button-primary"
              >
                Choose {plan === "personal" ? "Personal" : "Family"} <span aria-hidden="true">→</span>
              </Link>
            ))}
          </div>

          <span className="membership-quiet"><LockKeyhole size={13} aria-hidden="true" /> Private by design. Stripe-secured checkout.</span>
        </div>

        <div className="membership-aside">
          <span className="membership-aside-number">01 <span>/ 03</span></span>
          <p>Thoughtful things to watch, hear, read, and return to.</p>
          <span className="membership-aside-rule" />
          <p>A personal library to save the ideas you want to keep close.</p>
          <span className="membership-aside-rule" />
          <p>A moderated space shaped around community and care.</p>
        </div>
      </section>

      <section className="membership-includes">
        <div><span className="eyebrow">A little more of what you love</span><h2>Keep the good things <em>close.</em></h2></div>
        <ul>
          {[
            "A personal home for your saved stories and listening progress",
            "Member access to published members-only content",
            "Community posts reviewed by the Teens2Inspire moderation team",
            "Event details, member registration, and a private line to our team",
          ].map((line) => <li key={line}><span><Check size={15} aria-hidden="true" /></span>{line}</li>)}
        </ul>
      </section>

      {!plans.length && <p className="pricing-note">Membership checkout will open as soon as the Teens2Inspire Stripe plans are connected. No membership is activated from a button or success page; verified subscription events are required.</p>}
    </main>
  );
}
