import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "FIZ CAP | Fix your Fit",
    template: "%s | Fiz Cap",
  },
  description:
    "Discover our curated collection of premium caps, snapbacks, and headwear. From classic fitted caps to trendy dad hats, find your perfect style.",
  keywords: ["caps", "snapbacks", "fitted caps", "dad hats", "headwear", "hats", "streetwear", "fashion"],
  authors: [{ name: "FIZ CAP" }],
  creator: "FIZ CAP",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "FIZ CAP",
    title: "FIZ CAP | Fix your Fit",
    description: "Discover our curated collection of premium caps, snapbacks, and headwear.",
  },
  twitter: {
    card: "summary_large_image",
    title: "FIZ CAP | Fix your Fit",
    description: "Discover our curated collection of premium caps, snapbacks, and headwear.",
  },
  robots: {
    index: true,
    follow: true,
  },
    generator: 'v0.app'
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased min-h-screen flex flex-col">
        {children}
        <Toaster position="bottom-right" />
        <Analytics />
      </body>
    </html>
  )
}
