import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { bundles, bundleTranslations } from "@/drizzle/schema"
import { eq, and } from "drizzle-orm"
import { z } from "zod"

// Validation schema for creating bundles
const createBundleSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.number().min(0, "Price must be non-negative"),
  currency: z.string().default("USD"),
  services: z.array(z.object({
    type: z.string(),
    id: z.number()
  })).min(1, "At least one service is required"),
  isActive: z.boolean().default(true),
  isSpecialOffer: z.boolean().default(false),
  discountPercentage: z.number().min(0).max(100).default(0),
  startDate: z.string(),
  endDate: z.string(),
  maxBookings: z.number().optional(),
  images: z.array(z.string()).optional(),
})

// GET /api/bundles - Fetch all bundles
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const active = searchParams.get("active")

    let whereConditions = []

    if (active === "true") {
      whereConditions.push(eq(bundles.isActive, true))
    }

    const bundlesData = await db
      .select({
        id: bundles.id,
        name: bundles.name,
        description: bundles.description,
        price: bundles.price,
        currency: bundles.currency,
        services: bundles.services,
        isActive: bundles.isActive,
        isSpecialOffer: bundles.isSpecialOffer,
        discountPercentage: bundles.discountPercentage,
        startDate: bundles.startDate,
        endDate: bundles.endDate,
        maxBookings: bundles.maxBookings,
        currentBookings: bundles.currentBookings,
        images: bundles.images,
        createdAt: bundles.createdAt,
        updatedAt: bundles.updatedAt,
      })
      .from(bundles)
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
      .orderBy(bundles.createdAt)

    return NextResponse.json({ bundles: bundlesData })
  } catch (error) {
    console.error("Error fetching bundles:", error)
    return NextResponse.json(
      { error: "Failed to fetch bundles" },
      { status: 500 }
    )
  }
}

// POST /api/bundles - Create new bundle
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createBundleSchema.parse(body)

    const [bundle] = await db.insert(bundles).values({
      name: validatedData.name,
      description: validatedData.description,
      price: validatedData.price,
      currency: validatedData.currency,
      services: JSON.stringify(validatedData.services),
      isActive: validatedData.isActive,
      isSpecialOffer: validatedData.isSpecialOffer,
      discountPercentage: validatedData.discountPercentage,
      startDate: validatedData.startDate,
      endDate: validatedData.endDate,
      maxBookings: validatedData.maxBookings,
      images: validatedData.images ? JSON.stringify(validatedData.images) : null,
    }).returning()

    return NextResponse.json({ bundle }, { status: 201 })
  } catch (error) {
    console.error("Error creating bundle:", error)
    return NextResponse.json(
      { error: "Failed to create bundle" },
      { status: 500 }
    )
  }
} 