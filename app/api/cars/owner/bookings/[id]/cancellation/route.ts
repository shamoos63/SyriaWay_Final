import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { db } from '@/lib/db'
import { bookings, cars } from '@/drizzle/schema'
import { eq, and } from 'drizzle-orm'

// POST - Process car booking cancellation
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
    const { cancellationReason, refundAmount } = body

    // Get the booking
    const [booking] = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, parseInt(id)))

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    // Check if the car belongs to the user
    const [car] = await db
      .select()
      .from(cars)
      .where(and(
        eq(cars.id, booking.serviceId),
        eq(cars.ownerId, parseInt(session.user.id))
      ))

    if (!car) {
      return NextResponse.json(
        { error: 'Unauthorized to modify this booking' },
        { status: 403 }
      )
    }

    // Update booking status and add cancellation details
    const [updatedBooking] = await db
      .update(bookings)
      .set({
        status: 'CANCELLED',
        updatedAt: new Date().toISOString(),
        // You might want to add cancellation fields to your schema
        // cancellationReason: cancellationReason || null,
        // refundAmount: refundAmount || null,
      })
      .where(eq(bookings.id, parseInt(id)))
      .returning()

    return NextResponse.json({
      booking: updatedBooking,
      message: 'Booking cancellation processed successfully'
    })
  } catch (error) {
    console.error('Error processing car booking cancellation:', error)
    return NextResponse.json(
      { error: 'Failed to process booking cancellation' },
      { status: 500 }
    )
  }
} 