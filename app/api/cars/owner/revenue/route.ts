import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { db } from '@/lib/db'
import { cars, bookings } from '@/drizzle/schema'
import { eq, and, sql, gte, lte } from 'drizzle-orm'

// GET - Fetch car owner revenue data
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({
        error: 'Unauthorized',
        revenue: { total: 0, monthly: [], daily: [], byCar: [] }
      }, { status: 401 })
    }
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
        revenue: { total: 0, monthly: [], daily: [], byCar: [] }
      })
    }
    let whereConditions = [
      eq(bookings.serviceType, 'CAR'),
      sql`${bookings.serviceId} IN (${carIds.join(',')})`,
      eq(bookings.paymentStatus, 'PAID')
    ]
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    if (startDate) {
      whereConditions.push(gte(bookings.createdAt, startDate))
    }
    if (endDate) {
      whereConditions.push(lte(bookings.createdAt, endDate))
    }
    let totalRevenue = 0
    let monthlyRevenue = []
    let dailyRevenue = []
    let revenueByCar = []
    try {
      // Get total revenue
      const totalRevenueResult = await db
        .select({ total: sql`sum(totalPrice)` })
        .from(bookings)
        .where(and(...whereConditions))
      totalRevenue = totalRevenueResult[0]?.total || 0
      // Get monthly revenue
      monthlyRevenue = await db
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
      dailyRevenue = await db
        .select({
          date: sql`strftime('%Y-%m-%d', createdAt)`,
          revenue: sql`sum(totalPrice)`,
          bookings: sql`count(*)`
        })
        .from(bookings)
        .where(and(
          eq(bookings.serviceType, 'CAR'),
          sql`${bookings.serviceId} IN (${carIds.join(',')})`,
          eq(bookings.paymentStatus, 'PAID'),
          sql`strftime('%Y-%m', createdAt) = ${currentMonth}`
        ))
        .groupBy(sql`strftime('%Y-%m-%d', createdAt)`)
        .orderBy(sql`strftime('%Y-%m-%d', createdAt)`)
      // Get revenue by car
      revenueByCar = await db
        .select({
          carId: bookings.serviceId,
          carName: sql`${cars.make} ${cars.model}`,
          revenue: sql`sum(bookings.totalPrice)`,
          bookings: sql`count(*)`
        })
        .from(bookings)
        .leftJoin(cars, eq(bookings.serviceId, cars.id))
        .where(and(...whereConditions))
        .groupBy(bookings.serviceId)
    } catch (e) {
      console.error('Error fetching revenue data:', e)
      totalRevenue = 0
      monthlyRevenue = []
      dailyRevenue = []
      revenueByCar = []
    }
    const revenue = {
      total: typeof totalRevenue === 'number' ? totalRevenue : 0,
      monthly: Array.isArray(monthlyRevenue) ? monthlyRevenue : [],
      daily: Array.isArray(dailyRevenue) ? dailyRevenue : [],
      byCar: Array.isArray(revenueByCar) ? revenueByCar : []
    }
    return NextResponse.json({ revenue })
  } catch (error) {
    console.error('Error in car owner revenue API:', error)
    return NextResponse.json({
      error: 'Failed to fetch revenue',
      revenue: { total: 0, monthly: [], daily: [], byCar: [] }
    }, { status: 500 })
  }
} 