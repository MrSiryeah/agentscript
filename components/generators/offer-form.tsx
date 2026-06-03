"use client";

import { useState } from "react";
import { OutputCard } from "@/components/shared/output-card";
import { UpgradePrompt } from "@/components/shared/upgrade-prompt";
import { Loader2, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

const TONES = ["Heartfelt", "Professional", "Confident", "Concise"];
const BUYER_STRENGTHS = [
  "Pre-approved mortgage",
  "Cash buyer",
  "Flexible closing date",
  "No contingencies",
  "Large deposit",
  "Already sold current home",
  "Local buyer",
  "Long-term owner",
];

export function OfferForm() {
  const [form, setForm] = useState({
    buyerNames: "",
    propertyAddress: "",
    offerPrice: "",
    buyerStrengths: [] as string[],
    personalConnection: "",
    tone: "Heartfelt",
  });

  const [result, setResult] = useState<{ offerLetter: string } | null>(null);
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
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = () => handleSubmit({ preventDefault: () => {} } as React.FormEvent);

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {showUpgrade && <UpgradePrompt onClose={() => setShowUpgrade(false)} />}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="card p-6 space-y-5">
          <div className="flex items-center gap-3 mb-1">
            <div className="icon-wrap"><FileText className="w-5 h-5 text-teal-600" /></div>
            <div>
              <h2 className="text-sm font-semibold text-slate-800">Offer Details</h2>
              <p className="text-xs text-slate-400">Help your buyers stand out in a competitive market</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="field-label">Buyer Name(s) *</label>
              <input type="text" required placeholder="e.g. James & Emily Carter"
                value={form.buyerNames} onChange={(e) => setForm({ ...form, buyerNames: e.target.value })}
                className="field-input" />
            </div>
            <div>
              <label className="field-label">Offer Price *</label>
              <input type="text" required placeholder="e.g. $825,000"
                value={form.offerPrice} onChange={(e) => setForm({ ...form, offerPrice: e.target.value })}
                className="field-input" />
            </div>
          </div>

          <div>
            <label className="field-label">Property Address *</label>
            <input type="text" required placeholder="e.g. 12 Maple Lane, Austin, TX 78701"
              value={form.propertyAddress} onChange={(e) => setForm({ ...form, propertyAddress: e.target.value })}
              className="field-input" />
          </div>

          <div>
            <label className="field-label">Buyer Strengths</label>
            <p className="text-xs text-slate-400 mb-2">Select all that apply — these will be highlighted in the letter</p>
            <div className="flex flex-wrap gap-2">
              {BUYER_STRENGTHS.map((s) => (
                <button key={s} type="button" onClick={() => toggleStrength(s)}
                  className={cn("px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 border",
                    form.buyerStrengths.includes(s)
                      ? "bg-teal-50 border-teal-300 text-teal-700"
                      : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                  )}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="field-label">Personal Connection to Property <span className="text-slate-400 font-normal">(optional)</span></label>
            <textarea rows={3} maxLength={300}
              placeholder="e.g. The buyers have two young children and fell in love with the garden. They envision hosting family gatherings here for years to come."
              value={form.personalConnection} onChange={(e) => setForm({ ...form, personalConnection: e.target.value })}
              className="field-input resize-none" />
            <p className="text-xs text-slate-400 mt-1 text-right">{form.personalConnection.length}/300</p>
          </div>

          <div>
            <label className="field-label">Letter Tone</label>
            <div className="flex flex-wrap gap-2">
              {TONES.map((tone) => (
                <button key={tone} type="button" onClick={() => setForm({ ...form, tone })}
                  className={cn("px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 border",
                    form.tone === tone
                      ? "bg-teal-50 border-teal-300 text-teal-700"
                      : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                  )}>
                  {tone}
                </button>
              ))}
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-base">
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating…</> : <>Generate Offer Letter</>}
        </button>
      </form>

      {result && (
        <div className="animate-slide-up">
          <OutputCard label="Offer Letter" content={result.offerLetter} onRegenerate={handleRegenerate} isRegenerating={loading} />
        </div>
      )}
    </div>
  );
}
