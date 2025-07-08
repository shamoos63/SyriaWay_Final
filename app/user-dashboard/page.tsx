"use client"

import { useLanguage } from "@/lib/i18n/language-context"
import { useAuth } from "@/lib/auth-context"
import { useNotifications } from "@/lib/notification-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Award, CalendarDays, Car, DollarSign, FileText, Hotel, Plane, Settings, Calendar, Clock, BarChart3, TrendingUp, Bell, Plus, MapPin } from "lucide-react"
import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function UserDashboard() {
  const { t, language, dir } = useLanguage()
  const { user } = useAuth()
  const { unreadCount } = useNotifications()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [stats, setStats] = useState<any>(null)
  const [spending, setSpending] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return
      
      setLoading(true)
      setError(null)
      
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout
        
        // Fetch stats and spending data in parallel
        const [statsResponse, spendingResponse] = await Promise.all([
          fetch("/api/user/bookings/stats", {
            headers: {
              Authorization: `Bearer ${user.id}`,
            },
            signal: controller.signal
          }),
          fetch("/api/user/spending", {
            headers: {
              Authorization: `Bearer ${user.id}`,
            },
            signal: controller.signal
          })
        ])
        
        clearTimeout(timeoutId)
        
        if (statsResponse.ok && spendingResponse.ok) {
          const statsData = await statsResponse.json()
          const spendingData = await spendingResponse.json()
          setStats(statsData.stats)
          setSpending(spendingData)
        } else {
          throw new Error('Failed to fetch data')
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        setError(error instanceof Error ? error.message : 'Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  // Check if user is admin or super admin
  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN"

  // Redirect admin and super admin users to settings
  useEffect(() => {
    if (mounted && isAdmin) {
      router.push("/user-dashboard/settings")
    }
  }, [mounted, isAdmin, router])

  // Memoize stats to prevent unnecessary re-renders
  const memoizedStats = useMemo(() => stats, [stats])

  const testNotification = async () => {
    try {
      const response = await fetch('/api/test-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.id}`
        },
        body: JSON.stringify({
          title: 'Test Notification',
          message: 'This is a test notification to verify the system is working!',
          type: 'TEST',
          category: 'SYSTEM',
          priority: 'NORMAL'
        })
      })

      if (response.ok) {
        console.log('Test notification sent successfully')
      } else {
        console.error('Failed to send test notification')
      }
    } catch (error) {
      console.error('Error sending test notification:', error)
    }
  }

  if (!mounted) {
    return null
  }

  // Show message for admin users while redirecting
  if (isAdmin) {
    return (
      <div className="space-y-6">
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-6 shadow-md">
          <div className="text-center space-y-4">
            <Settings className="h-16 w-16 mx-auto text-muted-foreground" />
            <h1 className="text-2xl font-bold">Redirecting to Settings...</h1>
            <p className="text-muted-foreground">
              Admin users can only access account settings in the user dashboard.
            </p>
            <Button onClick={() => router.push("/user-dashboard/settings")}>
              Go to Settings
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-syria-gold mx-auto"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-6 shadow-md">
          <div className="text-center space-y-4">
            <div className="text-red-500 text-4xl">⚠️</div>
            <h1 className="text-2xl font-bold text-red-600">Error Loading Dashboard</h1>
            <p className="text-gray-600">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-syria-gold/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Bell className="h-8 w-8 text-syria-gold" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Unread Notifications</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{unreadCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-syria-gold/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Calendar className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Bookings</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {spending?.totalBookings || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-syria-gold/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <DollarSign className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Spent</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {spending?.currency || 'USD'} {spending?.totalSpending?.toFixed(2) || '0.00'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-syria-gold/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Recent Spending</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {spending?.currency || 'USD'} {spending?.recentSpending?.toFixed(2) || '0.00'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Spending Breakdown */}
        {spending && Object.keys(spending.spendingByService).length > 0 && (
          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-syria-gold/20 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-syria-gold" />
                Spending Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(spending.spendingByService).map(([serviceType, data]: [string, any]) => (
                  <div key={serviceType} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white capitalize">
                        {serviceType.toLowerCase()}
                      </h4>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {data.count} {data.count === 1 ? 'booking' : 'bookings'}
                      </span>
                    </div>
                    <p className="text-lg font-bold text-syria-gold">
                      {data.currency} {data.total.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link href="/user-dashboard/bookings">
            <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-syria-gold/20 hover:border-syria-gold/40">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Calendar className="h-6 w-6 text-syria-gold" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">My Bookings</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">View and manage your bookings</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/user-dashboard/notifications">
            <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-syria-gold/20 hover:border-syria-gold/40">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Bell className="h-6 w-6 text-syria-gold" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">View all your notifications</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/user-dashboard/settings">
            <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-syria-gold/20 hover:border-syria-gold/40">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <MapPin className="h-6 w-6 text-syria-gold" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Settings</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Manage your account settings</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Test Section */}
        <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-syria-gold/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-syria-gold" />
              Test Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Test the notification system by sending a test notification.
            </p>
            <Button onClick={testNotification} className="bg-syria-gold hover:bg-syria-dark-gold text-white">
              <Plus className="h-4 w-4 mr-2" />
              Send Test Notification
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
