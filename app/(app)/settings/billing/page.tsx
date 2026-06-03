"use client";

import { useState, useEffect } from "react";
import { Loader2, CreditCard, Zap, CheckCircle2, TrendingUp, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { UsageMeter } from "@/components/shared/usage-meter";

interface ProfileData {
  subscription_tier: string;
  generation_count_this_month: number;
}

const PLANS = [
  {
    key: "starter",
    name: "Starter",
    price: "$49",
    period: "/month",
    limit: "100 generations",
    features: ["All 4 AI writing tools", "100 generations / month", "Generation history", "Email support"],
    color: "border-slate-200",
    badge: null,
  },
  {
    key: "pro",
    name: "Pro",
    price: "$99",
    period: "/month",
    limit: "Unlimited",
    features: ["All 4 AI writing tools", "Unlimited generations", "Priority support", "Advanced prompts"],
    color: "border-teal-400",
    badge: "Most Popular",
  },
  {
    key: "team",
    name: "Team",
    price: "$199",
    period: "/month",
    limit: "Unlimited · 5 seats",
    features: ["Everything in Pro", "Up to 5 team seats", "Shared brand voice", "Onboarding call"],
    color: "border-slate-200",
    badge: null,
  },
];

const MONTHLY_LIMITS: Record<string, number> = { free: 10, starter: 100, pro: 999999, team: 999999 };

export default function BillingPage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);
  const [upgradeLoading, setUpgradeLoading] = useState<string | null>(null);

  useEffect(() => {
    const fetch_ = async () => {
      const res = await fetch("/api/usage");
      if (res.ok) { const data = await res.json(); setProfile(data.profile); }
      setLoading(false);
    };
    fetch_();
  }, []);

  const handlePortal = async () => {
    setPortalLoading(true);
    const res = await fetch("/api/billing/portal", { method: "POST" });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    setPortalLoading(false);
  };

  const handleUpgrade = async (planKey: string) => {
    const priceId =
      planKey === "starter" ? process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID
      : planKey === "pro" ? process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID
      : process.env.NEXT_PUBLIC_STRIPE_TEAM_PRICE_ID;

    if (!priceId) { alert("Price not configured. Check .env.local"); return; }

    setUpgradeLoading(planKey);
    const res = await fetch("/api/billing/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    setUpgradeLoading(null);
  };

  const tier = profile?.subscription_tier ?? "free";
  const limit = MONTHLY_LIMITS[tier] ?? 10;
  const used = profile?.generation_count_this_month ?? 0;

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        {[...Array(3)].map((_, i) => <div key={i} className="h-32 shimmer rounded-xl" />)}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-7 animate-fade-in">
      {/* Current plan */}
      <div className="card p-6">
        <div className="flex items-start justify-between mb-5">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Current Plan</p>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl font-bold text-slate-900">
                {tier === "free" ? "Free Trial" : tier.charAt(0).toUpperCase() + tier.slice(1)}
              </h2>
              {tier !== "free" && (
                <span className="badge-teal">Active</span>
              )}
            </div>
          </div>
          {tier !== "free" && (
            <button onClick={handlePortal} disabled={portalLoading}
              className="btn-outline text-sm">
              {portalLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
              Manage Billing
            </button>
          )}
        </div>
        <UsageMeter used={used} limit={limit} tier={tier} />

        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Shield className="w-3.5 h-3.5 text-teal-500" />
            Cancel anytime
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <TrendingUp className="w-3.5 h-3.5 text-teal-500" />
            Resets monthly
          </div>
        </div>
      </div>

      {/* Plans */}
      <div>
        <h2 className="text-base font-bold text-slate-900 mb-4">
          {tier === "free" ? "Choose a plan to unlock more" : "Available Plans"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {PLANS.map((plan) => {
            const isCurrent = tier === plan.key;
            return (
              <div key={plan.key}
                className={cn("card p-5 flex flex-col relative transition-all duration-200",
                  plan.badge ? "border-2 border-teal-400 shadow-md" : "",
                  isCurrent && "ring-2 ring-teal-400 ring-offset-2"
                )}>
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-teal-600 text-white text-xs font-bold">
                    {plan.badge}
                  </div>
                )}
                {isCurrent && (
                  <div className="absolute -top-3 right-4 px-3 py-0.5 rounded-full bg-emerald-500 text-white text-xs font-bold">
                    Current
                  </div>
                )}

                <div className="mb-4">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{plan.name}</p>
                  <div className="flex items-end gap-0.5">
                    <span className="text-2xl font-extrabold text-slate-900">{plan.price}</span>
                    <span className="text-sm text-slate-400 mb-0.5">{plan.period}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{plan.limit}</p>
                </div>

                <ul className="space-y-2 flex-1 mb-5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs text-slate-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-500 shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>

                {isCurrent ? (
                  <div className="flex items-center justify-center gap-2 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold">
                    <CheckCircle2 className="w-4 h-4" /> Your Plan
                  </div>
                ) : (
                  <button
                    onClick={() => handleUpgrade(plan.key)}
                    disabled={!!upgradeLoading}
                    className={cn("w-full py-2.5 rounded-xl text-sm font-bold transition-all duration-150",
                      plan.badge
                        ? "bg-teal-600 text-white hover:bg-teal-700"
                        : "border border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                    )}>
                    {upgradeLoading === plan.key
                      ? <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                      : tier === "free" ? `Start ${plan.name}` : "Switch Plan"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {tier === "free" && (
        <p className="text-center text-xs text-slate-400">
          All plans include a 7-day money-back guarantee. No questions asked. Secured by Stripe.
        </p>
      )}
    </div>
  );
}
