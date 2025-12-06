import { createClient } from "@/lib/supabase/server"
import { MessagesTable } from "@/components/admin/messages-table"

async function getMessages() {
  const supabase = await createClient()
  const { data } = await supabase.from("contact_submissions").select("*").order("created_at", { ascending: false })

  return data || []
}

export default async function AdminMessagesPage() {
  const messages = await getMessages()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Messages</h1>
        <p className="text-muted-foreground">View contact form submissions</p>
      </div>

      <MessagesTable messages={messages} />
    </div>
  )
}
