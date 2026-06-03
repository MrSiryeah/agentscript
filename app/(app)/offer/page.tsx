import type { Metadata } from "next";
import { OfferForm } from "@/components/generators/offer-form";
import { FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Offer Letter Generator",
  description: "Generate compelling buyer offer cover letters that win multi-offer situations.",
};

export default function OfferPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-50 border border-amber-100">
          <FileText className="w-5 h-5 text-amber-600" />
        </div>
        <div>
          <h1 className="page-title">Offer Letter</h1>
          <p className="page-subtitle">Win multi-offer situations with a compelling buyer letter.</p>
        </div>
      </div>
      <OfferForm />
    </div>
  );
}
