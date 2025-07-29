import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { db } from '@/lib/db'
import { specialTourRequests, users } from '@/drizzle/schema'
import { eq, and, desc } from 'drizzle-orm'

// Helper to extract user id from session
function getUserId(session: any): number {
  return parseInt(session?.user?.id || session?.user?.userId || '0');
}

// GET - Fetch special tour requests for the authenticated guide
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    const userId = getUserId(session);
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '10')
    const page = parseInt(searchParams.get('page') || '1')

    let whereConditions = [eq(specialTourRequests.assignedGuideId, userId)]

    if (status) {
      whereConditions.push(eq(specialTourRequests.status, status))
    }

    const offset = (page - 1) * limit

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
        user: {
          id: users.id,
          name: users.name,
          email: users.email,
          image: users.image,
        }
      })
      .from(specialTourRequests)
      .leftJoin(users, eq(specialTourRequests.userId, users.id))
      .where(and(...whereConditions))
      .orderBy(desc(specialTourRequests.createdAt))
      .limit(limit)
      .offset(offset)

    // Get total count for pagination
    const totalCount = await db
      .select({ count: specialTourRequests.id })
      .from(specialTourRequests)
      .where(and(...whereConditions))

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
    console.error('Error fetching tour requests:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch requests',
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