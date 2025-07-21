import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { db } from '@/lib/db'
import { cars, bookings, users } from '@/drizzle/schema'
import { eq, and, desc, sql } from 'drizzle-orm'

// GET - Fetch bookings for cars owned by the authenticated user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized', bookings: [], pagination: { currentPage: 1, totalPages: 0, totalCount: 0, hasNextPage: false, hasPrevPage: false } },
        { status: 401 }
      )
    }
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '10')
    const page = parseInt(searchParams.get('page') || '1')
    const userId = parseInt(session.user.id)
    // Get user's cars
    let userCars = []
    try {
      userCars = await db
        .select({ id: cars.id })
        .from(cars)
        .where(eq(cars.ownerId, userId))
    } catch (e) {
      console.error('Error fetching user cars:', e)
      userCars = []
    }
    const carIds = userCars.map(car => car.id)
    if (carIds.length === 0) {
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
    let whereConditions = [eq(bookings.serviceType, 'CAR')]
    if (status) {
      whereConditions.push(eq(bookings.status, status))
    }
    const offset = (page - 1) * limit
    let bookingsData = []
    try {
      bookingsData = await db
        .select({
          id: bookings.id,
          userId: bookings.userId,
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
          createdAt: bookings.createdAt,
          updatedAt: bookings.updatedAt,
          user: {
            id: users.id,
            name: users.name,
            email: users.email,
            image: users.image,
          },
          car: {
            id: cars.id,
            make: cars.make,
            model: cars.model,
            year: cars.year,
            color: cars.color,
            licensePlate: cars.licensePlate,
            pricePerDay: cars.pricePerDay,
            currency: cars.currency,
          }
        })
        .from(bookings)
        .leftJoin(users, eq(bookings.userId, users.id))
        .leftJoin(cars, eq(bookings.serviceId, cars.id))
        .where(and(...whereConditions))
        .orderBy(desc(bookings.createdAt))
        .limit(limit)
        .offset(offset)
    } catch (e) {
      console.error('Error fetching bookings:', e)
      bookingsData = []
    }
    const filteredBookings = Array.isArray(bookingsData)
      ? bookingsData.filter(booking => carIds.includes(booking.serviceId))
      : []
    let totalCount = 0
    try {
      const totalCountResult = await db
        .select({ count: sql`count(*)` })
        .from(bookings)
        .where(and(...whereConditions))
      totalCount = totalCountResult[0]?.count || 0
    } catch (e) {
      totalCount = 0
    }
    const totalPages = Math.ceil(totalCount / limit)
    return NextResponse.json({
      bookings: filteredBookings,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      }
    })
  } catch (error) {
    console.error('Error in car owner bookings API:', error)
    return NextResponse.json({
      error: 'Failed to fetch bookings',
      bookings: [],
      pagination: {
        currentPage: 1,
        totalPages: 0,
        totalCount: 0,
        hasNextPage: false,
        hasPrevPage: false,
      }
    }, { status: 500 })
  }
} 