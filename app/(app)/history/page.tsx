"use client";

import { useState, useEffect, useCallback } from "react";
import { Trash2, Clock, Filter, Search, Copy, Check, ChevronDown, ChevronUp, FileDown } from "lucide-react";
import { TOOL_LABELS, TOOL_ICONS, formatRelativeTime, cn } from "@/lib/utils";

interface Generation {
  id: string;
  tool_type: string;
  output_text: string;
  input_data: Record<string, unknown>;
  created_at: string;
}

const FILTER_OPTIONS = [
  { value: "all", label: "All Types" },
  { value: "listing_description", label: "Listings" },
  { value: "follow_up_email", label: "Emails" },
  { value: "offer_letter", label: "Offers" },
  { value: "social_caption", label: "Social" },
];

const TOOL_COLORS: Record<string, string> = {
  listing_description: "bg-blue-50 text-blue-600 border-blue-100",
  follow_up_email: "bg-violet-50 text-violet-600 border-violet-100",
  offer_letter: "bg-amber-50 text-amber-600 border-amber-100",
  social_caption: "bg-pink-50 text-pink-600 border-pink-100",
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handleCopy}
      className={cn("inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-150 border",
        copied ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-white text-slate-600 border-slate-200 hover:border-teal-300 hover:text-teal-600"
      )}>
      {copied ? <><Check className="w-3 h-3" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
    </button>
  );
}

export default function HistoryPage() {
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

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
    setDeletingId(id);
    await fetch(`/api/history?id=${id}`, { method: "DELETE" });
    setGenerations((prev) => prev.filter((g) => g.id !== id));
    setDeletingId(null);
  };

  const filtered = generations.filter((g) =>
    search === "" || g.output_text.toLowerCase().includes(search.toLowerCase())
  );

  const downloadTxt = (gen: Generation) => {
    const blob = new Blob([gen.output_text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `agentscript-${gen.tool_type}-${gen.id.slice(0, 8)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="page-title">Generation History</h1>
          <p className="page-subtitle">Your last 50 AI-generated pieces, saved automatically.</p>
        </div>
        <span className="badge-teal">{generations.length} saved</span>
      </div>

      {/* Search + Filter */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-52">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text" placeholder="Search your generations…"
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="field-input pl-9"
          />
        </div>
        <div className="flex items-center gap-1.5">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          {FILTER_OPTIONS.map((opt) => (
            <button key={opt.value} onClick={() => setFilter(opt.value)}
              className={cn("px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 border",
                filter === opt.value
                  ? "bg-teal-50 border-teal-300 text-teal-700"
                  : "bg-white border-slate-200 text-slate-500 hover:text-slate-700 hover:border-slate-300"
              )}>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <div key={i} className="h-20 shimmer rounded-xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-14 text-center">
          <p className="text-2xl mb-3">📄</p>
          <p className="font-semibold text-slate-800 mb-1">
            {search ? "No results found" : "No generations yet"}
          </p>
          <p className="text-sm text-slate-400">
            {search ? "Try a different search term." : "Use any of the tools above to generate your first piece."}
          </p>
        </div>
      ) : (
        <div className="card divide-y divide-slate-100 overflow-hidden">
          {filtered.map((gen) => {
            const isExpanded = expanded === gen.id;
            const isLong = gen.output_text.length > 200;
            return (
              <div key={gen.id} className="group">
                <div className="p-4 flex items-start gap-3">
                  <span className={cn("shrink-0 flex items-center justify-center w-8 h-8 rounded-lg text-sm border mt-0.5", TOOL_COLORS[gen.tool_type] ?? "bg-slate-50 text-slate-500 border-slate-100")}>
                    {TOOL_ICONS[gen.tool_type] ?? "✦"}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        {TOOL_LABELS[gen.tool_type] ?? gen.tool_type}
                      </span>
                      <span className="text-slate-200">·</span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatRelativeTime(gen.created_at)}
                      </span>
                    </div>
                    <p className={cn("text-sm text-slate-600 leading-relaxed whitespace-pre-line",
                      !isExpanded && isLong && "line-clamp-3"
                    )}>
                      {gen.output_text}
                    </p>
                    {isLong && (
                      <button onClick={() => setExpanded(isExpanded ? null : gen.id)}
                        className="flex items-center gap-1 text-xs text-teal-600 hover:text-teal-700 font-semibold mt-1.5 transition-colors">
                        {isExpanded ? <><ChevronUp className="w-3 h-3" />Show less</> : <><ChevronDown className="w-3 h-3" />Show more</>}
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                    <CopyButton text={gen.output_text} />
                    <button onClick={() => downloadTxt(gen)} title="Download as .txt"
                      className="p-2 rounded-lg text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition-all duration-150">
                      <FileDown className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(gen.id)} disabled={deletingId === gen.id} title="Delete"
                      className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all duration-150">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
