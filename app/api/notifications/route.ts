import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { notifications } from '@/drizzle/schema'
import { eq, and, desc, inArray } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const userId = authHeader.replace('Bearer ', '')
    if (userId === 'demo-user-id') {
      return NextResponse.json({
        notifications: [
          {
            id: 'demo-notification-1',
            title: 'Welcome to Syria Ways!',
            message: 'Thank you for joining our platform. Start exploring amazing destinations in Syria.',
            type: 'SYSTEM',
            category: 'SYSTEM',
            isRead: false,
            createdAt: new Date().toISOString(),
          }
        ],
        total: 1
      })
    }
    const userIdNum = parseInt(userId)

    const notificationsData = await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userIdNum))
      .orderBy(desc(notifications.createdAt))

    return NextResponse.json({
      notifications: notificationsData,
      total: notificationsData.length
    })
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const userId = authHeader.replace('Bearer ', '')
    if (userId === 'demo-user-id') {
      return NextResponse.json({ success: true, message: 'Notifications marked as read (demo)' })
    }
    const userIdNum = parseInt(userId)
    const { notificationIds } = await request.json()

    if (!notificationIds || !Array.isArray(notificationIds)) {
      return NextResponse.json(
        { error: 'Notification IDs array is required' },
        { status: 400 }
      )
    }

    // Mark notifications as read
    await db
      .update(notifications)
      .set({ 
        isRead: true
      })
      .where(and(
        eq(notifications.userId, userIdNum),
        inArray(notifications.id, notificationIds)
      ))

    return NextResponse.json({ 
      success: true, 
      message: 'Notifications marked as read' 
    })
  } catch (error) {
    console.error('Error marking notifications as read:', error)
    return NextResponse.json(
      { error: 'Failed to mark notifications as read' },
      { status: 500 }
    )
  }
} 