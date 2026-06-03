"use client";

import { useState, useEffect } from "react";
import { Loader2, Save, User } from "lucide-react";

interface ProfileData {
  full_name: string;
  agency_name: string;
  market_location: string;
}

export default function SettingsPage() {
  const [form, setForm] = useState<ProfileData>({
    full_name: "",
    agency_name: "",
    market_location: "US",
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
        body: JSON.stringify(form),
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

  if (loading) {
    return (
      <div className="max-w-xl mx-auto space-y-4">
        {[...Array(3)].map((_, i) => <div key={i} className="h-16 shimmer rounded-xl" />)}
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Profile Settings</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Your profile details are used to personalise every AI output.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="glass-card p-6 space-y-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="icon-circle"><User className="w-5 h-5 text-primary" /></div>
            <h2 className="text-base font-semibold text-foreground">Your Details</h2>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Full Name</label>
            <input
              type="text"
              placeholder="e.g. Sarah Johnson"
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              className="field-input"
            />
            <p className="text-xs text-muted-foreground mt-1">Used to sign emails and letters.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Agency / Brokerage Name</label>
            <input
              type="text"
              placeholder="e.g. Sunshine Realty Group"
              value={form.agency_name}
              onChange={(e) => setForm({ ...form, agency_name: e.target.value })}
              className="field-input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Primary Market / Location</label>
            <input
              type="text"
              placeholder="e.g. Miami, FL · London, UK · Malta"
              value={form.market_location}
              onChange={(e) => setForm({ ...form, market_location: e.target.value })}
              className="field-input"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Helps the AI use the right terminology and local context.
            </p>
          </div>
        </div>

        {error && (
          <p className="text-sm text-destructive bg-destructive/10 px-4 py-3 rounded-lg border border-destructive/20">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className={`btn-gold w-full flex items-center justify-center gap-2 py-3 transition-all duration-200 ${
            saved ? "!bg-green-500" : ""
          }`}
        >
          {saving ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
          ) : saved ? (
            <><Save className="w-4 h-4" /> Saved!</>
          ) : (
            <><Save className="w-4 h-4" /> Save Changes</>
          )}
        </button>
      </form>
    </div>
  );
}
