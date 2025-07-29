import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hotels, users, tours, cars, tourismSites, blogs } from '@/drizzle/schema'
import { eq, and, or, like } from 'drizzle-orm'

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
      const hotelsData = await db
        .select({
          id: hotels.id,
          name: hotels.name,
          description: hotels.description,
          city: hotels.city,
          address: hotels.address,
          isVerified: hotels.isVerified,
          isActive: hotels.isActive,
          starRating: hotels.starRating,
          images: hotels.images,
          owner: {
            name: users.name,
            email: users.email
          }
        })
        .from(hotels)
        .leftJoin(users, eq(hotels.ownerId, users.id))
        .where(and(
          or(
            like(hotels.name, `%${searchTerm}%`),
            like(hotels.description, `%${searchTerm}%`),
            like(hotels.city, `%${searchTerm}%`),
            like(hotels.address, `%${searchTerm}%`)
          ),
          eq(hotels.isVerified, true),
          eq(hotels.isActive, true)
        ))
        .limit(limit)

      results.push(...hotelsData.map(hotel => ({
        id: hotel.id,
        name: hotel.name,
        description: hotel.description || '',
        type: 'hotel',
        price: 100, // Default price since pricePerNight doesn't exist in schema
        rating: hotel.starRating || 0,
        location: `${hotel.city}, ${hotel.address}`,
        image: hotel.images ? JSON.parse(hotel.images)[0] : '/placeholder.svg',
        url: `/hotels/${hotel.id}`,
        provider: hotel.owner?.name
      })))
    }

    // Search tours
    if (type === 'all' || type === 'tours') {
      const toursData = await db
        .select({
          id: tours.id,
          name: tours.name,
          description: tours.description,
          startLocation: tours.startLocation,
          endLocation: tours.endLocation,
          price: tours.price,
          isActive: tours.isActive,
          images: tours.images,
        })
        .from(tours)
        .where(and(
          or(
            like(tours.name, `%${searchTerm}%`),
            like(tours.description, `%${searchTerm}%`),
            like(tours.startLocation, `%${searchTerm}%`),
            like(tours.endLocation, `%${searchTerm}%`)
          ),
          eq(tours.isActive, true)
        ))
        .limit(limit)

      results.push(...toursData.map(tour => ({
        id: tour.id,
        name: tour.name,
        description: tour.description || '',
        type: 'tour',
        price: tour.price,
        rating: 0, // No rating system for tours yet
        location: `${tour.startLocation} to ${tour.endLocation}`,
        image: tour.images ? JSON.parse(tour.images)[0] : '/placeholder.svg',
        url: `/tours/${tour.id}`,
        provider: 'Tour Guide'
      })))
    }

    // Search cars
    if (type === 'all' || type === 'cars') {
      const carsData = await db
        .select({
          id: cars.id,
          brand: cars.brand,
          model: cars.model,
          year: cars.year,
          pricePerDay: cars.pricePerDay,
          isAvailable: cars.isAvailable,
          isVerified: cars.isVerified,
          images: cars.images,
        })
        .from(cars)
        .where(and(
          or(
            like(cars.brand, `%${searchTerm}%`),
            like(cars.model, `%${searchTerm}%`)
          ),
          eq(cars.isAvailable, true),
          eq(cars.isVerified, true)
        ))
        .limit(limit)

      results.push(...carsData.map(car => ({
        id: car.id,
        name: `${car.brand} ${car.model} (${car.year})`,
        description: `${car.brand} ${car.model} available for rent`,
        type: 'car',
        price: car.pricePerDay,
        rating: 0, // No rating system for cars yet
        location: 'Available for pickup',
        image: car.images ? JSON.parse(car.images)[0] : '/placeholder.svg',
        url: `/cars/${car.id}`,
        provider: 'Car Owner'
      })))
    }

    // Search tourism sites
    if (type === 'all' || type === 'sites') {
      const sitesData = await db
        .select({
          id: tourismSites.id,
          name: tourismSites.name,
          description: tourismSites.description,
          city: tourismSites.city,
          category: tourismSites.category,
          isActive: tourismSites.isActive,
          images: tourismSites.images,
        })
        .from(tourismSites)
        .where(and(
          or(
            like(tourismSites.name, `%${searchTerm}%`),
            like(tourismSites.description, `%${searchTerm}%`),
            like(tourismSites.city, `%${searchTerm}%`)
          ),
          eq(tourismSites.isActive, true)
        ))
        .limit(limit)

      results.push(...sitesData.map(site => ({
        id: site.id,
        name: site.name,
        description: site.description || '',
        type: 'site',
        price: 0, // Free to visit
        rating: 0, // No rating system for sites yet
        location: site.city,
        image: site.images ? JSON.parse(site.images)[0] : '/placeholder.svg',
        url: `/tourism-sites/${site.id}`,
        provider: 'Tourism Site'
      })))
    }

    // Search blogs
    if (type === 'all' || type === 'blogs') {
      const blogsData = await db
        .select({
          id: blogs.id,
          title: blogs.title,
          excerpt: blogs.excerpt,
          slug: blogs.slug,
          status: blogs.status,
          featuredImage: blogs.featuredImage,
        })
        .from(blogs)
        .where(and(
          or(
            like(blogs.title, `%${searchTerm}%`),
            like(blogs.excerpt, `%${searchTerm}%`)
          ),
          eq(blogs.status, 'PUBLISHED')
        ))
        .limit(limit)

      results.push(...blogsData.map(blog => ({
        id: blog.id,
        name: blog.title,
        description: blog.excerpt || '',
        type: 'blog',
        price: 0, // Free to read
        rating: 0, // No rating system for blogs yet
        location: 'Blog',
        image: blog.featuredImage || '/placeholder.svg',
        url: `/blog/${blog.slug}`,
        provider: 'Blog Author'
      })))
    }

    return NextResponse.json({
      results: results.slice(0, limit),
      total: results.length,
      query,
      message: `Found ${results.length} results for "${query}"`
    })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    )
  }
} 