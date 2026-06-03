"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { OnboardingModal } from "@/components/shared/onboarding-modal";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Show onboarding only on first visit (no localStorage key set)
    if (typeof window !== "undefined") {
      const onboarded = localStorage.getItem("agentscript_onboarded");
      if (!onboarded) setShowOnboarding(true);
    }
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-50">
      {showOnboarding && (
        <OnboardingModal onComplete={() => setShowOnboarding(false)} />
      )}
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-6 pb-24 lg:pb-8 overflow-auto">
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
