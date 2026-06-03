import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";

export function CTA() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto text-center relative">
        {/* Glow */}
        <div
          className="absolute inset-0 rounded-3xl blur-3xl opacity-15 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at center, hsl(38,93%,54%), transparent 60%)" }}
        />

        <div className="relative glass-card rounded-3xl px-8 py-16 border border-primary/20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-sm font-medium text-primary mb-8">
            <Zap className="w-3.5 h-3.5" />
            Start free today
          </div>

          <h2 className="text-4xl sm:text-5xl font-extrabold text-foreground mb-5 leading-tight">
            Your AI writing assistant<br />
            is <span className="gold-text">ready when you are.</span>
          </h2>

          <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
            Join real estate agents saving 5+ hours every week. Start with 10 free generations — no credit card required.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/sign-up" className="btn-gold flex items-center gap-2 text-base px-10 py-4">
              Start Writing for Free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <p className="text-xs text-muted-foreground">
              10 free generations · No card · Cancel anytime
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
