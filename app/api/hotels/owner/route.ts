import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { db } from '@/lib/db'
import { hotels, users } from '@/drizzle/schema'
import { eq } from 'drizzle-orm'

// GET - Fetch hotels owned by the authenticated user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const hotelsData = await db
      .select({
        id: hotels.id,
        name: hotels.name,
        description: hotels.description,
        address: hotels.address,
        city: hotels.city,
        country: hotels.country,
        phone: hotels.phone,
        email: hotels.email,
        website: hotels.website,
        rating: hotels.rating,
        priceRange: hotels.priceRange,
        amenities: hotels.amenities,
        images: hotels.images,
        isActive: hotels.isActive,
        isVerified: hotels.isVerified,
        createdAt: hotels.createdAt,
        updatedAt: hotels.updatedAt,
        ownerId: hotels.ownerId,
      })
      .from(hotels)
      .where(eq(hotels.ownerId, parseInt(session.user.id)))

    return NextResponse.json({ hotels: hotelsData })
  } catch (error) {
    console.error('Error fetching hotels:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch hotels',
        hotels: []
      },
      { status: 500 }
    )
  }
}

// POST - Create new hotel
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
      name,
      description,
      address,
      city,
      country,
      phone,
      email,
      website,
      priceRange,
      amenities,
      images
    } = body

    // Validate required fields
    if (!name || !description || !address || !city || !country) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create hotel
    const [newHotel] = await db
      .insert(hotels)
      .values({
        name,
        description,
        address,
        city,
        country,
        phone: phone || null,
        email: email || null,
        website: website || null,
        rating: 0,
        priceRange: priceRange || null,
        amenities: amenities || null,
        images: images || null,
        isActive: true,
        isVerified: false,
        ownerId: parseInt(session.user.id),
      })
      .returning()

    return NextResponse.json({
      hotel: newHotel,
      message: 'Hotel created successfully'
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating hotel:', error)
    return NextResponse.json(
      { error: 'Failed to create hotel' },
      { status: 500 }
    )
  }
} 