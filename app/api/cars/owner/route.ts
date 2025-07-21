import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { db } from '@/lib/db'
import { cars } from '@/drizzle/schema'
import { eq } from 'drizzle-orm'

// GET - Fetch cars owned by the authenticated user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const carsData = await db
      .select()
      .from(cars)
      .where(eq(cars.ownerId, parseInt(session.user.id)))

    return NextResponse.json({ cars: carsData })
  } catch (error) {
    console.error('Error fetching cars:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch cars',
        cars: []
      },
      { status: 500 }
    )
  }
}

// POST - Create new car
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    const body = await request.json()
    const {
      brand,
      model,
      year,
      licensePlate,
      color,
      category,
      transmission,
      fuelType,
      seats,
      doors,
      pricePerDay,
      currency,
      description,
      features,
      images,
      currentLocation,
      isAvailable,
      isVerified,
      isSpecialOffer,
      lastServiceDate,
      nextServiceDate,
      mileage
    } = body
    // Validate required fields
    const missingFields = []
    if (!brand) missingFields.push('brand')
    if (!model) missingFields.push('model')
    if (!year) missingFields.push('year')
    if (!licensePlate) missingFields.push('licensePlate')
    if (!color) missingFields.push('color')
    if (!category) missingFields.push('category')
    if (!transmission) missingFields.push('transmission')
    if (!fuelType) missingFields.push('fuelType')
    if (!pricePerDay) missingFields.push('pricePerDay')
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: 'Missing required fields: ' + missingFields.join(', ') },
        { status: 400 }
      )
    }
    // Create car
    const [newCar] = await db
      .insert(cars)
      .values({
        brand,
        model,
        year: parseInt(year),
        licensePlate,
        color,
        category,
        transmission,
        fuelType,
        seats: seats ? parseInt(seats) : 5,
        doors: doors ? parseInt(doors) : 4,
        pricePerDay: parseFloat(pricePerDay),
        currency: currency || 'USD',
        description: description || null,
        features: features || null,
        images: images || null,
        currentLocation: currentLocation || null,
        isAvailable: isAvailable !== false,
        isVerified: isVerified || false,
        isSpecialOffer: isSpecialOffer || false,
        lastServiceDate: lastServiceDate || null,
        nextServiceDate: nextServiceDate || null,
        mileage: mileage ? parseInt(mileage) : 0,
        ownerId: parseInt(session.user.id),
      })
      .returning()
    return NextResponse.json({ car: newCar })
  } catch (error) {
    console.error('Error creating car:', error)
    return NextResponse.json(
      { error: 'Failed to create car' },
      { status: 500 }
    )
  }
} 