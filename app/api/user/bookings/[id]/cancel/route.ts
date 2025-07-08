import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@/lib/generated/prisma"
import { createBookingStatusNotification, createCancellationRequestNotification } from "@/lib/notifications"

const prisma = new PrismaClient()

// POST /api/user/bookings/[id]/cancel - Cancel a booking (user only)
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
            brand: true,
            model: true,
            ownerId: true,
            owner: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
        hotel: {
          select: {
            name: true,
            ownerId: true,
            owner: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
        guide: {
          select: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
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

    // Verify that the current user owns the booking
    if (booking.userId !== userId) {
      return NextResponse.json(
        { error: "You can only cancel your own bookings" },
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

    // For Umrah requests, allow direct cancellation of pending requests
    if (booking.serviceType === "UMRAH") {
      if (booking.status === "PENDING") {
        // Update booking status to cancelled
        const updatedBooking = await prisma.booking.update({
          where: { id: params.id },
          data: {
            status: "CANCELLED",
            updatedAt: new Date(),
          },
          include: {
            umrahPackage: true
          },
        })

        return NextResponse.json({ 
          booking: updatedBooking,
          message: "Umrah request cancelled successfully" 
        })
      } else {
        return NextResponse.json(
          { error: "Can only cancel pending Umrah requests" },
          { status: 400 }
        )
      }
    }

    // For other services, check if booking has started (for confirmed bookings)
    if (booking.status === "CONFIRMED") {
      const startDate = new Date(booking.startDate)
      const now = new Date()
      if (startDate <= now) {
        return NextResponse.json(
          { error: "Cannot cancel bookings that have already started" },
          { status: 400 }
        )
      }
    }

    // For confirmed bookings, set status to CANCELLATION_REQUESTED for approval
    if (booking.status === "CONFIRMED") {
      const updatedBooking = await prisma.booking.update({
        where: { id: params.id },
        data: {
          status: "CANCELLATION_REQUESTED",
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
          hotel: {
            select: {
              name: true,
              owner: {
                select: {
                  name: true,
                  email: true,
                },
              },
            },
          },
          guide: {
            select: {
              user: {
                select: {
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      })

      // For car bookings, ensure car remains unavailable during cancellation request
      if (booking.serviceType === "CAR" && booking.car) {
        await prisma.car.update({
          where: { id: booking.car.id },
          data: { isAvailable: false }
        })
      }

      // Create cancellation request notification for service provider
      let serviceProviderId: string | null = null
      let serviceName = ''
      
      if (booking.car) {
        serviceProviderId = booking.car.ownerId
        serviceName = `${booking.car.brand} ${booking.car.model}`
      } else if (booking.hotel) {
        serviceProviderId = booking.hotel.ownerId
        serviceName = booking.hotel.name
      } else if (booking.guide) {
        serviceProviderId = booking.guide.user.id
        serviceName = 'Tour'
      }

      await createCancellationRequestNotification(
        booking.id,
        booking.userId,
        serviceProviderId,
        serviceName,
        booking.serviceType
      )

      // Create notification for customer about cancellation request
      await prisma.notification.create({
        data: {
          userId: booking.userId,
          title: "Cancellation Request Submitted",
          message: `Your cancellation request for ${serviceName} has been submitted. Waiting for service provider approval.`,
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
        message: "Cancellation request submitted. Waiting for service provider approval." 
      })
    }

    // For pending bookings, cancel directly
    if (booking.status === "PENDING") {
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
          hotel: {
            select: {
              name: true,
              owner: {
                select: {
                  name: true,
                  email: true,
                },
              },
            },
          },
          guide: {
            select: {
              user: {
                select: {
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      })

      // For car bookings, check if car should become available
      if (booking.serviceType === "CAR" && booking.car) {
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
      }

      // Create cancellation notification
      let serviceProviderId: string | null = null
      let serviceName = ''
      
      if (booking.car) {
        serviceProviderId = booking.car.ownerId
        serviceName = `${booking.car.brand} ${booking.car.model}`
      } else if (booking.hotel) {
        serviceProviderId = booking.hotel.ownerId
        serviceName = booking.hotel.name
      } else if (booking.guide) {
        serviceProviderId = booking.guide.user.id
        serviceName = 'Tour'
      }

      await createBookingStatusNotification(
        booking.id,
        booking.userId,
        serviceProviderId,
        "CANCELLED",
        serviceName,
        booking.serviceType,
        "Your booking has been cancelled."
      )

      return NextResponse.json({ 
        booking: updatedBooking,
        message: "Booking cancelled successfully" 
      })
    }

    // For other statuses, return error
    return NextResponse.json(
      { error: "Cannot cancel booking in its current status" },
      { status: 400 }
    )
  } catch (error) {
    console.error("Error cancelling booking:", error)
    return NextResponse.json(
      { error: "Failed to cancel booking" },
      { status: 500 }
    )
  }
} 