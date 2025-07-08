import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@/lib/generated/prisma"
import { z } from "zod"

const prisma = new PrismaClient()

// Validation schema for creating bundles
const createBundleSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  duration: z.number().min(1, "Duration must be at least 1 day"),
  maxGuests: z.number().min(1, "Max guests must be at least 1"),
  price: z.number().min(0, "Price must be non-negative"),
  originalPrice: z.number().optional(),
  currency: z.string().default("USD"),
  includesHotel: z.boolean().default(false),
  includesCar: z.boolean().default(false),
  includesGuide: z.boolean().default(false),
  hotelIds: z.array(z.string()).optional(),
  carIds: z.array(z.string()).optional(),
  guideIds: z.array(z.string()).optional(),
  itinerary: z.string().optional(),
  inclusions: z.array(z.string()).optional(),
  exclusions: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
})

// GET /api/bundles - Fetch all bundles
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get("featured")
    const active = searchParams.get("active")

    const where: any = {}

    if (featured === "true") {
      where.isFeatured = true
    }

    if (active === "true") {
      where.isActive = true
    }

    const bundles = await prisma.bundle.findMany({
      where,
      include: {
        translations: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({ bundles })
  } catch (error) {
    console.error("Error fetching bundles:", error)
    return NextResponse.json(
      { error: "Failed to fetch bundles" },
      { status: 500 }
    )
  }
}

// POST /api/bundles - Create a new bundle
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the request body
    const validatedData = createBundleSchema.parse(body)

    // Create the bundle
    const bundle = await prisma.bundle.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        duration: validatedData.duration,
        maxGuests: validatedData.maxGuests,
        price: validatedData.price,
        originalPrice: validatedData.originalPrice,
        currency: validatedData.currency,
        includesHotel: validatedData.includesHotel,
        includesCar: validatedData.includesCar,
        includesGuide: validatedData.includesGuide,
        hotelIds: validatedData.hotelIds,
        carIds: validatedData.carIds,
        guideIds: validatedData.guideIds,
        itinerary: validatedData.itinerary,
        inclusions: validatedData.inclusions,
        exclusions: validatedData.exclusions,
        images: validatedData.images,
        isActive: validatedData.isActive,
        isFeatured: validatedData.isFeatured,
      },
      include: {
        translations: true,
      },
    })

    return NextResponse.json({ bundle }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Error creating bundle:", error)
    return NextResponse.json(
      { error: "Failed to create bundle" },
      { status: 500 }
    )
  }
} 