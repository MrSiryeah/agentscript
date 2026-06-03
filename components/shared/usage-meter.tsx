"use client";

import { cn } from "@/lib/utils";

interface UsageMeterProps {
  used: number;
  limit: number;
  tier: string;
  className?: string;
}

export function UsageMeter({ used, limit, tier, className }: UsageMeterProps) {
  const isUnlimited = limit >= 999999;
  const percentage = isUnlimited ? 0 : Math.min((used / limit) * 100, 100);
  const isWarning = percentage >= 70;
  const isCritical = percentage >= 90;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground font-medium">Generations</span>
        <span className={cn("font-semibold", isCritical ? "text-destructive" : isWarning ? "text-amber-400" : "text-foreground")}>
          {isUnlimited ? (
            <span className="text-primary">Unlimited</span>
          ) : (
            `${used} / ${limit}`
          )}
        </span>
      </div>

      {!isUnlimited && (
        <div className="relative h-2 w-full rounded-full bg-secondary overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500",
              isCritical
                ? "bg-destructive"
                : isWarning
                ? "bg-amber-400"
                : "bg-gold-gradient"
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        {isUnlimited
          ? `${tier} plan — no limits`
          : `${Math.max(0, limit - used)} remaining this month`}
      </p>
    </div>
  );
}
