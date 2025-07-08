'use client'

import { useState, useRef, useEffect } from 'react'
import { Bell, X, Check, Trash2, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useNotifications } from '@/lib/notification-context'
import { cn } from '@/lib/utils'

export default function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, archiveNotification, loading } = useNotifications()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
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

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell Button */}
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "relative p-2 text-white hover:text-syria-cream hover:bg-white/10 transition-all duration-200 rounded-full",
          unreadCount > 0 && "animate-bounce"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className={cn(
          "h-5 w-5 transition-all duration-200",
          unreadCount > 0 && "text-syria-cream"
        )} />
        {unreadCount > 0 && (
          <Badge 
            className={cn(
              "absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 text-xs font-bold bg-gradient-to-r from-red-500 to-red-600 text-white border-2 border-white shadow-lg animate-pulse",
              unreadCount > 9 ? "min-w-[24px]" : "min-w-[22px]",
              unreadCount > 99 ? "text-[10px]" : "text-xs"
            )}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-3 w-80 max-h-96 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800 z-[70] backdrop-blur-sm">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Bell className="h-4 w-4 text-syria-gold" />
              Notifications
            </h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-xs text-syria-gold hover:text-syria-dark-gold hover:bg-syria-gold/10"
                >
                  Mark all read
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">
                Loading notifications...
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No notifications
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {notifications.slice(0, 10).map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      "p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 border-l-4 border-transparent",
                      !notification.isRead && "bg-blue-50 dark:bg-blue-900/20 border-l-syria-gold"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      {/* Priority indicator */}
                      <div className={cn(
                        "w-2 h-2 rounded-full mt-2 flex-shrink-0",
                        getPriorityColor(notification.priority)
                      )} />
                      
                      {/* Category icon */}
                      <span className="text-lg flex-shrink-0">
                        {getCategoryIcon(notification.category)}
                      </span>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className={cn(
                            "text-sm font-medium text-gray-900 dark:text-white truncate",
                            !notification.isRead && "font-semibold"
                          )}>
                            {notification.title}
                          </h4>
                          <span className="text-xs text-gray-500 flex-shrink-0">
                            {formatTime(notification.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        
                        {/* Actions */}
                        <div className="flex items-center gap-2 mt-3">
                          {!notification.isRead && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                              className="h-6 px-2 text-xs text-syria-gold hover:text-syria-dark-gold hover:bg-syria-gold/10"
                            >
                              <Check className="h-3 w-3 mr-1" />
                              Mark read
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => archiveNotification(notification.id)}
                            className="h-6 px-2 text-xs text-gray-500 hover:text-red-600 hover:bg-red-50 dark:text-gray-400"
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Archive
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 10 && (
            <div className="p-3 border-t border-gray-100 dark:border-gray-700 text-center bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-syria-gold hover:text-syria-dark-gold hover:bg-syria-gold/10"
                onClick={() => {
                  setIsOpen(false)
                  // Navigate to full notifications page
                  window.location.href = '/user-dashboard/notifications'
                }}
              >
                View all notifications
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
} 