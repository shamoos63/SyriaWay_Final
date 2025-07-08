import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@/lib/generated/prisma'

const prisma = new PrismaClient()

export async function PUT(
  request: NextRequest,
  { params }: { params: { hotelId: string; roomId: string } }
) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const ownerId = authHeader.replace('Bearer ', '')

    // Verify the hotel belongs to this owner
    const hotel = await prisma.hotel.findFirst({
      where: { id: params.hotelId, ownerId }
    })
    if (!hotel) {
      return NextResponse.json({ error: 'Hotel not found or access denied' }, { status: 404 })
    }

    const body = await request.json()
    const { name, roomType, capacity, pricePerNight, amenities, bedType, images, description } = body

    // Validate required fields
    if (!name || !roomType || !capacity || !pricePerNight) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Find the room to update
    const existingRoom = await prisma.room.findFirst({
      where: { 
        id: params.roomId, 
        hotelId: params.hotelId 
      }
    })

    if (!existingRoom) {
      return NextResponse.json(
        { error: 'Room not found' },
        { status: 404 }
      )
    }

    // Check if room name already exists for this hotel (excluding current room)
    const duplicateRoom = await prisma.room.findFirst({
      where: {
        hotelId: params.hotelId,
        name,
        id: { not: params.roomId }
      }
    })
    if (duplicateRoom) {
      return NextResponse.json(
        { error: 'Room name already exists' },
        { status: 400 }
      )
    }

    // Update the room
    const updatedRoom = await prisma.room.update({
      where: { id: params.roomId },
      data: {
        name,
        roomType,
        capacity: parseInt(capacity),
        pricePerNight: parseFloat(pricePerNight),
        bedType: bedType || null,
        amenities: amenities || [],
        images: images || [],
        description: description || `${roomType} room`,
        maxOccupancy: parseInt(capacity),
      }
    })

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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { hotelId: string; roomId: string } }
) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const ownerId = authHeader.replace('Bearer ', '')

    // Verify the hotel belongs to this owner
    const hotel = await prisma.hotel.findFirst({
      where: { id: params.hotelId, ownerId }
    })
    if (!hotel) {
      return NextResponse.json({ error: 'Hotel not found or access denied' }, { status: 404 })
    }

    // Find the room to delete
    const room = await prisma.room.findFirst({
      where: { 
        id: params.roomId, 
        hotelId: params.hotelId 
      }
    })

    if (!room) {
      return NextResponse.json(
        { error: 'Room not found' },
        { status: 404 }
      )
    }

    // Check if room has any active bookings
    const activeBookings = await prisma.booking.findFirst({
      where: {
        roomId: params.roomId,
        status: { in: ['PENDING', 'CONFIRMED'] }
      }
    })

    if (activeBookings) {
      return NextResponse.json(
        { error: 'Cannot delete room with active bookings' },
        { status: 400 }
      )
    }

    // Delete the room
    await prisma.room.delete({
      where: { id: params.roomId }
    })

    return NextResponse.json({
      message: 'Room deleted successfully',
      room: room
    })

  } catch (error) {
    console.error('Error deleting room:', error)
    return NextResponse.json(
      { error: 'Failed to delete room' },
      { status: 500 }
    )
  }
} 