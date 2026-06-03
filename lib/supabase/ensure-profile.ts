import { clerkClient } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

/**
 * Fetches the profile for a Clerk user, auto-creating it if it doesn't exist.
 * This is a self-healing fallback for users who registered before the DB was ready.
 */
export async function ensureProfile(userId: string) {
  const supabase = createServerSupabaseClient();

  // Try to fetch existing profile
  const { data: existing } = await supabase
    .from("profiles")
    .select("*")
    .eq("clerk_user_id", userId)
    .single();

  if (existing) return existing;

  // Profile missing — fetch user from Clerk and create it
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const email = user.emailAddresses[0]?.emailAddress ?? "";
  const full_name = [user.firstName, user.lastName].filter(Boolean).join(" ");

  const { data: created, error } = await supabase
    .from("profiles")
    .insert({
      clerk_user_id: userId,
      email,
      full_name: full_name || null,
    })
    .select("*")
    .single();

  if (error) throw new Error(`Failed to create profile: ${error.message}`);
  return created;
}
