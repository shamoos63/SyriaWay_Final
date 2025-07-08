import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@/lib/generated/prisma"
import { createBookingStatusNotification } from "@/lib/notifications"

const prisma = new PrismaClient()

// POST /api/cars/owner/bookings/[id]/cancellation - Approve/Reject cancellation request (car owner only)
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

    const body = await request.json()
    const { action, notes } = body // action: "approve" or "reject"

    if (!action || !["approve", "reject"].includes(action)) {
      return NextResponse.json(
        { error: "Invalid action. Must be 'approve' or 'reject'" },
        { status: 400 }
      )
    }

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
        { error: "You can only manage cancellation requests for your own cars" },
        { status: 403 }
      )
    }

    // Check if booking is in CANCELLATION_REQUESTED status
    if (booking.status !== "CANCELLATION_REQUESTED") {
      return NextResponse.json(
        { error: "No cancellation request found for this booking" },
        { status: 400 }
      )
    }

    // Update booking status based on action
    const newStatus = action === "approve" ? "CANCELLED" : "CONFIRMED"
    const message = action === "approve" 
      ? "Cancellation request approved" 
      : "Cancellation request rejected"

    // Update booking and car availability
    const updatedBooking = await prisma.booking.update({
      where: { id: params.id },
      data: {
        status: newStatus,
        notes: notes || `Cancellation ${action}ed by owner`,
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

    // Update car availability based on cancellation action
    if (action === "approve") {
      // If cancellation is approved, check if car has any other active bookings
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
    } else {
      // If cancellation is rejected, ensure car remains unavailable
      await prisma.car.update({
        where: { id: booking.car.id },
        data: { isAvailable: false }
      })
    }

    // Create notifications for both customer and service provider
    const serviceName = `${booking.car.brand} ${booking.car.model}`
    const notificationMessage = action === "approve" 
      ? "Your cancellation request has been approved." 
      : "Your cancellation request has been rejected. Your booking remains confirmed."

    await createBookingStatusNotification(
      booking.id,
      booking.userId,
      booking.car.ownerId,
      newStatus,
      serviceName,
      "CAR",
      notificationMessage
    )

    // Create notification for service provider about their action
    await prisma.notification.create({
      data: {
        userId: booking.car.ownerId,
        title: `Cancellation Request ${action === "approve" ? "Approved" : "Rejected"}`,
        message: `You have ${action === "approve" ? "approved" : "rejected"} the cancellation request for ${serviceName} from ${booking.user.name}.`,
        type: "REQUEST_UPDATED",
        category: "BOOKING",
        priority: "NORMAL",
        isRead: false,
        relatedId: booking.id,
        relatedType: "BOOKING",
      },
    })

    return NextResponse.json({ 
      booking: updatedBooking,
      message: message
    })
  } catch (error) {
    console.error("Error processing cancellation request:", error)
    return NextResponse.json(
      { error: "Failed to process cancellation request" },
      { status: 500 }
    )
  }
} 