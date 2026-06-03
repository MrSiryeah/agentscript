import type { Metadata } from "next";
import { SocialForm } from "@/components/generators/social-form";
import { Share2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Social Media Caption Generator",
  description: "Generate platform-optimised Instagram, Facebook, and LinkedIn captions for real estate.",
};

export default function SocialPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-pink-50 border border-pink-100">
          <Share2 className="w-5 h-5 text-pink-600" />
        </div>
        <div>
          <h1 className="page-title">Social Captions</h1>
          <p className="page-subtitle">Optimised captions for Instagram, Facebook, and LinkedIn.</p>
        </div>
      </div>
      <SocialForm />
    </div>
  );
}
