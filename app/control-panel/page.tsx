"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/lib/i18n/language-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Hotel, Car, FileText, BarChart2, AlertTriangle, CheckCircle, Clock } from "lucide-react"

interface DashboardStats {
  total: number;
  customers: number;
  admins: number;
  providers: number;
}

export default function ControlPanel() {
  const { t } = useLanguage()
  const [stats, setStats] = useState<DashboardStats>({
    total: 0,
    customers: 0,
    admins: 0,
    providers: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/admin/users')
      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {t.controlPanel?.controlPanelDashboard || "Control Panel Dashboard"}
        </h1>
        <p className="text-muted-foreground mt-2">
          {t.controlPanel?.welcomeMessage ||
            "Welcome to the Syria Ways control panel. Manage your website content and users from here."}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.controlPanel?.totalUsers || "Total Users"}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "..." : stats.total}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.customers} customers, {stats.admins} admins, {stats.providers} providers
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t.controlPanel?.serviceProviders || "Service Providers"}
            </CardTitle>
            <Hotel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "..." : stats.providers}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Hotel owners, car owners, tour guides
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.controlPanel?.customers || "Customers"}</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "..." : stats.customers}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Registered customers
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.controlPanel?.administrators || "Administrators"}</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "..." : stats.admins}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Admin and super admin accounts
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>{t.controlPanel?.websiteActivity || "Website Activity"}</CardTitle>
            <CardDescription>
              {t.controlPanel?.activityOverview || "Overview of website activity for the past 30 days"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center border rounded-md">
              <BarChart2 className="h-16 w-16 text-muted-foreground/50" />
              <p className="ml-4 text-muted-foreground">
                {t.controlPanel?.activityChartPlaceholder || "Activity chart will be displayed here"}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t.controlPanel?.recentAlerts || "Recent Alerts"}</CardTitle>
            <CardDescription>
              {t.controlPanel?.systemNotifications || "System notifications and alerts"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">
                    {t.controlPanel?.systemOnline || "System online"}
                  </p>
                  <p className="text-xs text-muted-foreground">{t.controlPanel?.minutesAgo || "Just now"}</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">
                    {t.controlPanel?.databaseConnected || "Database connected"}
                  </p>
                  <p className="text-xs text-muted-foreground">{t.controlPanel?.minutesAgo || "Just now"}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Clock className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">
                    {t.controlPanel?.userManagement || "User management active"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {stats.total} users managed
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
