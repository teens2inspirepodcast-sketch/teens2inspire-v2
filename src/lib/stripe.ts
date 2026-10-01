import "server-only";
import Stripe from "stripe";

let stripe: Stripe | undefined;

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("Stripe server configuration is incomplete.");
  stripe ??= new Stripe(key);
  return stripe;
}

export function stripeReadyForBilling() {
  return Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_PRICE_ID);
}
