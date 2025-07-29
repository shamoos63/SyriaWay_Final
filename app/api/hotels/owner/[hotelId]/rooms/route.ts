import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { db } from '@/lib/db'
import { rooms, hotels } from '@/drizzle/schema'
import { eq, and } from 'drizzle-orm'

// GET - Fetch rooms for a hotel owned by the authenticated user
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ hotelId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { hotelId } = await params

    // Check if hotel belongs to user
    const [hotel] = await db
      .select()
      .from(hotels)
      .where(and(
        eq(hotels.id, parseInt(hotelId)),
        eq(hotels.ownerId, parseInt(session.user.id))
      ))

    if (!hotel) {
      return NextResponse.json(
        { error: 'Hotel not found' },
        { status: 404 }
      )
    }

    const roomsData = await db
      .select()
      .from(rooms)
      .where(eq(rooms.hotelId, parseInt(hotelId)))

    return NextResponse.json({ rooms: roomsData })
  } catch (error) {
    console.error('Error fetching rooms:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch rooms',
        rooms: []
      },
      { status: 500 }
    )
  }
}

// POST - Create new room
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ hotelId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { hotelId } = await params
    const body = await request.json()
    const {
      name,
      roomNumber,
      roomType,
      description,
      pricePerNight,
      capacity,
      amenities,
      images,
      bedType,
      bedCount,
      bathroomCount,
      isAvailable
    } = body

    // Check if hotel belongs to user
    const [hotel] = await db
      .select()
      .from(hotels)
      .where(and(
        eq(hotels.id, parseInt(hotelId)),
        eq(hotels.ownerId, parseInt(session.user.id))
      ))

    if (!hotel) {
      return NextResponse.json(
        { error: 'Hotel not found' },
        { status: 404 }
      )
    }

    // Validate required fields
    if (!name || !roomNumber || !roomType || !capacity || !pricePerNight) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create room
    const [newRoom] = await db
      .insert(rooms)
      .values({
        hotelId: parseInt(hotelId),
        name,
        roomNumber,
        roomType,
        description: description || null,
        pricePerNight: parseFloat(pricePerNight),
        capacity: parseInt(capacity),
        amenities: amenities || null,
        images: images || null,
        bedType: bedType || null,
        bedCount: bedCount ? parseInt(bedCount) : 1,
        bathroomCount: bathroomCount ? parseInt(bathroomCount) : 1,
        isAvailable: isAvailable !== false,
      })
      .returning()

    return NextResponse.json({
      room: newRoom,
      message: 'Room created successfully'
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating room:', error)
    return NextResponse.json(
      { error: 'Failed to create room' },
      { status: 500 }
    )
  }
} 