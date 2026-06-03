"use client";

import { useState } from "react";
import { OutputCard } from "@/components/shared/output-card";
import { UpgradePrompt } from "@/components/shared/upgrade-prompt";
import { Loader2, Share2 } from "lucide-react";

const POST_TYPES = ["New Listing", "Just Sold", "Open House", "Price Reduction", "Market Update", "Testimonial"];
const PLATFORM_OPTIONS = [
  { value: "Instagram", label: "Instagram" },
  { value: "Facebook", label: "Facebook" },
  { value: "LinkedIn", label: "LinkedIn" },
];

export function SocialForm() {
  const [form, setForm] = useState({
    propertyDescription: "",
    postType: "New Listing",
    platforms: ["Instagram", "Facebook"],
    includeHashtags: true,
  });

  const [captions, setCaptions] = useState<Record<string, string> | null>(null);
  const [loading, setLoading] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [error, setError] = useState("");

  const togglePlatform = (platform: string) => {
    setForm((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter((p) => p !== platform)
        : [...prev.platforms, platform],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.platforms.length === 0) {
      setError("Select at least one platform");
      return;
    }
    setLoading(true);
    setError("");
    setCaptions(null);

    try {
      const res = await fetch("/api/generate/social", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.status === 429 && data.upgrade) { setShowUpgrade(true); return; }
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setCaptions(data.captions);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = () => handleSubmit({ preventDefault: () => {} } as React.FormEvent);

  const platformLabels: Record<string, string> = {
    instagram: "📸 Instagram",
    facebook: "👥 Facebook",
    linkedin: "💼 LinkedIn",
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {showUpgrade && <UpgradePrompt onClose={() => setShowUpgrade(false)} />}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="glass-card p-6 space-y-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="icon-circle"><Share2 className="w-5 h-5 text-primary" /></div>
            <h2 className="text-base font-semibold text-foreground">Post Details</h2>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Property / Post Description *
            </label>
            <textarea
              rows={4} required maxLength={500}
              placeholder="e.g. Beautiful 4-bed family home in Coral Gables with pool, large garden, and recently renovated kitchen. Asking $750k."
              value={form.propertyDescription}
              onChange={(e) => setForm({ ...form, propertyDescription: e.target.value })}
              className="field-input resize-none"
            />
            <p className="text-xs text-muted-foreground mt-1 text-right">
              {form.propertyDescription.length}/500
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Post Type</label>
            <div className="flex flex-wrap gap-2">
              {POST_TYPES.map((type) => (
                <button
                  key={type} type="button"
                  onClick={() => setForm({ ...form, postType: type })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 border ${
                    form.postType === type
                      ? "bg-primary/15 border-primary/40 text-primary"
                      : "bg-secondary/30 border-border/50 text-muted-foreground hover:text-foreground hover:border-border"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-3">Platforms</label>
            <div className="flex gap-3">
              {PLATFORM_OPTIONS.map(({ value, label }) => (
                <button
                  key={value} type="button"
                  onClick={() => togglePlatform(value)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 border ${
                    form.platforms.includes(value)
                      ? "bg-primary/15 border-primary/40 text-primary"
                      : "bg-secondary/30 border-border/50 text-muted-foreground hover:text-foreground hover:border-border"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-secondary/30 border border-border/50">
            <div>
              <p className="text-sm font-medium text-foreground">Include Hashtags</p>
              <p className="text-xs text-muted-foreground">Adds 10–15 relevant hashtags</p>
            </div>
            <button
              type="button"
              onClick={() => setForm({ ...form, includeHashtags: !form.includeHashtags })}
              className={`relative w-12 h-6 rounded-full transition-all duration-200 ${
                form.includeHashtags ? "bg-primary" : "bg-secondary"
              }`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
                form.includeHashtags ? "translate-x-7" : "translate-x-1"
              }`} />
            </button>
          </div>
        </div>

        {error && (
          <p className="text-sm text-destructive bg-destructive/10 px-4 py-3 rounded-lg border border-destructive/20">
            {error}
          </p>
        )}

        <button type="submit" disabled={loading} className="btn-gold w-full flex items-center justify-center gap-2 py-3.5">
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating…</> : <>Generate Social Captions ✦</>}
        </button>
      </form>

      {captions && (
        <div className="space-y-4">
          {Object.entries(captions).map(([platform, caption]) => (
            <OutputCard
              key={platform}
              label={platformLabels[platform] ?? platform}
              content={caption}
              onRegenerate={handleRegenerate}
              isRegenerating={loading}
            />
          ))}
        </div>
      )}
    </div>
  );
}
