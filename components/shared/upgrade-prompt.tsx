"use client";

import { Zap } from "lucide-react";
import { useState } from "react";

interface UpgradePromptProps {
  onClose?: () => void;
}

export function UpgradePrompt({ onClose }: UpgradePromptProps) {
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async (priceId: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      setLoading(false);
    }
  };

  const starterPriceId = process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID;
  const proPriceId = process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className="gradient-border w-full max-w-md">
        <div className="p-6 text-center">
          {/* Icon */}
          <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 animate-glow-pulse">
            <Zap className="w-8 h-8 text-primary" />
          </div>

          <h2 className="text-xl font-bold text-foreground mb-2">
            You&apos;ve used all free generations
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            Upgrade to keep writing. Pro gives you unlimited generations, all tools, and priority support.
          </p>

          {/* Plans */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <button
              onClick={() => starterPriceId && handleUpgrade(starterPriceId)}
              disabled={loading}
              className="p-4 rounded-xl border border-border hover:border-border/80 bg-secondary/30 hover:bg-secondary/50 transition-all duration-150 text-left"
            >
              <div className="text-sm font-semibold text-foreground mb-1">Starter</div>
              <div className="text-2xl font-bold text-foreground">$49</div>
              <div className="text-xs text-muted-foreground">/month · 100 generations</div>
            </button>

            <button
              onClick={() => proPriceId && handleUpgrade(proPriceId)}
              disabled={loading}
              className="p-4 rounded-xl border border-primary/40 bg-primary/5 hover:bg-primary/10 transition-all duration-150 text-left relative overflow-hidden"
            >
              <div className="absolute top-2 right-2 text-xs px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground font-semibold">
                Popular
              </div>
              <div className="text-sm font-semibold text-primary mb-1">Pro</div>
              <div className="text-2xl font-bold text-foreground">$99</div>
              <div className="text-xs text-muted-foreground">/month · Unlimited</div>
            </button>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Maybe later
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
