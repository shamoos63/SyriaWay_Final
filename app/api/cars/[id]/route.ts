import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { cars, users } from '@/drizzle/schema'
import { eq } from 'drizzle-orm'

// GET - Fetch single car by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const [car] = await db
      .select({
        id: cars.id,
        make: cars.make,
        model: cars.model,
        year: cars.year,
        licensePlate: cars.licensePlate,
        color: cars.color,
        transmission: cars.transmission,
        fuelType: cars.fuelType,
        seats: cars.seats,
        dailyRate: cars.dailyRate,
        weeklyRate: cars.weeklyRate,
        monthlyRate: cars.monthlyRate,
        description: cars.description,
        features: cars.features,
        images: cars.images,
        location: cars.location,
        isAvailable: cars.isAvailable,
        createdAt: cars.createdAt,
        updatedAt: cars.updatedAt,
        ownerId: cars.ownerId,
        owner: {
          id: users.id,
          name: users.name,
          email: users.email,
          image: users.image,
        }
      })
      .from(cars)
      .leftJoin(users, eq(cars.ownerId, users.id))
      .where(eq(cars.id, parseInt(id)))

    if (!car) {
      return NextResponse.json(
        { error: 'Car not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ car })
  } catch (error) {
    console.error('Error fetching car:', error)
    return NextResponse.json(
      { error: 'Failed to fetch car' },
      { status: 500 }
    )
  }
} 