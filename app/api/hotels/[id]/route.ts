import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hotels, rooms as dbRooms } from '@/drizzle/schema'
import { eq } from 'drizzle-orm'

// GET - Fetch single hotel by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const includeRooms = searchParams.get('includeRooms') === 'true'

    const [hotel] = await db
      .select()
      .from(hotels)
      .where(eq(hotels.id, parseInt(id)))

    if (!hotel) {
      return NextResponse.json(
        { error: 'Hotel not found' },
        { status: 404 }
      )
    }

    let rooms: any[] = []
    if (includeRooms) {
      rooms = await db
        .select()
        .from(dbRooms)
        .where(eq(dbRooms.hotelId, parseInt(id)))
    }

    return NextResponse.json({ 
      hotel,
      rooms: includeRooms ? rooms : undefined
    })
  } catch (error) {
    console.error('Error fetching hotel:', error)
    return NextResponse.json(
      { error: 'Failed to fetch hotel' },
      { status: 500 }
    )
  }
} 