import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Helper function to get guide ID from user ID
async function getGuideIdFromUserId(userId: string) {
  const tourGuide = await prisma.tourGuide.findFirst({
    where: { userId: userId }
  })
  return tourGuide?.id
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const userId = authHeader.replace('Bearer ', '')
    
    // Get guide ID from user ID
    const guideId = await getGuideIdFromUserId(userId)
    if (!guideId) {
      return NextResponse.json({ error: 'Guide not found' }, { status: 404 })
    }

    // Get current date for calculations
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    // Calculate various statistics
    const [
      totalTours,
      activeBookings,
      upcomingBookings,
      totalRevenue,
      monthlyRevenue,
      totalCustomers,
      averageRating
    ] = await Promise.all([
      // Total tours created by this guide
      prisma.tour.count({
        where: {
          guideId: guideId
        }
      }),
      // Active bookings (CONFIRMED status with current dates)
      prisma.booking.count({
        where: {
          guideId: guideId,
          serviceType: 'TOUR',
          status: 'CONFIRMED',
          startDate: { lte: now },
          endDate: { gte: now }
        }
      }),
      // Upcoming bookings (PENDING or CONFIRMED with future dates)
      prisma.booking.count({
        where: {
          guideId: guideId,
          serviceType: 'TOUR',
          status: { in: ['PENDING', 'CONFIRMED'] },
          startDate: { gt: now }
        }
      }),
      // Total revenue
      prisma.booking.aggregate({
        where: {
          guideId: guideId,
          serviceType: 'TOUR',
          status: { in: ['CONFIRMED', 'COMPLETED'] }
        },
        _sum: { totalPrice: true }
      }),
      // Monthly revenue
      prisma.booking.aggregate({
        where: {
          guideId: guideId,
          serviceType: 'TOUR',
          status: { in: ['CONFIRMED', 'COMPLETED'] },
          createdAt: {
            gte: startOfMonth,
            lte: endOfMonth
          }
        },
        _sum: { totalPrice: true }
      }),
      // Total unique customers
      prisma.booking.groupBy({
        by: ['userId'],
        where: {
          guideId: guideId,
          serviceType: 'TOUR'
        },
        _count: true
      }),
      // Average rating
      prisma.review.aggregate({
        where: {
          guideId: guideId
        },
        _avg: { rating: true }
      })
    ])

    return NextResponse.json({
      stats: {
        totalTours,
        activeBookings,
        upcomingBookings,
        totalRevenue: totalRevenue._sum.totalPrice || 0,
        monthlyRevenue: monthlyRevenue._sum.totalPrice || 0,
        totalCustomers: totalCustomers.length,
        averageRating: averageRating._avg.rating || 0
      }
    })
  } catch (error) {
    console.error('Error fetching tour guide stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
} 