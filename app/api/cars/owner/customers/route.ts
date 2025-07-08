import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@/lib/generated/prisma"

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const ownerId = authHeader.replace("Bearer ", "")
    
    // Find all cars owned by this user
    const cars = await prisma.car.findMany({
      where: { ownerId },
      select: { id: true }
    })
    
    const carIds = cars.map(c => c.id)
    
    if (carIds.length === 0) {
      return NextResponse.json({ customers: [], total: 0 })
    }

    // Find all bookings for these cars and group by customer
    const bookings = await prisma.booking.findMany({
      where: {
        carId: { in: carIds },
        serviceType: 'CAR',
      },
      include: {
        user: true,
        car: true,
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
          currentCar: null,
          bookings: [],
          favoriteCarModel: null,
          averageRentalDuration: 0,
          totalDays: 0
        })
      }
      
      const customer = customerMap.get(userId)
      customer.totalBookings += 1
      customer.totalSpent += booking.totalPrice || 0
      customer.bookings.push({
        id: booking.id,
        carMake: booking.car?.make,
        carModel: booking.car?.model,
        carYear: booking.car?.year,
        carPlate: booking.car?.licensePlate,
        startDate: booking.startDate,
        endDate: booking.endDate,
        totalAmount: booking.totalPrice,
        status: booking.status,
        guests: booking.guests,
        createdAt: booking.createdAt
      })
      
      // Calculate rental duration
      const start = new Date(booking.startDate)
      const end = new Date(booking.endDate)
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
      customer.totalDays += days
      
      // Check if this is the current booking (active)
      if (booking.status === 'CONFIRMED' && 
          new Date(booking.startDate) <= new Date() && 
          new Date(booking.endDate) >= new Date()) {
        customer.currentCar = {
          carMake: booking.car?.make,
          carModel: booking.car?.model,
          carYear: booking.car?.year,
          carPlate: booking.car?.licensePlate,
          startDate: booking.startDate,
          endDate: booking.endDate,
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
        customer.averageRentalDuration = Math.round(customer.totalDays / customer.totalBookings)
      }
      // Find favorite car model
      const carModelCounts = {}
      customer.bookings.forEach(booking => {
        if (booking.carModel) {
          carModelCounts[booking.carModel] = (carModelCounts[booking.carModel] || 0) + 1
        }
      })
      const favoriteCarModel = Object.entries(carModelCounts)
        .sort(([,a], [,b]) => b - a)[0]
      customer.favoriteCarModel = favoriteCarModel ? favoriteCarModel[0] : null
    })

    // Convert map to array and sort by total spent
    const customers = Array.from(customerMap.values())
      .sort((a, b) => b.totalSpent - a.totalSpent)

    return NextResponse.json({
      customers,
      total: customers.length
    })
  } catch (error) {
    console.error("Error fetching car owner customers:", error)
    return NextResponse.json(
      { error: "Failed to fetch customers" },
      { status: 500 }
    )
  }
} 