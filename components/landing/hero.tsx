import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full blur-3xl opacity-10"
          style={{ background: "radial-gradient(ellipse, hsl(38, 93%, 54%), transparent 70%)" }}
        />
        <div
          className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-5"
          style={{ background: "hsl(222, 80%, 60%)" }}
        />
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(hsl(210,40%,96%) 1px, transparent 1px), linear-gradient(90deg, hsl(210,40%,96%) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-sm font-medium text-primary mb-8 animate-fade-in">
          <Sparkles className="w-3.5 h-3.5" />
          AI built exclusively for real estate agents
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-foreground leading-tight mb-6 animate-slide-up">
          Write Every Listing,<br />
          Email &amp; Offer Letter —<br />
          <span className="gold-text">In Seconds.</span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          Generate professional listing descriptions, client emails, offer letters, and social posts
          with AI trained specifically on real estate. No prompts. Just results.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <Link href="/sign-up" className="btn-gold flex items-center gap-2 text-base px-8 py-4">
            Start Free — No Card Needed
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            See how it works →
          </a>
        </div>

        {/* Social proof numbers */}
        <div className="flex items-center justify-center gap-8 sm:gap-12 animate-fade-in" style={{ animationDelay: "0.3s" }}>
          {[
            { stat: "10 free", label: "generations to start" },
            { stat: "30 sec", label: "per listing description" },
            { stat: "$99/mo", label: "for unlimited access" },
          ].map(({ stat, label }) => (
            <div key={stat} className="text-center">
              <div className="text-2xl font-bold gold-text">{stat}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {/* UI Preview mockup */}
        <div className="mt-16 relative max-w-4xl mx-auto animate-slide-up" style={{ animationDelay: "0.4s" }}>
          <div className="absolute inset-0 rounded-2xl" style={{ background: "radial-gradient(ellipse at center, hsl(38,93%,54%,0.15), transparent 70%)" }} />
          <div className="glass-card border border-border/50 rounded-2xl overflow-hidden shadow-2xl">
            {/* Fake browser chrome */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border/30 bg-secondary/30">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
              </div>
              <div className="flex-1 mx-4">
                <div className="bg-background/50 rounded-md px-3 py-1 text-xs text-muted-foreground text-center">
                  agentscript.ai/listing
                </div>
              </div>
            </div>
            {/* Fake app content */}
            <div className="p-6 bg-background/50">
              <div className="grid grid-cols-5 gap-4">
                {/* Sidebar */}
                <div className="col-span-1 space-y-2">
                  {["Dashboard", "Listing ✦", "Email", "Offer", "Social"].map((item, i) => (
                    <div
                      key={item}
                      className={`h-8 rounded-lg text-xs flex items-center px-2 text-muted-foreground ${
                        i === 1 ? "bg-primary/15 text-primary font-semibold border-l-2 border-primary" : ""
                      }`}
                    >
                      {item}
                    </div>
                  ))}
                </div>
                {/* Main content */}
                <div className="col-span-4 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <div className="h-2.5 w-20 bg-muted-foreground/20 rounded" />
                      <div className="h-8 bg-secondary/50 rounded-lg" />
                    </div>
                    <div className="space-y-1.5">
                      <div className="h-2.5 w-16 bg-muted-foreground/20 rounded" />
                      <div className="h-8 bg-secondary/50 rounded-lg" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="h-2.5 w-24 bg-muted-foreground/20 rounded" />
                    <div className="h-16 bg-secondary/50 rounded-lg" />
                  </div>
                  {/* Output card */}
                  <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-5 h-5 rounded bg-primary/20 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      </div>
                      <span className="text-xs font-semibold text-primary">AI Generated</span>
                    </div>
                    <div className="space-y-1.5">
                      <div className="h-2 bg-foreground/10 rounded w-full" />
                      <div className="h-2 bg-foreground/10 rounded w-4/5" />
                      <div className="h-2 bg-foreground/10 rounded w-full" />
                      <div className="h-2 bg-foreground/10 rounded w-3/5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
