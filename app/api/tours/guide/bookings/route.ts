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

    // Find all bookings for this guide
    const bookings = await prisma.booking.findMany({
      where: {
        guideId: guideId,
        serviceType: 'TOUR'
      },
      include: {
        user: true,
        tour: true
      },
      orderBy: { createdAt: 'desc' }
    })

    // Format bookings for the frontend - using the field names the frontend expects
    const formatted = bookings.map(b => ({
      id: b.id,
      tourId: b.tourId,
      tourName: b.tour?.name || 'Custom Tour',
      tourCategory: b.tour?.category,
      customerId: b.userId,
      customerName: b.user?.name || b.contactName || 'Unknown Customer',
      customerEmail: b.user?.email || b.contactEmail,
      customerPhone: b.user?.phone || b.contactPhone,
      startDate: b.startDate,
      endDate: b.endDate,
      guests: b.guests, // Frontend expects 'guests' not 'numberOfGuests'
      totalPrice: b.totalPrice, // Frontend expects 'totalPrice' not 'totalAmount'
      status: b.status,
      specialRequests: b.specialRequests,
      notes: b.notes,
      contactName: b.contactName,
      contactPhone: b.contactPhone,
      contactEmail: b.contactEmail,
      createdAt: b.createdAt,
      updatedAt: b.updatedAt,
    }))

    return NextResponse.json({
      bookings: formatted,
      total: formatted.length
    })
  } catch (error) {
    console.error('Error fetching tour guide bookings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}

// Add PUT method for updating booking status
export async function PUT(request: NextRequest) {
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

    const body = await request.json()
    const { bookingId, status, notes } = body

    // Validate status
    const validStatuses = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      )
    }

    // Find the booking and verify it belongs to this guide
    const booking = await prisma.booking.findFirst({
      where: { 
        id: bookingId,
        guideId: guideId,
        serviceType: 'TOUR'
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        tour: {
          select: {
            id: true,
            name: true,
            description: true
          }
        },
        guide: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    })

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found or access denied' },
        { status: 404 }
      )
    }

    // Update the booking
    const updateData: any = { status }
    if (notes) updateData.notes = notes

    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        tour: {
          select: {
            id: true,
            name: true,
            description: true
          }
        },
        guide: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    })

    // Create notifications for both customer and service provider
    const serviceName = booking.tour?.name || 'Tour'
    const guideUserId = booking.guide?.user?.id
    await createBookingStatusNotification(
      booking.id,
      booking.userId,
      guideUserId || null,
      status,
      serviceName,
      "TOUR",
      status === "CONFIRMED" ? "Your tour booking has been confirmed!" : 
      status === "CANCELLED" ? "Your tour booking has been cancelled." :
      status === "COMPLETED" ? "Your tour has been completed." : ""
    )

    return NextResponse.json({
      booking: updatedBooking,
      message: 'Booking status updated successfully'
    })

  } catch (error) {
    console.error('Error updating booking status:', error)
    return NextResponse.json(
      { error: 'Failed to update booking status' },
      { status: 500 }
    )
  }
} 