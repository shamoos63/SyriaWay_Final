'use client'

import { useState } from 'react'
import { Bell, Check, Trash2, Filter, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useNotifications } from '@/lib/notification-context'
import { useLanguage } from '@/lib/i18n/language-context'
import { cn } from '@/lib/utils'

export default function NotificationsPage() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, archiveNotification, loading } = useNotifications()
  const { t } = useLanguage()
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('ALL')

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return t.userDashboard?.justNow || 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}${t.userDashboard?.minutes || 'm'} ${t.userDashboard?.ago || 'ago'}`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}${t.userDashboard?.hours || 'h'} ${t.userDashboard?.ago || 'ago'}`
    return date.toLocaleDateString()
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'bg-red-500'
      case 'HIGH': return 'bg-orange-500'
      case 'NORMAL': return 'bg-blue-500'
      case 'LOW': return 'bg-gray-500'
      default: return 'bg-blue-500'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'BOOKING': return '🏨'
      case 'PAYMENT': return '💳'
      case 'MESSAGE': return '💬'
      case 'SYSTEM': return '⚙️'
      case 'REVIEW': return '⭐'
      case 'OFFER': return '🎉'
      default: return '📢'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'BOOKING': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'PAYMENT': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'MESSAGE': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      case 'SYSTEM': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
      case 'REVIEW': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'OFFER': return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = categoryFilter === 'ALL' || notification.category === categoryFilter
    
    const matchesStatus = statusFilter === 'ALL' || 
                         (statusFilter === 'UNREAD' && !notification.isRead) ||
                         (statusFilter === 'READ' && notification.isRead)
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  const categories = ['ALL', 'BOOKING', 'PAYMENT', 'MESSAGE', 'SYSTEM', 'REVIEW', 'OFFER']
  const statuses = ['ALL', 'UNREAD', 'READ']

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Bell className="h-8 w-8 text-syria-gold" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {t.userDashboard?.notifications || "Notifications"}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {unreadCount} {t.userDashboard?.unreadNotifications || "unread notification"}{unreadCount !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          
          {unreadCount > 0 && (
            <Button
              onClick={markAllAsRead}
              className="bg-syria-gold hover:bg-syria-dark-gold text-white"
            >
              <Check className="h-4 w-4 mr-2" />
              {t.userDashboard?.markAllAsRead || "Mark all as read"}
            </Button>
          )}
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              {t.userDashboard?.filters || "Filters"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={t.userDashboard?.searchNotifications || "Search notifications..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder={t.userDashboard?.category || "Category"} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder={t.userDashboard?.status || "Status"} />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map(status => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notifications List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-syria-gold mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">{t.userDashboard?.loadingNotifications || "Loading notifications..."}</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {t.userDashboard?.noNotificationsFound || "No notifications found"}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {searchTerm || categoryFilter !== 'ALL' || statusFilter !== 'ALL' 
                  ? (t.userDashboard?.tryAdjustingFilters || 'Try adjusting your filters')
                  : (t.userDashboard?.allCaughtUp || 'You\'re all caught up!')}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <Card
                key={notification.id}
                className={cn(
                  "transition-all duration-200 hover:shadow-md",
                  !notification.isRead && "border-l-4 border-l-syria-gold bg-blue-50 dark:bg-blue-900/20"
                )}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Priority indicator */}
                    <div className={cn(
                      "w-3 h-3 rounded-full mt-2 flex-shrink-0",
                      getPriorityColor(notification.priority)
                    )} />
                    
                    {/* Category icon */}
                    <span className="text-2xl flex-shrink-0">
                      {getCategoryIcon(notification.category)}
                    </span>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className={cn(
                            "text-lg font-semibold text-gray-900 dark:text-white",
                            !notification.isRead && "font-bold"
                          )}>
                            {notification.title}
                          </h3>
                          <Badge className={getCategoryColor(notification.category)}>
                            {notification.category}
                          </Badge>
                          {notification.priority === 'URGENT' && (
                            <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                              {t.userDashboard?.urgent || "URGENT"}
                            </Badge>
                          )}
                        </div>
                        <span className="text-sm text-gray-500 flex-shrink-0">
                          {formatTime(notification.createdAt)}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                        {notification.message}
                      </p>
                      
                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        {!notification.isRead && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                            className="text-blue-600 hover:text-blue-700 border-blue-200 hover:border-blue-300"
                          >
                            <Check className="h-4 w-4 mr-1" />
                            {t.userDashboard?.markAsRead || "Mark as read"}
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => archiveNotification(notification.id)}
                          className="text-gray-500 hover:text-red-600 border-gray-200 hover:border-red-300"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          {t.userDashboard?.archive || "Archive"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 