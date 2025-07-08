import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@/lib/generated/prisma"

const prisma = new PrismaClient()

// GET /api/cars/owner/revenue - Get detailed revenue analytics for car owner
export async function GET(request: NextRequest) {
  try {
    // Get user from authorization header
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const token = authHeader.split(" ")[1]
    const userId = token // This should be decoded from JWT

    // Get all cars owned by the user
    const cars = await prisma.car.findMany({
      where: { ownerId: userId },
      select: { id: true, brand: true, model: true, licensePlate: true },
    })

    const carIds = cars.map(car => car.id)

    if (carIds.length === 0) {
      return NextResponse.json({
        revenue: {
          totalRevenue: 0,
          monthlyRevenue: 0,
          averagePerBooking: 0,
          totalBookings: 0,
          completedBookings: 0,
          monthlyBreakdown: [],
          carRevenue: [],
          recentTransactions: [],
          revenueGrowth: 0,
        }
      })
    }

    // Get current date for calculations
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear

    // Get all completed bookings for revenue calculation
    const completedBookings = await prisma.booking.findMany({
      where: { 
        carId: { in: carIds },
        status: "COMPLETED"
      },
      select: {
        id: true,
        totalPrice: true,
        currency: true,
        startDate: true,
        endDate: true,
        createdAt: true,
        car: {
          select: {
            id: true,
            brand: true,
            model: true,
            licensePlate: true,
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    // Calculate total revenue
    const totalRevenue = completedBookings.reduce((sum, booking) => sum + booking.totalPrice, 0)

    // Calculate monthly revenue (current month)
    const currentMonthBookings = completedBookings.filter(booking => {
      const bookingDate = new Date(booking.createdAt)
      return bookingDate.getMonth() === currentMonth && bookingDate.getFullYear() === currentYear
    })
    const monthlyRevenue = currentMonthBookings.reduce((sum, booking) => sum + booking.totalPrice, 0)

    // Calculate last month revenue for growth comparison
    const lastMonthBookings = completedBookings.filter(booking => {
      const bookingDate = new Date(booking.createdAt)
      return bookingDate.getMonth() === lastMonth && bookingDate.getFullYear() === lastMonthYear
    })
    const lastMonthRevenue = lastMonthBookings.reduce((sum, booking) => sum + booking.totalPrice, 0)

    // Calculate revenue growth percentage
    const revenueGrowth = lastMonthRevenue > 0 
      ? ((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
      : 0

    // Calculate average per booking
    const averagePerBooking = completedBookings.length > 0 
      ? totalRevenue / completedBookings.length 
      : 0

    // Generate monthly breakdown for the last 12 months
    const monthlyBreakdown = []
    for (let i = 11; i >= 0; i--) {
      const targetMonth = (currentMonth - i + 12) % 12
      const targetYear = currentMonth - i < 0 ? currentYear - 1 : currentYear
      
      const monthBookings = completedBookings.filter(booking => {
        const bookingDate = new Date(booking.createdAt)
        return bookingDate.getMonth() === targetMonth && bookingDate.getFullYear() === targetYear
      })
      
      const monthRevenue = monthBookings.reduce((sum, booking) => sum + booking.totalPrice, 0)
      
      monthlyBreakdown.push({
        month: new Date(targetYear, targetMonth).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        revenue: monthRevenue,
        bookings: monthBookings.length,
        average: monthBookings.length > 0 ? monthRevenue / monthBookings.length : 0
      })
    }

    // Calculate revenue per car
    const carRevenue = cars.map(car => {
      const carBookings = completedBookings.filter(booking => booking.car.id === car.id)
      const carTotalRevenue = carBookings.reduce((sum, booking) => sum + booking.totalPrice, 0)
      const carMonthlyRevenue = carBookings.filter(booking => {
        const bookingDate = new Date(booking.createdAt)
        return bookingDate.getMonth() === currentMonth && bookingDate.getFullYear() === currentYear
      }).reduce((sum, booking) => sum + booking.totalPrice, 0)

      return {
        carId: car.id,
        carName: `${car.brand} ${car.model}`,
        licensePlate: car.licensePlate,
        totalRevenue: carTotalRevenue,
        monthlyRevenue: carMonthlyRevenue,
        totalBookings: carBookings.length,
        averagePerBooking: carBookings.length > 0 ? carTotalRevenue / carBookings.length : 0
      }
    }).sort((a, b) => b.totalRevenue - a.totalRevenue)

    // Get recent transactions (last 10 completed bookings)
    const recentTransactions = completedBookings.slice(0, 10).map(booking => ({
      id: booking.id,
      carName: `${booking.car.brand} ${booking.car.model}`,
      licensePlate: booking.car.licensePlate,
      amount: booking.totalPrice,
      currency: booking.currency,
      date: booking.createdAt,
      duration: Math.ceil((new Date(booking.endDate).getTime() - new Date(booking.startDate).getTime()) / (1000 * 60 * 60 * 24))
    }))

    const revenue = {
      totalRevenue,
      monthlyRevenue,
      averagePerBooking,
      totalBookings: completedBookings.length,
      completedBookings: completedBookings.length,
      monthlyBreakdown,
      carRevenue,
      recentTransactions,
      revenueGrowth,
    }

    return NextResponse.json({ revenue })
  } catch (error) {
    console.error("Error fetching car owner revenue:", error)
    return NextResponse.json(
      { error: "Failed to fetch revenue data" },
      { status: 500 }
    )
  }
} 