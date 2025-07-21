import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { db } from '@/lib/db'
import { cars, hotels, tours, users } from '@/drizzle/schema'
import { desc } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
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
    const carRows = await db
      .select({
        id: cars.id,
        type: 'CAR',
        name: cars.brand,
        model: cars.model,
        providerId: cars.ownerId,
        createdAt: cars.createdAt,
        status: cars.isAvailable,
        price: cars.pricePerDay,
      })
      .from(cars)
    // Fetch all hotels with owner
    const hotelRows = await db
      .select({
        id: hotels.id,
        type: 'HOTEL',
        name: hotels.name,
        model: null,
        providerId: hotels.ownerId,
        createdAt: hotels.createdAt,
        status: hotels.isActive,
        price: null,
      })
      .from(hotels)
    // Fetch all tours with guide
    const tourRows = await db
      .select({
        id: tours.id,
        type: 'TOUR',
        name: tours.name,
        model: null,
        providerId: tours.guideId,
        createdAt: tours.createdAt,
        status: tours.isActive,
        price: tours.price,
      })
      .from(tours)
    // Combine all
    let allListings = [...carRows, ...hotelRows, ...tourRows]
    // Filter by type if requested
    if (typeFilter && ['CAR', 'HOTEL', 'TOUR'].includes(typeFilter)) {
      allListings = allListings.filter(l => l.type === typeFilter)
    }
    // Fetch all providers in one go
    const providerIds = Array.from(new Set(allListings.map(l => l.providerId)))
    const providerRows = providerIds.length > 0 ? await db
      .select({ id: users.id, name: users.name, email: users.email })
      .from(users)
      .where(users.id.in(providerIds)) : []
    const providerMap = Object.fromEntries(providerRows.map(u => [u.id, u]))
    // Attach provider info
    allListings = allListings.map(l => ({
      ...l,
      provider: providerMap[l.providerId] || null
    }))
    // Sort by createdAt desc (ISO string sort is fine)
    allListings.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
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