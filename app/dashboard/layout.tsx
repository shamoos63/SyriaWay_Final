"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { useLanguage } from "@/lib/i18n/language-context"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { dir, t } = useLanguage()
  const { user } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Check if user is a car owner - if so, don't render the original sidebar
  const isCarOwner = user?.role === "CAR_OWNER"
  const isHotelOwner = user?.role === "HOTEL_OWNER"
  const isTourGuide = user?.role === "TOUR_GUIDE"

  // Only run on client side
  useEffect(() => {
    setMounted(true)

    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setSidebarOpen(false)
      } else {
        setSidebarOpen(true)
      }
    }

    // Initial check
    checkIfMobile()

    // Add event listener
    window.addEventListener("resize", checkIfMobile)

    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  // For car owners, hotel owners, and tour guides, just render children without any layout wrapper
  // This allows the car/hotel/tour dashboard layout to handle everything
  if (isCarOwner || isHotelOwner || isTourGuide) {
    return <>{children}</>
  }

  // Default to desktop view during SSR
  if (!mounted) {
    return (
      <div className="min-h-screen" dir={dir}>
        <div className="flex pt-20">
          <div className="hidden md:block">
            <Sidebar />
          </div>
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" dir={dir}>
      <div className="flex pt-5 relative">
        {/* Sidebar */}
        <div
          className={`
            fixed inset-y-0 left-0 z-40 pt-10 transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            md:rounded-r-xl overflow-hidden
          `}
        >
          <Sidebar />
        </div>

        {/* Overlay when sidebar is open on mobile */}
        {sidebarOpen && isMobile && (
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <main
          className={`
          transition-all duration-300 ease-in-out
          ${sidebarOpen ? "ml-64 w-[calc(100%-16rem)]" : "ml-0 w-full"}
          p-4 md:p-6 min-h-[calc(100vh-80px)]
        `}
        >
          {children}
        </main>

        {/* Sidebar toggle button */}
        <Button
          variant="outline"
          size="icon"
          className="fixed left-4 bottom-4 z-50 rounded-full shadow-lg bg-syria-gold text-white hover:bg-syria-gold/90 dark:bg-gold-accent dark:hover:bg-gold-accent/90 p-3 md:hidden"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label={
            sidebarOpen ? t.dashboard?.hideSidebar || "Hide Sidebar" : t.dashboard?.showSidebar || "Show Sidebar"
          }
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>
    </div>
  )
}
