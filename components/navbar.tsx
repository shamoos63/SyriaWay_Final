"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronDown, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { LanguageSwitcher } from "@/components/language-switcher"
import { ThemeToggle } from "@/components/theme-toggle"
import { AuthButtons } from "@/components/auth-buttons"
import NotificationBell from "@/components/notification-bell"
import { useLanguage } from "@/lib/i18n/language-context"
import { useAuth } from "@/lib/auth-context"
import { Logo } from "@/components/ui/logo"

export function Navbar() {
  const [isServicesOpen, setIsServicesOpen] = useState(false)
  const [isTourismSitesOpen, setIsTourismSitesOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { t, dir } = useLanguage()
  const { user } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsServicesOpen(false)
        setIsTourismSitesOpen(false)
      }
    }

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Element
      if (!target.closest('.navbar-dropdown')) {
        setIsServicesOpen(false)
        setIsTourismSitesOpen(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    window.addEventListener("keydown", handleEscape)
    document.addEventListener("click", handleClickOutside)
    
    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("keydown", handleEscape)
      document.removeEventListener("click", handleClickOutside)
    }
  }, [])

  const navLinkClass = "text-white font-medium text-lg hover:text-syria-cream transition-colors relative"

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 mx-4 mt-4 rounded-xl transition-all duration-300 ${
        scrolled ? "bg-syria-gold/80 backdrop-blur-md shadow-md" : "bg-transparent"
      }`}
      dir={dir}
    >
      <div className="px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-6">
          {/* Logo/Home Link */}
          <Logo variant="navbar" size="md" withLink />

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6 text-white" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side={dir === "rtl" ? "right" : "left"} className="bg-syria-sand dark:bg-gray-800">
              <div className="flex flex-col gap-4 mt-8">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="w-full justify-start">
                      {t.nav.services} <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <Link href="/booking-hotels" className="w-full">
                        {t.services.bookingHotels}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/health-tourism" className="w-full">
                        {t.services.healthTourism}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/educational-tourism" className="w-full">
                        {t.services.educationalTourism}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/historical-tourism" className="w-full">
                        {t.services.historicalTourism}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/national-tourism" className="w-full">
                        {t.services.nationalTourism}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/cars-rental" className="w-full">
                        {t.services.carsRental}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/tours" className="w-full">
                        {t.services.tours}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/booking-flights" className="w-full">
                        {t.services.bookingFlights}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/umrah" className="w-full">
                        {t.services.umrah}
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="w-full justify-start">
                      {t.nav.tourismSites} <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <Link href="/historical-sites" className="w-full">
                        {t.tourismSites.historicalSites}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/natural-sites" className="w-full">
                        {t.tourismSites.naturalSites}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/religious-sites" className="w-full">
                        {t.tourismSites.religiousSites}
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button variant="ghost" className="justify-start">
                  <Link href="/tourism-news" className="w-full">
                    {t.nav.tourismNews}
                  </Link>
                </Button>

                <Button variant="ghost" className="justify-start">
                  <Link href="/blog" className="w-full">
                    {t.nav.blog}
                  </Link>
                </Button>

                <Button variant="ghost" className="justify-start">
                  <Link href="/offers" className="w-full">
                    {t.nav.offers}
                  </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          {/* Desktop menu - Fixed positioning */}
          <div className="hidden md:flex items-center gap-1">
            {/* Services dropdown with fixed positioning */}
            <div className="relative navbar-dropdown">
              <Button 
                variant="ghost" 
                className={navLinkClass} 
                onClick={(e) => {
                  e.stopPropagation() // Prevent click outside handler from firing
                  setIsTourismSitesOpen(false) // Close other dropdown
                  setIsServicesOpen(!isServicesOpen)
                }}
              >
                {t.nav.services} <ChevronDown className="ml-1 h-4 w-4" />
              </Button>

              {isServicesOpen && (
                <div className="absolute top-full left-0 mt-1 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-[60]">
                  <div className="py-1">
                    <Link
                      href="/booking-hotels"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setIsServicesOpen(false)}
                    >
                      {t.services.bookingHotels}
                    </Link>
                    <Link
                      href="/health-tourism"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setIsServicesOpen(false)}
                    >
                      {t.services.healthTourism}
                    </Link>
                    <Link
                      href="/educational-tourism"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setIsServicesOpen(false)}
                    >
                      {t.services.educationalTourism}
                    </Link>
                    <Link
                      href="/historical-tourism"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setIsServicesOpen(false)}
                    >
                      {t.services.historicalTourism}
                    </Link>
                    <Link
                      href="/national-tourism"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setIsServicesOpen(false)}
                    >
                      {t.services.nationalTourism}
                    </Link>
                    <Link
                      href="/cars-rental"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setIsServicesOpen(false)}
                    >
                      {t.services.carsRental}
                    </Link>
                    <Link
                      href="/tours"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setIsServicesOpen(false)}
                    >
                      {t.services.tours}
                    </Link>
                    <Link
                      href="/booking-flights"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setIsServicesOpen(false)}
                    >
                      {t.services.bookingFlights}
                    </Link>
                    <Link
                      href="/umrah"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setIsServicesOpen(false)}
                    >
                      {t.services.umrah}
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Tourism Sites dropdown with fixed positioning */}
            <div className="relative navbar-dropdown">
              <Button
                variant="ghost"
                className={navLinkClass}
                onClick={(e) => {
                  e.stopPropagation() // Prevent click outside handler from firing
                  setIsServicesOpen(false) // Close other dropdown
                  setIsTourismSitesOpen(!isTourismSitesOpen)
                }}
              >
                {t.nav.tourismSites} <ChevronDown className="ml-1 h-4 w-4" />
              </Button>

              {isTourismSitesOpen && (
                <div className="absolute top-full left-0 mt-1 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-[60]">
                  <div className="py-1">
                    <Link
                      href="/historical-sites"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setIsTourismSitesOpen(false)}
                    >
                      {t.tourismSites.historicalSites}
                    </Link>
                    <Link
                      href="/natural-sites"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setIsTourismSitesOpen(false)}
                    >
                      {t.tourismSites.naturalSites}
                    </Link>
                    <Link
                      href="/religious-sites"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setIsTourismSitesOpen(false)}
                    >
                      {t.tourismSites.religiousSites}
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Button variant="ghost" className={navLinkClass}>
              <Link href="/tourism-news">{t.nav.tourismNews}</Link>
            </Button>

            <Button variant="ghost" className={navLinkClass}>
              <Link href="/blog">{t.nav.blog}</Link>
            </Button>

            <Button variant="ghost" className={navLinkClass}>
              <Link href="/offers">{t.nav.offers}</Link>
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {user && <NotificationBell />}
          <ThemeToggle />
          <LanguageSwitcher />
          <AuthButtons />
        </div>
      </div>
    </nav>
  )
}
