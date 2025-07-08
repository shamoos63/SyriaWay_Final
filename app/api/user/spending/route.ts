import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@/lib/generated/prisma"

const prisma = new PrismaClient()

// GET /api/user/spending - Get user's total spending
export async function GET(request: NextRequest) {
  try {
    // Get user from authorization header
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Authentication required. Please sign in to view your spending." },
        { status: 401 }
      )
    }

    const token = authHeader.split(" ")[1]
    const userId = token // In this implementation, the token is the user ID

    // Validate that the user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, status: true }
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    if (user.status !== "ACTIVE") {
      return NextResponse.json(
        { error: "Account is not active" },
        { status: 403 }
      )
    }

    // Get all completed and confirmed bookings for the user
    const bookings = await prisma.booking.findMany({
      where: {
        userId: userId,
        status: {
          in: ["CONFIRMED", "COMPLETED"]
        }
      },
      select: {
        id: true,
        totalPrice: true,
        currency: true,
        status: true,
        serviceType: true,
        createdAt: true,
        startDate: true,
        endDate: true
      }
    })

    // Calculate total spending
    const totalSpending = bookings.reduce((total, booking) => {
      return total + booking.totalPrice
    }, 0)

    // Group spending by service type
    const spendingByService = bookings.reduce((acc, booking) => {
      const serviceType = booking.serviceType
      if (!acc[serviceType]) {
        acc[serviceType] = {
          total: 0,
          count: 0,
          currency: booking.currency
        }
      }
      acc[serviceType].total += booking.totalPrice
      acc[serviceType].count += 1
      return acc
    }, {} as Record<string, { total: number; count: number; currency: string }>)

    // Get spending by month (last 12 months)
    const twelveMonthsAgo = new Date()
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12)

    const monthlySpending = bookings
      .filter(booking => new Date(booking.createdAt) >= twelveMonthsAgo)
      .reduce((acc, booking) => {
        const month = new Date(booking.createdAt).toISOString().slice(0, 7) // YYYY-MM format
        if (!acc[month]) {
          acc[month] = 0
        }
        acc[month] += booking.totalPrice
        return acc
      }, {} as Record<string, number>)

    // Get recent spending (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const recentSpending = bookings
      .filter(booking => new Date(booking.createdAt) >= thirtyDaysAgo)
      .reduce((total, booking) => total + booking.totalPrice, 0)

    return NextResponse.json({
      totalSpending,
      currency: bookings.length > 0 ? bookings[0].currency : "USD",
      totalBookings: bookings.length,
      spendingByService,
      monthlySpending,
      recentSpending,
      bookings: bookings.slice(0, 10) // Return last 10 bookings for reference
    })
  } catch (error) {
    console.error("Error fetching user spending:", error)
    return NextResponse.json(
      { error: "Failed to fetch spending data" },
      { status: 500 }
    )
  }
} 