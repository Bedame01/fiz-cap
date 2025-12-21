import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono, Nunito, Poppins, Nixie_One } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })
const _nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito", weight: ["400", "500", "600", "700", "800"] })
const _poppins = Poppins({ subsets: ["latin"], variable: "--font-poppins", weight: ["400", "500", "600", "700", "800"] })
const _nixieOne = Nixie_One({ subsets: ["latin"], weight: ["400"] })


export const metadata: Metadata = {
  title: {
    default: "Fiz Cap - Fix your Fit",
    template: "%s - Fiz Cap",
  },
  description:
    "Discover our curated collection of premium caps, snapbacks, and headwear. From classic fitted caps to trendy dad hats, find your perfect style.",
  keywords: ["caps", "snapbacks", "fitted caps", "dad hats", "headwear", "hats", "streetwear", "fashion"],
  authors: [{ name: "FIZ CAP" }],
  creator: "Fiz Cap",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Fiz Cap",
    title: "Fiz Cap - Fix your Fit",
    description: "Discover our curated collection of premium caps, snapbacks, and headwear.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fiz Cap | Fix your Fit",
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
      <head>
        <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet"></link>
      </head>
      <body className="font-sans antialiased min-h-screen flex flex-col">
        {children}
        <Toaster position="bottom-right"/>
        <Analytics />
        <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
        <script>
          AOS.init();
        </script>
      </body>
    </html>
  )
}
