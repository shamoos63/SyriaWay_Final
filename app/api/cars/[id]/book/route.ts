import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@/lib/generated/prisma"
import { z } from "zod"

const prisma = new PrismaClient()

// Validation schema for booking a car
const bookCarSchema = z.object({
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  guests: z.number().min(1, "At least 1 guest is required").default(1),
  includeDriver: z.boolean().default(false),
  specialRequests: z.string().optional(),
  contactName: z.string().min(1, "Contact name is required"),
  contactPhone: z.string().min(1, "Contact phone is required"),
  contactEmail: z.string().email("Valid email is required"),
})

// POST /api/cars/[id]/book - Book a car
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log("Car booking request received for car ID:", params.id)
    
    // Get user from authorization header
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("Authorization header missing or invalid")
      return NextResponse.json(
        { error: "Authentication required. Please sign in to book a car." },
        { status: 401 }
      )
    }

    const token = authHeader.split(" ")[1]
    const userId = token // In this implementation, the token is the user ID

    console.log("User ID from token:", userId)

    // Validate that the user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true, status: true }
    })

    if (!user) {
      console.log("User not found for ID:", userId)
      return NextResponse.json(
        { error: "User not found. Please sign in again." },
        { status: 401 }
      )
    }

    // Check if user is active
    if (user.status !== 'ACTIVE') {
      console.log("User account not active:", userId)
      return NextResponse.json(
        { error: "Your account is not active. Please contact support." },
        { status: 403 }
      )
    }

    // Only allow customers to book cars
    if (user.role !== 'CUSTOMER') {
      console.log("Non-customer trying to book car:", { userId, role: user.role })
      return NextResponse.json(
        { error: "Service providers and administrators cannot make bookings. Please use a customer account." },
        { status: 403 }
      )
    }

    console.log("User found:", { id: user.id, role: user.role })

    const body = await request.json()
    console.log("Request body:", body)
    
    // Validate the request body
    const validatedData = bookCarSchema.parse(body)
    console.log("Validated data:", validatedData)

    // Check if car exists and is available
    const car = await prisma.car.findUnique({
      where: { id: params.id },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    console.log("Car lookup result:", car ? { id: car.id, brand: car.brand, model: car.model, isAvailable: car.isAvailable } : "Car not found")

    if (!car) {
      console.log("Car not found for ID:", params.id)
      return NextResponse.json(
        { error: "Car not found" },
        { status: 404 }
      )
    }

    if (!car.isAvailable) {
      console.log("Car is not available:", car.id)
      return NextResponse.json(
        { error: "Car is not available for booking" },
        { status: 400 }
      )
    }

    // Check if car owner is trying to book their own car
    if (car.ownerId === userId) {
      console.log("Car owner trying to book their own car")
      return NextResponse.json(
        { error: "You cannot book your own car" },
        { status: 400 }
      )
    }

    // Parse dates
    const startDate = new Date(validatedData.startDate)
    const endDate = new Date(validatedData.endDate)

    console.log("Parsed dates:", { startDate, endDate })

    // Validate dates
    if (startDate >= endDate) {
      console.log("Invalid date range: start date >= end date")
      return NextResponse.json(
        { error: "End date must be after start date" },
        { status: 400 }
      )
    }

    if (startDate < new Date()) {
      console.log("Start date is in the past")
      return NextResponse.json(
        { error: "Start date cannot be in the past" },
        { status: 400 }
      )
    }

    // Check for conflicting bookings
    const conflictingBooking = await prisma.booking.findFirst({
      where: {
        carId: params.id,
        status: {
          in: ["PENDING", "CONFIRMED"],
        },
        OR: [
          {
            startDate: {
              lte: endDate,
            },
            endDate: {
              gte: startDate,
            },
          },
        ],
      },
    })

    if (conflictingBooking) {
      console.log("Conflicting booking found:", conflictingBooking.id)
      return NextResponse.json(
        { error: "Car is not available for the selected dates" },
        { status: 400 }
      )
    }

    // Calculate rental duration and total price
    const durationMs = endDate.getTime() - startDate.getTime()
    const durationDays = Math.ceil(durationMs / (1000 * 60 * 60 * 24))
    
    let totalPrice = car.pricePerDay * durationDays
    
    // Add driver cost if requested (assuming $50/day for driver)
    if (validatedData.includeDriver) {
      totalPrice += 50 * durationDays
    }

    console.log("Booking calculation:", { durationDays, totalPrice, includeDriver: validatedData.includeDriver })

    // Create the booking
    const booking = await prisma.booking.create({
      data: {
        userId: userId,
        serviceType: "CAR",
        carId: params.id,
        startDate: startDate,
        endDate: endDate,
        guests: validatedData.guests,
        totalPrice: totalPrice,
        currency: car.currency || "USD",
        status: "PENDING",
        paymentStatus: "PENDING",
        specialRequests: validatedData.specialRequests,
        contactName: validatedData.contactName,
        contactPhone: validatedData.contactPhone,
        contactEmail: validatedData.contactEmail,
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

    // Set car as unavailable since it now has a pending booking
    await prisma.car.update({
      where: { id: params.id },
      data: { isAvailable: false }
    })

    console.log("Booking created successfully:", booking.id)

    // Create notifications for both car owner and customer
    try {
      // Notification for car owner
      await prisma.notification.create({
        data: {
          userId: car.ownerId,
          title: "New Car Booking Request",
          message: `You have a new booking request for your ${car.brand} ${car.model} from ${validatedData.contactName}. Please review and respond.`,
          type: "BOOKING_UPDATED",
          category: "BOOKING",
          priority: "HIGH",
          isRead: false,
          relatedId: booking.id,
          relatedType: "BOOKING",
        },
      })

      // Notification for customer
      await prisma.notification.create({
        data: {
          userId: userId,
          title: "Car Booking Submitted",
          message: `Your booking request for ${car.brand} ${car.model} has been submitted successfully. Waiting for owner approval.`,
          type: "BOOKING_UPDATED",
          category: "BOOKING",
          priority: "NORMAL",
          isRead: false,
          relatedId: booking.id,
          relatedType: "BOOKING",
        },
      })

      console.log("Notifications created successfully")
    } catch (notificationError) {
      console.error("Error creating notifications:", notificationError)
      // Don't fail the booking if notifications fail
    }

    return NextResponse.json({ 
      booking,
      message: "Booking created successfully. Waiting for car owner approval." 
    }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Validation error:", error.errors)
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Error creating booking:", error)
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    )
  }
} 