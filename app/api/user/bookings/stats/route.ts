import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { db } from '@/lib/db'
import { bookings } from '@/drizzle/schema'
import { eq, and, gte, lte } from 'drizzle-orm'
import { sql } from 'drizzle-orm'

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
    const period = searchParams.get('period') || 'all' // all, month, year

    let dateFilter = undefined

    if (period === 'month') {
      const oneMonthAgo = new Date()
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
      dateFilter = gte(bookings.createdAt, oneMonthAgo.toISOString())
    } else if (period === 'year') {
      const oneYearAgo = new Date()
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
      dateFilter = gte(bookings.createdAt, oneYearAgo.toISOString())
    }

    let whereConditions = [eq(bookings.userId, parseInt(session.user.id))]
    if (dateFilter) {
      whereConditions.push(dateFilter)
    }

    // Get total bookings count
    const totalBookings = await db
      .select({ count: sql`count(*)` })
      .from(bookings)
      .where(and(...whereConditions))

    // Get bookings by status
    const bookingsByStatus = await db
      .select({
        status: bookings.status,
        count: sql`count(*)`,
      })
      .from(bookings)
      .where(and(...whereConditions))
      .groupBy(bookings.status)

    // Get bookings by service type
    const bookingsByService = await db
      .select({
        serviceType: bookings.serviceType,
        count: sql`count(*)`,
        totalSpent: sql`sum(totalPrice)`,
      })
      .from(bookings)
      .where(and(...whereConditions))
      .groupBy(bookings.serviceType)

    // Get total spent
    const totalSpent = await db
      .select({
        total: sql`sum(totalPrice)`,
      })
      .from(bookings)
      .where(and(
        ...whereConditions,
        eq(bookings.paymentStatus, 'PAID')
      ))

    // Get recent bookings (last 5)
    const recentBookings = await db
      .select({
        id: bookings.id,
        serviceType: bookings.serviceType,
        status: bookings.status,
        totalPrice: bookings.totalPrice,
        createdAt: bookings.createdAt,
      })
      .from(bookings)
      .where(and(...whereConditions))
      .orderBy(bookings.createdAt)
      .limit(5)

    // Get monthly spending for the last 12 months
    const monthlySpending = await db
      .select({
        month: sql`strftime('%Y-%m', createdAt)`,
        total: sql`sum(totalPrice)`,
        count: sql`count(*)`,
      })
      .from(bookings)
      .where(and(
        ...whereConditions,
        eq(bookings.paymentStatus, 'PAID')
      ))
      .groupBy(sql`strftime('%Y-%m', createdAt)`)
      .orderBy(sql`strftime('%Y-%m', createdAt)`)
      .limit(12)

    const stats = {
      totalBookings: totalBookings[0].count,
      totalSpent: totalSpent[0].total || 0,
      bookingsByStatus: bookingsByStatus.reduce((acc, item) => {
        acc[item.status] = item.count
        return acc
      }, {} as Record<string, number>),
      bookingsByService: bookingsByService.reduce((acc, item) => {
        acc[item.serviceType] = {
          count: item.count,
          totalSpent: item.totalSpent || 0,
        }
        return acc
      }, {} as Record<string, any>),
      recentBookings,
      monthlySpending: monthlySpending.reduce((acc, item) => {
        acc[item.month] = {
          total: item.total || 0,
          count: item.count,
        }
        return acc
      }, {} as Record<string, any>),
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching booking stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch booking stats' },
      { status: 500 }
    )
  }
} 