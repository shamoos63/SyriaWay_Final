import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { db } from '@/lib/db'
import { notifications } from '@/drizzle/schema'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { title, message, type, category, priority } = body

    // Create test notification
    const [newNotification] = await db
      .insert(notifications)
      .values({
        userId: parseInt(session.user.id),
        title: title || 'Test Notification',
        message: message || 'This is a test notification',
        type: type || 'SYSTEM',
        category: category || 'SYSTEM',
        priority: priority || 'NORMAL',
        isRead: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .returning()

    return NextResponse.json({
      notification: newNotification,
      message: 'Test notification created successfully'
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating test notification:', error)
    return NextResponse.json(
      { error: 'Failed to create test notification' },
      { status: 500 }
    )
  }
} 