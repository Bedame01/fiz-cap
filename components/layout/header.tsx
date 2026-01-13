"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { CartButton } from "@/components/cart/cart-button"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"
import { Menu } from "lucide-react"
import { useTheme } from "next-themes"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import logoBlack from '@/public/icons/logoBlack.png'
import logoWhite from '@/public/icons/logoWhite.png'
import Image from "next/image"

const navLinks = [
  { href: "/shop", label: "Shop All" },
  // { href: "/shop?style=snapback", label: "Snapbacks" },
  // { href: "/shop?style=fitted", label: "Fitted" },
  { href: "/about", label: "About Us" },
  { href: "/stores", label: "Stores" },
  { href: "/contact", label: "Contact Us" },
]

export function Header() {
  const pathname = usePathname()
  const { theme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const checkAdmin = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()
        setIsAdmin(profile?.role === "admin")
      }
    }
    checkAdmin()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      checkAdmin()
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  if (pathname === "/checkout" || pathname === "/admin" || pathname === "/checkout/success") {
    return null
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center">
            {/* <span className="text-xl font-bold tracking-tight">FIZ CAP</span> */}
            <Image
              src={theme === "dark" ? logoWhite : logoBlack}
              alt="logo"
              className="w-23 h-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "md:text-[12.5px] lg:text-[13.6px] font-medium transition-colors hover:text-foreground uppercase",
                  pathname === link.href || (link.href.includes("?") && pathname === "/shop")
                    ? "text-foreground"
                    : "text-muted-foreground",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild className="hidden sm:flex">
              <Link href="/shop">
                {/* <Search className="w-5 h-5" /> */}
                <svg className="modal__toggle-open icon icon-search size-5 fill-foreground" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="search-icon">
                  <title id="search-icon">Search</title>
                  <g clip-path="url(#clip0_738:3276)">
                  <path d="M10.9549 22.1488C8.78808 22.1488 6.66987 21.4992 4.86818 20.2823C3.0665 19.0655 1.66229 17.3359 0.833066 15.3123C0.00384227 13.2886 -0.213135 11.0619 0.2096 8.91363C0.632334 6.76537 1.67583 4.79205 3.20804 3.24324C4.74025 1.69443 6.69241 0.639624 8.81764 0.212308C10.9429 -0.215008 13.1457 0.00432107 15.1477 0.842531C17.1496 1.68074 18.8606 3.10017 20.0645 4.92137C21.2683 6.74258 21.9109 8.88375 21.9109 11.0741C21.9077 14.0103 20.7524 16.8253 18.6984 18.9015C16.6445 20.9777 13.8596 22.1455 10.9549 22.1488ZM10.9549 1.12122C9.00736 1.12122 7.10359 1.70502 5.48422 2.79877C3.86486 3.89252 2.60272 5.44703 1.85741 7.26586C1.1121 9.0847 0.917027 11.0861 1.29698 13.0169C1.67694 14.9478 2.61482 16.7215 3.99197 18.1136C5.36912 19.5056 7.12379 20.4537 9.03395 20.8378C10.9441 21.2218 12.924 21.0247 14.7234 20.2713C16.5227 19.5179 18.0606 18.2421 19.1426 16.6051C20.2246 14.9682 20.8022 13.0438 20.8022 11.0751C20.7992 8.43612 19.7608 5.90601 17.9147 4.03994C16.0687 2.17387 13.5657 1.12422 10.9549 1.12122Z" fill="inherit"></path>
                  <path d="M23.4453 23.9999C23.3725 24 23.3005 23.9857 23.2332 23.9576C23.1659 23.9295 23.1048 23.8883 23.0533 23.8363L18.0011 18.7293C17.9036 18.6229 17.8507 18.4825 17.8535 18.3376C17.8563 18.1926 17.9145 18.0544 18.0159 17.9519C18.1173 17.8494 18.2541 17.7905 18.3975 17.7877C18.5409 17.7849 18.6798 17.8383 18.7851 17.9367L23.8374 23.0438C23.915 23.1221 23.9678 23.2219 23.9893 23.3306C24.0107 23.4393 23.9997 23.552 23.9577 23.6543C23.9158 23.7567 23.8446 23.8443 23.7534 23.9058C23.6622 23.9673 23.5549 24 23.4453 23.9999Z" fill="inherit"></path>
                  <path d="M17.6567 11.6608C17.5838 11.6609 17.5116 11.6466 17.4443 11.6184C17.3769 11.5903 17.3157 11.549 17.2642 11.4969C17.2126 11.4448 17.1717 11.3829 17.1439 11.3148C17.1161 11.2467 17.1018 11.1736 17.1019 11.0999C17.0999 9.4702 16.4586 7.90787 15.3185 6.75547C14.1785 5.60306 12.6328 4.95466 11.0205 4.95265C10.9458 4.95576 10.8713 4.94363 10.8013 4.91687C10.7314 4.8901 10.6675 4.84937 10.6136 4.79703C10.5596 4.74469 10.5167 4.68185 10.4874 4.61232C10.458 4.54278 10.4429 4.46798 10.4429 4.39239C10.4429 4.31681 10.458 4.242 10.4874 4.17247C10.5167 4.10293 10.5596 4.04009 10.6136 3.98775C10.6675 3.93541 10.7314 3.89468 10.8013 3.86792C10.8713 3.84116 10.9458 3.82891 11.0205 3.83201C12.9271 3.83402 14.755 4.60052 16.1031 5.96327C17.4513 7.32603 18.2096 9.17376 18.2115 11.101C18.2115 11.1746 18.1972 11.2474 18.1693 11.3154C18.1414 11.3834 18.1005 11.4452 18.049 11.4972C17.9975 11.5492 17.9363 11.5905 17.869 11.6185C17.8017 11.6466 17.7295 11.6609 17.6567 11.6608Z" fill="inherit"></path>
                  </g>
                  <defs>
                  <clipPath id="clip0_738:3276">
                  <rect width="24" height="24" fill="white"></rect>
                  </clipPath>
                  </defs>
                </svg>
                <span className="sr-only">Search</span>
              </Link>
            </Button>
            <ThemeToggle />
            {isAdmin && (
              <Button variant="ghost" size="icon" asChild className="hidden sm:flex">
                <Link href="/admin">
                  {/* <Shield className="w-5 h-5" /> */}
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" id="Admin-Panel-Settings--Streamline-Outlined-Material" height="24" width="24" className="size-5.5 fill-foreground">
                    <path fill="inherit" d="M17.272 17.2501c0.43135 0 0.798 -0.15835 1.1 -0.475 0.302 -0.31665 0.453 -0.69065 0.453 -1.122 0 -0.43135 -0.151 -0.798 -0.453 -1.1 -0.302 -0.302 -0.66865 -0.453 -1.1 -0.453 -0.43135 0 -0.80535 0.151 -1.122 0.453 -0.31665 0.302 -0.475 0.66865 -0.475 1.1 0 0.43135 0.15835 0.80535 0.475 1.122 0.31665 0.31665 0.69065 0.475 1.122 0.475Zm-0.0345 3.125c0.55835 0 1.0625 -0.11665 1.5125 -0.35 0.45 -0.23335 0.83335 -0.56665 1.15 -1 -0.43335 -0.23335 -0.86635 -0.40835 -1.299 -0.525 -0.43265 -0.11665 -0.88265 -0.175 -1.35 -0.175 -0.46735 0 -0.92185 0.05835 -1.3635 0.175 -0.44165 0.11665 -0.87085 0.29165 -1.2875 0.525 0.31665 0.43335 0.69585 0.76665 1.1375 1 0.44165 0.23335 0.94165 0.35 1.5 0.35ZM12 22.0001c-2.3 -0.53335 -4.20835 -1.8375 -5.725 -3.9125C4.758335 16.0126 4 13.63345 4 10.9501v-5.975l8 -3 8 3v6.75c-0.23335 -0.11665 -0.48335 -0.22085 -0.75 -0.3125 -0.26665 -0.09165 -0.51665 -0.15415 -0.75 -0.1875v-5.2l-6.5 -2.4 -6.5 2.4v4.925c0 1.26665 0.20415 2.43335 0.6125 3.5 0.40835 1.06665 0.92915 2.00415 1.5625 2.8125 0.63335 0.80835 1.33335 1.47915 2.1 2.0125 0.76665 0.53335 1.50835 0.91665 2.225 1.15 0.1 0.2 0.25 0.425 0.45 0.675 0.2 0.25 0.36665 0.44165 0.5 0.575 -0.15 0.08335 -0.30835 0.14585 -0.475 0.1875 -0.16665 0.04165 -0.325 0.0875 -0.475 0.1375Zm5.3125 0c-1.29165 0 -2.39585 -0.4625 -3.3125 -1.3875 -0.91665 -0.925 -1.375 -2.02085 -1.375 -3.2875 0 -1.30715 0.45825 -2.4215 1.37475 -3.343 0.9165 -0.92135 2.0249 -1.382 3.32525 -1.382 1.28335 0 2.3875 0.46065 3.3125 1.382 0.925 0.9215 1.3875 2.03585 1.3875 3.343 0 1.26665 -0.4625 2.3625 -1.3875 3.2875 -0.925 0.925 -2.03335 1.3875 -3.325 1.3875Z" stroke-width="0.3"></path>
                  </svg>
                  <span className="sr-only">Admin</span>
                </Link>
              </Button>
            )}
            <Button variant="ghost" size="icon" asChild>
              <Link href="/account">
                {/* <User className="w-5 h-5" /> */}
                <svg xmlns="http://www.w3.org/2000/svg" focusable="false" role="img" aria-labelledby="account-icon-title" className="icon icon-account size-5 text-foreground" fill="none" viewBox="0 0 18 19">
                  <title id="account-icon-title">Login to Account</title>
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M6 4.5a3 3 0 116 0 3 3 0 01-6 0zm3-4a4 4 0 100 8 4 4 0 000-8zm5.58 12.15c1.12.82 1.83 2.24 1.91 4.85H1.51c.08-2.6.79-4.03 1.9-4.85C4.66 11.75 6.5 11.5 9 11.5s4.35.26 5.58 1.15zM9 10.5c-2.5 0-4.65.24-6.17 1.35C1.27 12.98.5 14.93.5 18v.5h17V18c0-3.07-.77-5.02-2.33-6.15-1.52-1.1-3.67-1.35-6.17-1.35z" fill="currentColor"></path>
                </svg>
                <span className="sr-only">Account</span>
              </Link>
            </Button>
            <CartButton />

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="size-6 text-foreground" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px]">
                <SheetHeader>
                  <SheetTitle className="text-left">
                    {/* <span className="text-xl font-bold tracking-tight">FIZ CAP</span> */}
                    <Image
                      src={theme === "dark" ? logoWhite : logoBlack}
                      alt="logo"
                      className="w-23 h-auto"
                    />
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-4 mt-8 px-3">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "text-lg font-medium transition-colors hover:text-foreground py-2",
                        pathname === link.href ? "text-foreground" : "text-muted-foreground",
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <div className="border-t pt-4 mt-4">
                    <Link
                      href="/account"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 text-lg font-medium text-muted-foreground hover:text-foreground py-2"
                    >
                      {/* <User className="w-5 h-5" /> */}
                      <svg xmlns="http://www.w3.org/2000/svg" focusable="false" role="img" aria-labelledby="account-icon-title" className="icon icon-account size-5 text-foreground" fill="none" viewBox="0 0 18 19">
                        <title id="account-icon-title">Login to Account</title>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M6 4.5a3 3 0 116 0 3 3 0 01-6 0zm3-4a4 4 0 100 8 4 4 0 000-8zm5.58 12.15c1.12.82 1.83 2.24 1.91 4.85H1.51c.08-2.6.79-4.03 1.9-4.85C4.66 11.75 6.5 11.5 9 11.5s4.35.26 5.58 1.15zM9 10.5c-2.5 0-4.65.24-6.17 1.35C1.27 12.98.5 14.93.5 18v.5h17V18c0-3.07-.77-5.02-2.33-6.15-1.52-1.1-3.67-1.35-6.17-1.35z" fill="currentColor"></path>
                      </svg>
                      Account
                    </Link>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 text-lg font-medium text-muted-foreground hover:text-foreground py-2"
                      >
                        {/* <Shield className="w-5 h-5" /> */}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" id="Admin-Panel-Settings--Streamline-Outlined-Material" height="24" width="24" className="size-5.5 fill-foreground">
                          <path fill="inherit" d="M17.272 17.2501c0.43135 0 0.798 -0.15835 1.1 -0.475 0.302 -0.31665 0.453 -0.69065 0.453 -1.122 0 -0.43135 -0.151 -0.798 -0.453 -1.1 -0.302 -0.302 -0.66865 -0.453 -1.1 -0.453 -0.43135 0 -0.80535 0.151 -1.122 0.453 -0.31665 0.302 -0.475 0.66865 -0.475 1.1 0 0.43135 0.15835 0.80535 0.475 1.122 0.31665 0.31665 0.69065 0.475 1.122 0.475Zm-0.0345 3.125c0.55835 0 1.0625 -0.11665 1.5125 -0.35 0.45 -0.23335 0.83335 -0.56665 1.15 -1 -0.43335 -0.23335 -0.86635 -0.40835 -1.299 -0.525 -0.43265 -0.11665 -0.88265 -0.175 -1.35 -0.175 -0.46735 0 -0.92185 0.05835 -1.3635 0.175 -0.44165 0.11665 -0.87085 0.29165 -1.2875 0.525 0.31665 0.43335 0.69585 0.76665 1.1375 1 0.44165 0.23335 0.94165 0.35 1.5 0.35ZM12 22.0001c-2.3 -0.53335 -4.20835 -1.8375 -5.725 -3.9125C4.758335 16.0126 4 13.63345 4 10.9501v-5.975l8 -3 8 3v6.75c-0.23335 -0.11665 -0.48335 -0.22085 -0.75 -0.3125 -0.26665 -0.09165 -0.51665 -0.15415 -0.75 -0.1875v-5.2l-6.5 -2.4 -6.5 2.4v4.925c0 1.26665 0.20415 2.43335 0.6125 3.5 0.40835 1.06665 0.92915 2.00415 1.5625 2.8125 0.63335 0.80835 1.33335 1.47915 2.1 2.0125 0.76665 0.53335 1.50835 0.91665 2.225 1.15 0.1 0.2 0.25 0.425 0.45 0.675 0.2 0.25 0.36665 0.44165 0.5 0.575 -0.15 0.08335 -0.30835 0.14585 -0.475 0.1875 -0.16665 0.04165 -0.325 0.0875 -0.475 0.1375Zm5.3125 0c-1.29165 0 -2.39585 -0.4625 -3.3125 -1.3875 -0.91665 -0.925 -1.375 -2.02085 -1.375 -3.2875 0 -1.30715 0.45825 -2.4215 1.37475 -3.343 0.9165 -0.92135 2.0249 -1.382 3.32525 -1.382 1.28335 0 2.3875 0.46065 3.3125 1.382 0.925 0.9215 1.3875 2.03585 1.3875 3.343 0 1.26665 -0.4625 2.3625 -1.3875 3.2875 -0.925 0.925 -2.03335 1.3875 -3.325 1.3875Z" stroke-width="0.3"></path>
                        </svg>
                        Admin Panel
                      </Link>
                    )}
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}

// /95 backdrop-blur supports-[backdrop-filter]:bg-background/60