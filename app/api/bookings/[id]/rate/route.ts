import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST - Rate a booking
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }
    
    let userId = authHeader.replace('Bearer ', '')
    
    // For demo purposes, allow demo-user-id
    if (userId === 'demo-user-id') {
      userId = 'demo-user-id'
    }

    const { id } = params
    const body = await request.json()
    const { rating, title, comment } = body

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 })
    }

    // Check if booking exists and belongs to user
    const booking = await prisma.booking.findFirst({
      where: { 
        id,
        userId
      },
      include: {
        tour: true,
        hotel: true,
        car: true,
        guide: true
      }
    })

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found or access denied' }, { status: 404 })
    }

    // Check if booking is completed
    if (booking.status !== 'COMPLETED') {
      return NextResponse.json({ error: 'Can only rate completed bookings' }, { status: 400 })
    }

    // Check if user already rated this booking
    const existingReview = await prisma.review.findFirst({
      where: { bookingId: id }
    })

    if (existingReview) {
      return NextResponse.json({ error: 'You have already rated this booking' }, { status: 400 })
    }

    // Determine what to rate based on service type
    let reviewData: any = {
      userId,
      bookingId: id,
      rating,
      title: title || null,
      comment: comment || null,
      isApproved: true,
      isVerified: true
    }

    // Add service-specific references
    switch (booking.serviceType) {
      case 'TOUR':
        if (booking.tourId) reviewData.tourId = booking.tourId
        if (booking.guideId) reviewData.guideId = booking.guideId
        break
      case 'HOTEL':
        if (booking.hotelId) reviewData.hotelId = booking.hotelId
        break
      case 'CAR':
        if (booking.carId) reviewData.carId = booking.carId
        break
    }

    // Create review
    const review = await prisma.review.create({
      data: reviewData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      review,
      message: 'Rating submitted successfully'
    })
  } catch (error) {
    console.error('Error rating booking:', error)
    return NextResponse.json({ error: 'Failed to submit rating' }, { status: 500 })
  }
}

// GET - Get rating for a booking
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }
    
    let userId = authHeader.replace('Bearer ', '')
    
    // For demo purposes, allow demo-user-id
    if (userId === 'demo-user-id') {
      userId = 'demo-user-id'
    }

    const { id } = params

    // Get review for this booking
    const review = await prisma.review.findFirst({
      where: { bookingId: id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    })

    return NextResponse.json({
      review
    })
  } catch (error) {
    console.error('Error getting booking rating:', error)
    return NextResponse.json({ error: 'Failed to get rating' }, { status: 500 })
  }
} 