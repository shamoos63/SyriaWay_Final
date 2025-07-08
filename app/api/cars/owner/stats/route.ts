import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@/lib/generated/prisma"

const prisma = new PrismaClient()

// GET /api/cars/owner/stats - Get statistics for car owner
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
      select: { id: true },
    })

    const carIds = cars.map(car => car.id)

    if (carIds.length === 0) {
      return NextResponse.json({
        stats: {
          totalCars: 0,
          totalBookings: 0,
          pendingBookings: 0,
          confirmedBookings: 0,
          completedBookings: 0,
          cancelledBookings: 0,
          totalRevenue: 0,
          monthlyRevenue: 0,
          averageRating: 0,
          totalReviews: 0,
          activeRentals: 0,
          upcomingRentals: 0,
        }
      })
    }

    // Get booking statistics
    const [
      totalBookings,
      pendingBookings,
      confirmedBookings,
      completedBookings,
      cancelledBookings,
      totalRevenue,
      monthlyRevenue,
      activeRentals,
      upcomingRentals,
    ] = await Promise.all([
      // Total bookings
      prisma.booking.count({
        where: { carId: { in: carIds } },
      }),
      // Pending bookings
      prisma.booking.count({
        where: { 
          carId: { in: carIds },
          status: "PENDING"
        },
      }),
      // Confirmed bookings
      prisma.booking.count({
        where: { 
          carId: { in: carIds },
          status: "CONFIRMED"
        },
      }),
      // Completed bookings
      prisma.booking.count({
        where: { 
          carId: { in: carIds },
          status: "COMPLETED"
        },
      }),
      // Cancelled bookings
      prisma.booking.count({
        where: { 
          carId: { in: carIds },
          status: "CANCELLED"
        },
      }),
      // Total revenue (from completed bookings)
      prisma.booking.aggregate({
        where: { 
          carId: { in: carIds },
          status: "COMPLETED"
        },
        _sum: { totalPrice: true },
      }),
      // Monthly revenue (current month)
      prisma.booking.aggregate({
        where: { 
          carId: { in: carIds },
          status: "COMPLETED",
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
        _sum: { totalPrice: true },
      }),
      // Active rentals (confirmed bookings that haven't ended)
      prisma.booking.count({
        where: { 
          carId: { in: carIds },
          status: "CONFIRMED",
          endDate: {
            gte: new Date(),
          },
        },
      }),
      // Upcoming rentals (confirmed bookings that haven't started)
      prisma.booking.count({
        where: { 
          carId: { in: carIds },
          status: "CONFIRMED",
          startDate: {
            gte: new Date(),
          },
        },
      }),
    ])

    // Get average rating and total reviews (if you have a rating system)
    const averageRating = 0 // Placeholder - implement when rating system is added
    const totalReviews = 0 // Placeholder - implement when rating system is added

    const stats = {
      totalCars: carIds.length,
      totalBookings,
      pendingBookings,
      confirmedBookings,
      completedBookings,
      cancelledBookings,
      totalRevenue: totalRevenue._sum.totalPrice || 0,
      monthlyRevenue: monthlyRevenue._sum.totalPrice || 0,
      averageRating,
      totalReviews,
      activeRentals,
      upcomingRentals,
    }

    return NextResponse.json({ stats })
  } catch (error) {
    console.error("Error fetching car owner stats:", error)
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    )
  }
} 