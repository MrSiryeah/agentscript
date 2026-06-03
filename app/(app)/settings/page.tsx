"use client";

import { useState, useEffect } from "react";
import { Loader2, Save, User, Building2, MapPin, Check, ExternalLink, CreditCard, Zap, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface ProfileData {
  full_name: string;
  agency_name: string;
  market_location: string;
  subscription_tier: string;
  generation_count_this_month: number;
}

const MARKET_PRESETS = ["US", "UK", "Australia", "Malta", "UAE", "South Africa", "Canada", "New Zealand"];

const PLAN_INFO: Record<string, { label: string; price: string; limit: string; color: string }> = {
  free: { label: "Free Trial", price: "Free", limit: "10 / month", color: "bg-slate-100 text-slate-600 border-slate-200" },
  starter: { label: "Starter", price: "$49/mo", limit: "100 / month", color: "bg-blue-50 text-blue-700 border-blue-200" },
  pro: { label: "Pro", price: "$99/mo", limit: "Unlimited", color: "bg-teal-50 text-teal-700 border-teal-200" },
  team: { label: "Team", price: "$199/mo", limit: "Unlimited · 5 seats", color: "bg-violet-50 text-violet-700 border-violet-200" },
};

export default function SettingsPage() {
  const [form, setForm] = useState<ProfileData>({
    full_name: "",
    agency_name: "",
    market_location: "US",
    subscription_tier: "free",
    generation_count_this_month: 0,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetch_ = async () => {
      const res = await fetch("/api/usage");
      if (res.ok) {
        const data = await res.json();
        setForm({
          full_name: data.profile?.full_name ?? "",
          agency_name: data.profile?.agency_name ?? "",
          market_location: data.profile?.market_location ?? "US",
          subscription_tier: data.profile?.subscription_tier ?? "free",
          generation_count_this_month: data.profile?.generation_count_this_month ?? 0,
        });
      }
      setLoading(false);
    };
    fetch_();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: form.full_name,
          agency_name: form.agency_name,
          market_location: form.market_location,
        }),
      });
      if (!res.ok) throw new Error("Save failed");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const tier = form.subscription_tier;
  const planInfo = PLAN_INFO[tier] ?? PLAN_INFO.free;

  if (loading) {
    return (
      <div className="max-w-xl mx-auto space-y-4">
        {[...Array(4)].map((_, i) => <div key={i} className="h-14 shimmer rounded-xl" />)}
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-fade-in">
      {/* Plan badge */}
      <div className="card p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-teal-50 border border-teal-100">
            <Zap className="w-4.5 h-4.5 text-teal-600" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Current Plan</p>
            <div className="flex items-center gap-2">
              <p className="text-sm font-bold text-slate-900">{planInfo.label}</p>
              <span className={cn("badge border text-xs", planInfo.color)}>{planInfo.limit}</span>
            </div>
          </div>
        </div>
        <Link href="/settings/billing" className="btn-outline text-xs py-2 px-3.5">
          <CreditCard className="w-3.5 h-3.5" />
          Manage
        </Link>
      </div>

      {/* Profile form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="card p-6 space-y-5">
          <div className="flex items-center gap-3 pb-1">
            <div className="icon-wrap"><User className="w-4.5 h-4.5 text-teal-600" /></div>
            <div>
              <h2 className="text-sm font-semibold text-slate-800">Profile Details</h2>
              <p className="text-xs text-slate-400">Used to personalise every AI output</p>
            </div>
          </div>

          <div>
            <label className="field-label">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input type="text" placeholder="e.g. Andrew Camilleri"
                value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                className="field-input pl-9" />
            </div>
            <p className="text-xs text-slate-400 mt-1">Used to sign emails and offer letters.</p>
          </div>

          <div>
            <label className="field-label">Agency / Brokerage</label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input type="text" placeholder="e.g. Sunshine Realty Group"
                value={form.agency_name} onChange={(e) => setForm({ ...form, agency_name: e.target.value })}
                className="field-input pl-9" />
            </div>
          </div>

          <div>
            <label className="field-label">Primary Market</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input type="text" placeholder="e.g. Miami, FL"
                value={form.market_location} onChange={(e) => setForm({ ...form, market_location: e.target.value })}
                className="field-input pl-9" />
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {MARKET_PRESETS.map((m) => (
                <button key={m} type="button"
                  onClick={() => setForm({ ...form, market_location: m })}
                  className={cn("px-2.5 py-1 rounded-lg text-xs font-medium border transition-all duration-150",
                    form.market_location === m
                      ? "bg-teal-50 border-teal-300 text-teal-700"
                      : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
                  )}>
                  {m}
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-2">Helps the AI use local terminology and market context.</p>
          </div>
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <button type="submit" disabled={saving}
          className={cn("btn-primary w-full py-3 transition-all duration-200",
            saved && "!bg-emerald-500 !hover:bg-emerald-600"
          )}>
          {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
            : saved ? <><Check className="w-4 h-4" /> Saved!</>
            : <><Save className="w-4 h-4" /> Save Changes</>}
        </button>
      </form>

      {/* Links */}
      <div className="card divide-y divide-slate-100">
        <a href="https://clerk.com/user" target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50 transition-colors group">
          <div>
            <p className="text-sm font-medium text-slate-700">Account & Password</p>
            <p className="text-xs text-slate-400">Manage your login credentials via Clerk</p>
          </div>
          <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition-colors" />
        </a>
        <Link href="/settings/billing"
          className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50 transition-colors group">
          <div>
            <p className="text-sm font-medium text-slate-700">Billing & Subscription</p>
            <p className="text-xs text-slate-400">View plans, invoices, and cancel anytime</p>
          </div>
          <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition-colors" />
        </Link>
      </div>
    </div>
  );
}
