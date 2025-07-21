import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { db } from '@/lib/db'
import { tours, users } from '@/drizzle/schema'
import { eq } from 'drizzle-orm'

// GET - Fetch tours created by the authenticated guide
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const toursData = await db
      .select()
      .from(tours)
      .where(eq(tours.guideId, parseInt(session.user.id)))

    return NextResponse.json({ tours: toursData })
  } catch (error) {
    console.error('Error fetching tours:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch tours',
        tours: []
      },
      { status: 500 }
    )
  }
}

// POST - Create new tour
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      title,
      description,
      duration,
      maxCapacity,
      price,
      location,
      startLocation,
      endLocation,
      itinerary,
      includedServices,
      excludedServices,
      requirements,
      images,
      isActive
    } = body

    // Validate required fields
    if (!title || !description || !duration || !price) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create tour
    const [newTour] = await db
      .insert(tours)
      .values({
        title,
        description,
        duration: parseInt(duration),
        maxCapacity: maxCapacity ? parseInt(maxCapacity) : 10,
        price: parseFloat(price),
        location: location || null,
        startLocation: startLocation || null,
        endLocation: endLocation || null,
        itinerary: itinerary || null,
        includedServices: includedServices || null,
        excludedServices: excludedServices || null,
        requirements: requirements || null,
        images: images || null,
        isActive: isActive !== false,
        guideId: parseInt(session.user.id),
      })
      .returning()

    return NextResponse.json({
      tour: newTour,
      message: 'Tour created successfully'
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating tour:', error)
    return NextResponse.json(
      { error: 'Failed to create tour' },
      { status: 500 }
    )
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