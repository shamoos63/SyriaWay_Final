"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, FileText, Settings, Home, Calendar } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useLanguage } from "@/lib/i18n/language-context"
import { useAuth } from "@/lib/auth-context"

export default function UserSidebar() {
  const pathname = usePathname()
  const { t, language } = useLanguage()
  const { user } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  // Check if user is admin or super admin
  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN"
  const isCustomer = user?.role === "CUSTOMER"

  // Navigation items based on user role
  const getNavItems = () => {
    if (isAdmin) {
      // Admin and Super Admin only see settings
      return [
        {
          name: "Settings",
          href: "/user-dashboard/settings",
          icon: <Settings className="h-5 w-5" />,
        },
      ]
    } else if (isCustomer) {
      // Customers see full navigation
      return [
        {
          name: t.userDashboard?.dashboard || "Dashboard",
          href: "/user-dashboard",
          icon: <LayoutDashboard className="h-5 w-5" />,
        },
        {
          name: "My Bookings",
          href: "/user-dashboard/bookings",
          icon: <Calendar className="h-5 w-5" />,
        },
        {
          name: t.userDashboard?.myPosts || "My Posts",
          href: "/user-dashboard/posts",
          icon: <FileText className="h-5 w-5" />,
        },
        {
          name: "Settings",
          href: "/user-dashboard/settings",
          icon: <Settings className="h-5 w-5" />,
        },
      ]
    }
    return []
  }

  const navItems = getNavItems()

  // Format creation date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    })
  }

  function getUserInitial(name: string | null | undefined) {
    if (!name) return "U";
    const [first = "", last = ""] = name.trim().split(" ");
    return (first[0] || "") + (last[0] || "");
  }

  return (
    <div className="flex h-full flex-col pt-4">
      <div className="mb-6 flex flex-col items-center">
        <Avatar className="h-16 w-16">
        <AvatarImage >{getUserInitial(user?.name)}</AvatarImage> 
          <AvatarFallback>{getUserInitial(user?.name)}</AvatarFallback>
        </Avatar>
        <h2 className="mt-3 text-lg font-bold">{user?.name || "User"}</h2>
        <p className="text-xs text-muted-foreground">{user?.role?.replace('_', ' ') || "Member"}</p>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="mt-4 space-y-3">
        <div className="rounded-lg bg-muted p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium">Member Since</p>
              <p className="text-xs text-muted-foreground">
                {user?.createdAt ? formatDate(user.createdAt) : "Unknown"}
              </p>
            </div>
            <div className="rounded-full bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">
              {user?.status || "Active"}
            </div>
          </div>
        </div>

        {/* Homepage Button */}
        <Link
          href="/"
          className="flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <Home className="mr-3 h-5 w-5" />
          Go to Homepage
        </Link>
      </div>
    </div>
  )
}
