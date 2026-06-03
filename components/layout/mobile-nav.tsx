"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Home, Mail, FileText, Share2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const mobileNavItems = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/listing", label: "Listing", icon: Home },
  { href: "/email", label: "Email", icon: Mail },
  { href: "/offer", label: "Offer", icon: FileText },
  { href: "/social", label: "Social", icon: Share2 },
  { href: "/history", label: "History", icon: Clock },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white">
      <div className="flex items-center justify-around py-1.5 px-1">
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-150 min-w-[48px]",
                isActive
                  ? "text-teal-600 bg-teal-50"
                  : "text-slate-400 hover:text-slate-600"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-semibold">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
