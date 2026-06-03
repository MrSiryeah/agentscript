"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Home, Mail, FileText, Share2, Clock, TrendingUp, Zap } from "lucide-react";
import { UsageMeter } from "@/components/shared/usage-meter";
import { TOOL_LABELS, TOOL_ICONS, formatRelativeTime } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";

interface Profile {
  full_name: string | null;
  agency_name: string | null;
  subscription_tier: string;
  generation_count_this_month: number;
}

interface Generation {
  id: string;
  tool_type: string;
  output_text: string;
  created_at: string;
}

const LIMITS: Record<string, number> = {
  free: 10, starter: 100, pro: 999999, team: 999999,
};

const tools = [
  { href: "/listing", label: "Listing Description", icon: Home, desc: "MLS-ready property descriptions" },
  { href: "/email", label: "Follow-Up Email", icon: Mail, desc: "Personalised lead follow-ups" },
  { href: "/offer", label: "Offer Letter", icon: FileText, desc: "Compelling cover letters" },
  { href: "/social", label: "Social Captions", icon: Share2, desc: "Instagram, Facebook & LinkedIn" },
];

export default function DashboardPage() {
  const { user } = useUser();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [recentGenerations, setRecentGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/usage");
        if (res.ok) {
          const data = await res.json();
          setProfile(data.profile);
          setRecentGenerations(data.recentGenerations ?? []);
        }
      } catch {
        // Silent fail — dashboard still renders
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const tier = profile?.subscription_tier ?? "free";
  const used = profile?.generation_count_this_month ?? 0;
  const limit = LIMITS[tier] ?? 10;
  const firstName = user?.firstName ?? profile?.full_name?.split(" ")[0] ?? "Agent";

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Welcome back, {firstName} 👋
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {profile?.agency_name ? `${profile.agency_name} · ` : ""}
            Here&apos;s your AI writing workspace.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-xs font-semibold text-primary">
          <Zap className="w-3 h-3" />
          {tier === "free" ? "Free Trial" : tier.charAt(0).toUpperCase() + tier.slice(1)}
        </div>
      </div>

      {/* Usage + Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-5 sm:col-span-2">
          {loading ? (
            <div className="h-16 shimmer rounded-lg" />
          ) : (
            <UsageMeter used={used} limit={limit} tier={tier} />
          )}
        </div>
        <div className="glass-card p-5 flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-1.5 text-primary mb-1">
            <TrendingUp className="w-4 h-4" />
            <span className="text-2xl font-bold">{used}</span>
          </div>
          <p className="text-xs text-muted-foreground">Generated this month</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-base font-semibold text-foreground mb-4">Create Something</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {tools.map(({ href, label, icon: Icon, desc }) => (
            <Link
              key={href}
              href={href}
              className="glass-card p-4 hover:border-primary/30 hover:bg-primary/5 transition-all duration-200 group"
            >
              <div className="icon-circle mb-3 group-hover:border-primary/40 transition-colors duration-200">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <p className="text-sm font-semibold text-foreground mb-1">{label}</p>
              <p className="text-xs text-muted-foreground">{desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Generations */}
      {recentGenerations.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-foreground">Recent Generations</h2>
            <Link href="/history" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              View all →
            </Link>
          </div>
          <div className="space-y-2">
            {recentGenerations.slice(0, 5).map((gen) => (
              <div key={gen.id} className="glass-card p-4 flex items-start gap-3">
                <span className="text-lg">{TOOL_ICONS[gen.tool_type] ?? "✦"}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {TOOL_LABELS[gen.tool_type] ?? gen.tool_type}
                    </span>
                    <span className="text-xs text-muted-foreground">·</span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatRelativeTime(gen.created_at)}
                    </span>
                  </div>
                  <p className="text-sm text-foreground/80 truncate">{gen.output_text.slice(0, 120)}…</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
