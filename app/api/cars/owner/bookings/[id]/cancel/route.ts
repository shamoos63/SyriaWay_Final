import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@/lib/generated/prisma"
import { createBookingStatusNotification } from "@/lib/notifications"

const prisma = new PrismaClient()

// POST /api/cars/owner/bookings/[id]/cancel - Cancel a booking (car owner only)
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get user from authorization header
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const token = authHeader.split(" ")[1]
    const userId = token // This should be decoded from JWT

    // Find the booking and verify ownership
    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: {
        car: {
          select: {
            id: true,
            ownerId: true,
            brand: true,
            model: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      )
    }

    // Verify that the current user owns the car
    if (booking.car.ownerId !== userId) {
      return NextResponse.json(
        { error: "You can only cancel bookings for your own cars" },
        { status: 403 }
      )
    }

    // Check if booking can be cancelled
    if (booking.status === "CANCELLED") {
      return NextResponse.json(
        { error: "Booking is already cancelled" },
        { status: 400 }
      )
    }

    if (booking.status === "COMPLETED") {
      return NextResponse.json(
        { error: "Cannot cancel completed bookings" },
        { status: 400 }
      )
    }

    // Update booking status to cancelled
    const updatedBooking = await prisma.booking.update({
      where: { id: params.id },
      data: {
        status: "CANCELLED",
        updatedAt: new Date(),
      },
      include: {
        car: {
          select: {
            id: true,
            brand: true,
            model: true,
          },
        },
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    // Check if car has any other active bookings
    const activeBookings = await prisma.booking.findMany({
      where: {
        carId: booking.car.id,
        status: {
          in: ["PENDING", "CONFIRMED", "CANCELLATION_REQUESTED"]
        },
        id: {
          not: booking.id // Exclude the current booking that was just cancelled
        }
      }
    })

    // If no other active bookings, make car available
    if (activeBookings.length === 0) {
      await prisma.car.update({
        where: { id: booking.car.id },
        data: { isAvailable: true }
      })
    }

    // Create notifications for both customer and service provider
    const serviceName = `${booking.car.brand} ${booking.car.model}`
    await createBookingStatusNotification(
      booking.id,
      booking.userId,
      booking.car.ownerId,
      "CANCELLED",
      serviceName,
      "CAR",
      "Your car rental booking has been cancelled by the owner."
    )

    // Create notification for service provider about their action
    await prisma.notification.create({
      data: {
        userId: booking.car.ownerId,
        title: "Booking Cancelled",
        message: `You have cancelled the booking for ${serviceName} from ${booking.user.name}.`,
        type: "BOOKING_CANCELLED",
        category: "BOOKING",
        priority: "NORMAL",
        isRead: false,
        relatedId: booking.id,
        relatedType: "BOOKING",
      },
    })

    return NextResponse.json({ 
      booking: updatedBooking,
      message: "Booking cancelled successfully" 
    })
  } catch (error) {
    console.error("Error cancelling booking:", error)
    return NextResponse.json(
      { error: "Failed to cancel booking" },
      { status: 500 }
    )
  }
} 