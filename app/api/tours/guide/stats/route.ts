import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { db } from '@/lib/db'
import { tours, bookings } from '@/drizzle/schema'
import { eq, and, sql } from 'drizzle-orm'

// Helper to extract user id from session
function getUserId(session: any): number {
  return parseInt(session?.user?.id || session?.user?.userId || '0');
}

// GET - Fetch tour guide statistics
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

    // Get user's tours
    const userTours = await db
      .select({ id: tours.id })
      .from(tours)
      .where(eq(tours.guideId, userId))

    const tourIds = userTours.map(tour => tour.id)

    if (tourIds.length === 0) {
      return NextResponse.json({
        stats: {
          totalTours: 0,
          totalBookings: 0,
          totalRevenue: 0,
          averageRating: 0,
          activeBookings: 0,
          completedBookings: 0,
          cancelledBookings: 0,
          activeTours: 0,
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
        eq(bookings.serviceType, 'TOUR'),
        sql`${bookings.serviceId} IN (${tourIds.join(',')})`
      ))

    // Get active tours count
    const activeToursResult = await db
      .select({ count: sql`count(*)` })
      .from(tours)
      .where(and(
        sql`${tours.id} IN (${tourIds.join(',')})`,
        eq(tours.isActive, true)
      ))

    const stats = {
      totalTours: tourIds.length,
      totalBookings: bookingStats[0].totalBookings || 0,
      totalRevenue: bookingStats[0].totalRevenue || 0,
      averageRating: 0, // Tours don't have ratings in this schema
      activeBookings: bookingStats[0].activeBookings || 0,
      completedBookings: bookingStats[0].completedBookings || 0,
      cancelledBookings: bookingStats[0].cancelledBookings || 0,
      activeTours: activeToursResult[0].count || 0,
    }

    return NextResponse.json({ stats })
  } catch (error) {
    console.error('Error fetching tour stats:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch stats',
        stats: {
          totalTours: 0,
          totalBookings: 0,
          totalRevenue: 0,
          averageRating: 0,
          activeBookings: 0,
          completedBookings: 0,
          cancelledBookings: 0,
          activeTours: 0,
        }
      },
      { status: 500 }
    )
  }
} 