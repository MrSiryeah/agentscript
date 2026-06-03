import { Home, Mail, FileText, Share2, Clock, CheckCircle2 } from "lucide-react";

const features = [
  {
    icon: Home,
    title: "Listing Description Generator",
    desc: "Enter property details and get a compelling MLS-ready description with a short teaser for portals and social — in under 30 seconds.",
    bullets: ["150–280 word full description", "2–3 sentence teaser version", "Tone & audience targeting"],
  },
  {
    icon: Mail,
    title: "Follow-Up Email Generator",
    desc: "Never stare at a blank email again. Enter your lead's details and get a personal, action-oriented follow-up ready to send.",
    bullets: ["Personalised to the lead", "Right tone for the situation", "Includes subject line"],
  },
  {
    icon: FileText,
    title: "Offer Letter Generator",
    desc: "Help your buyers stand out. Generate a compelling cover letter that highlights their strengths and creates a genuine human connection.",
    bullets: ["250–380 word letter", "Highlights buyer strengths", "Warm, persuasive tone"],
  },
  {
    icon: Share2,
    title: "Social Media Caption Generator",
    desc: "Create platform-perfect captions for Instagram, Facebook, and LinkedIn simultaneously — with or without hashtags.",
    bullets: ["All 3 platforms at once", "Post-type optimised", "Optional hashtag set"],
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 px-6 max-w-7xl mx-auto">
      {/* Section header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border text-xs font-medium text-muted-foreground mb-4">
          <Clock className="w-3 h-3" />
          Save 5+ hours every week
        </div>
        <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
          Four tools. Every writing task<br />
          <span className="gold-text">agents face — covered.</span>
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          No generic AI. No prompts to write. Just fill in a form, click generate, and copy the result.
        </p>
      </div>

      {/* Feature grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map(({ icon: Icon, title, desc, bullets }) => (
          <div key={title} className="glass-card p-8 hover:border-primary/20 transition-all duration-300 group">
            <div className="icon-circle mb-5 group-hover:border-primary/40 transition-colors duration-300">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">{title}</h3>
            <p className="text-muted-foreground mb-5 leading-relaxed">{desc}</p>
            <ul className="space-y-2">
              {bullets.map((b) => (
                <li key={b} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
