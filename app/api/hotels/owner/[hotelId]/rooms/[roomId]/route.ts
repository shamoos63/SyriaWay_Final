import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { db } from '@/lib/db'
import { rooms, hotels } from '@/drizzle/schema'
import { eq, and } from 'drizzle-orm'

// Helper to extract user id from session
function getUserId(session: any): number {
  return parseInt(session?.user?.id || session?.user?.userId || '0');
}

// GET - Fetch single room
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ hotelId: string; roomId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    const userId = getUserId(session);
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { hotelId, roomId } = await params

    // Check if hotel belongs to user
    const [hotel] = await db
      .select()
      .from(hotels)
      .where(and(
        eq(hotels.id, parseInt(hotelId)),
        eq(hotels.ownerId, userId)
      ))

    if (!hotel) {
      return NextResponse.json(
        { error: 'Hotel not found' },
        { status: 404 }
      )
    }

    const [room] = await db
      .select()
      .from(rooms)
      .where(eq(rooms.id, parseInt(roomId)))

    if (!room) {
      return NextResponse.json(
        { error: 'Room not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ room })
  } catch (error) {
    console.error('Error fetching room:', error)
    return NextResponse.json(
      { error: 'Failed to fetch room' },
      { status: 500 }
    )
  }
}

// PUT - Update room
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ hotelId: string; roomId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    const userId = getUserId(session);
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { hotelId, roomId } = await params
    const body = await request.json()

    // Check if hotel belongs to user
    const [hotel] = await db
      .select()
      .from(hotels)
      .where(and(
        eq(hotels.id, parseInt(hotelId)),
        eq(hotels.ownerId, userId)
      ))

    if (!hotel) {
      return NextResponse.json(
        { error: 'Hotel not found' },
        { status: 404 }
      )
    }

    // Check if room exists
    const [existingRoom] = await db
      .select()
      .from(rooms)
      .where(eq(rooms.id, parseInt(roomId)))

    if (!existingRoom) {
      return NextResponse.json(
        { error: 'Room not found' },
        { status: 404 }
      )
    }

    // Update room
    const [updatedRoom] = await db
      .update(rooms)
      .set({
        ...body,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(rooms.id, parseInt(roomId)))
      .returning()

    return NextResponse.json({
      room: updatedRoom,
      message: 'Room updated successfully'
    })
  } catch (error) {
    console.error('Error updating room:', error)
    return NextResponse.json(
      { error: 'Failed to update room' },
      { status: 500 }
    )
  }
}

// DELETE - Delete room
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ hotelId: string; roomId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    const userId = getUserId(session);
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { hotelId, roomId } = await params

    // Check if hotel belongs to user
    const [hotel] = await db
      .select()
      .from(hotels)
      .where(and(
        eq(hotels.id, parseInt(hotelId)),
        eq(hotels.ownerId, userId)
      ))

    if (!hotel) {
      return NextResponse.json(
        { error: 'Hotel not found' },
        { status: 404 }
      )
    }

    // Check if room exists
    const [existingRoom] = await db
      .select()
      .from(rooms)
      .where(eq(rooms.id, parseInt(roomId)))

    if (!existingRoom) {
      return NextResponse.json(
        { error: 'Room not found' },
        { status: 404 }
      )
    }

    // Delete room
    await db
      .delete(rooms)
      .where(eq(rooms.id, parseInt(roomId)))

    return NextResponse.json({
      message: 'Room deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting room:', error)
    return NextResponse.json(
      { error: 'Failed to delete room' },
      { status: 500 }
    )
  }
} 