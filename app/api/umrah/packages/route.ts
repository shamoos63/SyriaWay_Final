import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { umrahPackages, users } from '@/drizzle/schema'
import { eq, and, gte, lte } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const season = searchParams.get('season')
    const active = searchParams.get('active')

    let whereConditions = []

    if (active === 'true') {
      whereConditions.push(eq(umrahPackages.isActive, true))
    }

    // Filter by season if specified
    if (season && season !== 'ALL') {
      const now = new Date()
      const currentYear = now.getFullYear()
      
      if (season === 'RAMADAN') {
        // Ramadan typically falls in March-April-May
        whereConditions.push(gte(umrahPackages.startDate, `${currentYear}-03-01`))
        whereConditions.push(lte(umrahPackages.endDate, `${currentYear}-05-31`))
      } else if (season === 'HAJJ') {
        // Hajj typically falls in June-July-August
        whereConditions.push(gte(umrahPackages.startDate, `${currentYear}-06-01`))
        whereConditions.push(lte(umrahPackages.endDate, `${currentYear}-08-31`))
      }
    }

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
        provider: {
          id: users.id,
          name: users.name,
          email: users.email,
        }
      })
      .from(umrahPackages)
      .leftJoin(users, eq(umrahPackages.providerId, users.id))
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
      .orderBy(umrahPackages.createdAt)

    return NextResponse.json({ packages: packagesData })
  } catch (error) {
    console.error('Error fetching Umrah packages:', error)
    return NextResponse.json(
      { error: 'Failed to fetch Umrah packages' },
      { status: 500 }
    )
  }
} 