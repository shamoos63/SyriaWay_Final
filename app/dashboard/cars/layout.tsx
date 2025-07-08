"use client"
import type React from "react"
import { useState, useEffect } from "react"
import { Menu, X, Car, BarChart3, Settings, Users, Calendar, DollarSign, Home, LogOut } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useLanguage } from "@/lib/i18n/language-context"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useSearchParams } from 'next/navigation'

function CarOwnerSidebar({ activeTab }: { activeTab: string }) {
  const { user } = useAuth()
  const { t, dir } = useLanguage()
  
  function getUserInitial(name: string | null | undefined) {
    if (!name) return "U";
    const [first = "", last = ""] = name.trim().split(" ");
    return (first[0] || "") + (last[0] || "");
  }

  const navigationItems = [
    {
      name: "Dashboard",
      href: "/dashboard/cars?tab=dashboard",
      icon: BarChart3,
      active: activeTab === "dashboard"
    },
    {
      name: "My Cars",
      href: "/dashboard/cars?tab=manage",
      icon: Car,
      active: activeTab === "manage"
    },
    {
      name: "Bookings",
      href: "/dashboard/cars?tab=bookings",
      icon: Calendar,
      active: activeTab === "bookings"
    },
    {
      name: "Customers",
      href: "/dashboard/cars?tab=customers",
      icon: Users,
      active: activeTab === "customers"
    },
    {
      name: "Earnings",
      href: "/dashboard/cars?tab=earnings",
      icon: DollarSign,
      active: activeTab === "earnings"
    },
    {
      name: "Settings",
      href: "/dashboard/cars?tab=settings",
      icon: Settings,
      active: activeTab === "settings"
    }
  ]

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 border-r border-slate-200 dark:border-slate-700">
      {/* Header */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-syria-gold to-orange-500 rounded-lg flex items-center justify-center">
            <Car className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white">Car Fleet</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Management Dashboard</p>
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center space-x-3">
          <Avatar className="w-12 h-12 border-2 border-syria-gold">
            <AvatarImage src={user?.image || ""} />
            <AvatarFallback className="bg-gradient-to-br from-syria-gold to-orange-500 text-white font-semibold">
              {getUserInitial(user?.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
              {user?.name || "Car Owner"}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {user?.email}
            </p>
            <Badge variant="secondary" className="mt-1 text-xs">
              {user?.role?.replace('_', ' ') || "Car Owner"}
            </Badge>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                item.active
                  ? "bg-syria-gold text-white shadow-md"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white"
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-700 space-y-2">
        <Link
          href="/"
          className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-all duration-200"
        >
          <Home className="w-5 h-5" />
          <span>Go to Homepage</span>
        </Link>
        
      </div>
    </div>
  )
}

export default function CarOwnerDashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState("dashboard")
  const { dir } = useLanguage()
  const searchParams = useSearchParams()

  useEffect(() => {
    setMounted(true)
    const handleResize = () => {
      if (typeof window !== 'undefined' && window.innerWidth < 1024) {
        setSidebarOpen(false)
      } else {
        setSidebarOpen(true)
      }
    }

    handleResize()
    if (typeof window !== 'undefined') {
      window.addEventListener("resize", handleResize)
      return () => window.removeEventListener("resize", handleResize)
    }
  }, [])

  // Update active tab based on URL
  useEffect(() => {
    if (searchParams) {
      const tab = searchParams.get("tab") || "dashboard"
      setActiveTab(tab)
    }
  }, [searchParams])

  if (!mounted) {
    return (
      <div dir={dir} className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <div className="flex min-h-screen">
          <div className="w-80 shrink-0"></div>
          <main className="flex-1 p-6"></main>
        </div>
      </div>
    )
  }

  return (
    <div dir={dir} className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <div
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-80 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <CarOwnerSidebar activeTab={activeTab} />
        </div>

        {/* Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 min-h-screen">
          {/* Top Bar */}
          <div className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {activeTab === "dashboard" && "Dashboard"}
                  {activeTab === "manage" && "My Cars"}
                  {activeTab === "bookings" && "Bookings"}
                  {activeTab === "customers" && "Customers"}
                  {activeTab === "earnings" && "Earnings"}
                  {activeTab === "settings" && "Settings"}
                </h1>
              </div>
              
              <div className="flex items-center space-x-4">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                  Online
                </Badge>
              </div>
            </div>
          </div>

          {/* Page Content */}
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
} 