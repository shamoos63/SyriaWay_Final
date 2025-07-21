import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { db } from '@/lib/db'
import { bookings } from '@/drizzle/schema'
import { eq, and, gte, lte } from 'drizzle-orm'

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
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const serviceType = searchParams.get('serviceType')

    let whereConditions = [eq(bookings.userId, parseInt(session.user.id))]

    // Filter by date range
    if (startDate) {
      whereConditions.push(gte(bookings.createdAt, startDate))
    }

    if (endDate) {
      whereConditions.push(lte(bookings.createdAt, endDate))
    }

    // Filter by service type
    if (serviceType) {
      whereConditions.push(eq(bookings.serviceType, serviceType))
    }

    const spendingData = await db
      .select({
        id: bookings.id,
        serviceType: bookings.serviceType,
        serviceId: bookings.serviceId,
        startDate: bookings.startDate,
        endDate: bookings.endDate,
        totalPrice: bookings.totalPrice,
        currency: bookings.currency,
        status: bookings.status,
        paymentStatus: bookings.paymentStatus,
        numberOfPeople: bookings.numberOfPeople,
        createdAt: bookings.createdAt,
      })
      .from(bookings)
      .where(and(...whereConditions))
      .orderBy(bookings.createdAt)

    // Calculate totals
    const totalSpent = spendingData.reduce((sum, booking) => {
      if (booking.paymentStatus === 'PAID') {
        return sum + booking.totalPrice
      }
      return sum
    }, 0)

    const totalBookings = spendingData.length
    const completedBookings = spendingData.filter(b => b.status === 'COMPLETED').length
    const pendingBookings = spendingData.filter(b => b.status === 'PENDING').length

    // Group by service type
    const spendingByService = spendingData.reduce((acc, booking) => {
      const serviceType = booking.serviceType
      if (!acc[serviceType]) {
        acc[serviceType] = {
          count: 0,
          totalSpent: 0,
          bookings: []
        }
      }
      acc[serviceType].count++
      if (booking.paymentStatus === 'PAID') {
        acc[serviceType].totalSpent += booking.totalPrice
      }
      acc[serviceType].bookings.push(booking)
      return acc
    }, {} as Record<string, any>)

    return NextResponse.json({
      spending: spendingData,
      summary: {
        totalSpent,
        totalBookings,
        completedBookings,
        pendingBookings,
        spendingByService
      }
    })
  } catch (error) {
    console.error('Error fetching user spending:', error)
    return NextResponse.json(
      { error: 'Failed to fetch spending data' },
      { status: 500 }
    )
  }
} 