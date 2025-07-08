import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Fetch all special tour requests for admin
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

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status')
    const tourType = searchParams.get('tourType')
    const search = searchParams.get('search')

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}

    if (status) {
      where.status = status
    }

    if (tourType) {
      where.tourType = tourType
    }

    if (search) {
      where.OR = [
        { customerName: { contains: search, mode: 'insensitive' } },
        { customerEmail: { contains: search, mode: 'insensitive' } },
        { customerPhone: { contains: search, mode: 'insensitive' } },
        { tourType: { contains: search, mode: 'insensitive' } },
        { specialRequirements: { contains: search, mode: 'insensitive' } },
        { message: { contains: search, mode: 'insensitive' } }
      ]
    }

    const [requests, total] = await Promise.all([
      prisma.specialTourRequest.findMany({
        where,
        include: {
          guide: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true
                }
              }
            }
          }
        },
        orderBy: [
          { createdAt: 'desc' }
        ],
        skip,
        take: limit
      }),
      prisma.specialTourRequest.count({ where })
    ])

    // Format the response
    const formattedRequests = requests.map(request => ({
      id: request.id,
      customerName: request.customerName,
      customerEmail: request.customerEmail,
      customerPhone: request.customerPhone,
      tourType: request.tourType,
      preferredDates: request.preferredDates,
      groupSize: request.groupSize,
      specialRequirements: request.specialRequirements,
      budget: request.budget,
      message: request.message,
      status: request.status,
      createdAt: request.createdAt,
      updatedAt: request.updatedAt,
      guide: request.guide ? {
        id: request.guide.id,
        name: request.guide.user.name,
        email: request.guide.user.email,
        bio: request.guide.bio,
        experience: request.guide.experience,
        specialties: request.guide.specialties,
        dailyRate: request.guide.dailyRate,
        currency: request.guide.currency
      } : null,
      needsGuideAssignment: !request.guideId
    }))

    return NextResponse.json({
      requests: formattedRequests,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching special tour requests:', error)
    return NextResponse.json(
      { error: 'Failed to fetch special tour requests' },
      { status: 500 }
    )
  }
}

// PUT - Update special tour request status (admin only)
export async function PUT(request: NextRequest) {
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
    const { requestId, status, guideId, notes } = body

    if (!requestId) {
      return NextResponse.json(
        { error: 'Request ID is required' },
        { status: 400 }
      )
    }

    // Check if request exists
    const existingRequest = await prisma.specialTourRequest.findUnique({
      where: { id: requestId }
    })

    if (!existingRequest) {
      return NextResponse.json(
        { error: 'Special tour request not found' },
        { status: 404 }
      )
    }

    // Update request
    const updateData: any = {
      status: status || existingRequest.status,
      updatedAt: new Date()
    }

    // Only update guideId if provided and different from current
    if (guideId && guideId !== existingRequest.guideId) {
      updateData.guideId = guideId
    }

    const updatedRequest = await prisma.specialTourRequest.update({
      where: { id: requestId },
      data: updateData,
      include: {
        guide: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Special tour request updated successfully',
      request: {
        id: updatedRequest.id,
        customerName: updatedRequest.customerName,
        customerEmail: updatedRequest.customerEmail,
        tourType: updatedRequest.tourType,
        status: updatedRequest.status,
        guide: updatedRequest.guide ? {
          id: updatedRequest.guide.id,
          name: updatedRequest.guide.user.name,
          email: updatedRequest.guide.user.email
        } : null
      }
    })
  } catch (error) {
    console.error('Error updating special tour request:', error)
    return NextResponse.json(
      { error: 'Failed to update special tour request' },
      { status: 500 }
    )
  }
} 