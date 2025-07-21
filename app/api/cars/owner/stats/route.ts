import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { db } from '@/lib/db'
import { cars, bookings } from '@/drizzle/schema'
import { eq, and, sql } from 'drizzle-orm'

// GET - Fetch car owner statistics
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userId = parseInt(session.user.id)

    // Get user's cars
    const userCars = await db
      .select({ id: cars.id })
      .from(cars)
      .where(eq(cars.ownerId, userId))

    const carIds = userCars.map(car => car.id)

    if (carIds.length === 0) {
      return NextResponse.json({
        stats: {
          totalCars: 0,
          totalBookings: 0,
          totalRevenue: 0,
          averageRating: 0,
          activeBookings: 0,
          completedBookings: 0,
          cancelledBookings: 0,
          availableCars: 0,
        }
      })
    }

    // Get booking statistics
    const bookingStats = await db
      .select({
        totalBookings: sql`count(*)`,
        totalRevenue: sql`sum(totalPrice)`,
        activeBookings: sql`count(CASE WHEN status = 'CONFIRMED' THEN 1 END)`,
        completedBookings: sql`count(CASE WHEN status = 'COMPLETED' THEN 1 END)`,
        cancelledBookings: sql`count(CASE WHEN status = 'CANCELLED' THEN 1 END)`,
      })
      .from(bookings)
      .where(and(
        eq(bookings.serviceType, 'CAR'),
        carIds.length > 0 ? sql`${bookings.serviceId} IN (${carIds.join(',')})` : sql`1 = 0`
      ))

    // Get available cars count
    const availableCarsResult = await db
      .select({ count: sql`count(*)` })
      .from(cars)
      .where(and(
        carIds.length > 0 ? sql`${cars.id} IN (${carIds.join(',')})` : sql`1 = 0`,
        eq(cars.isAvailable, true)
      ))

    const stats = {
      totalCars: carIds.length,
      totalBookings: bookingStats[0].totalBookings || 0,
      totalRevenue: bookingStats[0].totalRevenue || 0,
      averageRating: 0, // Cars don't have ratings in this schema
      activeBookings: bookingStats[0].activeBookings || 0,
      completedBookings: bookingStats[0].completedBookings || 0,
      cancelledBookings: bookingStats[0].cancelledBookings || 0,
      availableCars: availableCarsResult[0].count || 0,
    }

    return NextResponse.json({ stats })
  } catch (error) {
    console.error('Error fetching car stats:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch stats',
        stats: {
          totalCars: 0,
          totalBookings: 0,
          totalRevenue: 0,
          averageRating: 0,
          activeBookings: 0,
          completedBookings: 0,
          cancelledBookings: 0,
          availableCars: 0,
        }
      },
      { status: 500 }
    )
  }
} 