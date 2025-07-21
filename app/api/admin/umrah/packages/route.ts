import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { db } from '@/lib/db'
import { umrahPackages } from '@/drizzle/schema'
import { eq, desc } from 'drizzle-orm'

// GET - Fetch all Umrah packages (admin only)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is admin (you might want to add role checking here)
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '10')
    const page = parseInt(searchParams.get('page') || '1')

    let whereConditions = []

    if (status) {
      whereConditions.push(eq(umrahPackages.status, status))
    }

    const offset = (page - 1) * limit

    const packagesData = await db
      .select()
      .from(umrahPackages)
      .where(whereConditions.length > 0 ? whereConditions[0] : undefined)
      .orderBy(desc(umrahPackages.createdAt))
      .limit(limit)
      .offset(offset)

    // Get total count for pagination
    const totalCount = await db
      .select({ count: umrahPackages.id })
      .from(umrahPackages)
      .where(whereConditions.length > 0 ? whereConditions[0] : undefined)

    const totalPages = Math.ceil(totalCount.length / limit)

    return NextResponse.json({
      packages: packagesData,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount: totalCount.length,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      }
    })
  } catch (error) {
    console.error('Error fetching admin Umrah packages:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch Umrah packages',
        packages: [],
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

// POST - Create new Umrah package (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is admin (you might want to add role checking here)
    const body = await request.json()
    const {
      name,
      description,
      duration,
      price,
      inclusions,
      exclusions,
      itinerary,
      terms,
      isActive
    } = body

    // Validate required fields
    if (!name || !description || !duration || !price) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create Umrah package
    const [newPackage] = await db
      .insert(umrahPackages)
      .values({
        name,
        description,
        duration: parseInt(duration),
        price: parseFloat(price),
        inclusions: inclusions || null,
        exclusions: exclusions || null,
        itinerary: itinerary || null,
        terms: terms || null,
        isActive: isActive !== false,
      })
      .returning()

    return NextResponse.json({
      package: newPackage,
      message: 'Umrah package created successfully'
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating admin Umrah package:', error)
    return NextResponse.json(
      { error: 'Failed to create Umrah package' },
      { status: 500 }
    )
  }
} 