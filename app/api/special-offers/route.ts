import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // 'all', 'hotels', 'cars', 'tours'
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined

    // Build where clause for special offers
    const whereClause = {
      isSpecialOffer: true,
    }

    // Fetch special offers based on type
    let specialOffers = []

    if (!type || type === 'all') {
      // Fetch all types of special offers
      const [hotels, cars, tours] = await Promise.all([
        prisma.hotel.findMany({
          where: { ...whereClause, isVerified: true },
          include: {
            owner: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          take: limit,
        }),
        prisma.car.findMany({
          where: { ...whereClause, isVerified: true },
          include: {
            owner: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          take: limit,
        }),
        prisma.tour.findMany({
          where: { ...whereClause },
          include: {
            guide: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
              },
            },
          },
          take: limit,
        }),
      ])

      // Normalize and combine the data
      specialOffers = [
        ...hotels.map(hotel => ({
          id: hotel.id,
          type: 'HOTEL',
          name: hotel.name,
          description: hotel.description,
          price: hotel.starRating * 50, // Calculate price based on star rating
          originalPrice: hotel.starRating * 60, // 20% discount
          discount: '20%',
          image: hotel.images ? (hotel.images as string[])[0] : '/placeholder.svg',
          location: hotel.city,
          rating: hotel.starRating,
          provider: hotel.owner,
          amenities: hotel.amenities,
          createdAt: hotel.createdAt,
          updatedAt: hotel.updatedAt,
        })),
        ...cars.map(car => ({
          id: car.id,
          type: 'CAR',
          name: `${car.brand} ${car.model}`,
          description: `${car.year} ${car.brand} ${car.model} - ${car.color}`,
          price: car.pricePerDay * 0.8, // 20% discount
          originalPrice: car.pricePerDay,
          discount: '20%',
          image: car.images ? (car.images as string[])[0] : '/placeholder.svg',
          location: car.currentLocation,
          features: car.features,
          provider: car.owner,
          createdAt: car.createdAt,
          updatedAt: car.updatedAt,
        })),
        ...tours.map(tour => ({
          id: tour.id,
          type: 'TOUR',
          name: tour.name,
          description: tour.description,
          price: tour.price * 0.85, // 15% discount
          originalPrice: tour.price,
          discount: '15%',
          image: tour.images ? (tour.images as string[])[0] : '/placeholder.svg',
          location: `${tour.startLocation} → ${tour.endLocation}`,
          duration: tour.duration,
          category: tour.category,
          provider: tour.guide?.user,
          createdAt: tour.createdAt,
          updatedAt: tour.updatedAt,
        })),
      ]
    } else {
      // Fetch specific type
      switch (type) {
        case 'hotels':
          const hotels = await prisma.hotel.findMany({
            where: { ...whereClause, isVerified: true },
            include: {
              owner: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
            take: limit,
          })
          specialOffers = hotels.map(hotel => ({
            id: hotel.id,
            type: 'HOTEL',
            name: hotel.name,
            description: hotel.description,
            price: hotel.starRating * 50,
            originalPrice: hotel.starRating * 60,
            discount: '20%',
            image: hotel.images ? (hotel.images as string[])[0] : '/placeholder.svg',
            location: hotel.city,
            rating: hotel.starRating,
            provider: hotel.owner,
            amenities: hotel.amenities,
            createdAt: hotel.createdAt,
            updatedAt: hotel.updatedAt,
          }))
          break

        case 'cars':
          const cars = await prisma.car.findMany({
            where: { ...whereClause, isVerified: true },
            include: {
              owner: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
            take: limit,
          })
          specialOffers = cars.map(car => ({
            id: car.id,
            type: 'CAR',
            name: `${car.brand} ${car.model}`,
            description: `${car.year} ${car.brand} ${car.model} - ${car.color}`,
            price: car.pricePerDay * 0.8,
            originalPrice: car.pricePerDay,
            discount: '20%',
            image: car.images ? (car.images as string[])[0] : '/placeholder.svg',
            location: car.currentLocation,
            features: car.features,
            provider: car.owner,
            createdAt: car.createdAt,
            updatedAt: car.updatedAt,
          }))
          break

        case 'tours':
          const tours = await prisma.tour.findMany({
            where: { ...whereClause },
            include: {
              guide: {
                include: {
                  user: {
                    select: {
                      id: true,
                      name: true,
                      email: true,
                    },
                  },
                },
              },
            },
            take: limit,
          })
          specialOffers = tours.map(tour => ({
            id: tour.id,
            type: 'TOUR',
            name: tour.name,
            description: tour.description,
            price: tour.price * 0.85,
            originalPrice: tour.price,
            discount: '15%',
            image: tour.images ? (tour.images as string[])[0] : '/placeholder.svg',
            location: `${tour.startLocation} → ${tour.endLocation}`,
            duration: tour.duration,
            category: tour.category,
            provider: tour.guide?.user,
            createdAt: tour.createdAt,
            updatedAt: tour.updatedAt,
          }))
          break
      }
    }

    // Sort by creation date (newest first)
    specialOffers.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return NextResponse.json({
      specialOffers,
      count: specialOffers.length,
    })
  } catch (error) {
    console.error('Error fetching special offers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch special offers' },
      { status: 500 }
    )
  }
} 