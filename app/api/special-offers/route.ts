import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { offers, offerTranslations } from '@/drizzle/schema'
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

    return NextResponse.json({ offers: offersData })
  } catch (error) {
    console.error('Error fetching special offers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch special offers' },
      { status: 500 }
    )
  }
} 