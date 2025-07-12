"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/i18n/language-context"
import { useAuth } from "@/lib/auth-context"
import { AuthModal } from "@/components/auth-modal"
import { LogIn, UserPlus, User, LogOut, Settings, LayoutDashboard, Shield, Users } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function AuthButtons() {
  const { t } = useLanguage()
  const { user, signOut } = useAuth()
  const [isSignInOpen, setIsSignInOpen] = useState(false)
  const [isSignUpOpen, setIsSignUpOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  function getUserInitial(name: string | null | undefined) {
    if (!name) return "U";
    const [first = "", last = ""] = name.trim().split(" ");
    return (first[0] || "") + (last[0] || "");
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = () => {
    signOut()
  }

  // Helper function to check if user can access control panel
  const canAccessControlPanel = () => {
    return user?.role === "ADMIN" || user?.role === "SUPER_ADMIN"
  }

  // Helper function to check if user can access dashboard
  const canAccessDashboard = () => {
    return user?.role === "HOTEL_OWNER" || user?.role === "CAR_OWNER" || user?.role === "TOUR_GUIDE"
  }

  // Helper function to check if user can access user dashboard
  const canAccessUserDashboard = () => {
    return user?.role === "CUSTOMER" || user?.role === "ADMIN" || user?.role === "SUPER_ADMIN"
  }

  // For SSR, return a placeholder
  if (!mounted) {
    return <div className="w-20 h-10"></div>
  }

  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10">
            <AvatarImage >{getUserInitial(user?.name)}</AvatarImage> 
              <AvatarFallback>
                {user.name ? user.name.charAt(0).toUpperCase() : <User className="h-6 w-6" />}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>{user.name || t.userDropdown?.profile || "Profile"}</span>
          </DropdownMenuItem>
          
          {/* Dashboard links based on role */}
          {canAccessDashboard() && (
            <DropdownMenuItem>
              <Link 
                href={user.role === "CAR_OWNER" ? "/dashboard/cars" : "/dashboard"} 
                className="flex items-center w-full"
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                <span>{t.userDropdown?.serviceDashboard || "Service Dashboard"}</span>
              </Link>
            </DropdownMenuItem>
          )}
          
          {canAccessUserDashboard() && (
            <DropdownMenuItem>
              <Link href="/user-dashboard" className="flex items-center w-full">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                <span>{t.userDropdown?.dashboard || "Dashboard"}</span>
              </Link>
            </DropdownMenuItem>
          )}
          
          {/* Control Panel for admins and super admins */}
          {canAccessControlPanel() && (
            <DropdownMenuItem>
              <Link href="/control-panel" className="flex items-center w-full">
                <Shield className="mr-2 h-4 w-4" />
                <span>{t.userDropdown?.controlPanel || "Control Panel"}</span>
              </Link>
            </DropdownMenuItem>
          )}
          
          <DropdownMenuItem>
            <Link href="/user-dashboard/settings" className="flex items-center w-full">
              <Settings className="mr-2 h-4 w-4" />
              <span>{t.userDropdown?.settings || "Settings"}</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>{t.userDropdown?.signOut || "Sign out"}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        className="text-white hover:text-syria-gold dark:hover:text-gold-accent"
        onClick={() => setIsSignInOpen(true)}
      >
        <LogIn className="h-5 w-5 md:hidden" />
        <span className="hidden md:inline">{t.common.signIn}</span>
      </Button>
      <Button
        className="bg-syria-gold hover:bg-syria-dark-gold text-white dark:bg-gold-accent dark:hover:bg-gold-accent-hover dark:text-teal-900"
        size="sm"
        onClick={() => setIsSignUpOpen(true)}
      >
        <UserPlus className="h-5 w-5 md:hidden" />
        <span className="hidden md:inline">{t.common.signUp}</span>
      </Button>

      <AuthModal
        isOpen={isSignInOpen}
        onClose={() => setIsSignInOpen(false)}
        type="signin"
        onSwitchMode={() => {
          setIsSignInOpen(false)
          setIsSignUpOpen(true)
        }}
      />

      <AuthModal
        isOpen={isSignUpOpen}
        onClose={() => setIsSignUpOpen(false)}
        type="signup"
        onSwitchMode={() => {
          setIsSignUpOpen(false)
          setIsSignInOpen(true)
        }}
      />
    </div>
  )
}
