import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { db } from '@/lib/db'
import { umrahRequests, users } from '@/drizzle/schema'
import { eq, and, desc } from 'drizzle-orm'

// GET - Fetch all Umrah requests (admin only)
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
      whereConditions.push(eq(umrahRequests.status, status))
    }

    const offset = (page - 1) * limit

    const requestsData = await db
      .select({
        id: umrahRequests.id,
        userId: umrahRequests.userId,
        packageId: umrahRequests.packageId,
        startDate: umrahRequests.startDate,
        endDate: umrahRequests.endDate,
        numberOfPeople: umrahRequests.numberOfPeople,
        specialRequests: umrahRequests.specialRequests,
        status: umrahRequests.status,
        createdAt: umrahRequests.createdAt,
        updatedAt: umrahRequests.updatedAt,
        user: {
          id: users.id,
          name: users.name,
          email: users.email,
          image: users.image,
        }
      })
      .from(umrahRequests)
      .leftJoin(users, eq(umrahRequests.userId, users.id))
      .where(whereConditions.length > 0 ? whereConditions[0] : undefined)
      .orderBy(desc(umrahRequests.createdAt))
      .limit(limit)
      .offset(offset)

    // Get total count for pagination
    const totalCount = await db
      .select({ count: umrahRequests.id })
      .from(umrahRequests)
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
    console.error('Error fetching admin Umrah requests:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch Umrah requests',
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