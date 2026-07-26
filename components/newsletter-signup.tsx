"use client"

import { type FormEvent, useState } from "react"
import { CheckCircle2, Loader2, Mail } from "lucide-react"
import { subscribeToNewsletter } from "@/app/actions/newsletter"
import { Button } from "@/components/ui/button"

type FormState = {
  status: "idle" | "loading" | "success" | "error"
  message: string
}

export function NewsletterSignup() {
  const [email, setEmail] = useState("")
  const [formState, setFormState] = useState<FormState>({ status: "idle", message: "" })

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmedEmail = email.trim()
    if (!trimmedEmail) {
      setFormState({ status: "error", message: "Please enter your email address." })
      return
    }

    setFormState({ status: "loading", message: "" })

    const result = await subscribeToNewsletter(trimmedEmail)

    if (result.success) {
      setEmail("")
      setFormState({ status: "success", message: result.message || "You’re on the list!" })
    } else {
      setFormState({ status: "error", message: result.error || "Unable to subscribe right now." })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <div className="flex-1 relative">
        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          id="newsletter-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Enter your email"
          autoComplete="email"
          disabled={formState.status === "loading"}
          className="w-full pl-10 pr-4 py-3 rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-background/50"
          required
        />
      </div>
      <Button
        type="submit"
        variant="secondary"
        size="lg"
        disabled={formState.status === "loading"}
        className="bg-background text-foreground hover:bg-background/90"
      >
        {formState.status === "loading" ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Subscribing...
          </>
        ) : (
          "Subscribe"
        )}
      </Button>

      {formState.message ? (
        <p
          aria-live="polite"
          className={`w-full text-sm text-left sm:text-center ${
            formState.status === "success" ? "text-emerald-200" : "text-red-200"
          }`}
        >
          {formState.status === "success" ? <CheckCircle2 className="inline mr-2 h-4 w-4" /> : null}
          {formState.message}
        </p>
      ) : null}
    </form>
  )
}
