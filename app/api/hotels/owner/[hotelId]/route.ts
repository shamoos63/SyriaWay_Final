import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { db } from '@/lib/db'
import { hotels } from '@/drizzle/schema'
import { eq, and } from 'drizzle-orm'

// GET - Fetch single hotel owned by the authenticated user
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
    console.error('Error fetching hotel:', error)
    return NextResponse.json(
      { error: 'Failed to fetch hotel' },
      { status: 500 }
    )
  }
}

// PUT - Update hotel
export async function PUT(
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

    // Check if hotel exists and belongs to user
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

    // Update hotel
    const [updatedHotel] = await db
      .update(hotels)
      .set({
        ...body,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(hotels.id, parseInt(hotelId)))
      .returning()

    return NextResponse.json({
      hotel: updatedHotel,
      message: 'Hotel updated successfully'
    })
  } catch (error) {
    console.error('Error updating hotel:', error)
    return NextResponse.json(
      { error: 'Failed to update hotel' },
      { status: 500 }
    )
  }
}

// DELETE - Delete hotel
export async function DELETE(
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

    // Check if hotel exists and belongs to user
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

    // Delete hotel
    await db
      .delete(hotels)
      .where(eq(hotels.id, parseInt(hotelId)))

    return NextResponse.json({
      message: 'Hotel deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting hotel:', error)
    return NextResponse.json(
      { error: 'Failed to delete hotel' },
      { status: 500 }
    )
  }
} 