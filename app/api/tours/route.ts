import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const location = searchParams.get('location')

    // Build where clause
    const where: any = {
      isActive: true,
    }

    if (category && category !== 'all') {
      where.category = category.toUpperCase()
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { startLocation: { contains: search, mode: 'insensitive' } },
        { endLocation: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) where.price.gte = parseFloat(minPrice)
      if (maxPrice) where.price.lte = parseFloat(maxPrice)
    }

    if (location) {
      where.OR = [
        { startLocation: { contains: location, mode: 'insensitive' } },
        { endLocation: { contains: location, mode: 'insensitive' } },
      ]
    }

    const tours = await prisma.tour.findMany({
      where,
      include: {
        guide: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              }
            }
          }
        },
        reviews: {
          where: {
            isApproved: true,
          },
          select: {
            rating: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Calculate average rating for each tour
    const toursWithRating = tours.map(tour => {
      const totalRating = tour.reviews.reduce((sum, review) => sum + review.rating, 0)
      const averageRating = tour.reviews.length > 0 ? totalRating / tour.reviews.length : 0
      
      return {
        ...tour,
        averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
        reviewCount: tour.reviews.length,
        guideName: tour.guide?.user?.name || 'Unknown Guide',
        guideEmail: tour.guide?.user?.email || '',
      }
    })

    return NextResponse.json({ tours: toursWithRating })
  } catch (error) {
    console.error('Error fetching tours:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tours' },
      { status: 500 }
    )
  }
} 