import { NextRequest, NextResponse } from 'next/server'
import { createNotification } from '@/lib/notifications'

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const userId = authHeader.replace('Bearer ', '')
    const body = await request.json()
    const { title, message, type, category, priority } = body
    
    const result = await createNotification({
      userId,
      title: title || 'Test Notification',
      message: message || 'This is a test notification',
      type: type || 'TEST',
      category: category || 'SYSTEM',
      priority: priority || 'NORMAL'
    })
    
    if (result.success) {
      return NextResponse.json({
        message: 'Test notification created successfully',
        notification: result.notification
      })
    } else {
      return NextResponse.json(
        { error: 'Failed to create test notification' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error creating test notification:', error)
    return NextResponse.json(
      { error: 'Failed to create test notification' },
      { status: 500 }
    )
  }
} 