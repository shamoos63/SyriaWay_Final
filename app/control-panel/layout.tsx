"use client"

import type React from "react"
import { useAuth } from "@/lib/auth-context"
import { useState, useEffect } from "react"
import { useLanguage } from "@/lib/i18n/language-context"
import {
  Menu,
  X,
  Settings,
  Users,
  Hotel,
  FileText,
  LayoutDashboard,
  LogOut,
  Bell,
  Search,
  ChevronDown,
  Package,Home,
  MessageSquare,
  Calendar,
  Building2,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { LanguageSwitcher } from "@/components/language-switcher"
import { Suspense } from "react"
import { Toaster } from "@/components/ui/toaster"

export default function ControlPanelLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { t, language, dir } = useLanguage()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const pathname = usePathname()
  const { user } = useAuth()
  
  // Check if user is super admin
  const isSuperAdmin = user?.role === "SUPER_ADMIN"
  const isAdmin = user?.role === "ADMIN"

  // Close sidebar when route changes on mobile
  useEffect(() => {
    setIsSidebarOpen(false)
  }, [pathname])

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const sidebar = document.getElementById("control-panel-sidebar")
      const toggle = document.getElementById("sidebar-toggle")
      const userMenu = document.getElementById("user-menu")
      const userMenuToggle = document.getElementById("user-menu-toggle")

      if (
        sidebar &&
        toggle &&
        !sidebar.contains(event.target as Node) &&
        !toggle.contains(event.target as Node) &&
        isSidebarOpen
      ) {
        setIsSidebarOpen(false)
      }

      if (
        userMenu &&
        userMenuToggle &&
        !userMenu.contains(event.target as Node) &&
        !userMenuToggle.contains(event.target as Node) &&
        isUserMenuOpen
      ) {
        setIsUserMenuOpen(false)
      }
    }
   
    document.addEventListener("mousedown", handleOutsideClick)
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick)
    }
  }, [isSidebarOpen, isUserMenuOpen])

  function getUserIni(name: string | null | undefined) {
    if (!name) return "U";
    const [first = "", last = ""] = name.trim().split(" ");
    return (first[0] || "") + (last[0] || "");
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-card shadow-sm border-b">
        <div className="flex items-center justify-between px-4 h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center mr-6">
              <Image src="/images/syria-logo.webp" alt="Syria Ways" width={40} height={40} />
              <span className="ml-2 font-bold text-lg hidden md:inline-block">
                Control Panel
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            {/* Search */}
            <div className="relative hidden md:flex items-center">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 rounded-md border border-input bg-background h-9 w-[200px] focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Notifications */}
            <button className="relative p-2 rounded-full hover:bg-accent">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Language Switcher */}
            <div className="hidden md:block">
              <LanguageSwitcher />
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                id="user-menu-toggle"
                className="flex items-center space-x-2 rtl:space-x-reverse"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                <Avatar className="h-8 w-8">
                <AvatarImage >{getUserIni(user?.name)}</AvatarImage> 
                <AvatarFallback>{getUserIni(user?.name)}</AvatarFallback>
                </Avatar>
                <span className="hidden md:inline-block font-medium">{user?.name || "Admin"}</span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </button>

              {isUserMenuOpen && (
                <div id="user-menu" className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-card border">
                  <div className="py-1">
                    <Link
                      href="/control-panel/settings"
                      className="block px-4 py-2 text-sm hover:bg-accent"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Settings
                    </Link>
                    {isSuperAdmin && (
                      <Link
                        href="/control-panel/users/admins"
                        className="block px-4 py-2 text-sm hover:bg-accent"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Manage Administrators
                      </Link>
                    )}
                    <div className="border-t my-1"></div>
                    <Link
                      href="/"
                      className="block px-4 py-2 text-sm text-destructive hover:bg-accent"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      HomePage
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar for desktop */}
      <div
        id="control-panel-sidebar"
        className={cn(
          "fixed top-16 left-0 z-40 h-[calc(100vh-64px)] w-64 transform overflow-y-auto bg-card shadow-lg transition-transform duration-300 ease-in-out md:translate-x-0 md:rounded-r-xl",
          isSidebarOpen ? "translate-x-0 rounded-xl" : "-translate-x-full",
        )}
        dir={dir}
      >
        <div className="flex flex-col h-full">
          {/* Admin profile */}
          <div className="p-4 border-b">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <Avatar className="h-10 w-10">
              <AvatarImage >{getUserIni(user?.name)}</AvatarImage> 
              <AvatarFallback>{getUserIni(user?.name)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{user?.name || "Admin User"}</p>
                <p className="text-xs text-muted-foreground">
                  {isSuperAdmin ? "Super Administrator" : "Administrator"}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase">
              Dashboard
            </p>
            <Link
              href="/control-panel"
              className={cn(
                "flex items-center space-x-2 rtl:space-x-reverse px-3 py-2 rounded-md hover:bg-primary/10 transition-colors",
                pathname === "/control-panel" ? "bg-primary/20 text-primary font-medium" : "",
              )}
            >
              <LayoutDashboard size={18} />
              <span>Overview</span>
            </Link>

            <p className="text-xs font-semibold text-muted-foreground mb-2 mt-6 uppercase">
              Content Management
            </p>
            <Link
              href="/control-panel/content/blog"
              className={cn(
                "flex items-center space-x-2 rtl:space-x-reverse px-3 py-2 rounded-md hover:bg-primary/10 transition-colors",
                pathname === "/control-panel/content/blog" ? "bg-primary/20 text-primary font-medium" : "",
              )}
            >
              <FileText size={18} />
              <span>Blog Posts</span>
            </Link>
            <Link
              href="/control-panel/content/bundles"
              className={cn(
                "flex items-center space-x-2 rtl:space-x-reverse px-3 py-2 rounded-md hover:bg-primary/10 transition-colors",
                pathname === "/control-panel/content/bundles" ? "bg-primary/20 text-primary font-medium" : "",
              )}
            >
              <Package size={18} />
              <span>Bundles</span>
            </Link>
            <Link
              href="/control-panel/content/tourism-news"
              className={cn(
                "flex items-center space-x-2 rtl:space-x-reverse px-3 py-2 rounded-md hover:bg-primary/10 transition-colors",
                pathname === "/control-panel/content/tourism-news" ? "bg-primary/20 text-primary font-medium" : "",
              )}
            >
              <FileText size={18} />
              <span>Tourism News</span>
            </Link>
            <Link
              href="/control-panel/content/contact-forms"
              className={cn(
                "flex items-center space-x-2 rtl:space-x-reverse px-3 py-2 rounded-md hover:bg-primary/10 transition-colors",
                pathname === "/control-panel/content/contact-forms" ? "bg-primary/20 text-primary font-medium" : "",
              )}
            >
              <MessageSquare size={18} />
              <span>Contact Forms</span>
            </Link>
            <Link
              href="/control-panel/bookings"
              className={cn(
                "flex items-center space-x-2 rtl:space-x-reverse px-3 py-2 rounded-md hover:bg-primary/10 transition-colors",
                pathname === "/control-panel/bookings" ? "bg-primary/20 text-primary font-medium" : "",
              )}
            >
              <Calendar size={18} />
              <span>Bookings Management</span>
            </Link>
            <Link
              href="/control-panel/content/listings"
              className={cn(
                "flex items-center space-x-2 rtl:space-x-reverse px-3 py-2 rounded-md hover:bg-primary/10 transition-colors",
                pathname === "/control-panel/content/listings" ? "bg-primary/20 text-primary font-medium" : "",
              )}
            >
              <Hotel size={18} />
              <span>Listings Management</span>
            </Link>

            <p className="text-xs font-semibold text-muted-foreground mb-2 mt-6 uppercase">
              Umrah Services
            </p>
            <Link
              href="/control-panel/umrah/packages"
              className={cn(
                "flex items-center space-x-2 rtl:space-x-reverse px-3 py-2 rounded-md hover:bg-primary/10 transition-colors",
                pathname === "/control-panel/umrah/packages" ? "bg-primary/20 text-primary font-medium" : "",
              )}
            >
              <Building2 size={18} />
              <span>Umrah Packages</span>
            </Link>
            <Link
              href="/control-panel/umrah/requests"
              className={cn(
                "flex items-center space-x-2 rtl:space-x-reverse px-3 py-2 rounded-md hover:bg-primary/10 transition-colors",
                pathname === "/control-panel/umrah/requests" ? "bg-primary/20 text-primary font-medium" : "",
              )}
            >
              <MessageSquare size={18} />
              <span>Umrah Requests</span>
            </Link>

            <p className="text-xs font-semibold text-muted-foreground mb-2 mt-6 uppercase">
              User Management
            </p>
            <Link
              href="/control-panel/users/customers"
              className={cn(
                "flex items-center space-x-2 rtl:space-x-reverse px-3 py-2 rounded-md hover:bg-primary/10 transition-colors",
                pathname === "/control-panel/users/customers" ? "bg-primary/20 text-primary font-medium" : "",
              )}
            >
              <Users size={18} />
              <span>Customers</span>
            </Link>
            {/* Show providers to admins and super admins, but admins only see providers, not admins */}
            {(isAdmin || isSuperAdmin) && (
              <Link
                href="/control-panel/users/providers"
                className={cn(
                  "flex items-center space-x-2 rtl:space-x-reverse px-3 py-2 rounded-md hover:bg-primary/10 transition-colors",
                  pathname === "/control-panel/users/providers" ? "bg-primary/20 text-primary font-medium" : "",
                )}
              >
                <Hotel size={18} />
                <span>Service Providers</span>
              </Link>
            )}
            {/* Show admins only to super admins */}
            {isSuperAdmin && (
              <Link
                href="/control-panel/users/admins"
                className={cn(
                  "flex items-center space-x-2 rtl:space-x-reverse px-3 py-2 rounded-md hover:bg-primary/10 transition-colors",
                  pathname === "/control-panel/users/admins" ? "bg-primary/20 text-primary font-medium" : "",
                )}
              >
                <Settings size={18} />
                <span>Administrators</span>
              </Link>
            )}

            <p className="text-xs font-semibold text-muted-foreground mb-2 mt-6 uppercase">
              Settings
            </p>
            <Link
              href="/control-panel/settings"
              className={cn(
                "flex items-center space-x-2 rtl:space-x-reverse px-3 py-2 rounded-md hover:bg-primary/10 transition-colors",
                pathname === "/control-panel/settings" ? "bg-primary/20 text-primary font-medium" : "",
              )}
            >
              <Settings size={18} />
              <span>General Settings</span>
            </Link>

            <div className="mt-auto pt-6">
            <Link
          href="/"
          className="flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <Home className="mr-3 h-5 w-5" />
          Go to Homepage
        </Link>
            </div>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64">
        <div className="pt-20 p-4 min-h-[calc(100vh-64px)]">
          <Suspense>{children}</Suspense>
        </div>
      </div>

      {/* Mobile sidebar toggle */}
      <button
        id="sidebar-toggle"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed left-4 bottom-4 z-50 md:hidden bg-primary text-primary-foreground p-3 rounded-full shadow-lg"
        aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Backdrop overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      <Toaster />
    </div>
  )
}
