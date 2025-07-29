import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { db } from '@/lib/db'
import { cars, bookings } from '@/drizzle/schema'
import { eq, and } from 'drizzle-orm'

// Helper to extract user id from session
function getUserId(session: any): number {
  return parseInt(session?.user?.id || session?.user?.userId || '0');
}

// POST - Book a car
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try { 
    const session = await getServerSession(authOptions)
    
    const userId = getUserId(session);
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await request.json()
    const {
      startDate,
      endDate,
      totalAmount,
      specialRequests
    } = body

    // Validate required fields
    if (!startDate || !endDate || !totalAmount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if car exists and is available
    const [car] = await db
      .select()
      .from(cars)
      .where(and(
        eq(cars.id, parseInt(id)),
        eq(cars.isAvailable, true)
      ))

    if (!car) {
      return NextResponse.json(
        { error: 'Car not found or not available' },
        { status: 404 }
      )
    }

    // Check if car is already booked for the requested dates
    const existingBookings = await db
      .select()
      .from(bookings)
      .where(and(
        eq(bookings.serviceType, 'CAR'),
        eq(bookings.serviceId, parseInt(id)),
        eq(bookings.status, 'CONFIRMED')
      ))

    // Simple date overlap check
    const start = new Date(startDate)
    const end = new Date(endDate)
    
    const hasConflict = existingBookings.some(booking => {
      const bookingStart = new Date(booking.startDate)
      const bookingEnd = new Date(booking.endDate)
      return (start < bookingEnd && end > bookingStart)
    })

    if (hasConflict) {
      return NextResponse.json(
        { error: 'Car is already booked for the requested dates' },
        { status: 400 }
      )
    }

    // Create booking
    const [newBooking] = await db
      .insert(bookings)
      .values({
        userId,
        serviceType: 'CAR',
        serviceId: parseInt(id),
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        totalPrice: parseFloat(totalAmount), // Map totalAmount to totalPrice
        status: 'PENDING',
        paymentStatus: 'PENDING',
        specialRequests: specialRequests ? String(specialRequests) : '',
      })
      .returning()

    return NextResponse.json({
      booking: newBooking,
      message: 'Car booked successfully'
    }, { status: 201 })
  } catch (error) {
    console.error('Error booking car:', error)
    return NextResponse.json(
      { error: 'Failed to book car' },
      { status: 500 }
    )
  }
} 