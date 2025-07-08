import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@/lib/generated/prisma"

const prisma = new PrismaClient()

// GET /api/user/bookings - Get user's bookings
export async function GET(request: NextRequest) {
  try {
    // Get user from authorization header
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Authentication required. Please sign in to view your bookings." },
        { status: 401 }
      )
    }

    const token = authHeader.split(" ")[1]
    const userId = token // In this implementation, the token is the user ID

    // Validate that the user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true, status: true }
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found. Please sign in again." },
        { status: 401 }
      )
    }

    // Check if user is active
    if (user.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: "Your account is not active. Please contact support." },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const serviceType = searchParams.get("serviceType")

    const where: any = {
      userId: userId,
    }

    if (status) {
      where.status = status
    }

    if (serviceType) {
      where.serviceType = serviceType
    }

    const bookings = await prisma.booking.findMany({
      where: {
        userId: userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        hotel: {
          select: {
            id: true,
            name: true,
            address: true,
            city: true,
            starRating: true,
            ownerId: true
          }
        },
        room: {
          select: {
            id: true,
            name: true,
            roomType: true,
            roomNumber: true
          }
        },
        car: {
          select: {
            id: true,
            brand: true,
            model: true,
            year: true,
            color: true,
            licensePlate: true,
            ownerId: true
          }
        },
        tour: {
          select: {
            id: true,
            name: true,
            description: true,
            category: true,
            guideId: true
          }
        },
        guide: {
          select: {
            id: true,
            bio: true,
            experience: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ bookings })
  } catch (error) {
    console.error("Error fetching user bookings:", error)
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    )
  }
} 