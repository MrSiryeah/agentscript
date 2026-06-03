import type { Metadata } from "next";
import { EmailForm } from "@/components/generators/email-form";

export const metadata: Metadata = {
  title: "Follow-Up Email Generator",
  description: "Generate personalised follow-up emails for your real estate leads instantly.",
};

export default function EmailPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Follow-Up Email</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Create personalised follow-up emails that convert leads into clients.
        </p>
      </div>
      <EmailForm />
    </div>
  );
}
