import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@/lib/generated/prisma"
import { z } from "zod"

const prisma = new PrismaClient()

// Validation schema for updating bundles
const updateBundleSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  description: z.string().optional(),
  duration: z.number().min(1, "Duration must be at least 1 day").optional(),
  maxGuests: z.number().min(1, "Max guests must be at least 1").optional(),
  price: z.number().min(0, "Price must be non-negative").optional(),
  originalPrice: z.number().optional(),
  currency: z.string().optional(),
  includesHotel: z.boolean().optional(),
  includesCar: z.boolean().optional(),
  includesGuide: z.boolean().optional(),
  hotelIds: z.array(z.string()).optional(),
  carIds: z.array(z.string()).optional(),
  guideIds: z.array(z.string()).optional(),
  itinerary: z.string().optional(),
  inclusions: z.array(z.string()).optional(),
  exclusions: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
})

// GET /api/bundles/[id] - Get a specific bundle
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bundle = await prisma.bundle.findUnique({
      where: { id: params.id },
      include: {
        translations: true,
      },
    })

    if (!bundle) {
      return NextResponse.json(
        { error: "Bundle not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ bundle })
  } catch (error) {
    console.error("Error fetching bundle:", error)
    return NextResponse.json(
      { error: "Failed to fetch bundle" },
      { status: 500 }
    )
  }
}

// PUT /api/bundles/[id] - Update a bundle
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    // Validate the request body
    const validatedData = updateBundleSchema.parse(body)

    // Check if bundle exists
    const existingBundle = await prisma.bundle.findUnique({
      where: { id: params.id },
    })

    if (!existingBundle) {
      return NextResponse.json(
        { error: "Bundle not found" },
        { status: 404 }
      )
    }

    // Update the bundle
    const bundle = await prisma.bundle.update({
      where: { id: params.id },
      data: validatedData,
      include: {
        translations: true,
      },
    })

    return NextResponse.json({ bundle })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Error updating bundle:", error)
    return NextResponse.json(
      { error: "Failed to update bundle" },
      { status: 500 }
    )
  }
}

// PATCH /api/bundles/[id] - Update bundle status
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    // Check if bundle exists
    const existingBundle = await prisma.bundle.findUnique({
      where: { id: params.id },
    })

    if (!existingBundle) {
      return NextResponse.json(
        { error: "Bundle not found" },
        { status: 404 }
      )
    }

    // Update only the allowed fields for status changes
    const updateData: any = {}
    if (typeof body.isActive === 'boolean') {
      updateData.isActive = body.isActive
    }
    if (typeof body.isFeatured === 'boolean') {
      updateData.isFeatured = body.isFeatured
    }

    // Update the bundle
    const bundle = await prisma.bundle.update({
      where: { id: params.id },
      data: updateData,
      include: {
        translations: true,
      },
    })

    return NextResponse.json({ bundle })
  } catch (error) {
    console.error("Error updating bundle status:", error)
    return NextResponse.json(
      { error: "Failed to update bundle status" },
      { status: 500 }
    )
  }
}

// DELETE /api/bundles/[id] - Delete a bundle
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if bundle exists
    const existingBundle = await prisma.bundle.findUnique({
      where: { id: params.id },
    })

    if (!existingBundle) {
      return NextResponse.json(
        { error: "Bundle not found" },
        { status: 404 }
      )
    }

    // Delete the bundle
    await prisma.bundle.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "Bundle deleted successfully" })
  } catch (error) {
    console.error("Error deleting bundle:", error)
    return NextResponse.json(
      { error: "Failed to delete bundle" },
      { status: 500 }
    )
  }
} 