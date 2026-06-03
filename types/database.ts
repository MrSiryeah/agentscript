export type SubscriptionTier = "free" | "starter" | "pro" | "team";
export type ToolType =
  | "listing_description"
  | "follow_up_email"
  | "offer_letter"
  | "social_caption";

export interface Profile {
  id: string;
  clerk_user_id: string;
  email: string;
  full_name: string | null;
  agency_name: string | null;
  market_location: string | null;
  subscription_tier: SubscriptionTier;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  generation_count_this_month: number;
  generation_reset_date: string;
  created_at: string;
  updated_at: string;
}

export interface Generation {
  id: string;
  profile_id: string;
  tool_type: ToolType;
  input_data: Record<string, unknown>;
  output_text: string;
  tokens_used: number | null;
  created_at: string;
}

export interface WaitlistEntry {
  id: string;
  email: string;
  name: string | null;
  agency: string | null;
  source: string | null;
  created_at: string;
}

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Partial<Profile> & { clerk_user_id: string; email: string };
        Update: Partial<Profile>;
      };
      generations: {
        Row: Generation;
        Insert: Omit<Generation, "id" | "created_at">;
        Update: Partial<Generation>;
      };
      waitlist: {
        Row: WaitlistEntry;
        Insert: Omit<WaitlistEntry, "id" | "created_at">;
        Update: Partial<WaitlistEntry>;
      };
    };
  };
};
