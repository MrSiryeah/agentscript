"use client";

import { useState } from "react";
import { Zap, CheckCircle2, X } from "lucide-react";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-md">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-100">
                <Zap className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Free trial used up</h2>
                <p className="text-sm text-slate-500">Upgrade to keep generating</p>
              </div>
            </div>
            {onClose && (
              <button onClick={onClose} className="btn-ghost p-1.5 -mr-1 -mt-1">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Plans */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <button
              onClick={() => starterPriceId && handleUpgrade(starterPriceId)}
              disabled={loading}
              className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 transition-all duration-150 text-left"
            >
              <div className="text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide">Starter</div>
              <div className="text-2xl font-bold text-slate-900">$49</div>
              <div className="text-xs text-slate-500 mb-3">/month</div>
              <ul className="space-y-1">
                {["All 4 tools", "100 / month"].map(f => (
                  <li key={f} className="flex items-center gap-1.5 text-xs text-slate-600">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-500 shrink-0" />{f}
                  </li>
                ))}
              </ul>
            </button>

            <button
              onClick={() => proPriceId && handleUpgrade(proPriceId)}
              disabled={loading}
              className="p-4 rounded-xl border-2 border-teal-500 bg-teal-50 hover:bg-teal-100 transition-all duration-150 text-left relative"
            >
              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[10px] px-2 py-0.5 rounded-full bg-teal-600 text-white font-bold">
                Popular
              </div>
              <div className="text-xs font-semibold text-teal-600 mb-1 uppercase tracking-wide">Pro</div>
              <div className="text-2xl font-bold text-slate-900">$99</div>
              <div className="text-xs text-slate-500 mb-3">/month</div>
              <ul className="space-y-1">
                {["All 4 tools", "Unlimited"].map(f => (
                  <li key={f} className="flex items-center gap-1.5 text-xs text-slate-600">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-500 shrink-0" />{f}
                  </li>
                ))}
              </ul>
            </button>
          </div>

          {onClose && (
            <p className="text-center text-xs text-slate-400 cursor-pointer hover:text-slate-600 transition-colors" onClick={onClose}>
              Maybe later
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
