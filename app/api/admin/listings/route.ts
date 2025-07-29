import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { db } from '@/lib/db'
import { cars, hotels, tours, users } from '@/drizzle/schema'
import { desc } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    // Pagination and filtering
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const page = parseInt(searchParams.get('page') || '1')
    const typeFilter = searchParams.get('type')?.toUpperCase()
    const offset = (page - 1) * limit
    // Fetch all cars with owner
    const carRowsRaw = await db
      .select({
        id: cars.id,
        name: cars.brand,
        model: cars.model,
        providerId: cars.ownerId,
        createdAt: cars.createdAt,
        status: cars.isAvailable,
        price: cars.pricePerDay,
        isVerified: cars.isVerified,
        isSpecialOffer: cars.isSpecialOffer,
      })
      .from(cars)
    const carRows = carRowsRaw.map(car => ({ ...car, type: 'CAR' as const, status: car.status ?? false }))

    // Fetch all hotels with owner
    const hotelRowsRaw = await db
      .select({
        id: hotels.id,
        name: hotels.name,
        providerId: hotels.ownerId,
        createdAt: hotels.createdAt,
        status: hotels.isActive,
        isVerified: hotels.isVerified,
        isSpecialOffer: hotels.isSpecialOffer,
      })
      .from(hotels)
    const hotelRows = hotelRowsRaw.map(hotel => ({ ...hotel, type: 'HOTEL' as const, model: null, price: null, status: hotel.status ?? false }))

    // Fetch all tours with guide
    const tourRowsRaw = await db
      .select({
        id: tours.id,
        name: tours.name,
        providerId: tours.guideId,
        createdAt: tours.createdAt,
        status: tours.isActive,
        price: tours.price,
        isVerified: tours.isVerified,
        isSpecialOffer: tours.isSpecialOffer,
      })
      .from(tours)
    const tourRows = tourRowsRaw.map(tour => ({ ...tour, type: 'TOUR' as const, model: null, status: tour.status ?? false }))

    // Combine all
    let allListings: Array<{
      id: number;
      type: 'CAR' | 'HOTEL' | 'TOUR';
      name: string;
      model: string | null;
      providerId: number;
      createdAt: string | Date;
      status: boolean;
      price: number | null;
      provider?: { id: number; name: string | null; email: string | null } | null;
    }> = [...carRows, ...hotelRows, ...tourRows]
    // Filter by type if requested
    if (typeFilter && ['CAR', 'HOTEL', 'TOUR'].includes(typeFilter)) {
      allListings = allListings.filter(l => l.type === typeFilter)
    }
    // Fetch all providers in one go
    const providerIds = Array.from(new Set(allListings.map(l => l.providerId)))
    let providerRows: Array<{ id: number; name: string | null; email: string | null }> = []
    if (providerIds.length > 0) {
      // Use inArray from drizzle-orm
      const { inArray } = await import('drizzle-orm')
      providerRows = await db
        .select({ id: users.id, name: users.name, email: users.email })
        .from(users)
        .where(inArray(users.id, providerIds))
    }
    const providerMap: Record<number, { id: number; name: string | null; email: string | null }> = Object.fromEntries(providerRows.map(u => [u.id, u]))
    // Attach provider info
    allListings = allListings.map(l => ({
      ...l,
      provider: providerMap[l.providerId] || null
    }))
    // Sort by createdAt desc
    allListings.sort((a, b) => {
      const aDate = typeof a.createdAt === 'string' ? new Date(a.createdAt) : a.createdAt
      const bDate = typeof b.createdAt === 'string' ? new Date(b.createdAt) : b.createdAt
      return bDate.getTime() - aDate.getTime()
    })
    // Pagination
    const paginated = allListings.slice(offset, offset + limit)
    const totalCount = allListings.length
    const totalPages = Math.ceil(totalCount / limit)
    return NextResponse.json({
      listings: paginated,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      }
    })
  } catch (error) {
    console.error('Error fetching admin listings:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch listings',
        listings: [],
        pagination: {
          currentPage: 1,
          totalPages: 0,
          totalCount: 0,
          hasNextPage: false,
          hasPrevPage: false,
        }
      },
      { status: 500 }
    )
  }
} 