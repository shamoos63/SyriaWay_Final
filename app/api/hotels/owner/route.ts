import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { db } from '@/lib/db'
import { hotels, users, rooms, bookings } from '@/drizzle/schema'
import { eq, sql } from 'drizzle-orm'

// GET - Fetch hotels owned by the authenticated user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    const userId = getUserId(session);
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Fetch hotels for the owner
    const hotelsData = await db
      .select({
        id: hotels.id,
        name: hotels.name,
        description: hotels.description,
        address: hotels.address,
        city: hotels.city,
        phone: hotels.phone,
        email: hotels.email,
        website: hotels.website,
        ownerId: hotels.ownerId,
        starRating: hotels.starRating,
        checkInTime: hotels.checkInTime,
        checkOutTime: hotels.checkOutTime,
        amenities: hotels.amenities,
        images: hotels.images,
        latitude: hotels.latitude,
        longitude: hotels.longitude,
        googleMapLink: hotels.googleMapLink,
        isActive: hotels.isActive,
        isVerified: hotels.isVerified,
        isSpecialOffer: hotels.isSpecialOffer,
        createdAt: hotels.createdAt,
        updatedAt: hotels.updatedAt,
      })
      .from(hotels)
      .where(eq(hotels.ownerId, userId))

    // If no hotels, return early
    if (!hotelsData || hotelsData.length === 0) {
      return NextResponse.json({ hotels: [] })
    }

    // Fetch all rooms for these hotels
    const hotelIds = hotelsData.map(h => h.id)
    const roomsData = await db
      .select()
      .from(rooms)
      .where(sql`${rooms.hotelId} IN (${hotelIds.join(',')})`)

    // Fetch all bookings for these hotels (by hotelId and serviceType)
    let bookingsData = []
    if (hotelIds.length > 0) {
      bookingsData = await db
        .select()
        .from(bookings)
        .where(
          sql`${bookings.serviceType} = 'HOTEL' AND ${bookings.serviceId} IN (${hotelIds.join(',')})`
        )
    }

    // Attach bookings to rooms (no direct roomId link in bookings table, so set to empty array)
    const roomsWithBookings = roomsData.map(room => ({
      ...room,
      bookings: [] // No direct roomId link in bookings table
    }))

    // Attach rooms to hotels
    const hotelsWithRooms = hotelsData.map(hotel => ({
      ...hotel,
      // Parse amenities and images if they are JSON strings
      amenities: typeof hotel.amenities === 'string' ? (hotel.amenities ? safeJsonParse(hotel.amenities) : []) : hotel.amenities,
      images: typeof hotel.images === 'string' ? (hotel.images ? safeJsonParse(hotel.images) : []) : hotel.images,
      rooms: roomsWithBookings.filter(room => room.hotelId === hotel.id)
    }))

    return NextResponse.json({ hotels: hotelsWithRooms })
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
    
    const userId = getUserId(session);
    if (!userId) {
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
      phone,
      email,
      website,
      amenities,
      images
    } = body

    // Validate required fields
    if (!name || !description || !address || !city) {
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
        phone: phone || null,
        email: email || null,
        website: website || null,
        ownerId: userId,
        starRating: 0,
        checkInTime: '14:00',
        checkOutTime: '12:00',
        amenities: amenities || null,
        images: images || null,
        latitude: null,
        longitude: null,
        googleMapLink: null,
        isActive: true,
        isVerified: false,
        isSpecialOffer: false,
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

// Helper for safe JSON parsing
function safeJsonParse(str: string) {
  try {
    return JSON.parse(str)
  } catch {
    return []
  }
} 

// Helper to extract user id from session
function getUserId(session: any): number {
  return parseInt(session?.user?.id || session?.user?.userId || '0');
} 