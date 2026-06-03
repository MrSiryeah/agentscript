import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { ensureProfile } from "@/lib/supabase/ensure-profile";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { priceId } = await req.json();
  if (!priceId) {
    return NextResponse.json({ error: "Price ID required" }, { status: 400 });
  }

  const supabase = createServerSupabaseClient();
  const profile = await ensureProfile(userId);

  // ── Case 1: User already has an active subscription → switch plan in-place ──
  if (profile.stripe_subscription_id) {
    try {
      const subscription = await stripe.subscriptions.retrieve(profile.stripe_subscription_id);

      if (subscription.status === "active" || subscription.status === "trialing") {
        // Get the existing subscription item ID (the line item to replace)
        const itemId = subscription.items.data[0].id;

        // Swap the price — Stripe handles proration automatically
        const updated = await stripe.subscriptions.update(profile.stripe_subscription_id, {
          items: [{ id: itemId, price: priceId }],
          proration_behavior: "create_prorations",
        });

        // Sync the new tier to our DB immediately (webhook will also fire, but this is instant)
        const { PRICE_TO_TIER } = await import("@/lib/stripe");
        const newPriceId = updated.items.data[0].price.id;
        const newTier = PRICE_TO_TIER[newPriceId] ?? "starter";

        await supabase
          .from("profiles")
          .update({ subscription_tier: newTier })
          .eq("clerk_user_id", userId);

        return NextResponse.json({ switched: true, tier: newTier });
      }
    } catch (err) {
      console.error("Subscription update error:", err);
      // If the subscription no longer exists on Stripe, fall through to create a new checkout
    }
  }

  // ── Case 2: Free user (or expired sub) → create a Stripe Checkout Session ──
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    customer: profile.stripe_customer_id ?? undefined,
    customer_email: profile.stripe_customer_id ? undefined : profile.email,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing?upgraded=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing`,
    metadata: { clerk_user_id: userId },
    allow_promotion_codes: true,
  });

  return NextResponse.json({ url: session.url });
}
