"use client";

import { useState } from "react";
import { OutputCard } from "@/components/shared/output-card";
import { UpgradePrompt } from "@/components/shared/upgrade-prompt";
import { Loader2, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

const POST_TYPES = ["New Listing", "Just Sold", "Open House", "Price Reduction", "Market Update", "Behind-the-Scenes", "Client Testimonial", "Tips & Advice"];
const PLATFORMS = ["Instagram", "Facebook", "LinkedIn"];

export function SocialForm() {
  const [form, setForm] = useState({
    propertyDescription: "",
    postType: "New Listing",
    platforms: ["Instagram"] as string[],
    includeHashtags: true,
  });

  const [result, setResult] = useState<Record<string, string> | null>(null);
  const [loading, setLoading] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("instagram");

  const togglePlatform = (p: string) => {
    setForm((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(p)
        ? prev.platforms.filter((x) => x !== p)
        : [...prev.platforms, p],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.platforms.length === 0) { setError("Select at least one platform."); return; }
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/generate/social", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.status === 429 && data.upgrade) { setShowUpgrade(true); return; }
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setResult(data.captions);
      // Auto-select first generated platform tab
      const firstPlatform = form.platforms[0]?.toLowerCase();
      if (firstPlatform) setActiveTab(firstPlatform);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = () => handleSubmit({ preventDefault: () => {} } as React.FormEvent);

  const platformIcons: Record<string, string> = {
    Instagram: "📸",
    Facebook: "📘",
    LinkedIn: "💼",
  };

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {showUpgrade && <UpgradePrompt onClose={() => setShowUpgrade(false)} />}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="card p-6 space-y-5">
          <div className="flex items-center gap-3 mb-1">
            <div className="icon-wrap"><Share2 className="w-5 h-5 text-teal-600" /></div>
            <div>
              <h2 className="text-sm font-semibold text-slate-800">Post Details</h2>
              <p className="text-xs text-slate-400">Generate platform-optimised captions in one click</p>
            </div>
          </div>

          <div>
            <label className="field-label">Property / Post Description *</label>
            <textarea rows={4} required maxLength={500}
              placeholder="e.g. 3-bed penthouse with wraparound terrace and ocean views. Just listed in Miami Beach. Modern open-plan kitchen, 2.5 baths, residents' pool and concierge."
              value={form.propertyDescription} onChange={(e) => setForm({ ...form, propertyDescription: e.target.value })}
              className="field-input resize-none" />
            <p className="text-xs text-slate-400 mt-1 text-right">{form.propertyDescription.length}/500</p>
          </div>

          <div>
            <label className="field-label">Post Type</label>
            <div className="flex flex-wrap gap-2">
              {POST_TYPES.map((type) => (
                <button key={type} type="button" onClick={() => setForm({ ...form, postType: type })}
                  className={cn("px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 border",
                    form.postType === type
                      ? "bg-teal-50 border-teal-300 text-teal-700"
                      : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                  )}>
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="field-label">Target Platforms</label>
            <div className="flex gap-3">
              {PLATFORMS.map((p) => (
                <button key={p} type="button" onClick={() => togglePlatform(p)}
                  className={cn("flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150 border",
                    form.platforms.includes(p)
                      ? "bg-teal-50 border-teal-300 text-teal-700"
                      : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                  )}>
                  <span>{platformIcons[p]}</span>
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button type="button" role="switch" aria-checked={form.includeHashtags}
              onClick={() => setForm({ ...form, includeHashtags: !form.includeHashtags })}
              className={cn("relative w-10 h-5.5 rounded-full transition-colors duration-200 focus:outline-none",
                form.includeHashtags ? "bg-teal-500" : "bg-slate-200"
              )}>
              <span className={cn("absolute top-0.5 left-0.5 w-4.5 h-4.5 bg-white rounded-full shadow transition-transform duration-200",
                form.includeHashtags ? "translate-x-4.5" : "translate-x-0"
              )} />
            </button>
            <label className="text-sm text-slate-700 font-medium cursor-pointer select-none"
              onClick={() => setForm({ ...form, includeHashtags: !form.includeHashtags })}>
              Include hashtags
            </label>
          </div>
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <button type="submit" disabled={loading || form.platforms.length === 0} className="btn-primary w-full py-3.5 text-base">
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating…</> : <>Generate Social Captions</>}
        </button>
      </form>

      {result && Object.keys(result).length > 0 && (
        <div className="animate-slide-up space-y-4">
          {/* Platform tabs */}
          {Object.keys(result).length > 1 && (
            <div className="flex gap-1 p-1 bg-slate-100 rounded-xl w-fit">
              {Object.keys(result).map((platform) => (
                <button key={platform} onClick={() => setActiveTab(platform)}
                  className={cn("px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 capitalize",
                    activeTab === platform ? "bg-white shadow-sm text-slate-800" : "text-slate-500 hover:text-slate-700"
                  )}>
                  {platformIcons[platform.charAt(0).toUpperCase() + platform.slice(1)]} {platform}
                </button>
              ))}
            </div>
          )}

          {Object.entries(result).map(([platform, caption]) => (
            <div key={platform} className={activeTab === platform || Object.keys(result).length === 1 ? "block" : "hidden"}>
              <OutputCard
                label={`${platformIcons[platform.charAt(0).toUpperCase() + platform.slice(1)]} ${platform.charAt(0).toUpperCase() + platform.slice(1)} Caption`}
                content={caption}
                onRegenerate={handleRegenerate}
                isRegenerating={loading}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
