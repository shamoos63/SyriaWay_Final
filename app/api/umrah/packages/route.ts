import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const season = searchParams.get('season')

    const where: any = { isActive: true }
    if (season && season !== 'ALL') {
      where.season = season
    }

    const packages = await prisma.umrahPackage.findMany({
      where,
      orderBy: { price: 'asc' }
    })

    return NextResponse.json({
      packages,
      total: packages.length
    })

  } catch (error) {
    console.error('Error fetching Umrah packages:', error)
    return NextResponse.json(
      { error: 'Failed to fetch Umrah packages' },
      { status: 500 }
    )
  }
} 