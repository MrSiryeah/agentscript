import type { Metadata } from "next";
import { EmailForm } from "@/components/generators/email-form";
import { Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Follow-Up Email Generator",
  description: "Generate personalised follow-up emails for your real estate leads instantly.",
};

export default function EmailPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-violet-50 border border-violet-100">
          <Mail className="w-5 h-5 text-violet-600" />
        </div>
        <div>
          <h1 className="page-title">Follow-Up Email</h1>
          <p className="page-subtitle">Personalised emails that convert leads into clients.</p>
        </div>
      </div>
      <EmailForm />
    </div>
  );
}
