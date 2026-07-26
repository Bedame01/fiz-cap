"use server"

import { createClient } from "@supabase/supabase-js"
import {
  generateNewsletterAdminNotificationEmail,
  generateNewsletterWelcomeEmail,
  sendSmtpEmail,
} from "@/lib/email/gmail-smtp"

const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function subscribeToNewsletter(email: string) {
  const normalizedEmail = email.trim().toLowerCase()

  if (!normalizedEmail) {
    return { success: false, error: "Email is required" }
  }

  if (!EMAIL_REGEX.test(normalizedEmail)) {
    return { success: false, error: "Please enter a valid email address" }
  }

  try {
    const { data: existingSubscriber } = await supabaseAdmin
      .from("newsletter_subscribers")
      .select("id, status")
      .eq("email", normalizedEmail)
      .maybeSingle()

    if (existingSubscriber?.status === "active") {
      return {
        success: true,
        message: "You are already subscribed to the FIZ CAP Crew.",
        alreadySubscribed: true,
      }
    }

    if (existingSubscriber) {
      const { error: updateError } = await supabaseAdmin
        .from("newsletter_subscribers")
        .update({ status: "active" })
        .eq("id", existingSubscriber.id)

      if (updateError) throw updateError
    } else {
      const { error: insertError } = await supabaseAdmin.from("newsletter_subscribers").insert({
        email: normalizedEmail,
        status: "active",
      })

      if (insertError) throw insertError
    }

    const welcomeResult = await sendSmtpEmail({
      to: normalizedEmail,
      subject: "Welcome to the FIZ CAP Crew",
      html: generateNewsletterWelcomeEmail(normalizedEmail),
    })

    if (!welcomeResult.success) {
      return {
        success: false,
        error: "Subscription saved, but we could not send your confirmation email. Please try again later.",
      }
    }

    const adminEmail = process.env.ADMIN_EMAIL || process.env.GMAIL_USER || process.env.SMTP_USER
    if (adminEmail) {
      await sendSmtpEmail({
        to: adminEmail,
        subject: "New FIZ CAP Crew subscriber",
        html: generateNewsletterAdminNotificationEmail(normalizedEmail),
      })
    }

    return {
      success: true,
      message: "Welcome to the FIZ CAP Crew! Check your inbox for a confirmation email.",
    }
  } catch (error) {
    console.error("Failed to subscribe to newsletter:", error)
    return { success: false, error: "Failed to subscribe. Please try again." }
  }
}
