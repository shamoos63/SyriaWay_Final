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
    
    if (!session?.user?.email) {
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

    // First, get the basic requests data
    const requestsData = await db
      .select({
        id: specialTourRequests.id,
        userId: specialTourRequests.userId,
        assignedGuideId: specialTourRequests.assignedGuideId,
        title: specialTourRequests.title,
        description: specialTourRequests.description,
        preferredDates: specialTourRequests.preferredDates,
        numberOfPeople: specialTourRequests.numberOfPeople,
        budget: specialTourRequests.budget,
        currency: specialTourRequests.currency,
        destinations: specialTourRequests.destinations,
        specialRequirements: specialTourRequests.specialRequirements,
        status: specialTourRequests.status,
        response: specialTourRequests.response,
        respondedAt: specialTourRequests.respondedAt,
        createdAt: specialTourRequests.createdAt,
        updatedAt: specialTourRequests.updatedAt,
      })
      .from(specialTourRequests)
      .where(whereConditions.length > 0 ? whereConditions[0] : undefined)
      .orderBy(desc(specialTourRequests.createdAt))
      .limit(limit)
      .offset(offset)

    // Get total count for pagination
    const totalCountArr = await db
      .select()
      .from(specialTourRequests)
      .where(whereConditions.length > 0 ? whereConditions[0] : undefined)
    const totalCount = totalCountArr.length
    const totalPages = Math.ceil(totalCount / limit)

    // Now fetch related data separately to avoid complex joins
    const userIds = [...new Set(requestsData.map(r => r.userId))]
    const guideIds = [...new Set(requestsData.map(r => r.assignedGuideId).filter(id => id !== null))]

    let usersData = []
    let guidesData = []

    if (userIds.length > 0) {
      usersData = await db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          phone: users.phone,
        })
        .from(users)
        .where(userIds.length === 1 ? eq(users.id, userIds[0]) : undefined)
    }

    if (guideIds.length > 0) {
      guidesData = await db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
        })
        .from(users)
        .where(guideIds.length === 1 ? eq(users.id, guideIds[0]) : undefined)
    }

    // Create maps for easy lookup
    const usersMap = new Map(usersData.map(u => [u.id, u]))
    const guidesMap = new Map(guidesData.map(g => [g.id, g]))

    // Combine the data
    const formattedRequests = requestsData.map(request => ({
      ...request,
      user: usersMap.get(request.userId) || null,
      guide: request.assignedGuideId ? guidesMap.get(request.assignedGuideId) || null : null,
    }))

    return NextResponse.json({
      requests: formattedRequests,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount: totalCount,
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
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    // Check if user is admin
    const userArr = await db.select().from(users).where(eq(users.email, session.user.email))
    const user = userArr[0]
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

    const existingRequestArr = await db.select().from(specialTourRequests).where(eq(specialTourRequests.id, requestId))
    const existingRequest = existingRequestArr[0]
    if (!existingRequest) {
      return NextResponse.json(
        { error: 'Special tour request not found' },
        { status: 404 }
      )
    }
    // Update request
    const updateData: any = {
      status: status || existingRequest.status,
      updatedAt: new Date().toISOString()
    }
    // Only update guideId if provided and different from current
    if (guideId && 'guideId' in existingRequest && guideId !== (existingRequest as any).guideId) {
      updateData.guideId = guideId
    }
    const [updatedRequest] = await db.update(specialTourRequests).set(updateData).where(eq(specialTourRequests.id, requestId)).returning()
    return NextResponse.json({
      success: true,
      message: 'Special tour request updated successfully',
      request: updatedRequest
    })
  } catch (error) {
    console.error('Error updating special tour request:', error)
    return NextResponse.json(
      { error: 'Failed to update special tour request' },
      { status: 500 }
    )
  }
} 