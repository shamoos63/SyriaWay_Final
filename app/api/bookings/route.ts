import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { db } from '@/lib/db'
import { bookings, users, hotels, cars, tours } from '@/drizzle/schema'
import { eq, and, desc, asc } from 'drizzle-orm'
import { ServiceType } from '@/drizzle/schema'

// Helper to extract user id from session
function getUserId(session: any): number {
  return parseInt(session?.user?.id || session?.user?.userId || '0');
}

// GET - Fetch bookings
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
    const type = searchParams.get('type')
    const limit = parseInt(searchParams.get('limit') || '10')
    const page = parseInt(searchParams.get('page') || '1')

    let whereConditions = [eq(bookings.userId, userId)]

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
  let body: any = null;
  
  try {
    const session = await getServerSession(authOptions)
    
    const userId = getUserId(session);
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    body = await request.json()
    
    const {
      serviceType,
      serviceId,
      hotelId,
      roomId,
      bundleId,
      startDate,
      endDate,
      totalAmount,
      totalPrice,
      specialRequests,
      guests,
      contactPhone,
      status
    } = body

    // Validate serviceType
    if (!serviceType || !Object.values(ServiceType).includes(serviceType)) {
      return NextResponse.json(
        { error: `Invalid serviceType. Must be one of: ${Object.values(ServiceType).join(', ')}` },
        { status: 400 }
      )
    }

    // Determine the actual serviceId based on service type
    let actualServiceId = serviceId
    if (serviceType === 'HOTEL' && roomId) {
      actualServiceId = roomId
    } else if (serviceType === 'BUNDLE' && bundleId) {
      actualServiceId = bundleId
    }

    // Determine the total price
    const finalTotalPrice = totalAmount || totalPrice

    // Validate required fields
    if (!actualServiceId || !startDate || finalTotalPrice === undefined || finalTotalPrice === null) {
      return NextResponse.json(
        { error: 'Missing required fields: serviceId, startDate, and totalPrice are required' },
        { status: 400 }
      )
    }

    // Validate endDate based on service type
    // For HOTEL and CAR bookings, endDate is required
    // For TOUR bookings, endDate should come from the tour data
    if ((serviceType === 'HOTEL' || serviceType === 'CAR') && !endDate) {
      return NextResponse.json(
        { error: 'endDate is required for hotel and car bookings' },
        { status: 400 }
      )
    }

    // Validate numeric fields
    if (isNaN(parseInt(actualServiceId))) {
      return NextResponse.json(
        { error: 'serviceId must be a valid number' },
        { status: 400 }
      )
    }

    if (isNaN(parseFloat(finalTotalPrice))) {
      return NextResponse.json(
        { error: 'totalPrice must be a valid number' },
        { status: 400 }
      )
    }

    // Validate that totalPrice is not negative
    if (parseFloat(finalTotalPrice) < 0) {
      return NextResponse.json(
        { error: 'totalPrice cannot be negative' },
        { status: 400 }
      )
    }

    // Create booking
    const [newBooking] = await db
      .insert(bookings)
      .values({
        userId,
        serviceType,
        serviceId: parseInt(actualServiceId),
        startDate: new Date(startDate).toISOString(),
        endDate: endDate ? new Date(endDate).toISOString() : new Date(startDate).toISOString(), // Use startDate as fallback
        totalPrice: parseFloat(finalTotalPrice),
        status: status || 'PENDING',
        paymentStatus: 'PENDING',
        specialRequests: specialRequests ? String(specialRequests) : '',
        numberOfPeople: guests ? parseInt(guests) : 1,
        contactPhone: contactPhone || '',
        contactEmail: session?.user?.email || '',
      })
      .returning()

    return NextResponse.json({
      booking: newBooking,
      message: 'Booking created successfully'
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating booking:', error)
    console.error('Request body:', body)
    return NextResponse.json(
      { error: 'Failed to create booking', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 