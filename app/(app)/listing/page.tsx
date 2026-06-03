import type { Metadata } from "next";
import { ListingForm } from "@/components/generators/listing-form";

export const metadata: Metadata = {
  title: "Listing Description Generator",
  description: "Generate professional MLS property listing descriptions in seconds with AI.",
};

export default function ListingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Listing Description</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Enter your property details and get a compelling MLS description in seconds.
        </p>
      </div>
      <ListingForm />
    </div>
  );
}
