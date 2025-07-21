import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { db } from '@/lib/db'
import { listings } from '@/drizzle/schema'
import { eq, and } from 'drizzle-orm'

// GET - Fetch single listing by ID and type (admin only)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type: string; id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is admin (you might want to add role checking here)
    const { type, id } = await params

    const [listing] = await db
      .select()
      .from(listings)
      .where(and(
        eq(listings.id, parseInt(id)),
        eq(listings.type, type)
      ))

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
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is admin (you might want to add role checking here)
    const { type, id } = await params
    const body = await request.json()

    // Check if listing exists
    const [existingListing] = await db
      .select()
      .from(listings)
      .where(and(
        eq(listings.id, parseInt(id)),
        eq(listings.type, type)
      ))

    if (!existingListing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      )
    }

    // Update listing
    const [updatedListing] = await db
      .update(listings)
      .set({
        ...body,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(listings.id, parseInt(id)))
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
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is admin (you might want to add role checking here)
    const { type, id } = await params

    // Check if listing exists
    const [existingListing] = await db
      .select()
      .from(listings)
      .where(and(
        eq(listings.id, parseInt(id)),
        eq(listings.type, type)
      ))

    if (!existingListing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      )
    }

    // Delete listing
    await db
      .delete(listings)
      .where(eq(listings.id, parseInt(id)))

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