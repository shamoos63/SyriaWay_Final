import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { db } from '@/lib/db'
import { hotels, cars, tours, offers } from '@/drizzle/schema'
import { eq, and } from 'drizzle-orm'

function getTableByType(type: string) {
  switch (type) {
    case 'HOTEL': return hotels;
    case 'CAR': return cars;
    case 'TOUR': return tours;
    default: return null;
  }
}

// GET - Fetch single listing by ID and type (admin only)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type: string; id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is admin (you might want to add role checking here)
    const { type, id } = await params

    const table = getTableByType(type)
    if (!table) {
      return NextResponse.json({ error: 'Invalid listing type' }, { status: 400 })
    }
    const [listing] = await db
      .select()
      .from(table)
      .where(eq(table.id, parseInt(id)))

    if (!listing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ listing })
  } catch (error) {
    console.error('Error fetching admin listing:', error)
    return NextResponse.json(
      { error: 'Failed to fetch listing' },
      { status: 500 }
    )
  }
}

// PUT - Update listing (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ type: string; id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is admin (you might want to add role checking here)
    const { type, id } = await params
    const body = await request.json()

    // Check if listing exists
    const table = getTableByType(type)
    if (!table) {
      return NextResponse.json({ error: 'Invalid listing type' }, { status: 400 })
    }
    const [existingListing] = await db
      .select()
      .from(table)
      .where(eq(table.id, parseInt(id)))

    if (!existingListing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      )
    }

    // Update listing
    const [updatedListing] = await db
      .update(table)
      .set({
        ...body,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(table.id, parseInt(id)))
      .returning()

    return NextResponse.json({
      listing: updatedListing,
      message: 'Listing updated successfully'
    })
  } catch (error) {
    console.error('Error updating admin listing:', error)
    return NextResponse.json(
      { error: 'Failed to update listing' },
      { status: 500 }
    )
  }
}

// DELETE - Delete listing (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ type: string; id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is admin (you might want to add role checking here)
    const { type, id } = await params

    // Check if listing exists
    const table = getTableByType(type)
    if (!table) {
      return NextResponse.json({ error: 'Invalid listing type' }, { status: 400 })
    }
    const [existingListing] = await db
      .select()
      .from(table)
      .where(eq(table.id, parseInt(id)))

    if (!existingListing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      )
    }

    // Delete listing
    await db
      .delete(table)
      .where(eq(table.id, parseInt(id)))

    return NextResponse.json({
      message: 'Listing deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting admin listing:', error)
    return NextResponse.json(
      { error: 'Failed to delete listing' },
      { status: 500 }
    )
  }
} 

// PATCH - Partial update listing (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ type: string; id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    const { type, id } = await params
    const body = await request.json()
    const table = getTableByType(type)
    if (!table) {
      return NextResponse.json({ error: 'Invalid listing type' }, { status: 400 })
    }
    const [existingListing] = await db
      .select()
      .from(table)
      .where(eq(table.id, parseInt(id)))
    if (!existingListing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      )
    }
    // Only update provided fields
    const updateFields: any = {}
    const shouldUpdateSpecialOffer = body.hasOwnProperty('isSpecialOffer')
    if (body.hasOwnProperty('isVerified')) updateFields.isVerified = body.isVerified
    if (shouldUpdateSpecialOffer) updateFields.isSpecialOffer = body.isSpecialOffer
    if (Object.keys(updateFields).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
    }
    updateFields.updatedAt = new Date().toISOString()
    const [updatedListing] = await db
      .update(table)
      .set(updateFields)
      .where(eq(table.id, parseInt(id)))
      .returning()

    // Sync offers table if isSpecialOffer is toggled
    if (shouldUpdateSpecialOffer) {
      const serviceType = type
      const serviceId = parseInt(id)
      // Fetch the full updated listing row for correct fields
      const [fullListing] = await db.select().from(table).where(eq(table.id, serviceId))
      let defaultTitle = ''
      let defaultDescription = ''
      if (serviceType === 'HOTEL' && fullListing && 'name' in fullListing) {
        defaultTitle = fullListing.name || 'Hotel Special Offer'
        defaultDescription = 'description' in fullListing && fullListing.description ? fullListing.description : 'Special offer for hotel'
      } else if (serviceType === 'CAR' && fullListing && 'brand' in fullListing) {
        defaultTitle = (fullListing.brand ? `${fullListing.brand} ` : '') + (fullListing.model || '') || 'Car Special Offer'
        defaultDescription = 'category' in fullListing && fullListing.category ? fullListing.category : 'Special offer for car'
      } else if (serviceType === 'TOUR' && fullListing && 'name' in fullListing) {
        defaultTitle = fullListing.name || 'Tour Special Offer'
        defaultDescription = 'Special offer for tour'
      } else {
        defaultTitle = `${serviceType} Special Offer`
        defaultDescription = `Special offer for ${serviceType.toLowerCase()}`
      }
      const defaultDiscount = 10 // Default 10% discount
      const now = new Date()
      const startDate = now.toISOString().split('T')[0]
      const endDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 30 days from now
      if (body.isSpecialOffer) {
        // Upsert offer
        const existing = await db
          .select()
          .from(offers)
          .where(and(eq(offers.serviceType, serviceType), eq(offers.serviceId, serviceId)))
        if (existing.length > 0) {
          await db
            .update(offers)
            .set({
              isActive: true,
              updatedAt: new Date().toISOString(),
            })
            .where(and(eq(offers.serviceType, serviceType), eq(offers.serviceId, serviceId)))
        } else {
          await db.insert(offers).values({
            title: defaultTitle,
            description: defaultDescription,
            discountPercentage: defaultDiscount,
            startDate,
            endDate,
            serviceType,
            serviceId,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          })
        }
      } else {
        // Remove/deactivate offer row
        await db
          .update(offers)
          .set({ isActive: false, updatedAt: new Date().toISOString() })
          .where(and(eq(offers.serviceType, serviceType), eq(offers.serviceId, serviceId)))
      }
    }
    return NextResponse.json({
      listing: updatedListing,
      message: 'Listing updated successfully'
    })
  } catch (error) {
    console.error('Error patching admin listing:', error)
    return NextResponse.json(
      { error: 'Failed to update listing' },
      { status: 500 }
    )
  }
} 