'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Instagram, Mail } from "lucide-react"
import logoBlack from '@/public/icons/logoBlack.png'
import logoWhite from '@/public/icons/logoWhite.png'
import { useTheme } from "next-themes"
import Image from "next/image"
// import Tiktok from "@/public/icons/Tiktok-Logo--Streamline-Logos.svg"

const footerLinks = {
  shop: [
    { label: "Snapbacks", href: "/shop?style=snapback" },
    { label: "Fitted Caps", href: "/shop?style=fitted" },
    { label: "Dad Hats", href: "/shop?style=dad-hat" },
    { label: "Trucker Caps", href: "/shop?style=trucker" },
    { label: "Beanies", href: "/shop?style=beanie" },
    { label: "All Headwear", href: "/shop" },
  ],
  support: [
    { label: "Contact Us", href: "/contact" },
    { label: "FAQ", href: "/faq" },
    { label: "Size Guide", href: "/size-guide" },
  ],
  company: [
    { label: "About Fiz Cap", href: "/about" },
    { label: "Store", href: "/stores" },
    { label: "Account", href: "/account" },
    { label: "Orders", href: "/account/orders" },
  ],
  legal: [
    { label: "Terms of Service", href: "/terms" },
    { label: "Shipping Policy", href: "/shipping-policy" },
    { label: "Refund Policy", href: "/refund-policy" },
  ],
}

const socialLinks = [
  // { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
  // { icon: Tiktok, href: "https://tiktok.com/Fizcaps", label: "Tiktok" },
  { icon: Instagram, href: "https://instagram.com/Fiz_caps", label: "Instagram" },
  { icon: Mail, href: "mailto:Fizayomi21@gmail.com", label: "Email;" },
]

export function Footer() {
  const pathname = usePathname()
  const { theme } = useTheme()

  if (pathname === "/checkout" || pathname === "/admin" || pathname === "/account/orders" || pathname === "/account") {
    return null
  }

  if (pathname === "/stores" || pathname === "/checkout/success" || pathname === "/refund-policy" || pathname === "/shipping-policy" || pathname === "/size-guide" || pathname === "/terms" || pathname === "/cart") {
   return (
      <div className="border-t mt-12 py-8 w-full">
          <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Fiz Cap. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <img src="/visa-logo-generic.png" alt="Visa" className="h-7 opacity-70" />
              <img src="/mastercard-logo.png" alt="Mastercard" className="h-7 opacity-70" />
              <img src="/verve-payment-logo.jpg" alt="Verve" className="h-7 opacity-70" />
              <img src="/paystack-payment-logo.jpg" alt="Paystack" className="h-7 opacity-70" />
            </div>
          </div>
      </div>
   )
  }

  return (
    <footer className="bg-secondary/30 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          

          {/* Shop Links */}
          <div>
            <h3 className="font-semibold mb-4 textDisplay">Shop</h3>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-semibold mb-4 textDisplay">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold mb-4 textDisplay">Quick Links</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="font-semibold mb-4 textDisplay">Terms and policies</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Brand */}
        <div className="flex justify-center mx-auto mt-6 pt-6 border-t w-full">
          <Link href="/" className="">
            {/* <span className="text-xl font-bold tracking-tight">FIZ CAP</span> */}
            <Image
              src={theme === "dark" ? logoWhite : logoBlack}
              alt="logo"
              className="w-[33%]! md:w-[18%]! lg:w-[13%]! mx-auto h-auto"
            />
          </Link>
        </div>

        {/* Bottom Bar */}
        <div className="border-t mt-6 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Fiz Cap. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <img src="/visa-logo-generic.png" alt="Visa" className="h-7 opacity-70" />
            <img src="/mastercard-logo.png" alt="Mastercard" className="h-7 opacity-70" />
            <img src="/verve-payment-logo.jpg" alt="Verve" className="h-7 opacity-70" />
            <img src="/paystack-payment-logo.jpg" alt="Paystack" className="h-7 opacity-70" />
          </div>
        </div>
      </div>
    </footer>
  )
}
