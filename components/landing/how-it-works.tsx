const steps = [
  {
    number: "01",
    title: "Fill in a simple form",
    desc: "No prompts to write. Enter your property details, lead info, or offer specifics using familiar dropdowns and checkboxes.",
  },
  {
    number: "02",
    title: "AI generates in seconds",
    desc: "Our AI — trained on real estate language — produces professional, specific, non-generic content tailored to your market and inputs.",
  },
  {
    number: "03",
    title: "Copy, send, close deals",
    desc: "Copy the output with one click, make any tweaks you want, and use it immediately. Every piece is saved to your history.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 px-6 bg-secondary/10 border-y border-border/30">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            How it works
          </h2>
          <p className="text-muted-foreground text-lg">Three steps. Under a minute. Every time.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector line (desktop) */}
          <div className="hidden md:block absolute top-10 left-[calc(16.66%+1rem)] right-[calc(16.66%+1rem)] h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

          {steps.map(({ number, title, desc }) => (
            <div key={number} className="text-center relative">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl border border-primary/20 bg-primary/5 mb-6 text-3xl font-extrabold gold-text">
                {number}
              </div>
              <h3 className="text-lg font-bold text-foreground mb-3">{title}</h3>
              <p className="text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
