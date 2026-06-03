import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
  typescript: true,
});

export const PRICE_TO_TIER: Record<string, string> = {
  [process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID ?? ""]: "starter",
  [process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID ?? ""]: "pro",
  [process.env.NEXT_PUBLIC_STRIPE_TEAM_PRICE_ID ?? ""]: "team",
};

export const TIER_TO_PRICE: Record<string, string | undefined> = {
  starter: process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID,
  pro: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
  team: process.env.NEXT_PUBLIC_STRIPE_TEAM_PRICE_ID,
};
