import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@/lib/generated/prisma'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const ownerId = authHeader.replace('Bearer ', '')

    // Find all hotels owned by this user
    const hotels = await prisma.hotel.findMany({
      where: { ownerId },
      select: { id: true }
    })
    const hotelIds = hotels.map(h => h.id)
    if (hotelIds.length === 0) {
      return NextResponse.json({ bookings: [], total: 0 })
    }

    // Find all bookings for these hotels
    const bookings = await prisma.booking.findMany({
      where: {
        hotelId: { in: hotelIds },
        serviceType: 'HOTEL',
      },
      include: {
        user: true,
        hotel: true,
        room: true,
      },
      orderBy: { createdAt: 'desc' }
    })

    // Format bookings for the frontend
    const formatted = bookings.map(b => ({
      id: b.id,
      hotelId: b.hotelId,
      hotelName: b.hotel?.name,
      roomType: b.room?.roomType,
      roomName: b.room?.name,
      roomNumber: b.room?.roomNumber,
      customerId: b.userId,
      customerName: b.user?.name,
      customerEmail: b.user?.email,
      customerPhone: b.user?.phone,
      checkInDate: b.startDate,
      checkOutDate: b.endDate,
      numberOfGuests: b.guests,
      totalAmount: b.totalPrice,
      status: b.status,
      specialRequests: b.specialRequests,
      createdAt: b.createdAt,
      updatedAt: b.updatedAt,
    }))

    return NextResponse.json({
      bookings: formatted,
      total: formatted.length
    })
  } catch (error) {
    console.error('Error fetching hotel owner bookings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
} 