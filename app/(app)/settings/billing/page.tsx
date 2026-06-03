"use client";

import { useState, useEffect } from "react";
import { Loader2, CreditCard, Zap, CheckCircle2 } from "lucide-react";

interface ProfileData {
  subscription_tier: string;
  generation_count_this_month: number;
}

const PLAN_FEATURES: Record<string, { price: string; limit: string; features: string[] }> = {
  free: {
    price: "Free",
    limit: "10 generations",
    features: ["All 4 writing tools", "10 generations/month", "Email support"],
  },
  starter: {
    price: "$49/mo",
    limit: "100 generations",
    features: ["All 4 writing tools", "100 generations/month", "Email support"],
  },
  pro: {
    price: "$99/mo",
    limit: "Unlimited",
    features: ["All 4 writing tools", "Unlimited generations", "Priority support", "Usage analytics"],
  },
  team: {
    price: "$199/mo",
    limit: "Unlimited",
    features: ["All Pro features", "Up to 5 seats", "Shared brand voice", "Onboarding call"],
  },
};

export default function BillingPage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);
  const [upgradeLoading, setUpgradeLoading] = useState<string | null>(null);

  useEffect(() => {
    const fetch_ = async () => {
      const res = await fetch("/api/usage");
      if (res.ok) {
        const data = await res.json();
        setProfile(data.profile);
      }
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

  const handleUpgrade = async (priceEnvKey: string) => {
    const priceId = priceEnvKey === "starter"
      ? process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID
      : priceEnvKey === "pro"
      ? process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID
      : process.env.NEXT_PUBLIC_STRIPE_TEAM_PRICE_ID;

    if (!priceId) { alert("Price not configured yet. Check .env.local"); return; }

    setUpgradeLoading(priceEnvKey);
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
  const currentPlan = PLAN_FEATURES[tier];

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        {[...Array(2)].map((_, i) => <div key={i} className="h-32 shimmer rounded-xl" />)}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Billing & Plan</h1>
        <p className="text-muted-foreground mt-1 text-sm">Manage your subscription and usage.</p>
      </div>

      {/* Current Plan */}
      <div className="glass-card p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                {tier === "free" ? "Free Trial" : tier.charAt(0).toUpperCase() + tier.slice(1)} Plan
              </span>
            </div>
            <p className="text-2xl font-bold text-foreground">{currentPlan.price}</p>
            <p className="text-sm text-muted-foreground">{currentPlan.limit}/month</p>
          </div>
          {tier !== "free" && (
            <button
              onClick={handlePortal}
              disabled={portalLoading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:border-border/80 transition-all duration-150"
            >
              {portalLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
              Manage Billing
            </button>
          )}
        </div>

        <ul className="space-y-2">
          {currentPlan.features.map((f) => (
            <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
              {f}
            </li>
          ))}
        </ul>
      </div>

      {/* Upgrade options */}
      {tier === "free" && (
        <div className="space-y-3">
          <h2 className="text-base font-semibold text-foreground">Upgrade Your Plan</h2>
          {(["starter", "pro", "team"] as const).map((plan) => {
            const p = PLAN_FEATURES[plan];
            return (
              <div
                key={plan}
                className={`glass-card p-5 flex items-center justify-between ${
                  plan === "pro" ? "border-primary/30 bg-primary/5" : ""
                }`}
              >
                <div>
                  {plan === "pro" && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary text-primary-foreground font-semibold mb-2 inline-block">
                      Most Popular
                    </span>
                  )}
                  <p className="font-semibold text-foreground capitalize">{plan}</p>
                  <p className="text-sm text-muted-foreground">{p.limit} · {p.price}</p>
                </div>
                <button
                  onClick={() => handleUpgrade(plan)}
                  disabled={upgradeLoading === plan}
                  className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${
                    plan === "pro"
                      ? "btn-gold"
                      : "border border-border text-muted-foreground hover:text-foreground hover:border-border/80"
                  }`}
                >
                  {upgradeLoading === plan ? <Loader2 className="w-4 h-4 animate-spin" /> : "Upgrade"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
