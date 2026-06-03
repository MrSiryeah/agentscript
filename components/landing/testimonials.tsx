const testimonials = [
  {
    quote: "I used to spend Sunday evenings writing listing descriptions. Now I do all of them in 15 minutes on Monday morning. AgentScript paid for itself on the first deal.",
    name: "Marcus T.",
    role: "Residential Agent · Miami, FL",
    initials: "MT",
  },
  {
    quote: "The follow-up email tool is incredible. I generate 10 follow-ups in the time it used to take me to write one. My response rate has actually gone up because the emails feel personal, not templated.",
    name: "Sarah K.",
    role: "Agent · London, UK",
    initials: "SK",
  },
  {
    quote: "My buyers' offer letters are now genuinely compelling. We won a multi-offer situation last month and the seller's agent told us the cover letter made the difference. I'm never going back.",
    name: "James W.",
    role: "Buyer's Agent · Austin, TX",
    initials: "JW",
  },
];

export function Testimonials() {
  return (
    <section className="py-24 px-6 bg-secondary/10 border-y border-border/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-muted-foreground text-sm font-medium uppercase tracking-wider mb-4">
            Trusted by 200+ real estate agents
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            What agents are saying
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map(({ quote, name, role, initials }) => (
            <div key={name} className="glass-card p-6 flex flex-col">
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <blockquote className="text-sm text-foreground/80 leading-relaxed flex-1 mb-5">
                &ldquo;{quote}&rdquo;
              </blockquote>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center text-xs font-bold text-primary">
                  {initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{name}</p>
                  <p className="text-xs text-muted-foreground">{role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
