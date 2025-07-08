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

    // Find all bookings for this guide and group by customer
    const bookings = await prisma.booking.findMany({
      where: {
        guideId: guideId,
        serviceType: 'TOUR',
      },
      include: {
        user: true,
        tour: true,
      },
      orderBy: { createdAt: 'desc' }
    })

    // Group bookings by customer and calculate statistics
    const customerMap = new Map()
    
    bookings.forEach(booking => {
      const userId = booking.userId
      if (!customerMap.has(userId)) {
        customerMap.set(userId, {
          id: userId,
          name: booking.user?.name || 'Unknown Customer',
          email: booking.user?.email || '',
          phone: booking.user?.phone || '',
          totalBookings: 0,
          totalSpent: 0,
          lastBookingDate: null,
          currentTour: null,
          bookings: [],
          favoriteTourCategory: null,
          averageTourDuration: 0,
          totalDays: 0
        })
      }
      
      const customer = customerMap.get(userId)
      customer.totalBookings += 1
      customer.totalSpent += booking.totalPrice || 0
      customer.bookings.push({
        id: booking.id,
        tourName: booking.tour?.name,
        tourCategory: booking.tour?.category,
        startDate: booking.startDate,
        endDate: booking.endDate,
        totalAmount: booking.totalPrice,
        status: booking.status,
        guests: booking.guests,
        createdAt: booking.createdAt
      })
      
      // Calculate tour duration
      const start = new Date(booking.startDate)
      const end = new Date(booking.endDate)
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
      customer.totalDays += days
      
      // Check if this is the current booking (active)
      if (booking.status === 'CONFIRMED' && 
          new Date(booking.startDate) <= new Date() && 
          new Date(booking.endDate) >= new Date()) {
        customer.currentTour = {
          tourName: booking.tour?.name,
          tourCategory: booking.tour?.category,
          startDate: booking.startDate,
          endDate: booking.endDate,
          guests: booking.guests
        }
      }
      
      if (!customer.lastBookingDate || new Date(booking.createdAt) > new Date(customer.lastBookingDate)) {
        customer.lastBookingDate = booking.createdAt
      }
    })

    // Calculate additional statistics for each customer
    customerMap.forEach(customer => {
      if (customer.totalBookings > 0) {
        customer.averageTourDuration = Math.round(customer.totalDays / customer.totalBookings)
      }
      
      // Find favorite tour category
      const categoryCounts = {}
      customer.bookings.forEach(booking => {
        if (booking.tourCategory) {
          categoryCounts[booking.tourCategory] = (categoryCounts[booking.tourCategory] || 0) + 1
        }
      })
      
      const favoriteCategory = Object.entries(categoryCounts)
        .sort(([,a], [,b]) => b - a)[0]
      
      customer.favoriteTourCategory = favoriteCategory ? favoriteCategory[0] : null
    })

    // Convert map to array and sort by total spent
    const customers = Array.from(customerMap.values())
      .sort((a, b) => b.totalSpent - a.totalSpent)

    return NextResponse.json({
      customers,
      total: customers.length
    })
  } catch (error) {
    console.error('Error fetching tour guide customers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    )
  }
} 