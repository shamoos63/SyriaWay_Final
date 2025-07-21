import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { db } from '@/lib/db'
import { umrahRequests, umrahPackages } from '@/drizzle/schema'
import { eq, and, desc } from 'drizzle-orm'

// GET - Fetch Umrah requests for the authenticated user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '10')
    const page = parseInt(searchParams.get('page') || '1')

    let whereConditions = [eq(umrahRequests.userId, parseInt(session.user.id))]

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
        package: {
          id: umrahPackages.id,
          name: umrahPackages.name,
          description: umrahPackages.description,
          duration: umrahPackages.duration,
          price: umrahPackages.price,
        }
      })
      .from(umrahRequests)
      .leftJoin(umrahPackages, eq(umrahRequests.packageId, umrahPackages.id))
      .where(and(...whereConditions))
      .orderBy(desc(umrahRequests.createdAt))
      .limit(limit)
      .offset(offset)

    // Get total count for pagination
    const totalCount = await db
      .select({ count: umrahRequests.id })
      .from(umrahRequests)
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
    console.error('Error fetching Umrah requests:', error)
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

// POST - Create new Umrah request
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
    const {
      packageId,
      startDate,
      endDate,
      numberOfPeople,
      specialRequests
    } = body

    // Validate required fields
    if (!packageId || !startDate || !endDate || !numberOfPeople) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if package exists
    const [package] = await db
      .select()
      .from(umrahPackages)
      .where(eq(umrahPackages.id, parseInt(packageId)))

    if (!package) {
      return NextResponse.json(
        { error: 'Umrah package not found' },
        { status: 404 }
      )
    }

    // Create Umrah request
    const [newRequest] = await db
      .insert(umrahRequests)
      .values({
        userId: parseInt(session.user.id),
        packageId: parseInt(packageId),
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        numberOfPeople: parseInt(numberOfPeople),
        specialRequests: specialRequests || null,
        status: 'PENDING',
      })
      .returning()

    return NextResponse.json({
      request: newRequest,
      message: 'Umrah request created successfully'
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating Umrah request:', error)
    return NextResponse.json(
      { error: 'Failed to create Umrah request' },
      { status: 500 }
    )
  }
} 