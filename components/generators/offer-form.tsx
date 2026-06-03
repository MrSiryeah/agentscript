"use client";

import { useState } from "react";
import { OutputCard } from "@/components/shared/output-card";
import { UpgradePrompt } from "@/components/shared/upgrade-prompt";
import { Loader2, FileText } from "lucide-react";

const STRENGTHS = [
  "Pre-Approved Mortgage",
  "Cash Buyer",
  "Flexible on Closing Date",
  "Local Family",
  "Quick Completion",
  "No Chain",
  "First-Time Buyer",
  "Long-Term Owner",
];
const TONES = ["Formal", "Warm & Personal", "Urgent", "Confident"];

export function OfferForm() {
  const [form, setForm] = useState({
    buyerNames: "",
    propertyAddress: "",
    offerPrice: "",
    buyerStrengths: [] as string[],
    personalConnection: "",
    tone: "Warm & Personal",
  });

  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [error, setError] = useState("");

  const toggleStrength = (s: string) => {
    setForm((prev) => ({
      ...prev,
      buyerStrengths: prev.buyerStrengths.includes(s)
        ? prev.buyerStrengths.filter((x) => x !== s)
        : [...prev.buyerStrengths, s],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/generate/offer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.status === 429 && data.upgrade) { setShowUpgrade(true); return; }
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setResult(data.offerLetter);
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
            <div className="icon-circle"><FileText className="w-5 h-5 text-primary" /></div>
            <h2 className="text-base font-semibold text-foreground">Offer Details</h2>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Buyer Name(s) *</label>
            <input
              type="text" required
              placeholder="e.g. James and Emily Carter"
              value={form.buyerNames}
              onChange={(e) => setForm({ ...form, buyerNames: e.target.value })}
              className="field-input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Property Address *</label>
            <input
              type="text" required
              placeholder="e.g. 18 Maple Street, Austin, TX"
              value={form.propertyAddress}
              onChange={(e) => setForm({ ...form, propertyAddress: e.target.value })}
              className="field-input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Offer Price *</label>
            <input
              type="text" required
              placeholder="e.g. $485,000"
              value={form.offerPrice}
              onChange={(e) => setForm({ ...form, offerPrice: e.target.value })}
              className="field-input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-3">Buyer Strengths</label>
            <div className="flex flex-wrap gap-2">
              {STRENGTHS.map((s) => (
                <button
                  key={s} type="button"
                  onClick={() => toggleStrength(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 border ${
                    form.buyerStrengths.includes(s)
                      ? "bg-primary/15 border-primary/40 text-primary"
                      : "bg-secondary/30 border-border/50 text-muted-foreground hover:text-foreground hover:border-border"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Personal Connection to Property <span className="text-muted-foreground">(optional)</span>
            </label>
            <input
              type="text" maxLength={200}
              placeholder="e.g. Grew up in this neighborhood, kids go to the local school"
              value={form.personalConnection}
              onChange={(e) => setForm({ ...form, personalConnection: e.target.value })}
              className="field-input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Letter Tone</label>
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
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating…</> : <>Generate Offer Letter ✦</>}
        </button>
      </form>

      {result && (
        <OutputCard
          label="Offer Letter"
          content={result}
          onRegenerate={handleRegenerate}
          isRegenerating={loading}
        />
      )}
    </div>
  );
}
