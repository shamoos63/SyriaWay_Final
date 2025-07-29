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
    
    const userId = getUserId(session);
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const toursData = await db
      .select()
      .from(tours)
      .where(eq(tours.guideId, userId))

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
    
    const userId = getUserId(session);
    if (!userId) {
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
      maxGroupSize,
      price,
      category,
      startLocation,
      endLocation,
      itinerary,
      included,
      notIncluded,
      requirements,
      images,
      isActive,
      startDate,
      endDate
    } = body

    // Validate required fields
    if (!name || !description || !duration || !price) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create tour
    const [newTour] = await db
      .insert(tours)
      .values({
        name,
        description,
        duration: parseInt(duration),
        maxGroupSize: maxGroupSize ? parseInt(maxGroupSize) : 10,
        price: parseFloat(price),
        category: category || null,
        startLocation: startLocation || null,
        endLocation: endLocation || null,
        itinerary: itinerary || null,
        included: included || null,
        notIncluded: notIncluded || null,
        requirements: requirements || null,
        images: images || null,
        isActive: isActive !== false,
        guideId: userId,
        startDate: startDate || null,
        endDate: endDate || null,
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

// Helper to extract user id from session
function getUserId(session: any): number {
  return parseInt(session?.user?.id || session?.user?.userId || '0');
} 