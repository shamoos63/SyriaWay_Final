import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { db } from '@/lib/db'
import { cars, bookings, users } from '@/drizzle/schema'
import { eq, and, desc, sql } from 'drizzle-orm'

// GET - Fetch customers for cars owned by the authenticated user
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
    const limit = parseInt(searchParams.get('limit') || '10')
    const page = parseInt(searchParams.get('page') || '1')

    const userId = parseInt(session.user.id)

    // Get user's cars
    const userCars = await db
      .select({ id: cars.id })
      .from(cars)
      .where(eq(cars.ownerId, userId))

    const carIds = userCars.map(car => car.id)

    if (carIds.length === 0) {
      return NextResponse.json({
        customers: [],
        pagination: {
          currentPage: page,
          totalPages: 0,
          totalCount: 0,
          hasNextPage: false,
          hasPrevPage: false,
        }
      })
    }

    const offset = (page - 1) * limit

    // Get unique customers with their booking stats
    const customersData = await db
      .select({
        userId: users.id,
        name: users.name,
        email: users.email,
        image: users.image,
        totalBookings: sql`count(bookings.id)`,
        totalSpent: sql`sum(bookings.totalPrice)`,
        lastBooking: sql`max(bookings.createdAt)`,
      })
      .from(users)
      .leftJoin(bookings, eq(users.id, bookings.userId))
      .where(and(
        eq(bookings.serviceType, 'CAR'),
        sql`${bookings.serviceId} IN (${carIds.join(',')})`
      ))
      .groupBy(users.id, users.name, users.email, users.image)
      .orderBy(desc(sql`sum(bookings.totalPrice)`))
      .limit(limit)
      .offset(offset)

    // Get total count for pagination
    const totalCountResult = await db
      .select({ count: sql`count(distinct users.id)` })
      .from(users)
      .leftJoin(bookings, eq(users.id, bookings.userId))
      .where(and(
        eq(bookings.serviceType, 'CAR'),
        sql`${bookings.serviceId} IN (${carIds.join(',')})`
      ))

    const totalCount = totalCountResult[0].count
    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      customers: customersData,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      }
    })
  } catch (error) {
    console.error('Error fetching car customers:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch customers',
        customers: [],
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