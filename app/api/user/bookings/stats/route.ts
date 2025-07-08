import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@/lib/generated/prisma"

const prisma = new PrismaClient()

// GET /api/user/bookings/stats - Get statistics for customer
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

    // Get current date for calculations
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    // Ultra-optimized: Get all statistics in minimal queries
    const [
      allBookings,
      revenueData,
      serviceTypeData,
    ] = await Promise.all([
      // Get all bookings with status in one query
      prisma.booking.findMany({
        where: { userId },
        select: {
          status: true,
          totalPrice: true,
          startDate: true,
          endDate: true,
          createdAt: true,
          serviceType: true,
        }
      }),
      // Get revenue aggregates in one query
      prisma.booking.aggregate({
        where: { 
          userId,
          status: { in: ["COMPLETED", "CONFIRMED", "PENDING"] }
        },
        _sum: { totalPrice: true },
        _avg: { totalPrice: true },
      }),
      // Get service type distribution
      prisma.booking.groupBy({
        by: ['serviceType'],
        where: { userId },
        _count: { serviceType: true },
        orderBy: { _count: { serviceType: 'desc' } },
        take: 1,
      }),
    ])

    // Process booking data in memory (much faster than multiple DB queries)
    const statusCounts = allBookings.reduce((acc, booking) => {
      acc[booking.status.toLowerCase()] = (acc[booking.status.toLowerCase()] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Calculate active and upcoming rentals
    const activeRentals = allBookings.filter(booking => 
      booking.status === "CONFIRMED" && 
      new Date(booking.endDate) >= now
    ).length

    const upcomingRentals = allBookings.filter(booking => 
      booking.status === "CONFIRMED" && 
      new Date(booking.startDate) >= now
    ).length

    // Calculate monthly revenue
    const monthlyRevenue = allBookings
      .filter(booking => 
        booking.status === "COMPLETED" || booking.status === "CONFIRMED" || booking.status === "PENDING"
      )
      .filter(booking => {
        const bookingDate = new Date(booking.createdAt)
        return bookingDate >= startOfMonth && bookingDate <= endOfMonth
      })
      .reduce((sum, booking) => sum + (booking.totalPrice || 0), 0)

    const stats = {
      totalBookings: allBookings.length,
      pendingBookings: statusCounts.pending || 0,
      confirmedBookings: statusCounts.confirmed || 0,
      completedBookings: statusCounts.completed || 0,
      cancelledBookings: statusCounts.cancelled || 0,
      totalSpent: revenueData._sum.totalPrice || 0,
      monthlySpent: monthlyRevenue,
      activeRentals,
      upcomingRentals,
      favoriteServiceType: serviceTypeData[0]?.serviceType || "None",
      averageBookingValue: revenueData._avg.totalPrice || 0,
    }

    return NextResponse.json({ stats })
  } catch (error) {
    console.error("Error fetching user booking stats:", error)
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    )
  }
} 