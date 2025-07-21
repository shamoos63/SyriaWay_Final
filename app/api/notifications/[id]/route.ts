import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { db } from '@/lib/db'
import { notifications } from '@/drizzle/schema'
import { eq, and } from 'drizzle-orm'

// GET - Fetch single notification
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params

    const [notification] = await db
      .select()
      .from(notifications)
      .where(and(
        eq(notifications.id, parseInt(id)),
        eq(notifications.userId, parseInt(session.user.id))
      ))

    if (!notification) {
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ notification })
  } catch (error) {
    console.error('Error fetching notification:', error)
    return NextResponse.json(
      { error: 'Failed to fetch notification' },
      { status: 500 }
    )
  }
}

// PUT - Mark notification as read
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await request.json()

    // Check if notification exists and belongs to user
    const [existingNotification] = await db
      .select()
      .from(notifications)
      .where(and(
        eq(notifications.id, parseInt(id)),
        eq(notifications.userId, parseInt(session.user.id))
      ))

    if (!existingNotification) {
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      )
    }

    // Update notification
    const [updatedNotification] = await db
      .update(notifications)
      .set({
        ...body,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(notifications.id, parseInt(id)))
      .returning()

    return NextResponse.json({
      notification: updatedNotification,
      message: 'Notification updated successfully'
    })
  } catch (error) {
    console.error('Error updating notification:', error)
    return NextResponse.json(
      { error: 'Failed to update notification' },
      { status: 500 }
    )
  }
}

// DELETE - Delete notification
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params

    // Check if notification exists and belongs to user
    const [existingNotification] = await db
      .select()
      .from(notifications)
      .where(and(
        eq(notifications.id, parseInt(id)),
        eq(notifications.userId, parseInt(session.user.id))
      ))

    if (!existingNotification) {
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      )
    }

    // Delete notification
    await db
      .delete(notifications)
      .where(eq(notifications.id, parseInt(id)))

    return NextResponse.json({
      message: 'Notification deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting notification:', error)
    return NextResponse.json(
      { error: 'Failed to delete notification' },
      { status: 500 }
    )
  }
} 