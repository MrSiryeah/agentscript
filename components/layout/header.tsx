"use client";

import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

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
    <header className="flex items-center justify-between h-16 px-6 border-b border-border/50 bg-card/30 backdrop-blur-sm">
      <h1 className="text-lg font-semibold text-foreground">{title}</h1>
      <div className="flex items-center gap-4">
        <UserButton
          appearance={{
            elements: {
              avatarBox: "w-8 h-8",
            },
          }}
        />
      </div>
    </header>
  );
}
