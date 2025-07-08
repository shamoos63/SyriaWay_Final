import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@/lib/generated/prisma"
import { z } from "zod"

const prisma = new PrismaClient()

// Validation schema for creating cars
const createCarSchema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.number().min(1900, "Invalid year"),
  color: z.string().min(1, "Color is required"),
  licensePlate: z.string().min(1, "License plate is required"),
  category: z.string().min(1, "Category is required"),
  transmission: z.string().min(1, "Transmission is required"),
  fuelType: z.string().min(1, "Fuel type is required"),
  seats: z.number().min(1, "Seats must be at least 1"),
  doors: z.number().min(1, "Doors must be at least 1"),
  pricePerDay: z.number().min(0, "Price must be non-negative"),
  currency: z.string().default("USD"),
  features: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
  currentLocation: z.string().optional(),
  isAvailable: z.boolean().default(true),
  lastServiceDate: z.string().optional(),
  nextServiceDate: z.string().optional(),
  mileage: z.number().min(0).optional(),
})

// GET /api/cars/owner - Get cars owned by the authenticated user
export async function GET(request: NextRequest) {
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
    // In a real app, you'd verify the JWT token here
    // For now, we'll assume the token contains the user ID
    const userId = token // This should be decoded from JWT

    const cars = await prisma.car.findMany({
      where: { ownerId: userId },
      include: {
        bookings: {
          where: {
            status: {
              in: ["PENDING", "CONFIRMED"]
            },
          },
          select: {
            id: true,
            startDate: true,
            endDate: true,
            totalPrice: true,
            status: true,
          },
        },
        translations: {
          select: {
            description: true,
            language: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({ cars })
  } catch (error) {
    console.error("Error fetching owner cars:", error)
    return NextResponse.json(
      { error: "Failed to fetch cars" },
      { status: 500 }
    )
  }
}

// POST /api/cars/owner - Create a new car for the authenticated user
export async function POST(request: NextRequest) {
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
    const validatedData = createCarSchema.parse(body)

    // Check if license plate already exists
    const existingCar = await prisma.car.findUnique({
      where: { licensePlate: validatedData.licensePlate },
    })

    if (existingCar) {
      return NextResponse.json(
        { error: "License plate already exists" },
        { status: 400 }
      )
    }

    // Create the car
    const car = await prisma.car.create({
      data: {
        ...validatedData,
        ownerId: userId,
        lastServiceDate: validatedData.lastServiceDate ? new Date(validatedData.lastServiceDate) : null,
        nextServiceDate: validatedData.nextServiceDate ? new Date(validatedData.nextServiceDate) : null,
      },
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

    return NextResponse.json({ car }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Error creating car:", error)
    return NextResponse.json(
      { error: "Failed to create car" },
      { status: 500 }
    )
  }
} 