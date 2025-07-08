import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@/lib/generated/prisma"
import { createBookingStatusNotification } from "@/lib/notifications"

const prisma = new PrismaClient()

// POST /api/cars/owner/bookings/[id]/decline - Decline a booking (car owner only)
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

    // Find the booking and verify car ownership
    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: {
        car: {
          select: {
            id: true,
            brand: true,
            model: true,
            ownerId: true,
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
    if (booking.car?.ownerId !== userId) {
      return NextResponse.json(
        { error: "You can only decline bookings for your own cars" },
        { status: 403 }
      )
    }

    // Check if booking can be declined
    if (booking.status !== "PENDING") {
      return NextResponse.json(
        { error: "Only pending bookings can be declined" },
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
            owner: {
              select: {
                name: true,
                email: true,
              },
            },
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
          not: booking.id // Exclude the current booking that was just declined
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
      "Your car rental booking has been declined."
    )

    // Create notification for service provider about their action
    await prisma.notification.create({
      data: {
        userId: booking.car.ownerId,
        title: "Booking Declined",
        message: `You have declined the booking request for ${serviceName} from ${booking.user.name}.`,
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
      message: "Booking declined successfully" 
    })
  } catch (error) {
    console.error("Error declining booking:", error)
    return NextResponse.json(
      { error: "Failed to decline booking" },
      { status: 500 }
    )
  }
} 