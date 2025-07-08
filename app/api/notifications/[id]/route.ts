import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PATCH - Mark notification as read
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const userId = authHeader.replace('Bearer ', '')
    
    const notification = await prisma.notification.findFirst({
      where: {
        id: params.id,
        userId
      }
    })
    
    if (!notification) {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 })
    }
    
    const updatedNotification = await prisma.notification.update({
      where: { id: params.id },
      data: {
        isRead: true,
        readAt: new Date()
      }
    })
    
    return NextResponse.json({
      notification: updatedNotification,
      message: 'Notification marked as read'
    })
  } catch (error) {
    console.error('Error updating notification:', error)
    return NextResponse.json(
      { error: 'Failed to update notification' },
      { status: 500 }
    )
  }
}

// DELETE - Archive notification
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const userId = authHeader.replace('Bearer ', '')
    
    const notification = await prisma.notification.findFirst({
      where: {
        id: params.id,
        userId
      }
    })
    
    if (!notification) {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 })
    }
    
    await prisma.notification.update({
      where: { id: params.id },
      data: { isArchived: true }
    })
    
    return NextResponse.json({
      message: 'Notification archived successfully'
    })
  } catch (error) {
    console.error('Error archiving notification:', error)
    return NextResponse.json(
      { error: 'Failed to archive notification' },
      { status: 500 }
    )
  }
} 