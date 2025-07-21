'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './auth-context'
import { toast } from '@/hooks/use-toast'

interface Notification {
  id: string
  title: string
  message: string
  type: string
  category: string
  isRead: boolean
  priority: string
  createdAt: string
  relatedId?: string
  relatedType?: string
}

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  loading: boolean
  markAsRead: (id: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  archiveNotification: (id: string) => Promise<void>
  refreshNotifications: () => Promise<void>
  addNotification: (notification: Notification) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)

  const fetchNotifications = async () => {
    if (!user?.id) return

    try {
      setLoading(true)
      const response = await fetch('/api/notifications?limit=50', {
        headers: {
          Authorization: `Bearer ${user.id}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        // Handle both response formats
        const notificationsList = data.notifications || []
        const unreadCountValue = data.unreadCount || notificationsList.filter((n: any) => !n.isRead).length
        
        setNotifications(notificationsList)
        setUnreadCount(unreadCountValue)
      } else {
        console.error('Failed to fetch notifications:', response.status)
        // Set empty state on error
        setNotifications([])
        setUnreadCount(0)
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
      // Set empty state on error
      setNotifications([])
      setUnreadCount(0)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id: string) => {
    if (!user?.id) return

    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${user.id}`,
        },
      })

      if (response.ok) {
        setNotifications(prev => 
          prev.map(notification => 
            notification.id === id 
              ? { ...notification, isRead: true }
              : notification
          )
        )
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const markAllAsRead = async () => {
    if (!user?.id) return

    try {
      const unreadNotifications = notifications.filter(n => !n.isRead)
      
      await Promise.all(
        unreadNotifications.map(notification => markAsRead(notification.id))
      )
      
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, isRead: true }))
      )
      setUnreadCount(0)
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    }
  }

  const archiveNotification = async (id: string) => {
    if (!user?.id) return

    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user.id}`,
        },
      })

      if (response.ok) {
        setNotifications(prev => prev.filter(notification => notification.id !== id))
        setUnreadCount(prev => {
          const notification = notifications.find(n => n.id === id)
          return notification && !notification.isRead ? Math.max(0, prev - 1) : prev
        })
      }
    } catch (error) {
      console.error('Error archiving notification:', error)
    }
  }

  const addNotification = (notification: Notification) => {
    setNotifications(prev => [notification, ...prev])
    if (!notification.isRead) {
      setUnreadCount(prev => prev + 1)
      
      // Show toast for high priority notifications
      if (notification.priority === 'HIGH' || notification.priority === 'URGENT') {
        toast({
          title: notification.title,
          description: notification.message,
          variant: notification.priority === 'URGENT' ? 'destructive' : 'default'
        })
      }
    }
  }

  const refreshNotifications = async () => {
    await fetchNotifications()
  }

  // Fetch notifications on mount and when user changes
  useEffect(() => {
    fetchNotifications()
  }, [user?.id])

  // Set up polling for new notifications (every 30 seconds)
  useEffect(() => {
    if (!user?.id) return

    const interval = setInterval(() => {
      fetchNotifications()
    }, 30000)

    return () => clearInterval(interval)
  }, [user?.id])

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    archiveNotification,
    refreshNotifications,
    addNotification
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
} 