"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/lib/i18n/language-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  Hotel, 
  Car, 
  FileText, 
  BarChart2, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  TrendingUp,
  TrendingDown,
  Eye,
  MessageSquare,
  Calendar,
  Building2,
  Package,
  MapPin,
  DollarSign,
  Activity,
  UserCheck,
  UserX,
  ShoppingCart,
  Mail,
  BookOpen,
  Newspaper,
  Settings,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react"
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts'

interface DashboardStats {
  users: {
    total: number
    customers: number
    admins: number
    providers: number
    active: number
    inactive: number
    suspended: number
    breakdown: Array<{ role: string; count: number }>
  }
  serviceProviders: {
    total: number
    hotelOwners: number
    carOwners: number
    tourGuides: number
  }
  listings: {
    total: number
    hotels: number
    cars: number
    tours: number
    sites: number
  }
  pendingListings: {
    total: number
    hotels: number
    cars: number
    tours: number
    sites: number
  }
  bookings: {
    total: number
    confirmed: number
    pending: number
    cancelled: number
    completed: number
    recent: number
  }
  pendingBookings: {
    total: number
  }
  contactForms: {
    total: number
    pending: number
    responded: number
    recent: number
  }
  content: {
    blogs: {
      total: number
      published: number
      pending: number
      draft: number
      featured: number
      totalViews: number
      totalLikes: number
    }
    news: {
      total: number
      published: number
      pending: number
      draft: number
      featured: number
      totalViews: number
    }
  }
  analytics: {
    pageViews: number
    mostVisitedPages: Array<{ page: string; views: number; percentage: number }>
    recentActivity: {
      newUsers: number
      newBookings: number
      newContactForms: number
    }
  }
}

export default function ControlPanel() {
  const { t, language } = useLanguage()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/dashboard')
      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
      } else {
        setError('Failed to fetch dashboard statistics')
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      setError('Failed to fetch dashboard statistics')
    } finally {
      setLoading(false)
    }
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'confirmed':
      case 'published':
        return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-100'
      case 'pending':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-100'
      case 'cancelled':
      case 'suspended':
        return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-100'
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-100'
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Error Loading Dashboard</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={fetchDashboardStats}>Try Again</Button>
        </div>
      </div>
    )
  }

  // Prepare chart data
  const userRoleData = stats.users.breakdown.map(item => ({
    name: item.role.replace('_', ' '),
    value: item.count,
    color: item.role === 'CUSTOMER' ? '#10B981' : 
           item.role === 'HOTEL_OWNER' ? '#3B82F6' :
           item.role === 'CAR_OWNER' ? '#F59E0B' :
           item.role === 'TOUR_GUIDE' ? '#8B5CF6' :
           item.role === 'ADMIN' ? '#EF4444' : '#6B7280'
  }))

  const bookingStatusData = [
    { name: 'Confirmed', value: stats.bookings.confirmed, color: '#10B981' },
    { name: 'Pending', value: stats.bookings.pending, color: '#F59E0B' },
    { name: 'Cancelled', value: stats.bookings.cancelled, color: '#EF4444' },
    { name: 'Completed', value: stats.bookings.completed, color: '#3B82F6' }
  ]

  const pageViewsData = stats.analytics.mostVisitedPages.map(page => ({
    name: page.page,
    views: page.views,
    percentage: page.percentage
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {language === "ar" ? "لوحة التحكم" : language === "fr" ? "Tableau de Bord" : "Control Panel Dashboard"}
          </h1>
          <p className="text-muted-foreground mt-2">
            {language === "ar" 
              ? "مرحباً بك في لوحة تحكم سيريا وايز. إدارة محتوى موقعك والمستخدمين من هنا."
              : language === "fr"
                ? "Bienvenue dans le panneau de contrôle de Syria Ways. Gérez le contenu de votre site web et vos utilisateurs depuis ici."
                : "Welcome to the Syria Ways control panel. Manage your website content and users from here."}
          </p>
        </div>
        <Button onClick={fetchDashboardStats} variant="outline">
          <Activity className="h-4 w-4 mr-2" />
          {language === "ar" ? "تحديث" : language === "fr" ? "Actualiser" : "Refresh"}
        </Button>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Active Customers */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {language === "ar" ? "العملاء النشطين" : language === "fr" ? "Clients Actifs" : "Active Customers"}
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.users.customers)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {language === "ar" ? "عملاء نشطين" : language === "fr" ? "clients actifs" : "active customers"}
            </p>
          </CardContent>
        </Card>

        {/* Service Providers */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {language === "ar" ? "مقدمي الخدمات" : language === "fr" ? "Prestataires" : "Service Providers"}
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.serviceProviders.total)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.serviceProviders.hotelOwners} {language === "ar" ? "فنادق" : language === "fr" ? "hôtels" : "hotels"}, {stats.serviceProviders.carOwners} {language === "ar" ? "سيارات" : language === "fr" ? "voitures" : "cars"}, {stats.serviceProviders.tourGuides} {language === "ar" ? "مرشدين" : language === "fr" ? "guides" : "guides"}
            </p>
          </CardContent>
        </Card>

        {/* Active Listings */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {language === "ar" ? "العروض النشطة" : language === "fr" ? "Annonces Actives" : "Active Listings"}
            </CardTitle>
            <Hotel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.listings.total)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {language === "ar" ? "في جميع الفئات" : language === "fr" ? "toutes catégories" : "across all categories"}
            </p>
          </CardContent>
        </Card>

        {/* Total Bookings */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {language === "ar" ? "إجمالي الحجوزات" : language === "fr" ? "Réservations Totales" : "Total Bookings"}
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.bookings.total)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.bookings.recent} {language === "ar" ? "في آخر 30 يوم" : language === "fr" ? "30 derniers jours" : "last 30 days"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Items Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Pending Listings */}
        <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
              {language === "ar" ? "العروض المعلقة" : language === "fr" ? "Annonces en Attente" : "Pending Listings"}
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-800 dark:text-yellow-200">
              {formatNumber(stats.pendingListings.total)}
            </div>
            <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
              {language === "ar" ? "تحتاج موافقة" : language === "fr" ? "nécessitent approbation" : "need approval"}
            </p>
          </CardContent>
        </Card>

        {/* Pending Bookings */}
        <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800 dark:text-blue-200">
              {language === "ar" ? "الحجوزات المعلقة" : language === "fr" ? "Réservations en Attente" : "Pending Bookings"}
            </CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-800 dark:text-blue-200">
              {formatNumber(stats.pendingBookings.total)}
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              {language === "ar" ? "تحتاج تأكيد" : language === "fr" ? "nécessitent confirmation" : "need confirmation"}
            </p>
          </CardContent>
        </Card>

        {/* Pending Contact Forms */}
        <Card className="border-orange-200 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-800 dark:text-orange-200">
              {language === "ar" ? "رسائل بانتظار الرد" : language === "fr" ? "Messages en Attente" : "Pending Messages"}
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-800 dark:text-orange-200">
              {formatNumber(stats.contactForms.pending)}
            </div>
            <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
              {language === "ar" ? "تحتاج رد" : language === "fr" ? "nécessitent réponse" : "need response"}
            </p>
          </CardContent>
        </Card>

        {/* Content Pending */}
        <Card className="border-purple-200 bg-purple-50 dark:bg-purple-900/20 dark:border-purple-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800 dark:text-purple-200">
              {language === "ar" ? "محتوى معلق" : language === "fr" ? "Contenu en Attente" : "Pending Content"}
            </CardTitle>
            <FileText className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-800 dark:text-purple-200">
              {formatNumber(stats.content.blogs.pending + stats.content.news.pending)}
            </div>
            <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
              {language === "ar" ? "مقالات وأخبار" : language === "fr" ? "articles et actualités" : "blogs & news"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* User Role Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              {language === "ar" ? "توزيع المستخدمين" : language === "fr" ? "Répartition des Utilisateurs" : "User Distribution"}
            </CardTitle>
            <CardDescription>
              {language === "ar" ? "توزيع المستخدمين حسب الدور" : language === "fr" ? "Répartition des utilisateurs par rôle" : "Distribution of users by role"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={userRoleData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {userRoleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Most Visited Pages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              {language === "ar" ? "الصفحات الأكثر زيارة" : language === "fr" ? "Pages les Plus Visitées" : "Most Visited Pages"}
            </CardTitle>
            <CardDescription>
              {language === "ar" ? "إحصائيات زيارات الصفحات" : language === "fr" ? "Statistiques de visite des pages" : "Page visit statistics"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={pageViewsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="views" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Content and Analytics Section */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Content Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {language === "ar" ? "إحصائيات المحتوى" : language === "fr" ? "Statistiques du Contenu" : "Content Statistics"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">{language === "ar" ? "المدونات" : language === "fr" ? "Blogs" : "Blog Posts"}</span>
              <div className="text-right">
                <div className="font-semibold">{stats.content.blogs.total}</div>
                <div className="text-xs text-muted-foreground">
                  {stats.content.blogs.published} {language === "ar" ? "منشور" : language === "fr" ? "publiés" : "published"}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">{language === "ar" ? "الأخبار" : language === "fr" ? "Actualités" : "News Articles"}</span>
              <div className="text-right">
                <div className="font-semibold">{stats.content.news.total}</div>
                <div className="text-xs text-muted-foreground">
                  {stats.content.news.published} {language === "ar" ? "منشور" : language === "fr" ? "publiés" : "published"}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">{language === "ar" ? "إجمالي المشاهدات" : language === "fr" ? "Vues Totales" : "Total Views"}</span>
              <div className="text-right">
                <div className="font-semibold">
                  {formatNumber(stats.content.blogs.totalViews + stats.content.news.totalViews)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              {language === "ar" ? "النشاط الأخير" : language === "fr" ? "Activité Récente" : "Recent Activity"}
            </CardTitle>
            <CardDescription>
              {language === "ar" ? "آخر 7 أيام" : language === "fr" ? "7 derniers jours" : "Last 7 days"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
                <UserCheck className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <div className="font-semibold">{stats.analytics.recentActivity.newUsers}</div>
                <div className="text-xs text-muted-foreground">
                  {language === "ar" ? "مستخدم جديد" : language === "fr" ? "nouveaux utilisateurs" : "new users"}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                <ShoppingCart className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <div className="font-semibold">{stats.analytics.recentActivity.newBookings}</div>
                <div className="text-xs text-muted-foreground">
                  {language === "ar" ? "حجز جديد" : language === "fr" ? "nouvelles réservations" : "new bookings"}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-full">
                <Mail className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <div className="font-semibold">{stats.analytics.recentActivity.newContactForms}</div>
                <div className="text-xs text-muted-foreground">
                  {language === "ar" ? "رسالة جديدة" : language === "fr" ? "nouveaux messages" : "new messages"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              {language === "ar" ? "إجراءات سريعة" : language === "fr" ? "Actions Rapides" : "Quick Actions"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href="/control-panel/content/listings">
                <Hotel className="h-4 w-4 mr-2" />
                {language === "ar" ? "إدارة العروض" : language === "fr" ? "Gérer les Annonces" : "Manage Listings"}
              </a>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href="/control-panel/bookings">
                <Calendar className="h-4 w-4 mr-2" />
                {language === "ar" ? "إدارة الحجوزات" : language === "fr" ? "Gérer les Réservations" : "Manage Bookings"}
              </a>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href="/control-panel/content/contact-forms">
                <MessageSquare className="h-4 w-4 mr-2" />
                {language === "ar" ? "الرد على الرسائل" : language === "fr" ? "Répondre aux Messages" : "Reply to Messages"}
              </a>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href="/control-panel/content/blog">
                <BookOpen className="h-4 w-4 mr-2" />
                {language === "ar" ? "إدارة المدونات" : language === "fr" ? "Gérer les Blogs" : "Manage Blogs"}
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
