import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { bundles, bundleTranslations } from "@/drizzle/schema"
import { eq, and, inArray } from "drizzle-orm"
import { z } from "zod"

// Helper function to convert frontend language codes to database language codes
function getDatabaseLanguageCode(frontendLanguage: string): string {
  const languageMap: Record<string, string> = {
    'en': 'ENGLISH',
    'ar': 'ARABIC',
    'fr': 'FRENCH'
  }
  return languageMap[frontendLanguage] || 'ENGLISH'
}

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
  itinerary: z.string().optional(),
  inclusions: z.array(z.string()).optional(),
  exclusions: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  translations: z.array(z.object({
    language: z.string(),
    name: z.string(),
    description: z.string().optional(),
  })).optional(),
})

// GET /api/bundles - Fetch all bundles
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const active = searchParams.get("active")
    const language = searchParams.get("language") || "ENGLISH"

    let whereConditions = []

    if (active === "true") {
      whereConditions.push(eq(bundles.isActive, true))
    }

    const bundlesData = await db
      .select({
        id: bundles.id,
        name: bundles.name,
        description: bundles.description,
        duration: bundles.duration,
        maxGuests: bundles.maxGuests,
        price: bundles.price,
        originalPrice: bundles.originalPrice,
        currency: bundles.currency,
        includesHotel: bundles.includesHotel,
        includesCar: bundles.includesCar,
        includesGuide: bundles.includesGuide,
        itinerary: bundles.itinerary,
        inclusions: bundles.inclusions,
        exclusions: bundles.exclusions,
        services: bundles.services,
        isActive: bundles.isActive,
        isFeatured: bundles.isFeatured,
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

    // Get translations for all bundles
    const bundleIds = bundlesData.map(bundle => bundle.id)
    let allTranslations = []
    if (bundleIds.length > 0) {
      allTranslations = await db
        .select()
        .from(bundleTranslations)
        .where(inArray(bundleTranslations.bundleId, bundleIds))
    }

    // Apply translations to bundles
    const bundlesWithTranslations = bundlesData.map(bundle => {
      const databaseLanguage = getDatabaseLanguageCode(language)
      const translation = allTranslations.find(t => t.bundleId === bundle.id && t.language === databaseLanguage)
      
      return {
        ...bundle,
        // Override with translation if available
        name: translation?.name || bundle.name,
        description: translation?.description || bundle.description,
        translations: allTranslations.filter(t => t.bundleId === bundle.id)
      }
    })

    return NextResponse.json({ bundles: bundlesWithTranslations })
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

    // Create services array from the form data
    const services = []
    if (validatedData.includesHotel) services.push({ type: 'hotel', id: 1 })
    if (validatedData.includesCar) services.push({ type: 'car', id: 2 })
    if (validatedData.includesGuide) services.push({ type: 'guide', id: 3 })

    // Set default dates if not provided
    const startDate = new Date().toISOString().split('T')[0]
    const endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 30 days from now

    const [bundle] = await db.insert(bundles).values({
      name: validatedData.name,
      description: validatedData.description,
      price: validatedData.price,
      currency: validatedData.currency,
      services: JSON.stringify(services),
      isActive: validatedData.isActive,
      isSpecialOffer: false, // Default value
      discountPercentage: 0, // Default value
      startDate: startDate,
      endDate: endDate,
      maxBookings: null, // Default value
      images: validatedData.images ? JSON.stringify(validatedData.images) : null,
    }).returning()

    // Handle translations if provided
    if (validatedData.translations && validatedData.translations.length > 0) {
      await db
        .insert(bundleTranslations)
        .values(validatedData.translations.map(t => ({
          ...t,
          bundleId: bundle.id
        })))
    }

    return NextResponse.json({ bundle }, { status: 201 })
  } catch (error) {
    console.error("Error creating bundle:", error)
    return NextResponse.json(
      { error: "Failed to create bundle" },
      { status: 500 }
    )
  }
} 