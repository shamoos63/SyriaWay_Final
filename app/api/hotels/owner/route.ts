import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@/lib/generated/prisma'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const ownerId = authHeader.replace('Bearer ', '')

    // Find all hotels owned by this user with their rooms
    const hotels = await prisma.hotel.findMany({
      where: { ownerId },
      include: {
        rooms: {
          include: {
            bookings: {
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
          orderBy: { name: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Format hotels for the frontend
    const formatted = hotels.map(hotel => ({
      id: hotel.id,
      name: hotel.name,
      description: hotel.description,
      address: hotel.address,
      city: hotel.city,
      phone: hotel.phone,
      email: hotel.email,
      website: hotel.website,
      starRating: hotel.starRating,
      checkInTime: hotel.checkInTime,
      checkOutTime: hotel.checkOutTime,
      amenities: hotel.amenities,
      images: hotel.images,
      latitude: hotel.latitude,
      longitude: hotel.longitude,
      isActive: hotel.isActive,
      isVerified: hotel.isVerified,
      createdAt: hotel.createdAt,
      updatedAt: hotel.updatedAt,
      rooms: hotel.rooms.map(room => ({
        id: room.id,
        hotelId: room.hotelId,
        name: room.name,
        roomNumber: room.roomNumber,
        roomType: room.roomType,
        capacity: room.capacity,
        pricePerNight: room.pricePerNight,
        price: room.pricePerNight,
        isAvailable: room.isAvailable,
        bedType: room.bedType,
        amenities: room.amenities,
        images: room.images,
        description: room.description,
        floor: room.floor,
        size: room.size,
        currency: room.currency,
        bedCount: room.bedCount,
        bathroomCount: room.bathroomCount,
        maxOccupancy: room.maxOccupancy,
        bookings: room.bookings,
        createdAt: room.createdAt,
        updatedAt: room.updatedAt,
      }))
    }))

    return NextResponse.json({
      hotels: formatted,
      total: formatted.length
    })
  } catch (error) {
    console.error('Error fetching hotel owner hotels:', error)
    return NextResponse.json(
      { error: 'Failed to fetch hotels' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const ownerId = authHeader.replace('Bearer ', '')

    const body = await request.json()
    const { name, address, city, starRating, phone, email, website, description, amenities, images } = body

    // Validate required fields
    if (!name || !address || !city) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create new hotel
    const hotel = await prisma.hotel.create({
      data: {
        name,
        description: description || null,
        address,
        city,
        phone: phone || null,
        email: email || null,
        website: website || null,
        starRating: starRating ? parseInt(starRating) : null,
        checkInTime: '14:00',
        checkOutTime: '12:00',
        amenities: amenities || [],
        images: images || [],
        ownerId,
        isActive: true,
        isVerified: false,
      }
    })

    return NextResponse.json({
      hotel,
      message: 'Hotel added successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Error adding hotel:', error)
    return NextResponse.json(
      { error: 'Failed to add hotel' },
      { status: 500 }
    )
  }
} 