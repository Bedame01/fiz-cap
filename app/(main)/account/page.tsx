import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ProfileForm } from "@/components/account/profile-form"

export const metadata = {
  title: "Profile",
}

export default async function AccountPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return (
    <div className="bg-card rounded-lg border p-6">
      <h2 className="text-xl font-semibold mb-6">Profile Information</h2>
      <ProfileForm
        initialData={{
          email: user.email || "",
          firstName: profile?.first_name || "",
          lastName: profile?.last_name || "",
          phone: profile?.phone || "",
          userId: user.id,
        }}
      />
    </div>
  )
}
