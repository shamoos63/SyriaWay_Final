import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@/lib/generated/prisma"
import { z } from "zod"

const prisma = new PrismaClient()

// Validation schema for updating cars
const updateCarSchema = z.object({
  make: z.string().min(1, "Make is required").optional(),
  model: z.string().min(1, "Model is required").optional(),
  year: z.number().min(1900, "Invalid year").optional(),
  color: z.string().min(1, "Color is required").optional(),
  licensePlate: z.string().min(1, "License plate is required").optional(),
  category: z.string().min(1, "Category is required").optional(),
  transmission: z.string().min(1, "Transmission is required").optional(),
  fuelType: z.string().min(1, "Fuel type is required").optional(),
  seats: z.number().min(1, "Seats must be at least 1").optional(),
  doors: z.number().min(1, "Doors must be at least 1").optional(),
  pricePerDay: z.number().min(0, "Price must be non-negative").optional(),
  currency: z.string().optional(),
  features: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
  currentLocation: z.string().optional(),
  isAvailable: z.boolean().optional(),
  isVerified: z.boolean().optional(),
  lastServiceDate: z.string().optional(),
  nextServiceDate: z.string().optional(),
  mileage: z.number().min(0).optional(),
})

// GET /api/cars/[id] - Get specific car
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
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
        translations: true,
      },
    })

    if (!car) {
      return NextResponse.json(
        { error: "Car not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ car })
  } catch (error) {
    console.error("Error fetching car:", error)
    return NextResponse.json(
      { error: "Failed to fetch car" },
      { status: 500 }
    )
  }
}

// PUT /api/cars/[id] - Update car
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    // Validate the request body
    const validatedData = updateCarSchema.parse(body)

    // Check if car exists
    const existingCar = await prisma.car.findUnique({
      where: { id: params.id },
    })

    if (!existingCar) {
      return NextResponse.json(
        { error: "Car not found" },
        { status: 404 }
      )
    }

    // Update the car
    const car = await prisma.car.update({
      where: { id: params.id },
      data: validatedData,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        translations: true,
      },
    })

    return NextResponse.json({ car })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Error updating car:", error)
    return NextResponse.json(
      { error: "Failed to update car" },
      { status: 500 }
    )
  }
}

// DELETE /api/cars/[id] - Delete car
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if car exists
    const existingCar = await prisma.car.findUnique({
      where: { id: params.id },
    })

    if (!existingCar) {
      return NextResponse.json(
        { error: "Car not found" },
        { status: 404 }
      )
    }

    // Delete the car
    await prisma.car.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "Car deleted successfully" })
  } catch (error) {
    console.error("Error deleting car:", error)
    return NextResponse.json(
      { error: "Failed to delete car" },
      { status: 500 }
    )
  }
} 