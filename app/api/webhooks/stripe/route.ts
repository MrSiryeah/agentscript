import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { stripe, PRICE_TO_TIER } from "@/lib/stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const headerPayload = await headers();
  const sig = headerPayload.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 });
  }

  const supabase = createServerSupabaseClient();

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const clerkUserId = session.metadata?.clerk_user_id;
    const customerId = session.customer as string;
    const subscriptionId = session.subscription as string;

    if (clerkUserId && subscriptionId) {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      const priceId = subscription.items.data[0].price.id;
      const tier = PRICE_TO_TIER[priceId] ?? "starter";

      await supabase
        .from("profiles")
        .update({
          stripe_customer_id: customerId,
          stripe_subscription_id: subscriptionId,
          subscription_tier: tier,
        })
        .eq("clerk_user_id", clerkUserId);
    }
  }

  if (event.type === "customer.subscription.updated") {
    const subscription = event.data.object as Stripe.Subscription;
    const priceId = subscription.items.data[0].price.id;
    const tier = PRICE_TO_TIER[priceId] ?? "starter";

    await supabase
      .from("profiles")
      .update({ subscription_tier: tier })
      .eq("stripe_customer_id", subscription.customer as string);
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;

    await supabase
      .from("profiles")
      .update({ subscription_tier: "free", stripe_subscription_id: null })
      .eq("stripe_customer_id", subscription.customer as string);
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
