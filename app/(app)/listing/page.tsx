import type { Metadata } from "next";
import { ListingForm } from "@/components/generators/listing-form";
import { Home } from "lucide-react";

export const metadata: Metadata = {
  title: "Listing Description Generator",
  description: "Generate professional MLS property listing descriptions in seconds with AI.",
};

export default function ListingPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 border border-blue-100">
          <Home className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h1 className="page-title">Listing Description</h1>
          <p className="page-subtitle">MLS-ready copy in under 30 seconds.</p>
        </div>
      </div>
      <ListingForm />
    </div>
  );
}
