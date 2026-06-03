// eslint-disable-next-line @typescript-eslint/no-explicit-any
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

/**
 * Server-side Supabase client using the SERVICE ROLE key.
 * Use ONLY in API routes and server actions — never expose this key to the client.
 *
 * Note: We return the untyped client to avoid Supabase v2 TypeScript inference
 * issues with .update() chains. Select queries are typed via the Database generic.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createServerSupabaseClient(): any {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

