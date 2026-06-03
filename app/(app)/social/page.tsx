import type { Metadata } from "next";
import { SocialForm } from "@/components/generators/social-form";

export const metadata: Metadata = {
  title: "Social Media Caption Generator",
  description: "Create ready-to-post social media captions for Instagram, Facebook, and LinkedIn.",
};

export default function SocialPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Social Captions</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Generate platform-perfect captions for Instagram, Facebook, and LinkedIn instantly.
        </p>
      </div>
      <SocialForm />
    </div>
  );
}
