import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Fetch user notifications
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const userId = authHeader.replace('Bearer ', '')
    
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const unreadOnly = searchParams.get('unreadOnly') === 'true'
    const category = searchParams.get('category')
    
    const skip = (page - 1) * limit
    
    // Build where clause
    const where: any = {
      userId,
      isArchived: false
    }
    
    if (unreadOnly) {
      where.isRead = false
    }
    
    if (category) {
      where.category = category
    }
    
    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.notification.count({ where }),
      prisma.notification.count({ 
        where: { 
          userId, 
          isRead: false, 
          isArchived: false 
        } 
      })
    ])
    
    return NextResponse.json({
      notifications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      unreadCount
    })
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    )
  }
}

// POST - Create notification (for internal use)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      userId,
      title,
      message,
      type,
      category,
      relatedId,
      relatedType,
      priority = 'NORMAL'
    } = body
    
    // Validate required fields
    if (!userId || !title || !message || !type || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Create notification
    const notification = await prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type,
        category,
        relatedId,
        relatedType,
        priority
      }
    })
    
    return NextResponse.json({
      notification,
      message: 'Notification created successfully'
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating notification:', error)
    return NextResponse.json(
      { error: 'Failed to create notification' },
      { status: 500 }
    )
  }
} 