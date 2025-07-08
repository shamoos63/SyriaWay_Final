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
      select: { id: true }
    })
    const hotelIds = hotels.map(h => h.id)

    if (hotelIds.length === 0) {
      return NextResponse.json({
        stats: {
          totalHotels: 0,
          totalBookings: 0,
          activeReservations: 0,
          upcomingReservations: 0,
          totalRevenue: 0,
          monthlyRevenue: 0,
          averageRating: 0,
          totalRooms: 0,
          availableRooms: 0,
          occupiedRooms: 0
        }
      })
    }

    // Get current date for calculations
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    // Calculate various statistics
    const [
      totalBookings,
      activeReservations,
      upcomingReservations,
      totalRevenue,
      monthlyRevenue,
      totalRooms,
      availableRooms,
      occupiedRooms,
      averageRating
    ] = await Promise.all([
      // Total bookings
      prisma.booking.count({
        where: {
          hotelId: { in: hotelIds },
          serviceType: 'HOTEL'
        }
      }),
      // Active reservations (CONFIRMED status with current dates)
      prisma.booking.count({
        where: {
          hotelId: { in: hotelIds },
          serviceType: 'HOTEL',
          status: 'CONFIRMED',
          startDate: { lte: now },
          endDate: { gte: now }
        }
      }),
      // Upcoming reservations (PENDING or CONFIRMED with future dates)
      prisma.booking.count({
        where: {
          hotelId: { in: hotelIds },
          serviceType: 'HOTEL',
          status: { in: ['PENDING', 'CONFIRMED'] },
          startDate: { gt: now }
        }
      }),
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
      // Total rooms
      prisma.room.count({
        where: { hotelId: { in: hotelIds } }
      }),
      // Available rooms
      prisma.room.count({
        where: { 
          hotelId: { in: hotelIds },
          isAvailable: true
        }
      }),
      // Occupied rooms
      prisma.room.count({
        where: { 
          hotelId: { in: hotelIds },
          isAvailable: false
        }
      }),
      // Average rating
      prisma.review.aggregate({
        where: {
          hotelId: { in: hotelIds }
        },
        _avg: { rating: true }
      })
    ])

    return NextResponse.json({
      stats: {
        totalHotels: hotels.length,
        totalBookings,
        activeReservations,
        upcomingReservations,
        totalRevenue: totalRevenue._sum.totalPrice || 0,
        monthlyRevenue: monthlyRevenue._sum.totalPrice || 0,
        averageRating: averageRating._avg.rating || 0,
        totalRooms,
        availableRooms,
        occupiedRooms
      }
    })
  } catch (error) {
    console.error('Error fetching hotel owner stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
} 