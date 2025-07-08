"use client"

import Link from "next/link"
import { CreditCard, LayoutDashboard, LogOut, Settings, Tag, Home } from "lucide-react"
import { useState, useEffect } from "react"
import { useLanguage } from "@/lib/i18n/language-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/lib/auth-context"


export function Sidebar() {
  const [username, setUsername] = useState("USERNAME")
  const { t, dir } = useLanguage()
  const { user } = useAuth()

  useEffect(() => {
    const storedUsername = localStorage.getItem("username")
    if (storedUsername) {
      setUsername(storedUsername)
    }
  }, [])
  function getUserInitial(name: string | null | undefined) {
    if (!name) return "U";
    const [first = "", last = ""] = name.trim().split(" ");
    return (first[0] || "") + (last[0] || "");
  }

  return (
    <aside className="content-card w-64 h-[calc(100vh-5rem)] p-4 flex flex-col shadow-lg overflow-y-auto bg-white" dir={dir}>
      <div className="flex flex-col items-center mb-6">
        <Avatar className="w-20 h-20 border-2 border-syria-gold">
        <AvatarImage >{getUserInitial(user?.name)}</AvatarImage> 
          <AvatarFallback className="bg-syria-gold text-white text-xl">
          {getUserInitial(user?.name)}
          </AvatarFallback>
        </Avatar>
        <h4 className="text-sm text-muted-foreground pt-4 font-semibold">{user?.role?.replace('_', ' ') || "Member"}</h4>
        <h2 className="text-lg font-bold text-syria-gold mt-2">{user?.name}</h2>
      </div>

      <nav className="space-y-1">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 p-3 rounded-md hover:bg-syria-gold/10 text-syria-gold font-medium"
        >
          <LayoutDashboard className="h-5 w-5 flex-shrink-0" />
          <span className="truncate">{t.dashboard?.dashboard || "Dashboard"}</span>
        </Link>
        <Link
          href="/dashboard/offers"
          className="flex items-center gap-3 p-3 rounded-md hover:bg-syria-gold/10 text-syria-gold font-medium"
        >
          <Tag className="h-5 w-5 flex-shrink-0" />
          <span className="truncate">{t.dashboard?.offers || "Offers"}</span>
        </Link>
        <Link
          href="/dashboard/plans"
          className="flex items-center gap-3 p-3 rounded-md hover:bg-syria-gold/10 text-syria-gold font-medium"
        >
          <CreditCard className="h-5 w-5 flex-shrink-0" />
          <span className="truncate">{t.dashboard?.plans || "Plans"}</span>
        </Link>
        <Link
          href="/dashboard/settings"
          className="flex items-center gap-3 p-3 rounded-md hover:bg-syria-gold/10 text-syria-gold font-medium"
        >
          <Settings className="h-5 w-5 flex-shrink-0" />
          <span className="truncate">{t.dashboard?.settings || "Settings"}</span>
        </Link>
      </nav>

      <div className="mt-auto">
      <Link
          href="/"
          className="flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <Home className="mr-3 h-5 w-5" />
          Go to Homepage
        </Link>
      </div>
    </aside>
  )
}
