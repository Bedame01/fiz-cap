import Link from "next/link"
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react"

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
    { label: "Size Guide", href: "/size-guide" },
    { label: "Shipping Info", href: "/shipping" },
    { label: "Returns & Exchanges", href: "/returns" },
  ],
  company: [
    { label: "About CAPHAUS", href: "/about" },
    { label: "Our Stores", href: "/stores" },
    { label: "Careers", href: "/careers" },
    { label: "Press", href: "/press" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
  ],
}

const socialLinks = [
  { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { icon: Youtube, href: "https://youtube.com", label: "YouTube" },
]

export function Footer() {
  return (
    <footer className="bg-secondary/30 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 lg:pr-8">
            <Link href="/" className="inline-block mb-4">
              <span className="text-xl font-bold tracking-tight">CAPHAUS</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs">
              Premium headwear for every style. From classic snapbacks to fitted caps, find your perfect fit.
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
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="font-semibold mb-4">Shop</h3>
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
            <h3 className="font-semibold mb-4">Support</h3>
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
            <h3 className="font-semibold mb-4">Company</h3>
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
            <h3 className="font-semibold mb-4">Legal</h3>
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
            &copy; {new Date().getFullYear()} CAPHAUS. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <img src="/visa-logo-generic.png" alt="Visa" className="h-6 opacity-50" />
            <img src="/mastercard-logo.png" alt="Mastercard" className="h-6 opacity-50" />
            <img src="/amex-logo.png" alt="American Express" className="h-6 opacity-50" />
            <img src="/apple-pay-logo.png" alt="Apple Pay" className="h-6 opacity-50" />
          </div>
        </div>
      </div>
    </footer>
  )
}
