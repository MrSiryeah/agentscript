"use client";

import { useState } from "react";
import { Loader2, Zap, MapPin, Building2, User } from "lucide-react";
import { cn } from "@/lib/utils";

const MARKET_PRESETS = ["US", "UK", "Australia", "Malta", "UAE", "South Africa", "Canada", "New Zealand"];

interface OnboardingModalProps {
  onComplete: () => void;
}

export function OnboardingModal({ onComplete }: OnboardingModalProps) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    full_name: "",
    agency_name: "",
    market_location: "US",
  });
  const [saving, setSaving] = useState(false);

  const handleComplete = async () => {
    setSaving(true);
    try {
      await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } catch { /* silent */ }
    setSaving(false);
    localStorage.setItem("agentscript_onboarded", "true");
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-md overflow-hidden">
        {/* Progress bar */}
        <div className="h-1 bg-slate-100">
          <div className="h-full bg-teal-500 transition-all duration-500 rounded-full"
            style={{ width: `${(step / 3) * 100}%` }} />
        </div>

        <div className="p-7">
          {step === 1 && (
            <div className="animate-slide-up">
              <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-teal-50 border border-teal-100 mx-auto mb-5">
                <Zap className="w-7 h-7 text-teal-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 text-center mb-1">Welcome to AgentScript! 🎉</h2>
              <p className="text-sm text-slate-500 text-center mb-6">
                Let's set up your profile so every AI output is personalised to you. It takes 30 seconds.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="field-label">Your Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input type="text" placeholder="e.g. Andrew Camilleri" autoFocus
                      value={form.full_name}
                      onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                      className="field-input pl-9" />
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Used to sign emails and offer letters.</p>
                </div>
              </div>

              <button onClick={() => setStep(2)}
                className="btn-primary w-full mt-6 py-3">
                Continue →
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="animate-slide-up">
              <h2 className="text-lg font-bold text-slate-900 mb-1">Your Brokerage</h2>
              <p className="text-sm text-slate-400 mb-5">Optional — we'll include it in emails and listing descriptions.</p>

              <div>
                <label className="field-label">Agency / Brokerage Name</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input type="text" placeholder="e.g. Sunshine Realty Group" autoFocus
                    value={form.agency_name}
                    onChange={(e) => setForm({ ...form, agency_name: e.target.value })}
                    className="field-input pl-9" />
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <button onClick={() => setStep(1)} className="btn-outline flex-1 py-2.5">← Back</button>
                <button onClick={() => setStep(3)} className="btn-primary flex-1 py-2.5">Continue →</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-slide-up">
              <h2 className="text-lg font-bold text-slate-900 mb-1">Your Market</h2>
              <p className="text-sm text-slate-400 mb-5">
                This tells the AI which country's conventions, terminology, and pricing norms to follow.
              </p>

              <div>
                <label className="field-label">Primary Market</label>
                <div className="relative mb-3">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input type="text" placeholder="e.g. Miami, FL or London, UK"
                    value={form.market_location}
                    onChange={(e) => setForm({ ...form, market_location: e.target.value })}
                    className="field-input pl-9" />
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {MARKET_PRESETS.map((m) => (
                    <button key={m} type="button"
                      onClick={() => setForm({ ...form, market_location: m })}
                      className={cn("px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150",
                        form.market_location === m
                          ? "bg-teal-50 border-teal-300 text-teal-700"
                          : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
                      )}>
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <button onClick={() => setStep(2)} className="btn-outline flex-1 py-2.5">← Back</button>
                <button onClick={handleComplete} disabled={saving} className="btn-primary flex-1 py-2.5">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Let's Go! 🚀"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
