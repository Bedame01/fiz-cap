"use server"

import { createClient } from "@/lib/supabase/server"

interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

export async function submitContactForm(data: ContactFormData) {
  const supabase = await createClient()

  // Validate input
  if (!data.name || !data.email || !data.subject || !data.message) {
    return { success: false, error: "All fields are required" }
  }

  if (data.name.length < 2) {
    return { success: false, error: "Name must be at least 2 characters" }
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return { success: false, error: "Please enter a valid email address" }
  }

  if (data.message.length < 10) {
    return { success: false, error: "Message must be at least 10 characters" }
  }

  try {
    const { error } = await supabase.from("contact_submissions").insert({
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
    })

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error("Failed to submit contact form:", error)
    return { success: false, error: "Failed to submit. Please try again." }
  }
}
