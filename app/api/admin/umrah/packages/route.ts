import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    let userId = authHeader.replace('Bearer ', '')
    
    // For demo purposes, allow demo-user-id
    if (userId === 'demo-user-id') {
      userId = 'demo-user-id'
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const packages = await prisma.umrahPackage.findMany({
      orderBy: { createdAt: 'desc' }
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

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    let userId = authHeader.replace('Bearer ', '')
    
    // For demo purposes, allow demo-user-id
    if (userId === 'demo-user-id') {
      userId = 'demo-user-id'
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const body = await request.json()
    const {
      name,
      description,
      duration,
      groupSize,
      season,
      price,
      currency,
      includes,
      images
    } = body

    // Validate required fields
    if (!name || !duration || !groupSize || !price) {
      return NextResponse.json(
        { error: 'Name, duration, group size, and price are required' },
        { status: 400 }
      )
    }

    const umrahPackage = await prisma.umrahPackage.create({
      data: {
        name,
        description: description || null,
        duration: parseInt(duration),
        groupSize,
        season: season || null,
        price: parseFloat(price),
        currency: currency || 'USD',
        includes: includes || [],
        images: images || [],
        isActive: true
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Umrah package created successfully',
      package: umrahPackage
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating Umrah package:', error)
    return NextResponse.json(
      { error: 'Failed to create Umrah package' },
      { status: 500 }
    )
  }
} 