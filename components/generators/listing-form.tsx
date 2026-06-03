"use client";

import { useState } from "react";
import { OutputCard } from "@/components/shared/output-card";
import { UpgradePrompt } from "@/components/shared/upgrade-prompt";
import { Loader2, Home } from "lucide-react";

const PROPERTY_TYPES = ["House", "Apartment", "Flat", "Condo", "Townhouse", "Land", "Commercial", "Villa"];
const TONES = ["Luxury", "Family-Friendly", "Investment Opportunity", "Modern", "Cosy", "Professional"];
const AUDIENCES = ["First-Time Buyers", "Investors", "Families", "Professionals", "Downsizers", "Relocating"];
const FEATURES = [
  "Garage", "Garden", "Pool", "Sea View", "City View", "Mountain View",
  "Renovated Kitchen", "New Roof", "Open Plan", "En-Suite", "Walk-In Closet",
  "Smart Home", "Solar Panels", "Fireplace", "Basement", "Home Office",
  "Double Glazing", "Underfloor Heating", "Air Conditioning", "Balcony", "Terrace",
];

export function ListingForm() {
  const [form, setForm] = useState({
    address: "",
    propertyType: "House",
    bedrooms: "",
    bathrooms: "",
    squareFootage: "",
    sizeUnit: "sq ft" as "sq ft" | "sq m",
    features: [] as string[],
    tone: "Luxury",
    targetAudience: "Families",
    additionalDetails: "",
  });

  const [result, setResult] = useState<{ listingDescription: string; shortTeaser: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [error, setError] = useState("");

  const toggleFeature = (feature: string) => {
    setForm((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/generate/listing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.status === 429 && data.upgrade) {
        setShowUpgrade(true);
        return;
      }
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async () => {
    const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
    await handleSubmit(fakeEvent);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {showUpgrade && <UpgradePrompt onClose={() => setShowUpgrade(false)} />}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="glass-card p-6 space-y-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="icon-circle"><Home className="w-5 h-5 text-primary" /></div>
            <h2 className="text-base font-semibold text-foreground">Property Details</h2>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Property Address *</label>
            <input
              type="text"
              required
              placeholder="e.g. 42 Ocean Drive, Miami, FL"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="field-input"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Property Type</label>
              <select
                value={form.propertyType}
                onChange={(e) => setForm({ ...form, propertyType: e.target.value })}
                className="field-input"
              >
                {PROPERTY_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Tone</label>
              <select
                value={form.tone}
                onChange={(e) => setForm({ ...form, tone: e.target.value })}
                className="field-input"
              >
                {TONES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Bedrooms *</label>
              <input
                type="number" min="0" max="20" required
                placeholder="3"
                value={form.bedrooms}
                onChange={(e) => setForm({ ...form, bedrooms: e.target.value })}
                className="field-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Bathrooms *</label>
              <input
                type="number" min="0" max="20" step="0.5" required
                placeholder="2"
                value={form.bathrooms}
                onChange={(e) => setForm({ ...form, bathrooms: e.target.value })}
                className="field-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Size</label>
              <div className="flex gap-2">
                <input
                  type="number" min="0"
                  placeholder="2,400"
                  value={form.squareFootage}
                  onChange={(e) => setForm({ ...form, squareFootage: e.target.value })}
                  className="field-input"
                />
                <select
                  value={form.sizeUnit}
                  onChange={(e) => setForm({ ...form, sizeUnit: e.target.value as "sq ft" | "sq m" })}
                  className="field-input w-24"
                >
                  <option value="sq ft">sq ft</option>
                  <option value="sq m">sq m</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Target Audience</label>
            <select
              value={form.targetAudience}
              onChange={(e) => setForm({ ...form, targetAudience: e.target.value })}
              className="field-input"
            >
              {AUDIENCES.map((a) => <option key={a}>{a}</option>)}
            </select>
          </div>
        </div>

        {/* Features */}
        <div className="glass-card p-6">
          <label className="block text-sm font-medium text-foreground mb-3">Key Features</label>
          <div className="flex flex-wrap gap-2">
            {FEATURES.map((feature) => (
              <button
                key={feature}
                type="button"
                onClick={() => toggleFeature(feature)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 border ${
                  form.features.includes(feature)
                    ? "bg-primary/15 border-primary/40 text-primary"
                    : "bg-secondary/30 border-border/50 text-muted-foreground hover:text-foreground hover:border-border"
                }`}
              >
                {feature}
              </button>
            ))}
          </div>
        </div>

        {/* Additional Details */}
        <div className="glass-card p-6">
          <label className="block text-sm font-medium text-foreground mb-1.5">
            Additional Details <span className="text-muted-foreground">(optional)</span>
          </label>
          <textarea
            rows={3}
            maxLength={300}
            placeholder="Anything unique about this property that sets it apart…"
            value={form.additionalDetails}
            onChange={(e) => setForm({ ...form, additionalDetails: e.target.value })}
            className="field-input resize-none"
          />
          <p className="text-xs text-muted-foreground mt-1 text-right">
            {form.additionalDetails.length}/300
          </p>
        </div>

        {error && (
          <p className="text-sm text-destructive bg-destructive/10 px-4 py-3 rounded-lg border border-destructive/20">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-gold w-full flex items-center justify-center gap-2 py-3.5"
        >
          {loading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Generating…</>
          ) : (
            <>Generate Listing Description ✦</>
          )}
        </button>
      </form>

      {/* Results */}
      {result && (
        <div className="space-y-4">
          <OutputCard
            label="Full Listing Description"
            content={result.listingDescription}
            onRegenerate={handleRegenerate}
            isRegenerating={loading}
          />
          {result.shortTeaser && (
            <OutputCard
              label="Short Teaser"
              content={result.shortTeaser}
              onRegenerate={handleRegenerate}
              isRegenerating={loading}
            />
          )}
        </div>
      )}
    </div>
  );
}
