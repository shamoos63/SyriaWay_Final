import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { db } from '@/lib/db'
import { specialTourRequests, users } from '@/drizzle/schema'
import { eq, and } from 'drizzle-orm'

// GET - Fetch a single special tour request by ID (admin only)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is admin
    const userArr = await db.select().from(users).where(eq(users.email, session.user.email))
    const user = userArr[0]
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const { id } = await params

    // First, get the basic request data
    const requestData = await db
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
      .where(eq(specialTourRequests.id, parseInt(id)))
      .limit(1)

    if (!requestData.length) {
      return NextResponse.json(
        { error: 'Special tour request not found' },
        { status: 404 }
      )
    }

    const request = requestData[0]

    // Fetch user data
    const userData = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        phone: users.phone,
      })
      .from(users)
      .where(eq(users.id, request.userId))
      .limit(1)

    // Fetch guide data if assigned
    let guideData = null
    if (request.assignedGuideId) {
      const guideResult = await db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
        })
        .from(users)
        .where(eq(users.id, request.assignedGuideId))
        .limit(1)
      
      guideData = guideResult.length > 0 ? guideResult[0] : null
    }

    const formattedRequest = {
      ...request,
      user: userData.length > 0 ? userData[0] : null,
      guide: guideData,
    }

    return NextResponse.json({
      request: formattedRequest
    })
  } catch (error) {
    console.error('Error fetching special tour request:', error)
    return NextResponse.json(
      { error: 'Failed to fetch special tour request' },
      { status: 500 }
    )
  }
}

// PUT - Update special tour request (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params
    const body = await request.json()

    // Check if request exists
    const [existingRequest] = await db
      .select()
      .from(specialTourRequests)
      .where(eq(specialTourRequests.id, parseInt(id)))

    if (!existingRequest) {
      return NextResponse.json(
        { error: 'Special tour request not found' },
        { status: 404 }
      )
    }

    // Prepare update data
    const updateData: any = {
      updatedAt: new Date().toISOString(),
    }

    if (body.status) {
      updateData.status = body.status
    }

    if (body.assignedGuideId !== undefined) {
      updateData.assignedGuideId = body.assignedGuideId ? parseInt(body.assignedGuideId) : null
    }

    if (body.response) {
      updateData.response = body.response
      updateData.respondedAt = new Date().toISOString()
    }

    if (body.specialRequirements) {
      updateData.specialRequirements = body.specialRequirements
    }

    // Update request
    const [updatedRequest] = await db
      .update(specialTourRequests)
      .set(updateData)
      .where(eq(specialTourRequests.id, parseInt(id)))
      .returning()

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

// DELETE - Delete special tour request (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params

    // Check if request exists
    const [existingRequest] = await db
      .select()
      .from(specialTourRequests)
      .where(eq(specialTourRequests.id, parseInt(id)))

    if (!existingRequest) {
      return NextResponse.json(
        { error: 'Special tour request not found' },
        { status: 404 }
      )
    }

    // Delete request
    await db
      .delete(specialTourRequests)
      .where(eq(specialTourRequests.id, parseInt(id)))

    return NextResponse.json({
      success: true,
      message: 'Special tour request deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting special tour request:', error)
    return NextResponse.json(
      { error: 'Failed to delete special tour request' },
      { status: 500 }
    )
  }
} 