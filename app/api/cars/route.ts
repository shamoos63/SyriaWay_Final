import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/cars - Fetch all cars with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const available = searchParams.get("available")
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const verified = searchParams.get("verified")

    const where: any = {}

    if (available === "true") {
      where.isAvailable = true
      
      // Exclude cars that have active bookings
      where.NOT = {
        bookings: {
          some: {
            status: {
              in: ['PENDING', 'CONFIRMED']
            }
          }
        }
      }
    }

    if (category) {
      where.category = category
    }

    if (verified === "true") {
      where.isVerified = true
    }

    if (search) {
      where.OR = [
        { make: { contains: search, mode: 'insensitive' } },
        { model: { contains: search, mode: 'insensitive' } },
        { licensePlate: { contains: search, mode: 'insensitive' } },
      ]
    }

    const cars = await prisma.car.findMany({
      where,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        translations: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({ cars })
  } catch (error) {
    console.error("Error fetching cars:", error)
    return NextResponse.json(
      { error: "Failed to fetch cars" },
      { status: 500 }
    )
  }
} 