import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { cars, users } from "@/drizzle/schema"
import { eq, and, or, like } from "drizzle-orm"

// GET /api/cars - Fetch all cars with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const available = searchParams.get("available")
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const verified = searchParams.get("verified")

    let whereConditions = []

    if (available === "true") {
      whereConditions.push(eq(cars.isAvailable, true))
      
      // For available cars, we need to check if they have active bookings
      // This is a simplified version - in a real app you might want to check booking dates
    }

    if (category) {
      whereConditions.push(eq(cars.category, category))
    }

    if (verified === "true") {
      whereConditions.push(eq(cars.isVerified, true))
    }

    if (search) {
      whereConditions.push(
        or(
          like(cars.brand, `%${search}%`),
          like(cars.model, `%${search}%`),
          like(cars.licensePlate, `%${search}%`)
        )
      )
    }

    const carsData = await db
      .select({
        id: cars.id,
        brand: cars.brand,
        model: cars.model,
        year: cars.year,
        color: cars.color,
        licensePlate: cars.licensePlate,
        ownerId: cars.ownerId,
        category: cars.category,
        transmission: cars.transmission,
        fuelType: cars.fuelType,
        seats: cars.seats,
        doors: cars.doors,
        pricePerDay: cars.pricePerDay,
        currency: cars.currency,
        features: cars.features,
        images: cars.images,
        currentLocation: cars.currentLocation,
        isAvailable: cars.isAvailable,
        isVerified: cars.isVerified,
        isSpecialOffer: cars.isSpecialOffer,
        lastServiceDate: cars.lastServiceDate,
        nextServiceDate: cars.nextServiceDate,
        mileage: cars.mileage,
        createdAt: cars.createdAt,
        updatedAt: cars.updatedAt,
        owner: {
          id: users.id,
          name: users.name,
          email: users.email,
        },
      })
      .from(cars)
      .leftJoin(users, eq(cars.ownerId, users.id))
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
      .orderBy(cars.createdAt)

    return NextResponse.json({ cars: carsData })
  } catch (error) {
    console.error("Error fetching cars:", error)
    return NextResponse.json(
      { error: "Failed to fetch cars" },
      { status: 500 }
    )
  }
} 