import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@/lib/generated/prisma"
import { z } from "zod"
import { notifyBookingConfirmed, notifyBookingCancelled } from "@/lib/notifications"

const prisma = new PrismaClient()

// Validation schema for updating booking status
const updateStatusSchema = z.object({
  status: z.enum(["CONFIRMED", "CANCELLED"]),
  notes: z.string().optional(),
})

// PUT /api/bookings/[id]/status - Update booking status (approve/decline)
export async function PUT(
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
    
    // Validate the request body
    const validatedData = updateStatusSchema.parse(body)

    // Check if booking exists and belongs to user's car
    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: {
        car: {
          select: {
            ownerId: true,
            brand: true,
            model: true,
            licensePlate: true,
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

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      )
    }

    // Check if user is the car owner
    if (booking.car.ownerId !== userId) {
      return NextResponse.json(
        { error: "Unauthorized to manage this booking" },
        { status: 403 }
      )
    }

    // Check if booking is in a valid state for status update
    if (booking.status !== "PENDING") {
      return NextResponse.json(
        { error: "Booking cannot be updated in its current state" },
        { status: 400 }
      )
    }

    // Update the booking status
    const updatedBooking = await prisma.booking.update({
      where: { id: params.id },
      data: {
        status: validatedData.status,
        notes: validatedData.notes,
        updatedAt: new Date(),
      },
      include: {
        car: {
          select: {
            brand: true,
            model: true,
            year: true,
            color: true,
            licensePlate: true,
            pricePerDay: true,
            currency: true,
          },
        },
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    })

    // Notify the user about the booking status update
    if (validatedData.status === "CONFIRMED") {
      await notifyBookingConfirmed(
        booking.userId, 
        booking.id, 
        `${booking.car.brand} ${booking.car.model}`
      )
    } else if (validatedData.status === "CANCELLED") {
      await notifyBookingCancelled(
        booking.userId, 
        booking.id, 
        `${booking.car.brand} ${booking.car.model}`,
        validatedData.notes
      )
    }

    return NextResponse.json({ 
      booking: updatedBooking,
      message: `Booking ${validatedData.status.toLowerCase()} successfully` 
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Error updating booking status:", error)
    return NextResponse.json(
      { error: "Failed to update booking status" },
      { status: 500 }
    )
  }
} 