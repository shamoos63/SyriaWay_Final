import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@/lib/generated/prisma'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const ownerId = authHeader.replace('Bearer ', '')

    // Find all hotels owned by this user
    const hotels = await prisma.hotel.findMany({
      where: { ownerId },
      select: { id: true, name: true, city: true }
    })
    const hotelIds = hotels.map(h => h.id)

    if (hotelIds.length === 0) {
      return NextResponse.json({
        totalRevenue: 0,
        monthlyRevenue: 0,
        revenueGrowth: 0,
        averagePerBooking: 0,
        totalBookings: 0,
        monthlyBreakdown: [],
        hotelRevenue: [],
        recentTransactions: []
      })
    }

    // Get current date for calculations
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

    // Calculate revenue statistics
    const [
      totalRevenue,
      monthlyRevenue,
      lastMonthRevenue,
      totalBookings,
      monthlyBookings,
      averagePerBooking
    ] = await Promise.all([
      // Total revenue
      prisma.booking.aggregate({
        where: {
          hotelId: { in: hotelIds },
          serviceType: 'HOTEL',
          status: { in: ['CONFIRMED', 'COMPLETED'] }
        },
        _sum: { totalPrice: true }
      }),
      // Monthly revenue
      prisma.booking.aggregate({
        where: {
          hotelId: { in: hotelIds },
          serviceType: 'HOTEL',
          status: { in: ['CONFIRMED', 'COMPLETED'] },
          createdAt: {
            gte: startOfMonth,
            lte: endOfMonth
          }
        },
        _sum: { totalPrice: true }
      }),
      // Last month revenue for growth calculation
      prisma.booking.aggregate({
        where: {
          hotelId: { in: hotelIds },
          serviceType: 'HOTEL',
          status: { in: ['CONFIRMED', 'COMPLETED'] },
          createdAt: {
            gte: startOfLastMonth,
            lte: endOfLastMonth
          }
        },
        _sum: { totalPrice: true }
      }),
      // Total bookings
      prisma.booking.count({
        where: {
          hotelId: { in: hotelIds },
          serviceType: 'HOTEL',
          status: { in: ['CONFIRMED', 'COMPLETED'] }
        }
      }),
      // Monthly bookings
      prisma.booking.count({
        where: {
          hotelId: { in: hotelIds },
          serviceType: 'HOTEL',
          status: { in: ['CONFIRMED', 'COMPLETED'] },
          createdAt: {
            gte: startOfMonth,
            lte: endOfMonth
          }
        }
      }),
      // Average per booking
      prisma.booking.aggregate({
        where: {
          hotelId: { in: hotelIds },
          serviceType: 'HOTEL',
          status: { in: ['CONFIRMED', 'COMPLETED'] }
        },
        _avg: { totalPrice: true }
      })
    ])

    // Calculate revenue growth
    const currentRevenue = monthlyRevenue._sum.totalPrice || 0
    const previousRevenue = lastMonthRevenue._sum.totalPrice || 0
    const revenueGrowth = previousRevenue > 0 
      ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 
      : 0

    // Get monthly breakdown for the last 6 months
    const monthlyBreakdown = []
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0)
      
      const monthData = await prisma.booking.aggregate({
        where: {
          hotelId: { in: hotelIds },
          serviceType: 'HOTEL',
          status: { in: ['CONFIRMED', 'COMPLETED'] },
          createdAt: {
            gte: monthStart,
            lte: monthEnd
          }
        },
        _sum: { totalPrice: true },
        _count: true
      })

      monthlyBreakdown.push({
        month: monthStart.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        revenue: monthData._sum.totalPrice || 0,
        bookings: monthData._count || 0,
        average: monthData._count > 0 ? (monthData._sum.totalPrice || 0) / monthData._count : 0
      })
    }

    // Get revenue by hotel
    const hotelRevenue = await Promise.all(
      hotels.map(async (hotel) => {
        const hotelBookings = await prisma.booking.aggregate({
          where: {
            hotelId: hotel.id,
            serviceType: 'HOTEL',
            status: { in: ['CONFIRMED', 'COMPLETED'] }
          },
          _sum: { totalPrice: true },
          _count: true
        })

        const hotelAvg = await prisma.booking.aggregate({
          where: {
            hotelId: hotel.id,
            serviceType: 'HOTEL',
            status: { in: ['CONFIRMED', 'COMPLETED'] }
          },
          _avg: { totalPrice: true }
        })

        return {
          hotelId: hotel.id,
          hotelName: hotel.name,
          city: hotel.city,
          totalRevenue: hotelBookings._sum.totalPrice || 0,
          totalBookings: hotelBookings._count || 0,
          averagePerBooking: hotelAvg._avg.totalPrice || 0
        }
      })
    )

    // Get recent transactions
    const recentTransactions = await prisma.booking.findMany({
      where: {
        hotelId: { in: hotelIds },
        serviceType: 'HOTEL',
        status: { in: ['CONFIRMED', 'COMPLETED'] }
      },
      include: {
        hotel: true
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    })

    const formattedTransactions = recentTransactions.map(booking => ({
      id: booking.id,
      hotelName: booking.hotel?.name || 'Unknown Hotel',
      amount: booking.totalPrice,
      status: booking.status,
      createdAt: booking.createdAt
    }))

    return NextResponse.json({
      totalRevenue: totalRevenue._sum.totalPrice || 0,
      monthlyRevenue: currentRevenue,
      revenueGrowth,
      averagePerBooking: averagePerBooking._avg.totalPrice || 0,
      totalBookings,
      monthlyBreakdown,
      hotelRevenue,
      recentTransactions: formattedTransactions
    })
  } catch (error) {
    console.error('Error fetching hotel owner revenue:', error)
    return NextResponse.json(
      { error: 'Failed to fetch revenue data' },
      { status: 500 }
    )
  }
} 