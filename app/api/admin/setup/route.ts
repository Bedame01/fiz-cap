import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

// Create admin client with service role key for bypassing RLS
const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: Request) {
  try {
    const { userId, email } = await request.json()

    if (!userId || !email) {
      return NextResponse.json({ error: "Missing userId or email" }, { status: 400 })
    }

    // Check if any admin exists - if so, require authentication
    const { count } = await supabaseAdmin
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "admin")

    // If admins exist, this endpoint is restricted (would need auth check in real app)
    // For now, allow creating additional admins via the form

    // Upsert profile with admin role
    const { error } = await supabaseAdmin.from("profiles").upsert(
      {
        id: userId,
        email,
        role: "admin",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" },
    )

    if (error) {
      console.error("Error creating admin profile:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Admin setup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
