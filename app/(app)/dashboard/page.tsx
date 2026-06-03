"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Home, Mail, FileText, Share2, Clock, TrendingUp, Zap, ArrowRight } from "lucide-react";
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
  { href: "/listing", label: "Listing Description", icon: Home, desc: "MLS-ready in 30 seconds", color: "bg-blue-50 text-blue-600 border-blue-100" },
  { href: "/email", label: "Follow-Up Email", icon: Mail, desc: "Personalised lead follow-ups", color: "bg-violet-50 text-violet-600 border-violet-100" },
  { href: "/offer", label: "Offer Letter", icon: FileText, desc: "Win multi-offer situations", color: "bg-amber-50 text-amber-600 border-amber-100" },
  { href: "/social", label: "Social Captions", icon: Share2, desc: "Instagram, Facebook & LinkedIn", color: "bg-pink-50 text-pink-600 border-pink-100" },
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
        // Silent fail
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
    <div className="space-y-7 animate-fade-in">

      {/* Welcome banner */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Good to see you, {firstName} 👋</h1>
          <p className="page-subtitle">
            {profile?.agency_name ? `${profile.agency_name} · ` : ""}
            Your AI writing workspace is ready.
          </p>
        </div>
        <span className="hidden sm:flex badge-teal text-xs px-3 py-1.5 text-sm">
          <Zap className="w-3.5 h-3.5" />
          {tier === "free" ? "Free Trial" : tier.charAt(0).toUpperCase() + tier.slice(1)}
        </span>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-5 sm:col-span-2">
          {loading ? (
            <div className="h-14 shimmer" />
          ) : (
            <UsageMeter used={used} limit={limit} tier={tier} />
          )}
        </div>
        <div className="card p-5 flex flex-col items-center justify-center text-center gap-1">
          <div className="flex items-center gap-2 text-teal-600">
            <TrendingUp className="w-4 h-4" />
            <span className="text-3xl font-extrabold text-slate-900">{used}</span>
          </div>
          <p className="text-xs text-slate-400 font-medium">Generated this month</p>
        </div>
      </div>

      {/* Quick action tools */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Quick Start</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {tools.map(({ href, label, icon: Icon, desc, color }) => (
            <Link
              key={href}
              href={href}
              className="card-hover p-5 group flex flex-col gap-3"
            >
              <div className={`flex items-center justify-center w-10 h-10 rounded-xl border ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800 mb-0.5">{label}</p>
                <p className="text-xs text-slate-400">{desc}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-teal-500 group-hover:translate-x-0.5 transition-all duration-150 mt-auto" />
            </Link>
          ))}
        </div>
      </div>

      {/* Recent generations */}
      {recentGenerations.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Recent Generations</h2>
            <Link href="/history" className="text-xs font-semibold text-teal-600 hover:text-teal-700 transition-colors">
              View all →
            </Link>
          </div>
          <div className="card divide-y divide-slate-100">
            {recentGenerations.slice(0, 5).map((gen) => (
              <div key={gen.id} className="flex items-start gap-3 p-4">
                <span className="text-lg mt-0.5 shrink-0">{TOOL_ICONS[gen.tool_type] ?? "✦"}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      {TOOL_LABELS[gen.tool_type] ?? gen.tool_type}
                    </span>
                    <span className="text-xs text-slate-300">·</span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatRelativeTime(gen.created_at)}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 truncate">{gen.output_text.slice(0, 120)}…</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && recentGenerations.length === 0 && (
        <div className="card p-10 text-center">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-teal-50 border border-teal-100 mx-auto mb-4">
            <Zap className="w-7 h-7 text-teal-600" />
          </div>
          <p className="font-semibold text-slate-800 mb-1">Ready when you are</p>
          <p className="text-sm text-slate-400 mb-5">Pick a tool above to generate your first piece of content.</p>
          <Link href="/listing" className="btn-primary">
            Generate a Listing Description →
          </Link>
        </div>
      )}
    </div>
  );
}
