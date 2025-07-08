import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@/lib/generated/prisma'
import { createBookingStatusNotification } from '@/lib/notifications'

const prisma = new PrismaClient()

export async function PUT(
  request: NextRequest,
  { params }: { params: { bookingId: string } }
) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const ownerId = authHeader.replace('Bearer ', '')

    const body = await request.json()
    const { status } = body

    // Validate status
    const validStatuses = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      )
    }

    // Find the booking and verify it belongs to a hotel owned by this user
    const booking = await prisma.booking.findFirst({
      where: { 
        id: params.bookingId,
        serviceType: 'HOTEL',
        hotel: {
          ownerId: ownerId
        }
      },
      include: {
        hotel: {
          select: {
            id: true,
            name: true,
            ownerId: true
          }
        },
        room: {
          select: {
            id: true,
            name: true,
            roomType: true
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true
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

    // Update the booking status
    const updatedBooking = await prisma.booking.update({
      where: { id: params.bookingId },
      data: { status },
      include: {
        hotel: {
          select: {
            id: true,
            name: true,
            ownerId: true
          }
        },
        room: {
          select: {
            id: true,
            name: true,
            roomType: true
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    // Update room availability based on booking status
    if (updatedBooking.roomId) {
      let isAvailable = true
      if (status === 'CONFIRMED') {
        isAvailable = false
      } else if (status === 'CANCELLED' || status === 'COMPLETED') {
        isAvailable = true
      }
      
      await prisma.room.update({
        where: { id: updatedBooking.roomId },
        data: { isAvailable }
      })
    }

    // Create notifications for both customer and service provider
    const serviceName = `${booking.hotel.name}${booking.room ? ` - ${booking.room.name}` : ''}`
    await createBookingStatusNotification(
      booking.id,
      booking.userId,
      booking.hotel.ownerId,
      status,
      serviceName,
      "HOTEL",
      status === "CONFIRMED" ? "Your hotel booking has been confirmed!" : 
      status === "CANCELLED" ? "Your hotel booking has been cancelled." :
      status === "COMPLETED" ? "Your hotel stay has been completed." : ""
    )

    return NextResponse.json({
      booking: {
        id: updatedBooking.id,
        hotelId: updatedBooking.hotelId,
        hotelName: updatedBooking.hotel?.name,
        roomType: updatedBooking.room?.roomType,
        roomName: updatedBooking.room?.name,
        customerId: updatedBooking.userId,
        customerName: updatedBooking.user?.name,
        customerEmail: updatedBooking.user?.email,
        customerPhone: updatedBooking.user?.phone,
        checkInDate: updatedBooking.startDate,
        checkOutDate: updatedBooking.endDate,
        numberOfGuests: updatedBooking.guests,
        totalAmount: updatedBooking.totalPrice,
        status: updatedBooking.status,
        specialRequests: updatedBooking.specialRequests,
        createdAt: updatedBooking.createdAt,
        updatedAt: updatedBooking.updatedAt,
      },
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