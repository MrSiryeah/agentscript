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
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/listing", label: "Listing Description", icon: Home },
  { href: "/email", label: "Follow-Up Email", icon: Mail },
  { href: "/offer", label: "Offer Letter", icon: FileText },
  { href: "/social", label: "Social Captions", icon: Share2 },
  { href: "/history", label: "History", icon: Clock },
];

const bottomItems = [
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-screen border-r border-slate-200 bg-white">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 h-16 border-b border-slate-100">
        <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-teal-600 shadow-sm">
          <Zap className="w-4 h-4 text-white" />
        </div>
        <span className="text-lg font-bold text-slate-900">AgentScript</span>
      </div>

      {/* Main nav */}
      <nav className="flex-1 px-3 py-5 space-y-0.5">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 px-3 mb-2">Tools</p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn("nav-item", isActive && "active")}
            >
              <Icon className={cn("w-4 h-4 shrink-0", isActive ? "text-teal-600" : "text-slate-400")} />
              <span className="flex-1">{item.label}</span>
              {isActive && <ChevronRight className="w-3.5 h-3.5 text-teal-500 shrink-0" />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-slate-100 space-y-0.5">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn("nav-item", isActive && "active")}
            >
              <Icon className={cn("w-4 h-4 shrink-0", isActive ? "text-teal-600" : "text-slate-400")} />
              <span>{item.label}</span>
            </Link>
          );
        })}

        {/* Upgrade card */}
        <div className="mt-3 rounded-xl p-3.5 bg-gradient-to-br from-teal-600 to-teal-700 text-white shadow-sm">
          <p className="text-xs font-bold mb-0.5">Upgrade to Pro</p>
          <p className="text-xs text-teal-100 mb-3">Unlimited generations</p>
          <Link
            href="/settings/billing"
            className="block w-full text-center text-xs font-bold py-1.5 rounded-lg bg-white text-teal-700 hover:bg-teal-50 transition-colors"
          >
            View Plans →
          </Link>
        </div>
      </div>
    </aside>
  );
}
