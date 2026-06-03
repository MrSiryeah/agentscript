import type { Metadata } from "next";
import { OfferForm } from "@/components/generators/offer-form";

export const metadata: Metadata = {
  title: "Offer Letter Generator",
  description: "Generate compelling offer cover letters that help your buyers win deals.",
};

export default function OfferPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Offer Letter</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Write a compelling cover letter to accompany your buyer&apos;s offer — in under a minute.
        </p>
      </div>
      <OfferForm />
    </div>
  );
}
