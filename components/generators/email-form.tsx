"use client";

import { useState } from "react";
import { OutputCard } from "@/components/shared/output-card";
import { UpgradePrompt } from "@/components/shared/upgrade-prompt";
import { Loader2, Mail } from "lucide-react";

const HOW_WE_MET = ["Open House", "Website Inquiry", "Referral", "Cold Call", "Social Media", "Portal", "Networking Event"];
const SITUATIONS = ["Actively Looking", "Just Browsing", "Looking to Sell", "Investor", "Relocating", "Undecided"];
const FOLLOW_UP_TYPES = [
  "First Follow-Up",
  "Check-In (2 Weeks Later)",
  "Re-Engagement After Silence",
  "Post-Viewing Follow-Up",
  "After Offer Submitted",
  "Monthly Check-In",
];
const TONES = ["Professional", "Warm & Friendly", "Concise", "Enthusiastic"];

export function EmailForm() {
  const [form, setForm] = useState({
    leadName: "",
    howWeMet: "Open House",
    propertyInterest: "",
    leadSituation: "Actively Looking",
    followUpType: "First Follow-Up",
    tone: "Warm & Friendly",
  });

  const [result, setResult] = useState<{ subject: string; emailBody: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/generate/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.status === 429 && data.upgrade) { setShowUpgrade(true); return; }
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = () => handleSubmit({ preventDefault: () => {} } as React.FormEvent);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {showUpgrade && <UpgradePrompt onClose={() => setShowUpgrade(false)} />}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="glass-card p-6 space-y-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="icon-circle"><Mail className="w-5 h-5 text-primary" /></div>
            <h2 className="text-base font-semibold text-foreground">Lead Details</h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Lead Name *</label>
              <input
                type="text" required
                placeholder="e.g. Sarah Johnson"
                value={form.leadName}
                onChange={(e) => setForm({ ...form, leadName: e.target.value })}
                className="field-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">How We Met</label>
              <select
                value={form.howWeMet}
                onChange={(e) => setForm({ ...form, howWeMet: e.target.value })}
                className="field-input"
              >
                {HOW_WE_MET.map((h) => <option key={h}>{h}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Property They Were Interested In <span className="text-muted-foreground">(optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. 3-bed house in Coral Gables"
              value={form.propertyInterest}
              onChange={(e) => setForm({ ...form, propertyInterest: e.target.value })}
              className="field-input"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Their Situation</label>
              <select
                value={form.leadSituation}
                onChange={(e) => setForm({ ...form, leadSituation: e.target.value })}
                className="field-input"
              >
                {SITUATIONS.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Follow-Up Type</label>
              <select
                value={form.followUpType}
                onChange={(e) => setForm({ ...form, followUpType: e.target.value })}
                className="field-input"
              >
                {FOLLOW_UP_TYPES.map((f) => <option key={f}>{f}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Email Tone</label>
            <div className="flex flex-wrap gap-2">
              {TONES.map((tone) => (
                <button
                  key={tone} type="button"
                  onClick={() => setForm({ ...form, tone })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 border ${
                    form.tone === tone
                      ? "bg-primary/15 border-primary/40 text-primary"
                      : "bg-secondary/30 border-border/50 text-muted-foreground hover:text-foreground hover:border-border"
                  }`}
                >
                  {tone}
                </button>
              ))}
            </div>
          </div>
        </div>

        {error && (
          <p className="text-sm text-destructive bg-destructive/10 px-4 py-3 rounded-lg border border-destructive/20">
            {error}
          </p>
        )}

        <button type="submit" disabled={loading} className="btn-gold w-full flex items-center justify-center gap-2 py-3.5">
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating…</> : <>Generate Follow-Up Email ✦</>}
        </button>
      </form>

      {result && (
        <div className="space-y-4">
          <div className="glass-card p-4 flex items-start gap-3">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-0.5">Subject</span>
            <p className="text-sm font-semibold text-foreground">{result.subject}</p>
          </div>
          <OutputCard
            label="Email Body"
            content={result.emailBody}
            onRegenerate={handleRegenerate}
            isRegenerating={loading}
          />
        </div>
      )}
    </div>
  );
}
