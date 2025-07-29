import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { db } from '@/lib/db'
import { hotels, bookings } from '@/drizzle/schema'
import { eq, and, sql, gte, lte } from 'drizzle-orm'

// Helper to extract user id from session
function getUserId(session: any): number {
  return parseInt(session?.user?.id || session?.user?.userId || '0');
}

// GET - Fetch hotel owner revenue data
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

    // Get user's hotels
    const userHotels = await db
      .select({ id: hotels.id })
      .from(hotels)
      .where(eq(hotels.ownerId, userId))

    const hotelIds = userHotels.map(hotel => hotel.id)

    if (hotelIds.length === 0) {
      return NextResponse.json({
        revenue: {
          total: 0,
          monthly: [],
          daily: [],
          byHotel: []
        }
      })
    }

    let whereConditions = [
      eq(bookings.serviceType, 'HOTEL'),
      sql`${bookings.serviceId} IN (${hotelIds.join(',')})`,
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
        eq(bookings.serviceType, 'HOTEL'),
        sql`${bookings.serviceId} IN (${hotelIds.join(',')})`,
        eq(bookings.paymentStatus, 'PAID'),
        sql`strftime('%Y-%m', createdAt) = ${currentMonth}`
      ))
      .groupBy(sql`strftime('%Y-%m-%d', createdAt)`)
      .orderBy(sql`strftime('%Y-%m-%d', createdAt)`)

    // Get revenue by hotel
    const revenueByHotel = await db
      .select({
        hotelId: bookings.serviceId,
        hotelName: hotels.name,
        revenue: sql`sum(bookings.totalPrice)`,
        bookings: sql`count(*)`
      })
      .from(bookings)
      .leftJoin(hotels, eq(bookings.serviceId, hotels.id))
      .where(and(...whereConditions))
      .groupBy(bookings.serviceId, hotels.name)

    const revenue = {
      total: totalRevenue,
      monthly: monthlyRevenue,
      daily: dailyRevenue,
      byHotel: revenueByHotel
    }

    return NextResponse.json({ revenue })
  } catch (error) {
    console.error('Error fetching hotel revenue:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch revenue',
        revenue: {
          total: 0,
          monthly: [],
          daily: [],
          byHotel: []
        }
      },
      { status: 500 }
    )
  }
} 