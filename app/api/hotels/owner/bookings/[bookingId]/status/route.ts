import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { db } from '@/lib/db'
import { bookings, hotels } from '@/drizzle/schema'
import { eq, and } from 'drizzle-orm'

// PUT - Update booking status
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ bookingId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { bookingId } = await params
    const body = await request.json()
    const { status } = body

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      )
    }

    // Get the booking
    const [booking] = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, parseInt(bookingId)))

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    // Check if the hotel belongs to the user
    const [hotel] = await db
      .select()
      .from(hotels)
      .where(and(
        eq(hotels.id, booking.serviceId),
        eq(hotels.ownerId, parseInt(session.user.id))
      ))

    if (!hotel) {
      return NextResponse.json(
        { error: 'Unauthorized to modify this booking' },
        { status: 403 }
      )
    }

    // Update booking status
    const [updatedBooking] = await db
      .update(bookings)
      .set({
        status,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(bookings.id, parseInt(bookingId)))
      .returning()

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