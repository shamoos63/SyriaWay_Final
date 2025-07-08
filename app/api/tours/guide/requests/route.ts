import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Helper function to get guide ID from user ID
async function getGuideIdFromUserId(userId: string) {
  const tourGuide = await prisma.tourGuide.findFirst({
    where: { userId: userId }
  })
  return tourGuide?.id
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const userId = authHeader.replace('Bearer ', '')
    
    // Get guide ID from user ID
    const guideId = await getGuideIdFromUserId(userId)
    if (!guideId) {
      return NextResponse.json({ error: 'Guide not found' }, { status: 404 })
    }

    // Find all special tour requests for this guide
    const requests = await prisma.specialTourRequest.findMany({
      where: {
        guideId: guideId
      },
      orderBy: { createdAt: 'desc' }
    })

    // Format requests for the frontend
    const formatted = requests.map(r => ({
      id: r.id,
      customerName: r.customerName,
      customerEmail: r.customerEmail,
      customerPhone: r.customerPhone,
      tourType: r.tourType,
      preferredDates: r.preferredDates,
      groupSize: r.groupSize,
      specialRequirements: r.specialRequirements,
      budget: r.budget,
      message: r.message,
      status: r.status,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      // Add fields that frontend expects
      guests: r.groupSize,
      destination: r.tourType,
      duration: r.preferredDates ? 'Custom' : 'Flexible',
      specialRequests: r.specialRequirements,
      preferredDate: r.preferredDates ? r.preferredDates.split(' to ')[0] : new Date().toISOString(),
    }))

    return NextResponse.json({
      requests: formatted,
      total: formatted.length
    })
  } catch (error) {
    console.error('Error fetching tour guide requests:', error)
    return NextResponse.json(
      { error: 'Failed to fetch requests' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const userId = authHeader.replace('Bearer ', '')
    
    // Get guide ID from user ID
    const guideId = await getGuideIdFromUserId(userId)
    if (!guideId) {
      return NextResponse.json({ error: 'Guide not found' }, { status: 404 })
    }

    const body = await request.json()
    const { requestId, status, response, price } = body

    // Validate status
    const validStatuses = ['PENDING', 'ACCEPTED', 'DECLINED', 'COMPLETED']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      )
    }

    // Find the request and verify it belongs to this guide
    const request = await prisma.specialTourRequest.findFirst({
      where: { 
        id: requestId,
        guideId: guideId
      }
    })

    if (!request) {
      return NextResponse.json(
        { error: 'Request not found or access denied' },
        { status: 404 }
      )
    }

    // Update the request
    const updateData: any = { status }
    if (response) updateData.message = response

    const updatedRequest = await prisma.specialTourRequest.update({
      where: { id: requestId },
      data: updateData
    })

    return NextResponse.json({
      request: {
        id: updatedRequest.id,
        customerName: updatedRequest.customerName,
        customerEmail: updatedRequest.customerEmail,
        customerPhone: updatedRequest.customerPhone,
        tourType: updatedRequest.tourType,
        preferredDates: updatedRequest.preferredDates,
        groupSize: updatedRequest.groupSize,
        specialRequirements: updatedRequest.specialRequirements,
        budget: updatedRequest.budget,
        message: updatedRequest.message,
        status: updatedRequest.status,
        createdAt: updatedRequest.createdAt,
        updatedAt: updatedRequest.updatedAt,
        // Add fields that frontend expects
        guests: updatedRequest.groupSize,
        destination: updatedRequest.tourType,
        duration: updatedRequest.preferredDates ? 'Custom' : 'Flexible',
        specialRequests: updatedRequest.specialRequirements,
        preferredDate: updatedRequest.preferredDates ? updatedRequest.preferredDates.split(' to ')[0] : new Date().toISOString(),
      },
      message: 'Request updated successfully'
    })

  } catch (error) {
    console.error('Error updating tour guide request:', error)
    return NextResponse.json(
      { error: 'Failed to update request' },
      { status: 500 }
    )
  }
} 