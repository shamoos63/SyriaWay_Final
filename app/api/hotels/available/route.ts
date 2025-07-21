import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hotels, rooms } from '@/drizzle/schema'
import { eq } from 'drizzle-orm'

// GET - Fetch available hotels with rooms (safe version)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const page = parseInt(searchParams.get('page') || '1')

    const offset = (page - 1) * limit

    // Simple query without complex conditions
    let hotelsData = []
    try {
      hotelsData = await db
        .select()
        .from(hotels)
        .limit(limit)
        .offset(offset)
    } catch (error) {
      console.error('Error fetching hotels:', error)
      hotelsData = []
    }

    // Ensure hotelsData is an array
    if (!hotelsData || !Array.isArray(hotelsData)) {
      return NextResponse.json({
        hotels: [],
        rooms: [],
        pagination: {
          currentPage: page,
          totalPages: 0,
          totalCount: 0,
          hasNextPage: false,
          hasPrevPage: false,
        }
      })
    }

    // Get rooms for each hotel
    const allRooms = []
    const hotelsWithRooms = await Promise.all(
      hotelsData.map(async (hotel) => {
        try {
          const hotelRooms = await db
            .select()
            .from(rooms)
            .where(eq(rooms.hotelId, hotel.id))
            .limit(10) // Limit rooms per hotel

          // Add hotel info to each room for the booking page
          const roomsWithHotel = hotelRooms.map(room => ({
            ...room,
            hotel: {
              id: hotel.id,
              name: hotel.name,
              description: hotel.description,
              address: hotel.address,
              city: hotel.city,
              country: hotel.country,
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
              googleMapLink: hotel.googleMapLink,
              isActive: hotel.isActive,
              isVerified: hotel.isVerified,
              isSpecialOffer: hotel.isSpecialOffer,
            }
          }))

          // Add rooms to the flattened array
          allRooms.push(...roomsWithHotel)

          return {
            ...hotel,
            rooms: hotelRooms || []
          }
        } catch (error) {
          console.error(`Error fetching rooms for hotel ${hotel.id}:`, error)
          // Return hotel without rooms if there's an error
          return {
            ...hotel,
            rooms: []
          }
        }
      })
    )

    // Get total count safely
    let totalCount = 0
    try {
      const totalCountResult = await db
        .select()
        .from(hotels)
        .limit(1)

      totalCount = totalCountResult.length
    } catch (error) {
      console.error('Error getting total count:', error)
      totalCount = 0
    }

    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      hotels: hotelsWithRooms,
      rooms: allRooms,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      }
    })
  } catch (error) {
    console.error('Error in hotels available route:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch available hotels',
        hotels: [],
        rooms: [],
        pagination: {
          currentPage: 1,
          totalPages: 0,
          totalCount: 0,
          hasNextPage: false,
          hasPrevPage: false,
        }
      },
      { status: 500 }
    )
  }
} 