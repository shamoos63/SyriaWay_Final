import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@/lib/generated/prisma'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const location = searchParams.get('location')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const roomType = searchParams.get('roomType')
    const guests = searchParams.get('guests')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    // Build where clause for rooms
    const roomWhere: any = {
      isAvailable: true,
      hotel: {
        isActive: true,
        isVerified: true
      }
    }

    // Filter by location (hotel city)
    if (location && location !== 'all') {
      roomWhere.hotel.city = {
        contains: location,
        mode: 'insensitive'
      }
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      roomWhere.pricePerNight = {}
      if (minPrice) roomWhere.pricePerNight.gte = parseFloat(minPrice)
      if (maxPrice) roomWhere.pricePerNight.lte = parseFloat(maxPrice)
    }

    // Filter by room type
    if (roomType && roomType !== 'all') {
      roomWhere.roomType = roomType
    }

    // Filter by capacity (guests)
    if (guests) {
      roomWhere.capacity = {
        gte: parseInt(guests)
      }
    }

    // Fetch available rooms with hotel information
    const rooms = await prisma.room.findMany({
      where: roomWhere,
      include: {
        hotel: {
          select: {
            id: true,
            name: true,
            description: true,
            address: true,
            city: true,
            starRating: true,
            amenities: true,
            images: true,
            checkInTime: true,
            checkOutTime: true,
            googleMapLink: true
          }
        },
        bookings: {
          where: {
            status: {
              in: ['PENDING', 'CONFIRMED']
            }
          }
        }
      },
      orderBy: [
        { hotel: { starRating: 'desc' } },
        { pricePerNight: 'asc' }
      ]
    })

    // Filter out rooms that have conflicting bookings for the selected dates
    const availableRooms = rooms.filter(room => {
      if (!startDate || !endDate) {
        // If no dates specified, only exclude rooms with current bookings
        return room.bookings.every(booking => 
          new Date(booking.endDate) < new Date() || new Date(booking.startDate) > new Date()
        )
      }

      const requestedStart = new Date(startDate)
      const requestedEnd = new Date(endDate)

      return room.bookings.every(booking => {
        const bookingStart = new Date(booking.startDate)
        const bookingEnd = new Date(booking.endDate)
        
        // Check if there's any overlap
        return bookingEnd <= requestedStart || bookingStart >= requestedEnd
      })
    })

    // Format the response
    const formattedRooms = availableRooms.map(room => ({
      id: room.id,
      name: room.name,
      roomNumber: room.roomNumber,
      roomType: room.roomType,
      capacity: room.capacity,
      pricePerNight: room.pricePerNight,
      price: room.pricePerNight,
      bedType: room.bedType,
      amenities: room.amenities,
      images: room.images,
      description: room.description,
      size: room.size,
      hotel: {
        id: room.hotel.id,
        name: room.hotel.name,
        description: room.hotel.description,
        address: room.hotel.address,
        city: room.hotel.city,
        starRating: room.hotel.starRating,
        amenities: room.hotel.amenities,
        images: room.hotel.images,
        checkInTime: room.hotel.checkInTime,
        checkOutTime: room.hotel.checkOutTime,
        googleMapLink: room.hotel.googleMapLink
      }
    }))

    return NextResponse.json({
      rooms: formattedRooms,
      total: formattedRooms.length
    })
  } catch (error) {
    console.error('Error fetching available rooms:', error)
    return NextResponse.json(
      { error: 'Failed to fetch available rooms' },
      { status: 500 }
    )
  }
} 