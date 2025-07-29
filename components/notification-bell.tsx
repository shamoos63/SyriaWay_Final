'use client'

import { useState, useRef, useEffect } from 'react'
import { Bell, X, Check, Trash2, Clock, ChevronDown, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useNotifications } from '@/lib/notification-context'
import { useLanguage } from '@/lib/i18n/language-context'
import { cn } from '@/lib/utils'

export default function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, archiveNotification, loading } = useNotifications()
  const { t, language } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 'auto',
    bottom: 'auto',
    left: 'auto',
    right: 'auto',
    transform: 'none'
  })

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

  // Calculate optimal dropdown position
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect()
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight
      const isMobile = viewportWidth < 768
      const isRTL = language === 'ar'
      
      // Dropdown dimensions
      const dropdownWidth = isMobile ? Math.min(viewportWidth - 32, 400) : 384
      const dropdownHeight = Math.min(400, viewportHeight - 200)
      
      let newPosition = {
        top: 'auto',
        bottom: 'auto',
        left: 'auto',
        right: 'auto',
        transform: 'none'
      }

      if (isMobile) {
        // Mobile: Center horizontally, position below navbar with margin
        const centerX = (viewportWidth - dropdownWidth) / 2
        newPosition = {
          top: `${buttonRect.bottom + 8}px`,
          left: `${centerX}px`,
          right: 'auto',
          bottom: 'auto',
          transform: 'none'
        }
        
        // Check if dropdown goes below viewport
        if (buttonRect.bottom + dropdownHeight + 8 > viewportHeight) {
          newPosition.top = 'auto'
          newPosition.bottom = `${viewportHeight - buttonRect.top + 8}px`
        }
      } else {
        // Desktop: Position relative to button with smart alignment
        const margin = 16 // Margin from viewport edges
        
        if (isRTL) {
          // RTL: Prefer right alignment, fallback to left
          const rightSpace = buttonRect.left - margin
          const leftSpace = viewportWidth - buttonRect.right - margin
          
          if (rightSpace >= dropdownWidth) {
            // Enough space on the right
            newPosition = {
              top: `${buttonRect.bottom + 8}px`,
              right: `${viewportWidth - buttonRect.left}px`,
              left: 'auto',
              bottom: 'auto',
              transform: 'none'
            }
          } else if (leftSpace >= dropdownWidth) {
            // Enough space on the left
            newPosition = {
              top: `${buttonRect.bottom + 8}px`,
              left: `${buttonRect.right}px`,
              right: 'auto',
              bottom: 'auto',
              transform: 'none'
            }
          } else {
            // Center horizontally with margins
            const centerX = (viewportWidth - dropdownWidth) / 2
            newPosition = {
              top: `${buttonRect.bottom + 8}px`,
              left: `${Math.max(margin, centerX)}px`,
              right: 'auto',
              bottom: 'auto',
              transform: 'none'
            }
          }
        } else {
          // LTR: Prefer left alignment, fallback to right
          const leftSpace = viewportWidth - buttonRect.left - margin
          const rightSpace = buttonRect.right - margin
          
          if (leftSpace >= dropdownWidth) {
            // Enough space on the left
            newPosition = {
              top: `${buttonRect.bottom + 8}px`,
              left: `${buttonRect.left}px`,
              right: 'auto',
              bottom: 'auto',
              transform: 'none'
            }
          } else if (rightSpace >= dropdownWidth) {
            // Enough space on the right
            newPosition = {
              top: `${buttonRect.bottom + 8}px`,
              right: `${viewportWidth - buttonRect.right}px`,
              left: 'auto',
              bottom: 'auto',
              transform: 'none'
            }
          } else {
            // Center horizontally with margins
            const centerX = (viewportWidth - dropdownWidth) / 2
            newPosition = {
              top: `${buttonRect.bottom + 8}px`,
              left: `${Math.max(margin, centerX)}px`,
              right: 'auto',
              bottom: 'auto',
              transform: 'none'
            }
          }
        }
        
        // Check if dropdown goes below viewport
        if (buttonRect.bottom + dropdownHeight + 8 > viewportHeight) {
          newPosition.top = 'auto'
          newPosition.bottom = `${viewportHeight - buttonRect.top + 8}px`
        }
      }
      
      setDropdownPosition(newPosition)
    }
  }, [isOpen, language])

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
      case 'URGENT': return 'bg-gradient-to-r from-red-500 to-red-600'
      case 'HIGH': return 'bg-gradient-to-r from-orange-500 to-orange-600'
      case 'NORMAL': return 'bg-gradient-to-r from-blue-500 to-blue-600'
      case 'LOW': return 'bg-gradient-to-r from-gray-500 to-gray-600'
      default: return 'bg-gradient-to-r from-blue-500 to-blue-600'
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
        ref={buttonRef}
        variant="ghost"
        size="sm"
        className={cn(
          "relative p-2.5 text-white hover:text-syria-cream hover:bg-white/10 transition-all duration-300 rounded-xl group",
          unreadCount > 0 && "animate-pulse"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className={cn(
          "h-5 w-5 transition-all duration-300 group-hover:scale-110",
          unreadCount > 0 && "text-syria-cream"
        )} />
        {unreadCount > 0 && (
          <Badge 
            className={cn(
              "absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs font-bold bg-gradient-to-r from-red-500 to-red-600 text-white border-2 border-white shadow-lg",
              unreadCount > 9 ? "min-w-[20px]" : "min-w-[18px]",
              unreadCount > 99 ? "text-[10px]" : "text-xs"
            )}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
        <ChevronDown className={cn(
          "h-3 w-3 ml-1 transition-transform duration-300",
          isOpen && "rotate-180"
        )} />
      </Button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div 
          className={cn(
            // Base styles
            "fixed w-80 max-h-96 overflow-hidden rounded-2xl border-0 bg-white/95 backdrop-blur-xl shadow-2xl dark:bg-gray-900/95 z-[70]",
            "transform transition-all duration-300 ease-out",
            // Responsive width
            "max-w-[calc(100vw-2rem)] sm:max-w-80 md:max-w-96"
          )}
          style={{
            ...dropdownPosition,
            maxHeight: 'calc(100vh - 200px)',
            minWidth: '280px',
            width: window.innerWidth < 768 ? 'calc(100vw - 2rem)' : '384px'
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100/50 dark:border-gray-700/50 bg-gradient-to-r from-gray-50/80 to-white/80 dark:from-gray-800/80 dark:to-gray-700/80 backdrop-blur-sm">
            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-gradient-to-r from-syria-gold to-syria-dark-gold">
                <Bell className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm">{t.userDashboard?.notifications || "Notifications"}</span>
              {unreadCount > 0 && (
                <Badge className="ml-2 h-5 px-2 text-xs bg-gradient-to-r from-red-500 to-red-600 text-white">
                  {unreadCount}
                </Badge>
              )}
            </h3>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="h-8 px-2 text-xs text-syria-gold hover:text-syria-dark-gold hover:bg-syria-gold/10 rounded-lg"
                >
                  {t.userDashboard?.markAllRead || "Mark all read"}
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            {loading ? (
              <div className="p-6 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-syria-gold mx-auto mb-2"></div>
                <p className="text-sm text-gray-500">{t.userDashboard?.loadingNotifications || "Loading notifications..."}</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <Bell className="h-6 w-6 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500">{t.userDashboard?.noNotifications || "No notifications"}</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100/50 dark:divide-gray-700/50">
                {notifications.slice(0, 8).map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      "p-4 hover:bg-gray-50/80 dark:hover:bg-gray-800/80 transition-all duration-200 group",
                      !notification.isRead && "bg-blue-50/50 dark:bg-blue-900/20"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      {/* Priority indicator */}
                      <div className={cn(
                        "w-2 h-2 rounded-full mt-2 flex-shrink-0 shadow-sm",
                        getPriorityColor(notification.priority)
                      )} />
                      
                      {/* Category icon */}
                      <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm">
                          {getCategoryIcon(notification.category)}
                        </span>
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className={cn(
                            "text-sm font-medium text-gray-900 dark:text-white line-clamp-1",
                            !notification.isRead && "font-semibold"
                          )}>
                            {notification.title}
                          </h4>
                          <span className="text-xs text-gray-500 flex-shrink-0 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatTime(notification.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        
                        {/* Actions */}
                        <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          {!notification.isRead && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                              className="h-7 px-2 text-xs text-syria-gold hover:text-syria-dark-gold hover:bg-syria-gold/10 rounded-md"
                            >
                              <Check className="h-3 w-3 mr-1" />
                              {t.userDashboard?.markRead || "Mark read"}
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => archiveNotification(notification.id)}
                            className="h-7 px-2 text-xs text-gray-500 hover:text-red-600 hover:bg-red-50 dark:text-gray-400 rounded-md"
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            {t.userDashboard?.archive || "Archive"}
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
          {notifications.length > 8 && (
            <div className="p-3 border-t border-gray-100/50 dark:border-gray-700/50 bg-gradient-to-r from-gray-50/80 to-white/80 dark:from-gray-800/80 dark:to-gray-700/80 backdrop-blur-sm">
              <Button
                variant="ghost"
                size="sm"
                className="w-full h-9 text-xs text-syria-gold hover:text-syria-dark-gold hover:bg-syria-gold/10 rounded-lg"
                onClick={() => {
                  setIsOpen(false)
                  // Navigate to full notifications page
                  window.location.href = '/user-dashboard/notifications'
                }}
              >
                <Settings className="h-3 w-3 mr-2" />
                {t.userDashboard?.viewAllNotifications || "View all notifications"}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
} 