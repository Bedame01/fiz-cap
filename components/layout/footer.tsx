'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Instagram, Mail } from "lucide-react"

import Tiktok from "@/public/icons/Tiktok-Logo--Streamline-Logos.svg"

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
    { label: "Shipping Info", href: "/shipping" },
    { label: "Returns & Exchanges", href: "/returns" },
  ],
  company: [
    { label: "About Fiz Cap", href: "/about" },
    { label: "Store", href: "/stores" },
    { label: "Account", href: "/account" },
    { label: "Orders", href: "/account/orders" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
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

  if (pathname === "/checkout" || pathname === "/admin") {
    return null
  }

  return (
    <footer className="bg-secondary/30 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 lg:pr-8">
            <Link href="/" className="inline-block mb-4">
              <span className="text-xl font-bold tracking-tight">FIZ CAP</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs">
              Premium headwear for every style. From classic snapbacks to fitted caps, Fix your fit.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
              <a
                href="https://www.tiktok.com/Fizcaps"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                // aria-label='Tiktok'
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="size-[19px] stroke-muted-foreground hover:stroke-foreground transition-all">
                  <path stroke="inherit" stroke-linejoin="round" d="M16 1.5h-3.5V16c0 1.5 -1.5 3 -3 3s-3 -0.5 -3 -3c0 -2 1.899 -3.339 3.5 -3V9.5c-6.12 0 -7 5 -7 6.5s0.977 6.5 6.5 6.5c4.522 0 6.5 -3.5 6.5 -6v-8c1.146 1.018 2.922 1.357 5 1.5V6.5c-3.017 0 -5 -2.654 -5 -5Z" stroke-width="1.8"></path>
                </svg>
              </a>
            </div>
          </div>

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

        {/* Bottom Bar */}
        <div className="border-t mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
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
