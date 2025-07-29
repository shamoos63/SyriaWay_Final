import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { offers, offerTranslations, hotels, cars, tours } from '@/drizzle/schema'
import { eq, and, gte, lte } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const active = searchParams.get('active') === 'true'

    let whereConditions = []

    if (active) {
      whereConditions.push(eq(offers.isActive, true))
    }

    // Only show current offers (not expired)
    const now = new Date().toISOString().split('T')[0] // Format as YYYY-MM-DD
    whereConditions.push(gte(offers.endDate, now))

    // Fetch special-offer listings from hotels, cars, and tours
    const hotelRows = await db
      .select()
      .from(hotels)
      .where(eq(hotels.isSpecialOffer, true))

    // Helper to convert CURRENT_TIMESTAMP to ISO string
    function fixTimestamp(ts: string | null | undefined): string | null | undefined {
      if (typeof ts === 'string' && ts.trim().toUpperCase() === 'CURRENT_TIMESTAMP') {
        return new Date().toISOString()
      }
      return ts
    }

    // Helper to safely parse JSON images
    function parseImages(imagesString: string | null | undefined): string {
      if (!imagesString) return '/placeholder.svg'
      try {
        const images = JSON.parse(imagesString)
        return Array.isArray(images) && images.length > 0 ? images[0] : '/placeholder.svg'
      } catch {
        return '/placeholder.svg'
      }
    }

    const hotelOffers = hotelRows.map(hotel => ({
      id: `hotel-${hotel.id}`,
      type: 'HOTEL',
      name: hotel.name,
      description: hotel.description || `Special offer for ${hotel.name}`,
      price: Math.round((hotel.starRating || 3) * 50), // Generate a price based on star rating
      originalPrice: Math.round((hotel.starRating || 3) * 55), // 10% higher than discounted price
      discount: '10%',
      image: parseImages(hotel.images),
      location: hotel.city || 'Syria',
      rating: hotel.starRating,
      duration: 1,
      provider: {
        id: hotel.ownerId?.toString() || '',
        name: hotel.name,
        email: hotel.email || ''
      },
      createdAt: fixTimestamp(hotel.createdAt),
    }))

    const carRows = await db
      .select()
      .from(cars)
      .where(eq(cars.isSpecialOffer, true))


    const carOffers = carRows.map(car => ({
      id: `car-${car.id}`,
      type: 'CAR',
      name: `${car.brand} ${car.model}`,
      description: car.category || `Special offer for ${car.brand} ${car.model}`,
      price: Math.round(car.pricePerDay * 0.9), // 10% discount
      originalPrice: car.pricePerDay,
      discount: '10%',
      image: parseImages(car.images),
      location: car.currentLocation || 'Syria',
      rating: 4.5,
      duration: 1,
      provider: {
        id: car.ownerId?.toString() || '',
        name: `${car.brand} ${car.model}`,
        email: ''
      },
      createdAt: fixTimestamp(car.createdAt),
    }))

    const tourRows = await db
      .select()
      .from(tours)
      .where(eq(tours.isSpecialOffer, true))


    const tourOffers = tourRows.map(tour => ({
      id: `tour-${tour.id}`,
      type: 'TOUR',
      name: tour.name,
      description: tour.description || `Special offer for ${tour.name}`,
      price: Math.round(tour.price * 0.9), // 10% discount
      originalPrice: tour.price,
      discount: '10%',
      image: parseImages(tour.images),
      location: tour.startLocation || 'Syria',
      rating: tour.rating || 4.5,
      duration: tour.duration,
      provider: {
        id: tour.guideId?.toString() || '',
        name: tour.name,
        email: ''
      },
      createdAt: fixTimestamp(tour.createdAt),
    }))

    // Fetch offers from the offers table as before
    const offersData = await db
      .select({
        id: offers.id,
        title: offers.title,
        description: offers.description,
        discountPercentage: offers.discountPercentage,
        startDate: offers.startDate,
        endDate: offers.endDate,
        serviceType: offers.serviceType,
        serviceId: offers.serviceId,
        isActive: offers.isActive,
        maxUses: offers.maxUses,
        currentUses: offers.currentUses,
        createdAt: offers.createdAt,
        updatedAt: offers.updatedAt,
      })
      .from(offers)
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
      .orderBy(offers.createdAt)
      .limit(limit)

    const offersDataFixed = offersData.map(offer => ({
      id: `offer-${offer.id}`,
      type: offer.serviceType as 'HOTEL' | 'CAR' | 'TOUR',
      name: offer.title,
      description: offer.description || `Special offer for ${offer.serviceType?.toLowerCase()}`,
      price: Math.round((offer.discountPercentage ? (100 - offer.discountPercentage) / 100 : 0.9) * 100), // Calculate discounted price
      originalPrice: 100, // Base price, adjust as needed
      discount: `${offer.discountPercentage}%`,
      image: '/placeholder.svg', // Default image for offers
      location: 'Syria',
      rating: 4.5,
      duration: 1,
      provider: {
        id: offer.serviceId?.toString() || '',
        name: offer.title,
        email: ''
      },
      createdAt: fixTimestamp(offer.createdAt),
    }))

    // Merge all offers
    const allOffers = [
      ...offersDataFixed,
      ...hotelOffers,
      ...carOffers,
      ...tourOffers,
    ]



    return NextResponse.json({ offers: allOffers })
  } catch (error) {
    console.error('Error fetching special offers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch special offers' },
      { status: 500 }
    )
  }
} 