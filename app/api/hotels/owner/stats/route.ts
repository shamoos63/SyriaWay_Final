import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { db } from '@/lib/db'
import { hotels, bookings, rooms, reviews } from '@/drizzle/schema'
import { eq, and, sql } from 'drizzle-orm'

// GET - Fetch hotel owner statistics
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

    // Get user's hotels
    const userHotels = await db
      .select({ id: hotels.id })
      .from(hotels)
      .where(eq(hotels.ownerId, userId))

    const hotelIds = userHotels.map(hotel => hotel.id)

    if (hotelIds.length === 0) {
      return NextResponse.json({
        stats: {
          totalHotels: 0,
          totalRooms: 0,
          totalBookings: 0,
          totalRevenue: 0,
          averageRating: 0,
          activeBookings: 0,
          completedBookings: 0,
          cancelledBookings: 0,
        }
      })
    }

    // Get total rooms
    const totalRoomsResult = await db
      .select({ count: sql`count(*)` })
      .from(rooms)
      .where(sql`${rooms.hotelId} IN (${hotelIds.join(',')})`)

    const totalRooms = totalRoomsResult[0]?.count || 0

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
        eq(bookings.serviceType, 'HOTEL'),
        sql`${bookings.serviceId} IN (${hotelIds.join(',')})`
      ))

    // Get average rating
    const avgRatingResult = await db
      .select({ avgRating: sql`avg(rating)` })
      .from(reviews)
      .where(and(
        eq(reviews.serviceType, 'HOTEL'),
        sql`${reviews.serviceId} IN (${hotelIds.join(',')})`
      ))

    const stats = {
      totalHotels: hotelIds.length,
      totalRooms: totalRooms,
      totalBookings: bookingStats[0].totalBookings || 0,
      totalRevenue: bookingStats[0].totalRevenue || 0,
      averageRating: avgRatingResult[0].avgRating || 0,
      activeBookings: bookingStats[0].activeBookings || 0,
      completedBookings: bookingStats[0].completedBookings || 0,
      cancelledBookings: bookingStats[0].cancelledBookings || 0,
    }

    return NextResponse.json({ stats })
  } catch (error) {
    console.error('Error fetching hotel stats:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch stats',
        stats: {
          totalHotels: 0,
          totalRooms: 0,
          totalBookings: 0,
          totalRevenue: 0,
          averageRating: 0,
          activeBookings: 0,
          completedBookings: 0,
          cancelledBookings: 0,
        }
      },
      { status: 500 }
    )
  }
} 