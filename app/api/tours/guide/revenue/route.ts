import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { db } from '@/lib/db'
import { tours, bookings } from '@/drizzle/schema'
import { eq, and, sql, gte, lte } from 'drizzle-orm'

// Helper to extract user id from session
function getUserId(session: any): number {
  return parseInt(session?.user?.id || session?.user?.userId || '0');
}

// GET - Fetch tour guide revenue data
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
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const period = searchParams.get('period') || 'month'

    // Get user's tours
    const userTours = await db
      .select({ id: tours.id })
      .from(tours)
      .where(eq(tours.guideId, userId))

    const tourIds = userTours.map(tour => tour.id)

    if (tourIds.length === 0) {
      return NextResponse.json({
        revenue: {
          total: 0,
          monthly: [],
          daily: [],
          byTour: []
        }
      })
    }

    let whereConditions = [
      eq(bookings.serviceType, 'TOUR'),
      sql`${bookings.serviceId} IN (${tourIds.join(',')})`,
      eq(bookings.paymentStatus, 'PAID')
    ]

    if (startDate) {
      whereConditions.push(gte(bookings.createdAt, startDate))
    }

    if (endDate) {
      whereConditions.push(lte(bookings.createdAt, endDate))
    }

    // Get total revenue
    const totalRevenueResult = await db
      .select({ total: sql`sum(totalPrice)` })
      .from(bookings)
      .where(and(...whereConditions))

    const totalRevenue = totalRevenueResult[0].total || 0

    // Get monthly revenue
    const monthlyRevenue = await db
      .select({
        month: sql`strftime('%Y-%m', createdAt)`,
        revenue: sql`sum(totalPrice)`,
        bookings: sql`count(*)`
      })
      .from(bookings)
      .where(and(...whereConditions))
      .groupBy(sql`strftime('%Y-%m', createdAt)`)
      .orderBy(sql`strftime('%Y-%m', createdAt)`)

    // Get daily revenue for current month
    const currentDate = new Date()
    const currentMonth = currentDate.toISOString().slice(0, 7)
    
    const dailyRevenue = await db
      .select({
        date: sql`strftime('%Y-%m-%d', createdAt)`,
        revenue: sql`sum(totalPrice)`,
        bookings: sql`count(*)`
      })
      .from(bookings)
      .where(and(
        eq(bookings.serviceType, 'TOUR'),
        sql`${bookings.serviceId} IN (${tourIds.join(',')})`,
        eq(bookings.paymentStatus, 'PAID'),
        sql`strftime('%Y-%m', createdAt) = ${currentMonth}`
      ))
      .groupBy(sql`strftime('%Y-%m-%d', createdAt)`)
      .orderBy(sql`strftime('%Y-%m-%d', createdAt)`)

    // Get revenue by tour
    const revenueByTour = await db
      .select({
        tourId: bookings.serviceId,
        tourName: tours.name,
        revenue: sql`sum(bookings.totalPrice)`,
        bookings: sql`count(*)`
      })
      .from(bookings)
      .leftJoin(tours, eq(bookings.serviceId, tours.id))
      .where(and(...whereConditions))
      .groupBy(bookings.serviceId, tours.name)

    const revenue = {
      total: totalRevenue,
      monthly: monthlyRevenue,
      daily: dailyRevenue,
      byTour: revenueByTour
    }

    return NextResponse.json({ revenue })
  } catch (error) {
    console.error('Error fetching tour revenue:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch revenue',
        revenue: {
          total: 0,
          monthly: [],
          daily: [],
          byTour: []
        }
      },
      { status: 500 }
    )
  }
} 