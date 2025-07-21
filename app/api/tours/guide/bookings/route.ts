import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { db } from '@/lib/db'
import { tours, bookings, users } from '@/drizzle/schema'
import { eq, and, desc } from 'drizzle-orm'

// GET - Fetch bookings for tours created by the authenticated guide
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

    const userId = parseInt(session.user.id)

    // Get user's tours
    const userTours = await db
      .select({ id: tours.id })
      .from(tours)
      .where(eq(tours.guideId, userId))

    const tourIds = userTours.map(tour => tour.id)

    if (tourIds.length === 0) {
      return NextResponse.json({
        bookings: [],
        pagination: {
          currentPage: page,
          totalPages: 0,
          totalCount: 0,
          hasNextPage: false,
          hasPrevPage: false,
        }
      })
    }

    let whereConditions = [eq(bookings.serviceType, 'TOUR')]

    if (status) {
      whereConditions.push(eq(bookings.status, status))
    }

    const offset = (page - 1) * limit

    const bookingsData = await db
      .select({
        id: bookings.id,
        userId: bookings.userId,
        serviceType: bookings.serviceType,
        serviceId: bookings.serviceId,
        startDate: bookings.startDate,
        endDate: bookings.endDate,
        totalAmount: bookings.totalAmount,
        status: bookings.status,
        paymentStatus: bookings.paymentStatus,
        specialRequests: bookings.specialRequests,
        createdAt: bookings.createdAt,
        updatedAt: bookings.updatedAt,
        user: {
          id: users.id,
          name: users.name,
          email: users.email,
          image: users.image,
        }
      })
      .from(bookings)
      .leftJoin(users, eq(bookings.userId, users.id))
      .where(and(...whereConditions))
      .orderBy(desc(bookings.createdAt))
      .limit(limit)
      .offset(offset)

    // Filter bookings for user's tours
    const filteredBookings = bookingsData.filter(booking => 
      tourIds.includes(booking.serviceId)
    )

    // Get total count for pagination
    const totalCount = await db
      .select({ count: bookings.id })
      .from(bookings)
      .where(and(...whereConditions))

    const totalPages = Math.ceil(totalCount.length / limit)

    return NextResponse.json({
      bookings: filteredBookings,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount: totalCount.length,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      }
    })
  } catch (error) {
    console.error('Error fetching tour bookings:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch bookings',
        bookings: [],
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