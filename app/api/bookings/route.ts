import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { db } from '@/lib/db'
import { bookings, users, hotels, cars, tours } from '@/drizzle/schema'
import { eq, and, desc, asc } from 'drizzle-orm'

// GET - Fetch bookings
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
    const type = searchParams.get('type')
    const limit = parseInt(searchParams.get('limit') || '10')
    const page = parseInt(searchParams.get('page') || '1')

    let whereConditions = [eq(bookings.userId, parseInt(session.user.id))]

    if (status) {
      whereConditions.push(eq(bookings.status, status))
    }

    if (type) {
      whereConditions.push(eq(bookings.serviceType, type))
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
        totalPrice: bookings.totalPrice, // Use totalPrice instead of totalAmount
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

    // Get total count for pagination
    const totalCount = await db
      .select({ count: bookings.id })
      .from(bookings)
      .where(and(...whereConditions))

    const totalPages = Math.ceil(totalCount.length / limit)

    return NextResponse.json({
      bookings: bookingsData,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount: totalCount.length,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      }
    })
  } catch (error) {
    console.error('Error fetching bookings:', error)
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

// POST - Create new booking
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
      serviceType,
      serviceId,
      startDate,
      endDate,
      totalAmount, // Accept totalAmount from frontend
      specialRequests
    } = body

    // Validate required fields
    if (!serviceType || !serviceId || !startDate || !totalAmount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create booking
    const [newBooking] = await db
      .insert(bookings)
      .values({
        userId: parseInt(session.user.id),
        serviceType,
        serviceId: parseInt(serviceId),
        startDate: new Date(startDate).toISOString(),
        endDate: endDate ? new Date(endDate).toISOString() : null,
        totalPrice: parseFloat(totalAmount), // Map totalAmount to totalPrice
        status: 'PENDING',
        paymentStatus: 'PENDING',
        specialRequests: specialRequests || null,
      })
      .returning()

    return NextResponse.json({
      booking: newBooking,
      message: 'Booking created successfully'
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    )
  }
} 