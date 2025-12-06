import { ContactForm } from "@/components/contact/contact-form"
import { Mail, Phone, MapPin, Clock } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with our team. We are here to help.",
}

export default function ContactPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Get in Touch</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Have a question or need assistance? We are here to help. Fill out the form below or reach out through one of
          our contact channels.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        {/* Contact Info */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-lg font-semibold mb-6">Contact Information</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium">Email</p>
                  <a
                    href="mailto:support@minimal.com"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    support@minimal.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium">Phone</p>
                  <a
                    href="tel:+1-800-MINIMAL"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    +1 (800) MINIMAL
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium">Headquarters</p>
                  <p className="text-muted-foreground">
                    123 Design Street
                    <br />
                    New York, NY 10012
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium">Business Hours</p>
                  <p className="text-muted-foreground">
                    Mon - Fri: 9am - 6pm EST
                    <br />
                    Sat - Sun: 10am - 4pm EST
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <div className="bg-card rounded-lg border p-6 sm:p-8">
            <h2 className="text-lg font-semibold mb-6">Send us a message</h2>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  )
}
