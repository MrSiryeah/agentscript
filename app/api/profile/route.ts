import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function PATCH(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { full_name, agency_name, market_location } = body;

  const supabase = createServerSupabaseClient();
  const { error } = await supabase
    .from("profiles")
    .update({ full_name, agency_name, market_location })
    .eq("clerk_user_id", userId);

  if (error) return NextResponse.json({ error: "Update failed" }, { status: 500 });

  return NextResponse.json({ updated: true });
}
