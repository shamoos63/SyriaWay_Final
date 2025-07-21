import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { db } from '@/lib/db'
import { bookings, bookingRatings } from '@/drizzle/schema'
import { eq, and } from 'drizzle-orm'

// POST - Rate a booking
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await request.json()
    const { rating, review } = body

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    // Check if booking exists and belongs to user
    const [booking] = await db
      .select()
      .from(bookings)
      .where(and(
        eq(bookings.id, parseInt(id)),
        eq(bookings.userId, parseInt(session.user.id))
      ))

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    // Check if booking is completed
    if (booking.status !== 'COMPLETED') {
      return NextResponse.json(
        { error: 'Can only rate completed bookings' },
        { status: 400 }
      )
    }

    // Check if user already rated this booking
    const [existingRating] = await db
      .select()
      .from(bookingRatings)
      .where(eq(bookingRatings.bookingId, parseInt(id)))

    if (existingRating) {
      return NextResponse.json(
        { error: 'Booking already rated' },
        { status: 400 }
      )
    }

    // Create rating
    const [newRating] = await db
      .insert(bookingRatings)
      .values({
        bookingId: parseInt(id),
        userId: parseInt(session.user.id),
        rating: parseInt(rating),
        review: review || null,
      })
      .returning()

    return NextResponse.json({
      rating: newRating,
      message: 'Rating submitted successfully'
    }, { status: 201 })
  } catch (error) {
    console.error('Error rating booking:', error)
    return NextResponse.json(
      { error: 'Failed to submit rating' },
      { status: 500 }
    )
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
    const review = await db
      .select()
      .from(bookingRatings)
      .where(eq(bookingRatings.bookingId, parseInt(id)))
      .then(rows => rows[0])

    return NextResponse.json({
      review
    })
  } catch (error) {
    console.error('Error getting booking rating:', error)
    return NextResponse.json({ error: 'Failed to get rating' }, { status: 500 })
  }
} 