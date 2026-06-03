"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "Will the AI content sound generic?",
    a: "No — you input your specific property details and our AI is trained on real estate language and formats. The output is specific to your property and your market. You can regenerate with different tones until it sounds exactly right.",
  },
  {
    q: "Do I need to know how to use AI or write prompts?",
    a: "Not at all. There are no prompts to write. You fill in a simple form with dropdowns and checkboxes, click Generate, and get professional copy instantly. It takes less time than typing a text message.",
  },
  {
    q: "Can I edit what the AI generates?",
    a: "Yes — every output is editable before you copy it. The AI does the first 90%, you personalise the last 10%. Most agents copy the output and use it exactly as-is.",
  },
  {
    q: "Is my client data stored safely?",
    a: "Your data is encrypted in transit and at rest. We use Supabase (enterprise-grade PostgreSQL) for storage and never use your client data to train AI models. We never sell or share your data.",
  },
  {
    q: "What happens when my free trial ends?",
    a: "After 10 free generations, you'll be prompted to choose a paid plan. Your saved generations remain accessible whether or not you upgrade.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes — cancel anytime from your billing settings. No contracts, no cancellation fees, no awkward calls. Your access continues until the end of the billing period.",
  },
  {
    q: "Does it work for international markets?",
    a: "Yes. AgentScript is designed for US, UK, Australian, Maltese, and broader European markets. The AI adapts its language, terminology, and style based on your market setting in your profile.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 px-6 max-w-3xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-foreground mb-4">Frequently asked questions</h2>
        <p className="text-muted-foreground">Everything you need to know before getting started.</p>
      </div>

      <div className="space-y-3">
        {faqs.map(({ q, a }, i) => (
          <div key={q} className="glass-card overflow-hidden">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full px-6 py-4 flex items-center justify-between text-left gap-4"
            >
              <span className="text-sm font-semibold text-foreground">{q}</span>
              <ChevronDown
                className={cn(
                  "w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200",
                  open === i && "rotate-180"
                )}
              />
            </button>
            {open === i && (
              <div className="px-6 pb-5">
                <p className="text-sm text-muted-foreground leading-relaxed">{a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
