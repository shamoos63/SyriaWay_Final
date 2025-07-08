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

    // Find all hotels owned by this user
    const hotels = await prisma.hotel.findMany({
      where: { ownerId },
      select: { id: true }
    })
    const hotelIds = hotels.map(h => h.id)
    if (hotelIds.length === 0) {
      return NextResponse.json({ customers: [], total: 0 })
    }

    // Find all bookings for these hotels and group by customer
    const bookings = await prisma.booking.findMany({
      where: {
        hotelId: { in: hotelIds },
        serviceType: 'HOTEL',
      },
      include: {
        user: true,
        hotel: true,
        room: true,
      },
      orderBy: { createdAt: 'desc' }
    })

    // Group bookings by customer and calculate statistics
    const customerMap = new Map()
    
    bookings.forEach(booking => {
      const userId = booking.userId
      if (!customerMap.has(userId)) {
        customerMap.set(userId, {
          id: userId,
          name: booking.user?.name || 'Unknown Customer',
          email: booking.user?.email || '',
          phone: booking.user?.phone || '',
          totalBookings: 0,
          totalSpent: 0,
          lastBookingDate: null,
          currentRoom: null,
          bookings: [],
          favoriteRoomType: null,
          averageStayDuration: 0,
          totalNights: 0
        })
      }
      
      const customer = customerMap.get(userId)
      customer.totalBookings += 1
      customer.totalSpent += booking.totalPrice || 0
      customer.bookings.push({
        id: booking.id,
        hotelName: booking.hotel?.name,
        roomName: booking.room?.name,
        roomNumber: booking.room?.roomNumber,
        roomType: booking.room?.roomType,
        checkInDate: booking.startDate,
        checkOutDate: booking.endDate,
        totalAmount: booking.totalPrice,
        status: booking.status,
        guests: booking.guests,
        createdAt: booking.createdAt
      })
      
      // Calculate stay duration
      const checkIn = new Date(booking.startDate)
      const checkOut = new Date(booking.endDate)
      const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
      customer.totalNights += nights
      
      // Check if this is the current booking (active)
      if (booking.status === 'CONFIRMED' && 
          new Date(booking.startDate) <= new Date() && 
          new Date(booking.endDate) >= new Date()) {
        customer.currentRoom = {
          hotelName: booking.hotel?.name,
          roomName: booking.room?.name,
          roomNumber: booking.room?.roomNumber,
          roomType: booking.room?.roomType,
          checkInDate: booking.startDate,
          checkOutDate: booking.endDate,
          guests: booking.guests
        }
      }
      
      if (!customer.lastBookingDate || new Date(booking.createdAt) > new Date(customer.lastBookingDate)) {
        customer.lastBookingDate = booking.createdAt
      }
    })

    // Calculate additional statistics for each customer
    customerMap.forEach(customer => {
      if (customer.totalBookings > 0) {
        customer.averageStayDuration = Math.round(customer.totalNights / customer.totalBookings)
      }
      
      // Find favorite room type
      const roomTypeCounts = {}
      customer.bookings.forEach(booking => {
        if (booking.roomType) {
          roomTypeCounts[booking.roomType] = (roomTypeCounts[booking.roomType] || 0) + 1
        }
      })
      
      const favoriteRoomType = Object.entries(roomTypeCounts)
        .sort(([,a], [,b]) => b - a)[0]
      
      customer.favoriteRoomType = favoriteRoomType ? favoriteRoomType[0] : null
    })

    // Convert map to array and sort by total spent
    const customers = Array.from(customerMap.values())
      .sort((a, b) => b.totalSpent - a.totalSpent)

    return NextResponse.json({
      customers,
      total: customers.length
    })
  } catch (error) {
    console.error('Error fetching hotel owner customers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    )
  }
} 