import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { db } from '@/lib/db'
import { hotels } from '@/drizzle/schema'
import { eq, and } from 'drizzle-orm'

// GET - Fetch hotel settings
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const hotelId = searchParams.get('hotelId')

    if (!hotelId) {
      return NextResponse.json(
        { error: 'Hotel ID is required' },
        { status: 400 }
      )
    }

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

    return NextResponse.json({ hotel })
  } catch (error) {
    console.error('Error fetching hotel settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch hotel settings' },
      { status: 500 }
    )
  }
}

// PUT - Update hotel settings
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { hotelId, ...updateData } = body

    if (!hotelId) {
      return NextResponse.json(
        { error: 'Hotel ID is required' },
        { status: 400 }
      )
    }

    // Check if hotel belongs to user
    const [existingHotel] = await db
      .select()
      .from(hotels)
      .where(and(
        eq(hotels.id, parseInt(hotelId)),
        eq(hotels.ownerId, parseInt(session.user.id))
      ))

    if (!existingHotel) {
      return NextResponse.json(
        { error: 'Hotel not found' },
        { status: 404 }
      )
    }

    // Update hotel settings
    const [updatedHotel] = await db
      .update(hotels)
      .set({
        ...updateData,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(hotels.id, parseInt(hotelId)))
      .returning()

    return NextResponse.json({
      hotel: updatedHotel,
      message: 'Hotel settings updated successfully'
    })
  } catch (error) {
    console.error('Error updating hotel settings:', error)
    return NextResponse.json(
      { error: 'Failed to update hotel settings' },
      { status: 500 }
    )
  }
} 