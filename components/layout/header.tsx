"use client";

import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { Zap } from "lucide-react";
import Link from "next/link";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/listing": "Listing Description",
  "/email": "Follow-Up Email",
  "/offer": "Offer Letter",
  "/social": "Social Captions",
  "/history": "History",
  "/settings": "Settings",
  "/settings/billing": "Billing",
};

export function Header() {
  const pathname = usePathname();
  const title = PAGE_TITLES[pathname] ?? "AgentScript";

  return (
    <header className="flex items-center justify-between h-16 px-6 border-b border-slate-200 bg-white">
      {/* Mobile logo */}
      <div className="flex items-center gap-2 lg:hidden">
        <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-teal-600">
          <Zap className="w-3.5 h-3.5 text-white" />
        </div>
        <span className="font-bold text-slate-900">AgentScript</span>
      </div>

      {/* Desktop title */}
      <h1 className="hidden lg:block text-base font-semibold text-slate-800">{title}</h1>

      <div className="flex items-center gap-3">
        <Link
          href="/settings/billing"
          className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-colors"
        >
          <Zap className="w-3 h-3" />
          Upgrade
        </Link>
        <UserButton
          appearance={{
            elements: {
              avatarBox: "w-8 h-8 ring-2 ring-teal-100",
            },
          }}
        />
      </div>
    </header>
  );
}
