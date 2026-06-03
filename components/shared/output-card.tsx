"use client";

import { useState } from "react";
import { Check, Copy, RefreshCw, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface OutputCardProps {
  content: string;
  label?: string;
  onRegenerate?: () => void;
  isRegenerating?: boolean;
  className?: string;
}

export function OutputCard({
  content,
  label,
  onRegenerate,
  isRegenerating,
  className,
}: OutputCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("output-card animate-slide-up", className)}>
      <div className="p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-teal-100">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            </div>
            {label && (
              <span className="text-sm font-semibold text-slate-800">{label}</span>
            )}
            <span className="badge-teal">AI Generated</span>
          </div>

          <div className="flex items-center gap-2">
            {onRegenerate && (
              <button
                onClick={onRegenerate}
                disabled={isRegenerating}
                className="btn-ghost text-xs"
              >
                <RefreshCw className={cn("w-3.5 h-3.5", isRegenerating && "animate-spin")} />
                {isRegenerating ? "Generating..." : "Regenerate"}
              </button>
            )}
            <button
              onClick={handleCopy}
              className={cn(
                "inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-150",
                copied
                  ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                  : "bg-teal-50 text-teal-700 border border-teal-200 hover:bg-teal-100"
              )}
            >
              {copied ? (
                <><Check className="w-3.5 h-3.5" /> Copied!</>
              ) : (
                <><Copy className="w-3.5 h-3.5" /> Copy</>
              )}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="rounded-xl bg-white border border-slate-100 p-4 shadow-sm">
          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
            {content}
          </p>
        </div>
      </div>
    </div>
  );
}
