"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useLanguage } from "@/lib/i18n/language-context"
import { Menu, X } from "lucide-react"
import UserSidebar from "@/components/user-dashboard/user-sidebar"


export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const {dir } = useLanguage()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false)
      } else {
        setSidebarOpen(true)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  if (!mounted) {
    // Server-side rendering fallback
    return (
      <div dir={dir} className="min-h-screen bg-pattern">
        <div className="flex min-h-[calc(100vh-64px)]">
          <div className="w-64 shrink-0"></div>
          <main className="flex-1 p-4 md:p-6"></main>
        </div>
      </div>
    )
  }

  return (
    <div dir={dir} className="min-h-screen bg-pattern">
     
      <div className="flex pt-9">
        {/* Sidebar */}
        <div
          className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
            sidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
          onClick={() => setSidebarOpen(false)}
        ></div>

        <div
          className={`fixed z-50 h-auto max-h-[calc(100vh-80px)] w-64 transform overflow-y-auto rounded-xl bg-white/90 p-4 shadow-lg transition-transform duration-300 dark:bg-gray-800/90 md:static md:translate-x-0 md:mt-0 md:rounded-r-xl md:rounded-l-none ${
            sidebarOpen ? "translate-x-0" : dir === "ltr" ? "-translate-x-full" : "translate-x-full"
          }`}
        >
          
          <UserSidebar  />
        </div>

        {/* Toggle button - repositioned to left side */}
        <button
          className="fixed left-4 bottom-4 z-50 rounded-full bg-primary p-3 text-white shadow-lg transition-all duration-300 md:hidden"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Main content */}
        <main
          className={`flex-1 min-h-[calc(100vh-80px)] transition-all duration-300 ${sidebarOpen ? "md:ml-0" : "ml-0"}`}
        >
          {children}
        </main>
      </div>
    </div>
  )
}
