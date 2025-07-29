import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { db } from '@/lib/db'
import { umrahPackages, umrahPackageTranslations } from '@/drizzle/schema'
import { eq, desc, and } from 'drizzle-orm'

// GET - Fetch all Umrah packages (admin only)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const language = searchParams.get('language') || 'ENGLISH'
    const limit = parseInt(searchParams.get('limit') || '10')
    const page = parseInt(searchParams.get('page') || '1')

    const offset = (page - 1) * limit

    // Fetch packages with translations
    const packagesData = await db
      .select({
        id: umrahPackages.id,
        name: umrahPackages.name,
        description: umrahPackages.description,
        providerId: umrahPackages.providerId,
        duration: umrahPackages.duration,
        price: umrahPackages.price,
        currency: umrahPackages.currency,
        maxPilgrims: umrahPackages.maxPilgrims,
        currentPilgrims: umrahPackages.currentPilgrims,
        startDate: umrahPackages.startDate,
        endDate: umrahPackages.endDate,
        isActive: umrahPackages.isActive,
        isVerified: umrahPackages.isVerified,
        createdAt: umrahPackages.createdAt,
        updatedAt: umrahPackages.updatedAt,
        translations: umrahPackageTranslations
      })
      .from(umrahPackages)
      .leftJoin(umrahPackageTranslations, eq(umrahPackages.id, umrahPackageTranslations.packageId))
      .orderBy(desc(umrahPackages.createdAt))
      .limit(limit)
      .offset(offset)

    // Group packages with their translations
    const packagesWithTranslations = packagesData.reduce((acc, row) => {
      const existingPackage = acc.find(pkg => pkg.id === row.id)
      
      if (existingPackage) {
        if (row.translations) {
          existingPackage.translations.push(row.translations)
        }
      } else {
        const newPackage = {
          id: row.id,
          name: row.name,
          description: row.description,
          providerId: row.providerId,
          duration: row.duration,
          price: row.price,
          currency: row.currency,
          maxPilgrims: row.maxPilgrims,
          currentPilgrims: row.currentPilgrims,
          startDate: row.startDate,
          endDate: row.endDate,
          isActive: row.isActive,
          isVerified: row.isVerified,
          createdAt: row.createdAt,
          updatedAt: row.updatedAt,
          translations: row.translations ? [row.translations] : []
        }
        acc.push(newPackage)
      }
      
      return acc
    }, [] as any[])

    // Get total count for pagination
    const totalCount = await db
      .select({ count: umrahPackages.id })
      .from(umrahPackages)

    const totalPages = Math.ceil(totalCount.length / limit)

    return NextResponse.json({
      packages: packagesWithTranslations,
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
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      name,
      description,
      duration,
      price,
      currency,
      maxPilgrims,
      startDate,
      endDate,
      isActive,
      translations
    } = body

    // Validate required fields
    if (!name || !duration || !price || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Missing required fields: name, duration, price, startDate, and endDate are required' },
        { status: 400 }
      )
    }

    // Create Umrah package
    const [newPackage] = await db
      .insert(umrahPackages)
      .values({
        name,
        description: description || '',
        duration: parseInt(duration),
        price: parseFloat(price),
        currency: currency || 'USD',
        maxPilgrims: maxPilgrims ? parseInt(maxPilgrims) : null,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        isActive: isActive !== false,
        providerId: 1, // Default provider ID
      })
      .returning()

    // Insert translations if provided
    if (translations && Array.isArray(translations)) {
      for (const translation of translations) {
        if (translation.language && translation.name) {
          await db
            .insert(umrahPackageTranslations)
            .values({
              packageId: newPackage.id,
              language: translation.language,
              name: translation.name,
              description: translation.description || '',
            })
        }
      }
    }

    return NextResponse.json({
      package: newPackage,
      message: 'Umrah package created successfully'
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating admin Umrah package:', error)
    console.error('Request body:', body)
    return NextResponse.json(
      { error: 'Failed to create Umrah package', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 