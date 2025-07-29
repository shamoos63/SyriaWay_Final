import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { tours, tourGuides, users, reviews } from '@/drizzle/schema'
import { eq, and, or, like, gte, lte } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const location = searchParams.get('location')

    // Build where conditions
    let whereConditions = [eq(tours.isActive, true)]

    if (category && category !== 'all') {
      whereConditions.push(eq(tours.category, category.toUpperCase()))
    }

    if (search) {
      const orClause = or(
        like(tours.name, `%${search}%`),
        like(tours.description, `%${search}%`),
        like(tours.startLocation, `%${search}%`),
        like(tours.endLocation, `%${search}%`)
      )
      if (orClause) whereConditions.push(orClause)
    }

    if (minPrice || maxPrice) {
      if (minPrice) whereConditions.push(gte(tours.price, parseFloat(minPrice)))
      if (maxPrice) whereConditions.push(lte(tours.price, parseFloat(maxPrice)))
    }

    if (location) {
      const orClause = or(
        like(tours.startLocation, `%${location}%`),
        like(tours.endLocation, `%${location}%`)
      )
      if (orClause) whereConditions.push(orClause)
    }

    const toursData = await db
      .select({
        id: tours.id,
        name: tours.name,
        description: tours.description,
        category: tours.category,
        duration: tours.duration,
        maxGroupSize: tours.maxGroupSize,
        price: tours.price,
        currency: tours.currency,
        guideId: tours.guideId,
        startLocation: tours.startLocation,
        endLocation: tours.endLocation,
        itinerary: tours.itinerary,
        included: tours.included,
        notIncluded: tours.notIncluded,
        requirements: tours.requirements,
        images: tours.images,
        isActive: tours.isActive,
        isVerified: tours.isVerified,
        isSpecialOffer: tours.isSpecialOffer,
        rating: tours.rating,
        reviewCount: tours.reviewCount,
        startDate: tours.startDate,
        endDate: tours.endDate,
        capacity: tours.capacity,
        createdAt: tours.createdAt,
        updatedAt: tours.updatedAt,
        guide: {
          id: tourGuides.id,
          bio: tourGuides.bio,
          experience: tourGuides.experience,
          languages: tourGuides.languages,
          specialties: tourGuides.specialties,
          baseLocation: tourGuides.baseLocation,
          serviceAreas: tourGuides.serviceAreas,
          isAvailable: tourGuides.isAvailable,
          isVerified: tourGuides.isVerified,
          hourlyRate: tourGuides.hourlyRate,
          dailyRate: tourGuides.dailyRate,
          currency: tourGuides.currency,
          profileImage: tourGuides.profileImage,
          certifications: tourGuides.certifications,
          guideUserId: users.id,
          guideUserName: users.name,
          guideUserEmail: users.email,
        }
      })
      .from(tours)
      .leftJoin(tourGuides, eq(tours.guideId, tourGuides.id))
      .leftJoin(users, eq(tourGuides.userId, users.id))
      .where(and(...whereConditions))
      .orderBy(tours.createdAt)

    // Get reviews for each tour
    const toursWithReviews = await Promise.all(
      toursData.map(async (tour) => {
        const tourReviews = await db
          .select({
            rating: reviews.rating,
          })
          .from(reviews)
          .where(and(
            eq(reviews.serviceType, 'TOUR'),
            eq(reviews.serviceId, Number(tour.id))
          ))

        const averageRating = tourReviews.length > 0
          ? tourReviews.reduce((sum, review) => sum + review.rating, 0) / tourReviews.length
          : 0

        return {
          ...tour,
          reviews: tourReviews,
          averageRating,
          reviewCount: tourReviews.length,
        }
      })
    )

    return NextResponse.json({ tours: toursWithReviews })
  } catch (error) {
    console.error('Error fetching tours:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tours' },
      { status: 500 }
    )
  }
} 