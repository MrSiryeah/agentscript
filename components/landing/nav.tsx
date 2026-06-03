"use client";

import Link from "next/link";
import { Zap, Menu, X } from "lucide-react";
import { useState } from "react";

export function LandingNav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/30 bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gold-gradient">
            <Zap className="w-4 h-4 text-slate-950" />
          </div>
          <span className="text-lg font-bold gold-text">AgentScript</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
          <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
          <a href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">FAQ</a>
          <Link href="/sign-in" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Sign In</Link>
          <Link href="/sign-up" className="btn-gold text-sm px-5 py-2">
            Start Free →
          </Link>
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2">
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border/30 bg-background/95 backdrop-blur-md px-6 py-4 space-y-3">
          <a href="#features" className="block text-sm text-muted-foreground hover:text-foreground">Features</a>
          <a href="#pricing" className="block text-sm text-muted-foreground hover:text-foreground">Pricing</a>
          <a href="#faq" className="block text-sm text-muted-foreground hover:text-foreground">FAQ</a>
          <Link href="/sign-in" className="block text-sm text-muted-foreground hover:text-foreground">Sign In</Link>
          <Link href="/sign-up" className="btn-gold block text-center text-sm px-5 py-2.5">Start Free →</Link>
        </div>
      )}
    </nav>
  );
}
