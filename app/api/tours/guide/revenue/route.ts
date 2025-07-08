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
      // Last month revenue for growth calculation
      prisma.booking.aggregate({
        where: {
          guideId: guideId,
          serviceType: 'TOUR',
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
          guideId: guideId,
          serviceType: 'TOUR',
          status: { in: ['CONFIRMED', 'COMPLETED'] }
        }
      }),
      // Monthly bookings
      prisma.booking.count({
        where: {
          guideId: guideId,
          serviceType: 'TOUR',
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
          guideId: guideId,
          serviceType: 'TOUR',
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
      
      const monthRevenue = await prisma.booking.aggregate({
        where: {
          guideId: guideId,
          serviceType: 'TOUR',
          status: { in: ['CONFIRMED', 'COMPLETED'] },
          createdAt: {
            gte: monthStart,
            lte: monthEnd
          }
        },
        _sum: { totalPrice: true }
      })

      monthlyBreakdown.push({
        month: monthStart.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        revenue: monthRevenue._sum.totalPrice || 0
      })
    }

    // Get recent transactions
    const recentTransactions = await prisma.booking.findMany({
      where: {
        guideId: guideId,
        serviceType: 'TOUR',
        status: { in: ['CONFIRMED', 'COMPLETED'] }
      },
      include: {
        tour: true,
        user: true
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    })

    const formattedTransactions = recentTransactions.map(booking => ({
      id: booking.id,
      tourName: booking.tour?.name || 'Unknown Tour',
      customerName: booking.user?.name || 'Unknown Customer',
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
      recentTransactions: formattedTransactions
    })
  } catch (error) {
    console.error('Error fetching tour guide revenue:', error)
    return NextResponse.json(
      { error: 'Failed to fetch revenue data' },
      { status: 500 }
    )
  }
} 