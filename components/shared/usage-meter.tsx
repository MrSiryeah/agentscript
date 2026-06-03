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
        <span className="font-medium text-slate-600">Generations used</span>
        <span className={cn(
          "font-bold",
          isCritical ? "text-red-600" : isWarning ? "text-amber-600" : "text-slate-800"
        )}>
          {isUnlimited ? (
            <span className="text-teal-600">Unlimited</span>
          ) : (
            `${used} / ${limit}`
          )}
        </span>
      </div>

      {!isUnlimited && (
        <div className="relative h-2 w-full rounded-full bg-slate-100 overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500",
              isCritical ? "bg-red-500" : isWarning ? "bg-amber-400" : "bg-teal-500"
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      )}

      <p className="text-xs text-slate-400">
        {isUnlimited
          ? `${tier.charAt(0).toUpperCase() + tier.slice(1)} plan — no limits applied`
          : `${Math.max(0, limit - used)} remaining this month`}
      </p>
    </div>
  );
}
