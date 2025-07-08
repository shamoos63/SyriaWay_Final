import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    const limit = parseInt(searchParams.get('limit') || '10')
    const type = searchParams.get('type') || 'all'

    if (!query.trim()) {
      return NextResponse.json({
        results: [],
        total: 0,
        query: '',
        message: 'Please provide a search query'
      })
    }

    const searchTerm = query.toLowerCase()
    const results: any[] = []

    // Search hotels
    if (type === 'all' || type === 'hotels') {
      const hotels = await prisma.hotel.findMany({
        where: {
          OR: [
            { name: { contains: searchTerm } },
            { description: { contains: searchTerm } },
            { city: { contains: searchTerm } },
            { address: { contains: searchTerm } }
          ],
          isVerified: true,
          isActive: true
        },
        include: {
          owner: {
            select: {
              name: true,
              email: true
            }
          }
        },
        take: limit
      })

      results.push(...hotels.map(hotel => ({
        id: hotel.id,
        name: hotel.name,
        description: hotel.description || '',
        type: 'hotel',
        price: 100, // Default price since pricePerNight doesn't exist in schema
        rating: hotel.starRating || 0,
        location: `${hotel.city}, ${hotel.address}`,
        image: hotel.images?.[0] || '/placeholder.svg',
        url: `/hotels/${hotel.id}`,
        provider: hotel.owner?.name
      })))
    }

    // Search cars
    if (type === 'all' || type === 'cars') {
      const cars = await prisma.car.findMany({
        where: {
          OR: [
            { brand: { contains: searchTerm } },
            { model: { contains: searchTerm } },
            { currentLocation: { contains: searchTerm } },
            { category: { contains: searchTerm } }
          ],
          isVerified: true,
          isAvailable: true
        },
        include: {
          owner: {
            select: {
              name: true,
              email: true
            }
          }
        },
        take: limit
      })

      results.push(...cars.map(car => ({
        id: car.id,
        name: `${car.brand} ${car.model}`,
        description: `${car.year} ${car.color} ${car.category}`,
        type: 'car',
        price: car.pricePerDay,
        rating: 0, // No rating field in Car model
        location: car.currentLocation || 'Location not specified',
        image: car.images?.[0] || '/placeholder.svg',
        url: '/cars-rental',
        provider: car.owner?.name,
        details: [`${car.year}`, car.category, `${car.seats} seats`]
      })))
    }

    // Search tours
    if (type === 'all' || type === 'tours') {
      const tours = await prisma.tour.findMany({
        where: {
          OR: [
            { name: { contains: searchTerm } },
            { description: { contains: searchTerm } },
            { startLocation: { contains: searchTerm } },
            { endLocation: { contains: searchTerm } }
          ],
          isActive: true
        },
        include: {
          guide: {
            include: {
              user: {
                select: {
                  name: true,
                  email: true
                }
              }
            }
          }
        },
        take: limit
      })

      results.push(...tours.map(tour => ({
        id: tour.id,
        name: tour.name,
        description: tour.description || '',
        type: 'tour',
        price: tour.price,
        rating: 0, // No rating field in Tour model
        location: `${tour.startLocation} → ${tour.endLocation}`,
        image: tour.images?.[0] || '/placeholder.svg',
        url: '/tours',
        provider: tour.guide?.user?.name,
        details: [`${tour.duration}h`, `${tour.capacity} people`]
      })))
    }

    // Search special offers
    if (type === 'all' || type === 'offers') {
      const hotels = await prisma.hotel.findMany({
        where: {
          AND: [
            { isSpecialOffer: true },
            {
              OR: [
                { name: { contains: searchTerm } },
                { description: { contains: searchTerm } },
                { city: { contains: searchTerm } },
                { address: { contains: searchTerm } }
              ]
            }
          ],
          isVerified: true,
          isActive: true
        },
        take: limit
      })

      const cars = await prisma.car.findMany({
        where: {
          AND: [
            { isSpecialOffer: true },
            {
              OR: [
                { brand: { contains: searchTerm } },
                { model: { contains: searchTerm } }
              ]
            }
          ],
          isVerified: true,
          isAvailable: true
        },
        take: limit
      })

      const tours = await prisma.tour.findMany({
        where: {
          AND: [
            { isSpecialOffer: true },
            {
              OR: [
                { name: { contains: searchTerm } },
                { description: { contains: searchTerm } }
              ]
            }
          ],
          isActive: true
        },
        take: limit
      })

      results.push(...hotels.map(hotel => ({
        id: hotel.id,
        name: hotel.name,
        description: hotel.description || '',
        type: 'offer',
        price: 80, // Discounted price
        originalPrice: 100, // Original price
        rating: hotel.starRating || 0,
        location: `${hotel.city}, ${hotel.address}`,
        image: hotel.images?.[0] || '/placeholder.svg',
        url: `/hotels/${hotel.id}`,
        discount: '20% OFF'
      })))

      results.push(...cars.map(car => ({
        id: car.id,
        name: `${car.brand} ${car.model}`,
        description: `${car.year} ${car.color} ${car.category}`,
        type: 'offer',
        price: car.pricePerDay * 0.85, // 15% discount
        originalPrice: car.pricePerDay,
        rating: 0,
        location: car.currentLocation || 'Location not specified',
        image: car.images?.[0] || '/placeholder.svg',
        url: '/cars-rental',
        discount: '15% OFF'
      })))

      results.push(...tours.map(tour => ({
        id: tour.id,
        name: tour.name,
        description: tour.description || '',
        type: 'offer',
        price: tour.price * 0.75, // 25% discount
        originalPrice: tour.price,
        rating: 0,
        location: `${tour.startLocation} → ${tour.endLocation}`,
        image: tour.images?.[0] || '/placeholder.svg',
        url: '/tours',
        discount: '25% OFF'
      })))
    }

    // Sort results by relevance
    const sortedResults = results.sort((a, b) => {
      const aExactMatch = a.name.toLowerCase().includes(searchTerm) || 
                         a.description.toLowerCase().includes(searchTerm)
      const bExactMatch = b.name.toLowerCase().includes(searchTerm) || 
                         b.description.toLowerCase().includes(searchTerm)
      
      if (aExactMatch && !bExactMatch) return -1
      if (!aExactMatch && bExactMatch) return 1
      
      return (b.rating || 0) - (a.rating || 0)
    })

    return NextResponse.json({
      results: sortedResults.slice(0, limit),
      total: sortedResults.length,
      query: searchTerm,
      message: `Found ${sortedResults.length} results for "${query}"`
    })

  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'Failed to perform search' },
      { status: 500 }
    )
  }
} 