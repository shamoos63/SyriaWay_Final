import { db } from './db'
import { notifications } from '@/drizzle/schema'
import { eq, and, desc } from 'drizzle-orm'

export interface CreateNotificationData {
  userId: string
  title: string
  message: string
  type: string
  category: 'BOOKING' | 'PAYMENT' | 'MESSAGE' | 'SYSTEM' | 'REVIEW' | 'OFFER'
  relatedId?: string
  relatedType?: string
  priority?: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT'
}

export async function createNotification(data: CreateNotificationData) {
  try {
    const [notification] = await db.insert(notifications).values({
      userId: data.userId,
      title: data.title,
      message: data.message,
      type: data.type,
      category: data.category,
      relatedId: data.relatedId,
      relatedType: data.relatedType,
      priority: data.priority || 'NORMAL',
    }).returning()

    return notification
  } catch (error) {
    console.error('Error creating notification:', error)
    throw error
  }
}

export async function markNotificationAsRead(notificationId: string) {
  try {
    const [notification] = await db
      .update(notifications)
      .set({ 
        isRead: true,
        readAt: new Date().toISOString()
      })
      .where(eq(notifications.id, notificationId))
      .returning()

    return notification
  } catch (error) {
    console.error('Error marking notification as read:', error)
    throw error
  }
}

export async function getUnreadNotifications(userId: string) {
  try {
    const unreadNotifications = await db
      .select()
      .from(notifications)
      .where(and(
        eq(notifications.userId, userId),
        eq(notifications.isRead, false)
      ))
      .orderBy(desc(notifications.createdAt))

    return unreadNotifications
  } catch (error) {
    console.error('Error fetching unread notifications:', error)
    throw error
  }
}

// Predefined notification types
export const NOTIFICATION_TYPES = {
  // Booking notifications
  BOOKING_CONFIRMED: 'BOOKING_CONFIRMED',
  BOOKING_CANCELLED: 'BOOKING_CANCELLED',
  BOOKING_UPDATED: 'BOOKING_UPDATED',
  BOOKING_REMINDER: 'BOOKING_REMINDER',
  
  // Payment notifications
  PAYMENT_RECEIVED: 'PAYMENT_RECEIVED',
  PAYMENT_FAILED: 'PAYMENT_FAILED',
  PAYMENT_REFUNDED: 'PAYMENT_REFUNDED',
  
  // Message notifications
  NEW_MESSAGE: 'NEW_MESSAGE',
  MESSAGE_REPLY: 'MESSAGE_REPLY',
  
  // System notifications
  ACCOUNT_VERIFIED: 'ACCOUNT_VERIFIED',
  PASSWORD_CHANGED: 'PASSWORD_CHANGED',
  PROFILE_UPDATED: 'PROFILE_UPDATED',
  
  // Review notifications
  NEW_REVIEW: 'NEW_REVIEW',
  REVIEW_RESPONSE: 'REVIEW_RESPONSE',
  
  // Offer notifications
  NEW_OFFER: 'NEW_OFFER',
  OFFER_EXPIRING: 'OFFER_EXPIRING',
  
  // Special requests
  REQUEST_APPROVED: 'REQUEST_APPROVED',
  REQUEST_REJECTED: 'REQUEST_REJECTED',
  REQUEST_UPDATED: 'REQUEST_UPDATED'
} as const

// Helper functions for common notifications
export async function notifyBookingConfirmed(userId: string, bookingId: string, serviceName: string) {
  return createNotification({
    userId,
    title: 'Booking Confirmed!',
    message: `Your booking for ${serviceName} has been confirmed. Check your booking details for more information.`,
    type: NOTIFICATION_TYPES.BOOKING_CONFIRMED,
    category: 'BOOKING',
    relatedId: bookingId,
    relatedType: 'BOOKING',
    priority: 'HIGH'
  })
}

export async function notifyBookingCancelled(userId: string, bookingId: string, serviceName: string, reason?: string) {
  return createNotification({
    userId,
    title: 'Booking Cancelled',
    message: `Your booking for ${serviceName} has been cancelled.${reason ? ` Reason: ${reason}` : ''}`,
    type: NOTIFICATION_TYPES.BOOKING_CANCELLED,
    category: 'BOOKING',
    relatedId: bookingId,
    relatedType: 'BOOKING',
    priority: 'HIGH'
  })
}

export async function notifyPaymentReceived(userId: string, amount: number, serviceName: string) {
  return createNotification({
    userId,
    title: 'Payment Received',
    message: `Payment of $${amount} has been received for ${serviceName}.`,
    type: NOTIFICATION_TYPES.PAYMENT_RECEIVED,
    category: 'PAYMENT',
    priority: 'NORMAL'
  })
}

export async function notifyNewMessage(userId: string, senderName: string, messagePreview: string) {
  return createNotification({
    userId,
    title: `New message from ${senderName}`,
    message: messagePreview,
    type: NOTIFICATION_TYPES.NEW_MESSAGE,
    category: 'MESSAGE',
    priority: 'NORMAL'
  })
}

export async function notifyRequestApproved(userId: string, requestType: string) {
  return createNotification({
    userId,
    title: 'Request Approved',
    message: `Your ${requestType} request has been approved.`,
    type: NOTIFICATION_TYPES.REQUEST_APPROVED,
    category: 'SYSTEM',
    priority: 'HIGH'
  })
}

export async function notifyRequestRejected(userId: string, requestType: string, reason?: string) {
  return createNotification({
    userId,
    title: 'Request Rejected',
    message: `Your ${requestType} request has been rejected.${reason ? ` Reason: ${reason}` : ''}`,
    type: NOTIFICATION_TYPES.REQUEST_REJECTED,
    category: 'SYSTEM',
    priority: 'NORMAL'
  })
}

// Helper function to create booking status change notifications
export async function createBookingStatusNotification(
  bookingId: string,
  customerId: string,
  serviceProviderId: string | null,
  status: string,
  serviceName: string,
  serviceType: string,
  notes?: string
) {
  try {
    // Determine notification type based on status
    let notificationType = NOTIFICATION_TYPES.BOOKING_UPDATED
    if (status === "CONFIRMED") {
      notificationType = NOTIFICATION_TYPES.BOOKING_CONFIRMED
    } else if (status === "CANCELLED") {
      notificationType = NOTIFICATION_TYPES.BOOKING_CANCELLED
    }

    // Create notification for customer
    await db.insert(notifications).values({
      userId: customerId,
      title: `Booking ${status.toLowerCase()}`,
      message: `Your ${serviceType.toLowerCase()} booking for ${serviceName} has been ${status.toLowerCase()}.${notes ? ` Notes: ${notes}` : ''}`,
      type: notificationType,
      category: "BOOKING",
      priority: status === "CONFIRMED" ? "HIGH" : "MEDIUM",
      isRead: false,
      relatedId: bookingId,
      relatedType: "BOOKING",
    })

    // Create notification for service provider if they exist
    if (serviceProviderId) {
      await db.insert(notifications).values({
        userId: serviceProviderId,
        title: `Booking ${status.toLowerCase()}`,
        message: `A ${serviceType.toLowerCase()} booking for ${serviceName} has been ${status.toLowerCase()}.${notes ? ` Notes: ${notes}` : ''}`,
        type: notificationType,
        category: "BOOKING",
        priority: status === "CONFIRMED" ? "HIGH" : "MEDIUM",
        isRead: false,
        relatedId: bookingId,
        relatedType: "BOOKING",
      })
    }
  } catch (error) {
    console.error("Error creating booking status notification:", error)
  }
}

// Helper function to create booking cancellation request notification
export async function createCancellationRequestNotification(
  bookingId: string,
  customerId: string,
  serviceProviderId: string | null,
  serviceName: string,
  serviceType: string
) {
  try {
    // Create notification for service provider
    if (serviceProviderId) {
      await db.insert(notifications).values({
        userId: serviceProviderId,
        title: "Cancellation Request",
        message: `A customer has requested to cancel their ${serviceType.toLowerCase()} booking for ${serviceName}. Please review and respond.`,
        type: NOTIFICATION_TYPES.REQUEST_UPDATED,
        category: "BOOKING",
        priority: "HIGH",
        isRead: false,
        relatedId: bookingId,
        relatedType: "BOOKING",
      })
    }
  } catch (error) {
    console.error("Error creating cancellation request notification:", error)
  }
} 