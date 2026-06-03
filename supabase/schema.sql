-- ============================================================
-- AgentScript — Supabase Database Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Profiles (synced from Clerk via webhook)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT,
  agency_name TEXT,
  market_location TEXT DEFAULT 'US',
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'starter', 'pro', 'team')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  generation_count_this_month INTEGER DEFAULT 0,
  generation_reset_date TIMESTAMPTZ DEFAULT (date_trunc('month', NOW()) + INTERVAL '1 month'),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users own their profile" ON profiles;
CREATE POLICY "Users own their profile" ON profiles
  FOR ALL USING (clerk_user_id = auth.uid()::TEXT);

-- Allow service role to manage profiles (for webhooks)
DROP POLICY IF EXISTS "Service role manages profiles" ON profiles;
CREATE POLICY "Service role manages profiles" ON profiles
  FOR ALL TO service_role USING (true);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- Generations (AI-generated content history)
CREATE TABLE IF NOT EXISTS generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  tool_type TEXT NOT NULL CHECK (tool_type IN ('listing_description', 'follow_up_email', 'offer_letter', 'social_caption')),
  input_data JSONB NOT NULL,
  output_text TEXT NOT NULL,
  tokens_used INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security for generations
ALTER TABLE generations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users own their generations" ON generations;
CREATE POLICY "Users own their generations" ON generations
  FOR ALL USING (
    profile_id IN (
      SELECT id FROM profiles WHERE clerk_user_id = auth.uid()::TEXT
    )
  );

DROP POLICY IF EXISTS "Service role manages generations" ON generations;
CREATE POLICY "Service role manages generations" ON generations
  FOR ALL TO service_role USING (true);

-- Indexes for fast retrieval
CREATE INDEX IF NOT EXISTS generations_profile_created ON generations(profile_id, created_at DESC);
CREATE INDEX IF NOT EXISTS generations_tool_type ON generations(profile_id, tool_type);


-- Waitlist
CREATE TABLE IF NOT EXISTS waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  agency TEXT,
  source TEXT DEFAULT 'landing_page',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Waitlist is publicly insertable (no auth needed to join)
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can join waitlist" ON waitlist;
CREATE POLICY "Anyone can join waitlist" ON waitlist
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Service role manages waitlist" ON waitlist;
CREATE POLICY "Service role manages waitlist" ON waitlist
  FOR ALL TO service_role USING (true);
