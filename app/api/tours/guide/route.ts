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

    // Get tours for this guide
    const tours = await prisma.tour.findMany({
      where: {
        guideId: guideId
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ tours })
  } catch (error) {
    console.error('Error fetching tours:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tours' },
      { status: 500 }
    )
  }
}

// POST /api/tours/guide/tours - Create a new tour
export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const userId = authHeader.replace('Bearer ', '')
    
    // Get guide ID from user ID
    const guideId = await getGuideIdFromUserId(userId)
    if (!guideId) {
      return NextResponse.json({ error: 'Guide not found' }, { status: 404 })
    }
    
    const body = await req.json()
    const tour = await prisma.tour.create({
      data: {
        ...body,
        guideId: guideId,
      },
    })
    return NextResponse.json({ tour })
  } catch (error) {
    console.error('Error creating tour:', error)
    return NextResponse.json({ error: "Failed to create tour" }, { status: 500 })
  }
}

// PUT /api/tours/guide/tours/[id] - Update a tour
export async function PUT(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const userId = authHeader.replace('Bearer ', '')
    
    // Get guide ID from user ID
    const guideId = await getGuideIdFromUserId(userId)
    if (!guideId) {
      return NextResponse.json({ error: 'Guide not found' }, { status: 404 })
    }
    
    const url = new URL(req.url)
    const id = url.pathname.split("/").pop()
    const body = await req.json()
    
    // Only allow updating own tours
    const existing = await prisma.tour.findUnique({ where: { id } })
    if (!existing || existing.guideId !== guideId) {
      return NextResponse.json({ error: "Not found or forbidden" }, { status: 404 })
    }
    
    const tour = await prisma.tour.update({
      where: { id },
      data: body,
    })
    return NextResponse.json({ tour })
  } catch (error) {
    console.error('Error updating tour:', error)
    return NextResponse.json({ error: "Failed to update tour" }, { status: 500 })
  }
}

// DELETE /api/tours/guide/tours/[id] - Delete a tour
export async function DELETE(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const userId = authHeader.replace('Bearer ', '')
    
    // Get guide ID from user ID
    const guideId = await getGuideIdFromUserId(userId)
    if (!guideId) {
      return NextResponse.json({ error: 'Guide not found' }, { status: 404 })
    }
    
    const url = new URL(req.url)
    const id = url.pathname.split("/").pop()
    
    // Only allow deleting own tours
    const existing = await prisma.tour.findUnique({ where: { id } })
    if (!existing || existing.guideId !== guideId) {
      return NextResponse.json({ error: "Not found or forbidden" }, { status: 404 })
    }
    
    await prisma.tour.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting tour:', error)
    return NextResponse.json({ error: "Failed to delete tour" }, { status: 500 })
  }
} 