import type React from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Providers } from "@/components/layout/providers"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Providers>
      <Header />
      <div className="flex-1">{children}</div>
      <Footer />
    </Providers>
  )
}
