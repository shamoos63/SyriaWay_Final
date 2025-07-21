import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { db } from '@/lib/db'
import { specialTourRequests, users } from '@/drizzle/schema'
import { eq, and, desc } from 'drizzle-orm'

// GET - Fetch all special tour requests (admin only)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is admin (you might want to add role checking here)
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '10')
    const page = parseInt(searchParams.get('page') || '1')

    let whereConditions = []

    if (status) {
      whereConditions.push(eq(specialTourRequests.status, status))
    }

    const offset = (page - 1) * limit

    const requestsData = await db
      .select({
        id: specialTourRequests.id,
        userId: specialTourRequests.userId,
        guideId: specialTourRequests.guideId,
        title: specialTourRequests.title,
        description: specialTourRequests.description,
        duration: specialTourRequests.duration,
        maxCapacity: specialTourRequests.maxCapacity,
        budget: specialTourRequests.budget,
        startDate: specialTourRequests.startDate,
        endDate: specialTourRequests.endDate,
        location: specialTourRequests.location,
        specialRequirements: specialTourRequests.specialRequirements,
        status: specialTourRequests.status,
        createdAt: specialTourRequests.createdAt,
        updatedAt: specialTourRequests.updatedAt,
        user: {
          id: users.id,
          name: users.name,
          email: users.email,
          image: users.image,
        }
      })
      .from(specialTourRequests)
      .leftJoin(users, eq(specialTourRequests.userId, users.id))
      .where(whereConditions.length > 0 ? whereConditions[0] : undefined)
      .orderBy(desc(specialTourRequests.createdAt))
      .limit(limit)
      .offset(offset)

    // Get total count for pagination
    const totalCount = await db
      .select({ count: specialTourRequests.id })
      .from(specialTourRequests)
      .where(whereConditions.length > 0 ? whereConditions[0] : undefined)

    const totalPages = Math.ceil(totalCount.length / limit)

    return NextResponse.json({
      requests: requestsData,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount: totalCount.length,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      }
    })
  } catch (error) {
    console.error('Error fetching admin special tour requests:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch special tour requests',
        requests: [],
        pagination: {
          currentPage: 1,
          totalPages: 0,
          totalCount: 0,
          hasNextPage: false,
          hasPrevPage: false,
        }
      },
      { status: 500 }
    )
  }
}

// PUT - Update special tour request status (admin only)
export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    let userId = authHeader.replace('Bearer ', '')
    
    // For demo purposes, allow demo-user-id
    if (userId === 'demo-user-id') {
      userId = 'demo-user-id'
    }

    // Check if user is admin
    const user = await db.select().from(users).where(eq(users.id, userId))

    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const body = await request.json()
    const { requestId, status, guideId, notes } = body

    if (!requestId) {
      return NextResponse.json(
        { error: 'Request ID is required' },
        { status: 400 }
      )
    }

    // Check if request exists
    const existingRequest = await db.select().from(specialTourRequests).where(eq(specialTourRequests.id, requestId))

    if (!existingRequest) {
      return NextResponse.json(
        { error: 'Special tour request not found' },
        { status: 404 }
      )
    }

    // Update request
    const updateData: any = {
      status: status || existingRequest.status,
      updatedAt: new Date()
    }

    // Only update guideId if provided and different from current
    if (guideId && guideId !== existingRequest.guideId) {
      updateData.guideId = guideId
    }

    const updatedRequest = await db.update(specialTourRequests).set(updateData).where(eq(specialTourRequests.id, requestId))

    return NextResponse.json({
      success: true,
      message: 'Special tour request updated successfully',
      request: {
        id: updatedRequest.id,
        customerName: updatedRequest.customerName,
        customerEmail: updatedRequest.customerEmail,
        tourType: updatedRequest.tourType,
        status: updatedRequest.status,
        guide: updatedRequest.guide ? {
          id: updatedRequest.guide.id,
          name: updatedRequest.guide.user.name,
          email: updatedRequest.guide.user.email
        } : null
      }
    })
  } catch (error) {
    console.error('Error updating special tour request:', error)
    return NextResponse.json(
      { error: 'Failed to update special tour request' },
      { status: 500 }
    )
  }
} 