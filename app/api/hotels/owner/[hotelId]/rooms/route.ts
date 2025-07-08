import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@/lib/generated/prisma'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: { hotelId: string } }
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

    // Get all rooms for this hotel with their bookings
    const rooms = await prisma.room.findMany({
      where: { hotelId: params.hotelId },
      include: {
        bookings: {
          where: {
            status: 'CONFIRMED',
            startDate: { lte: new Date() },
            endDate: { gte: new Date() }
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          },
          orderBy: { startDate: 'desc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      rooms: rooms.map(room => ({
        id: room.id,
        name: room.name,
        roomNumber: room.roomNumber,
        roomType: room.roomType,
        capacity: room.capacity,
        pricePerNight: room.pricePerNight,
        isAvailable: room.isAvailable,
        amenities: room.amenities,
        images: room.images,
        description: room.description,
        bedType: room.bedType,
        floor: room.floor,
        price: room.pricePerNight,
        bookings: room.bookings,
        createdAt: room.createdAt,
        updatedAt: room.updatedAt
      }))
    })

  } catch (error) {
    console.error('Error fetching rooms:', error)
    return NextResponse.json(
      { error: 'Failed to fetch rooms' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { hotelId: string } }
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
    const { name, roomNumber, roomType, capacity, pricePerNight, amenities, bedType, images, description } = body

    // Validate required fields
    if (!name || !roomNumber || !roomType || !capacity || !pricePerNight) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if room number already exists for this hotel
    const existingRoomNumber = await prisma.room.findFirst({
      where: { hotelId: params.hotelId, roomNumber }
    })
    if (existingRoomNumber) {
      return NextResponse.json(
        { error: 'Room number already exists' },
        { status: 400 }
      )
    }

    // Create new room
    const newRoom = await prisma.room.create({
      data: {
        hotelId: params.hotelId,
        name,
        roomType,
        capacity: parseInt(capacity),
        pricePerNight: parseFloat(pricePerNight),
        isAvailable: true,
        bedType: bedType || null,
        amenities: amenities || [],
        images: images || [],
        description: description || `${roomType} room`,
        currency: 'USD',
        bedCount: 1,
        bathroomCount: 1,
        maxOccupancy: parseInt(capacity),
        roomNumber: roomNumber,
      }
    })

    return NextResponse.json({
      room: newRoom,
      message: 'Room added successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Error adding room:', error)
    return NextResponse.json(
      { error: 'Failed to add room' },
      { status: 500 }
    )
  }
} 