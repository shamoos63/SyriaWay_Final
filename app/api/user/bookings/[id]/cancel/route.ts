import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { db } from '@/lib/db'
import { bookings } from '@/drizzle/schema'
import { eq, and } from 'drizzle-orm'

// POST - Cancel a booking
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
    const { reason } = body

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

    // Check if booking can be cancelled
    if (booking.status === 'CANCELLED') {
      return NextResponse.json(
        { error: 'Booking is already cancelled' },
        { status: 400 }
      )
    }

    if (booking.status === 'COMPLETED') {
      return NextResponse.json(
        { error: 'Cannot cancel completed booking' },
        { status: 400 }
      )
    }

    // Update booking status
    const [updatedBooking] = await db
      .update(bookings)
      .set({
        status: 'CANCELLED',
        updatedAt: new Date().toISOString(),
      })
      .where(eq(bookings.id, parseInt(id)))
      .returning()

    return NextResponse.json({
      booking: updatedBooking,
      message: 'Booking cancelled successfully'
    })
  } catch (error) {
    console.error('Error cancelling booking:', error)
    return NextResponse.json(
      { error: 'Failed to cancel booking' },
      { status: 500 }
    )
  }
} 