import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createServerSupabaseClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("clerk_user_id", userId)
    .single();

  const { data: recentGenerations } = await supabase
    .from("generations")
    .select("id, tool_type, output_text, created_at")
    .eq("profile_id", profile?.id ?? "")
    .order("created_at", { ascending: false })
    .limit(5);

  return NextResponse.json({ profile, recentGenerations });
}
