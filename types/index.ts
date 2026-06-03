export type { Profile, Generation, WaitlistEntry, SubscriptionTier, ToolType, Database } from "./database";

export interface ListingFormData {
  address: string;
  propertyType: string;
  bedrooms: number | string;
  bathrooms: number | string;
  squareFootage: number | string;
  sizeUnit: "sq ft" | "sq m";
  features: string[];
  tone: string;
  targetAudience: string;
  additionalDetails?: string;
}

export interface EmailFormData {
  leadName: string;
  howWeMet: string;
  propertyInterest?: string;
  leadSituation: string;
  followUpType: string;
  tone: string;
}

export interface OfferFormData {
  buyerNames: string;
  propertyAddress: string;
  offerPrice: string;
  buyerStrengths: string[];
  personalConnection?: string;
  tone: string;
}

export interface SocialFormData {
  propertyDescription: string;
  postType: string;
  platforms: string[];
  includeHashtags: boolean;
}

export interface GenerationResult {
  content: string;
  inputTokens: number;
  outputTokens: number;
}

export const MONTHLY_LIMITS: Record<string, number> = {
  free: 10,
  starter: 100,
  pro: 999999,
  team: 999999,
};

export const PLAN_NAMES: Record<string, string> = {
  free: "Free Trial",
  starter: "Starter",
  pro: "Pro",
  team: "Team",
};
