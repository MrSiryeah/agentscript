"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Home,
  Mail,
  FileText,
  Share2,
  Clock,
  Settings,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/listing", label: "Listing Description", icon: Home },
  { href: "/email", label: "Follow-Up Email", icon: Mail },
  { href: "/offer", label: "Offer Letter", icon: FileText },
  { href: "/social", label: "Social Captions", icon: Share2 },
  { href: "/history", label: "History", icon: Clock },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-screen border-r border-border/50 bg-card/30 backdrop-blur-sm">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-6 h-16 border-b border-border/50">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gold-gradient">
          <Zap className="w-4 h-4 text-slate-950" />
        </div>
        <span className="text-lg font-bold gold-text">AgentScript</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn("nav-item", isActive && "active")}
            >
              <Icon className={cn("w-4 h-4 shrink-0", isActive ? "text-primary" : "text-muted-foreground")} />
              <span>{item.label}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Upgrade nudge (shown for free users via CSS class toggling in parent) */}
      <div className="px-3 pb-6">
        <div className="rounded-lg p-3 border border-primary/20 bg-primary/5">
          <p className="text-xs font-semibold text-primary mb-1">Pro Plan</p>
          <p className="text-xs text-muted-foreground mb-3">Unlimited generations. Cancel anytime.</p>
          <Link
            href="/settings/billing"
            className="block w-full text-center text-xs font-semibold py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
          >
            Upgrade to Pro →
          </Link>
        </div>
      </div>
    </aside>
  );
}
