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
    <div className={cn("gradient-border animate-slide-up", className)}>
      <div className="p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="icon-circle w-8 h-8">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
            </div>
            {label && (
              <span className="text-sm font-semibold text-foreground">{label}</span>
            )}
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
              AI Generated
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onRegenerate && (
              <button
                onClick={onRegenerate}
                disabled={isRegenerating}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-md border border-border/50 hover:border-border transition-all duration-150 disabled:opacity-50"
              >
                <RefreshCw className={cn("w-3 h-3", isRegenerating && "animate-spin")} />
                {isRegenerating ? "Generating..." : "Regenerate"}
              </button>
            )}
            <button
              onClick={handleCopy}
              className={cn(
                "flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md transition-all duration-150 font-medium",
                copied
                  ? "bg-green-500/10 text-green-400 border border-green-500/20"
                  : "bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20"
              )}
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  Copy
                </>
              )}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="rounded-lg bg-background/50 border border-border/30 p-4">
          <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
            {content}
          </p>
        </div>
      </div>
    </div>
  );
}
