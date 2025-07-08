import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const umrahPackage = await prisma.umrahPackage.findUnique({
      where: { id: params.id }
    })

    if (!umrahPackage) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 })
    }

    return NextResponse.json(umrahPackage)

  } catch (error) {
    console.error('Error fetching Umrah package:', error)
    return NextResponse.json(
      { error: 'Failed to fetch Umrah package' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
      images,
      isActive
    } = body

    // Validate required fields
    if (!name || !duration || !groupSize || !price) {
      return NextResponse.json(
        { error: 'Name, duration, group size, and price are required' },
        { status: 400 }
      )
    }

    const updatedPackage = await prisma.umrahPackage.update({
      where: { id: params.id },
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
        isActive: isActive !== undefined ? isActive : true
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Umrah package updated successfully',
      package: updatedPackage
    })

  } catch (error) {
    console.error('Error updating Umrah package:', error)
    return NextResponse.json(
      { error: 'Failed to update Umrah package' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Check if there are any requests for this package
    const existingRequests = await prisma.umrahRequest.findMany({
      where: { packageId: params.id }
    })

    if (existingRequests.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete package with existing requests' },
        { status: 400 }
      )
    }

    await prisma.umrahPackage.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      success: true,
      message: 'Umrah package deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting Umrah package:', error)
    return NextResponse.json(
      { error: 'Failed to delete Umrah package' },
      { status: 500 }
    )
  }
} 