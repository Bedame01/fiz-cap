import type React from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AccountSidebar } from "@/components/account/account-sidebar"

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?redirect=/account")
  }

  return (
    <main className="min-h-screen bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <h1 className="text-3xl font-bold tracking-tight mb-8">My Account</h1>
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8">
          <AccountSidebar />
          <div>{children}</div>
        </div>
      </div>
    </main>
  )
}
