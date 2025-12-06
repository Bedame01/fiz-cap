"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Eye, Mail, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Message {
  id: string
  name: string
  email: string
  subject: string
  message: string
  status: string
  created_at: string
}

interface MessagesTableProps {
  messages: Message[]
}

export function MessagesTable({ messages }: MessagesTableProps) {
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const router = useRouter()
  const supabase = createClient()
  const { toast } = useToast()

  const markAsRead = async (id: string) => {
    await supabase.from("contact_submissions").update({ status: "read" }).eq("id", id)

    toast({
      title: "Marked as read",
    })

    router.refresh()
  }

  const unreadCount = messages.filter((m) => m.status === "new").length

  return (
    <>
      {unreadCount > 0 && (
        <div className="bg-primary/10 text-primary px-4 py-2 rounded-lg mb-4">
          You have {unreadCount} new message{unreadCount > 1 ? "s" : ""}
        </div>
      )}

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>From</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-24"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {messages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No messages yet
                </TableCell>
              </TableRow>
            ) : (
              messages.map((message) => (
                <TableRow key={message.id} className={message.status === "new" ? "bg-primary/5" : ""}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{message.name}</p>
                      <p className="text-sm text-muted-foreground">{message.email}</p>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{message.subject}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {format(new Date(message.created_at), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    <Badge variant={message.status === "new" ? "default" : "secondary"}>{message.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => setSelectedMessage(message)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      {message.status === "new" && (
                        <Button variant="ghost" size="icon" onClick={() => markAsRead(message.id)}>
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Message Details</DialogTitle>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-4">
              <div className="grid gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">From:</span>
                  <span className="font-medium">{selectedMessage.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <a href={`mailto:${selectedMessage.email}`} className="font-medium text-primary hover:underline">
                    {selectedMessage.email}
                  </a>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date:</span>
                  <span>{format(new Date(selectedMessage.created_at), "MMMM d, yyyy 'at' h:mm a")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subject:</span>
                  <span className="font-medium">{selectedMessage.subject}</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Message</h4>
                <p className="text-muted-foreground whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>

              <div className="flex gap-2 pt-4">
                <Button asChild className="flex-1">
                  <a href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}>
                    <Mail className="h-4 w-4 mr-2" />
                    Reply via Email
                  </a>
                </Button>
                {selectedMessage.status === "new" && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      markAsRead(selectedMessage.id)
                      setSelectedMessage(null)
                    }}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Mark as Read
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
