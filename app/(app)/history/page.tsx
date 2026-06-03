"use client";

import { useState, useEffect, useCallback } from "react";
import { Trash2, Clock, Filter } from "lucide-react";
import { TOOL_LABELS, TOOL_ICONS, formatRelativeTime, cn } from "@/lib/utils";

interface Generation {
  id: string;
  tool_type: string;
  output_text: string;
  input_data: Record<string, unknown>;
  created_at: string;
}

const FILTER_OPTIONS = [
  { value: "all", label: "All" },
  { value: "listing_description", label: "Listings" },
  { value: "follow_up_email", label: "Emails" },
  { value: "offer_letter", label: "Offers" },
  { value: "social_caption", label: "Social" },
];

export default function HistoryPage() {
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/history${filter !== "all" ? `?type=${filter}` : ""}`);
      if (res.ok) {
        const data = await res.json();
        setGenerations(data.generations ?? []);
      }
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  const handleDelete = async (id: string) => {
    await fetch(`/api/history?id=${id}`, { method: "DELETE" });
    setGenerations((prev) => prev.filter((g) => g.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Generation History</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Your last 50 AI-generated pieces, saved automatically.
          </p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="w-4 h-4 text-muted-foreground" />
        {FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setFilter(opt.value)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 border",
              filter === opt.value
                ? "bg-primary/15 border-primary/40 text-primary"
                : "bg-secondary/30 border-border/50 text-muted-foreground hover:text-foreground"
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 shimmer rounded-xl" />
          ))}
        </div>
      ) : generations.length === 0 ? (
        <div className="text-center py-16 glass-card">
          <p className="text-4xl mb-3">✦</p>
          <p className="text-foreground font-semibold mb-1">No generations yet</p>
          <p className="text-muted-foreground text-sm">Use any of the tools to get started.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {generations.map((gen) => (
            <div key={gen.id} className="glass-card overflow-hidden">
              <div className="p-4 flex items-start gap-3">
                <span className="text-xl mt-0.5">{TOOL_ICONS[gen.tool_type] ?? "✦"}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {TOOL_LABELS[gen.tool_type] ?? gen.tool_type}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatRelativeTime(gen.created_at)}
                    </span>
                  </div>
                  <p className={cn(
                    "text-sm text-foreground/80 leading-relaxed",
                    expanded !== gen.id && "line-clamp-2"
                  )}>
                    {gen.output_text}
                  </p>
                  {gen.output_text.length > 180 && (
                    <button
                      onClick={() => setExpanded(expanded === gen.id ? null : gen.id)}
                      className="text-xs text-primary hover:underline mt-1"
                    >
                      {expanded === gen.id ? "Show less" : "Show more"}
                    </button>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(gen.id)}
                  className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-150 shrink-0"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
