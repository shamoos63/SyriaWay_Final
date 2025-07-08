import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@/lib/generated/prisma'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const hotelId = params.id

    // Fetch hotel with rooms and their bookings
    const hotel = await prisma.hotel.findUnique({
      where: { id: hotelId },
      include: {
        rooms: {
          include: {
            bookings: {
              where: {
                status: 'CONFIRMED',
                startDate: { lte: new Date() },
                endDate: { gte: new Date() }
              }
            }
          },
          orderBy: { name: 'asc' }
        }
      }
    })

    if (!hotel) {
      return NextResponse.json(
        { error: 'Hotel not found' },
        { status: 404 }
      )
    }

    // Format the response
    const formattedHotel = {
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
      googleMapLink: hotel.googleMapLink,
      isActive: hotel.isActive,
      isVerified: hotel.isVerified,
      createdAt: hotel.createdAt,
      updatedAt: hotel.updatedAt
    }

    const formattedRooms = hotel.rooms.map(room => ({
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

    return NextResponse.json({
      hotel: formattedHotel,
      rooms: formattedRooms
    })
  } catch (error) {
    console.error('Error fetching hotel details:', error)
    return NextResponse.json(
      { error: 'Failed to fetch hotel details' },
      { status: 500 }
    )
  }
} 