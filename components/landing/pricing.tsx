"use client";

import Link from "next/link";
import { CheckCircle2, Zap } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "$49",
    period: "/month",
    description: "Perfect for solo agents starting with AI",
    limit: "100 generations/month",
    features: [
      "All 4 writing tools",
      "100 AI generations/month",
      "Generation history (last 50)",
      "1 user seat",
      "Email support",
    ],
    priceId: "NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$99",
    period: "/month",
    description: "For agents who want unlimited output",
    limit: "Unlimited generations",
    features: [
      "Everything in Starter",
      "Unlimited AI generations",
      "Custom tone & market profile",
      "Priority support",
      "Usage analytics",
    ],
    priceId: "NEXT_PUBLIC_STRIPE_PRO_PRICE_ID",
    highlight: true,
  },
  {
    name: "Team",
    price: "$199",
    period: "/month",
    description: "For small agencies and teams",
    limit: "Unlimited · 5 seats",
    features: [
      "Everything in Pro",
      "Up to 5 user seats",
      "Shared brand voice profile",
      "Team usage dashboard",
      "Onboarding call included",
    ],
    priceId: "NEXT_PUBLIC_STRIPE_TEAM_PRICE_ID",
    highlight: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
          Simple, transparent pricing
        </h2>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          One lead closed pays for a full year of Pro. No contracts, cancel anytime.
        </p>
      </div>

      {/* Free trial banner */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-primary/30 bg-primary/5 text-sm font-medium text-primary">
          <Zap className="w-4 h-4" />
          Start with 10 free generations — no credit card required
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative rounded-2xl p-8 flex flex-col ${
              plan.highlight
                ? "bg-primary/5 border border-primary/30"
                : "glass-card"
            }`}
          >
            {plan.highlight && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                Most Popular
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-lg font-bold text-foreground mb-1">{plan.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-foreground">{plan.price}</span>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>
              <p className="text-sm text-primary font-medium mt-1">{plan.limit}</p>
            </div>

            <ul className="space-y-3 flex-1 mb-8">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>

            <Link
              href="/sign-up"
              className={`block w-full text-center py-3 rounded-xl font-semibold text-sm transition-all duration-150 ${
                plan.highlight
                  ? "btn-gold"
                  : "border border-border text-muted-foreground hover:text-foreground hover:border-border/80"
              }`}
            >
              {plan.highlight ? "Get Started →" : "Choose Plan"}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
