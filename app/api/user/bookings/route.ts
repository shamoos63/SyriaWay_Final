import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { db } from '@/lib/db'
import { bookings } from '@/drizzle/schema'
import { eq, and, gte, lte } from 'drizzle-orm'
import { sql } from 'drizzle-orm'

// Helper to extract user id from session
function getUserId(session: any): number {
  return parseInt(session?.user?.id || session?.user?.userId || '0');
}

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
    const serviceType = searchParams.get('serviceType')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const limit = parseInt(searchParams.get('limit') || '10')
    const page = parseInt(searchParams.get('page') || '1')

    let whereConditions = [eq(bookings.userId, userId)]

    if (status) {
      whereConditions.push(eq(bookings.status, status))
    }

    if (serviceType) {
      whereConditions.push(eq(bookings.serviceType, serviceType))
    }

    if (startDate) {
      whereConditions.push(gte(bookings.startDate, startDate))
    }

    if (endDate) {
      whereConditions.push(lte(bookings.endDate, endDate))
    }

    const offset = (page - 1) * limit

    const userBookings = await db
      .select({
        id: bookings.id,
        serviceType: bookings.serviceType,
        serviceId: bookings.serviceId,
        startDate: bookings.startDate,
        endDate: bookings.endDate,
        totalPrice: bookings.totalPrice,
        currency: bookings.currency,
        status: bookings.status,
        paymentStatus: bookings.paymentStatus,
        specialRequests: bookings.specialRequests,
        numberOfPeople: bookings.numberOfPeople,
        contactPhone: bookings.contactPhone,
        contactEmail: bookings.contactEmail,
        cancellationReason: bookings.cancellationReason,
        refundAmount: bookings.refundAmount,
        createdAt: bookings.createdAt,
        updatedAt: bookings.updatedAt,
      })
      .from(bookings)
      .where(and(...whereConditions))
      .orderBy(bookings.createdAt)
      .limit(limit)
      .offset(offset)

    // Get total count for pagination
    const totalCount = await db
      .select({ count: sql`count(*)` })
      .from(bookings)
      .where(and(...whereConditions))

    const totalPages = Math.ceil(Number(totalCount[0].count) / limit)

    return NextResponse.json({
      bookings: userBookings,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount: Number(totalCount[0].count),
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      }
    })
  } catch (error) {
    console.error('Error fetching user bookings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
} 