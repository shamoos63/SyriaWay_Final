import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { bundles } from '@/drizzle/schema'
import { eq } from 'drizzle-orm'

// GET - Fetch single bundle by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const [bundle] = await db
      .select()
      .from(bundles)
      .where(eq(bundles.id, parseInt(id)))

    if (!bundle) {
      return NextResponse.json(
        { error: 'Bundle not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ bundle })
  } catch (error) {
    console.error('Error fetching bundle:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bundle' },
      { status: 500 }
    )
  }
}

// PUT - Update bundle
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // Check if bundle exists
    const [existingBundle] = await db
      .select()
      .from(bundles)
      .where(eq(bundles.id, parseInt(id)))

    if (!existingBundle) {
      return NextResponse.json(
        { error: 'Bundle not found' },
        { status: 404 }
      )
    }

    // Update bundle
    const [updatedBundle] = await db
      .update(bundles)
      .set({
        ...body,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(bundles.id, parseInt(id)))
      .returning()

    return NextResponse.json({
      bundle: updatedBundle,
      message: 'Bundle updated successfully'
    })
  } catch (error) {
    console.error('Error updating bundle:', error)
    return NextResponse.json(
      { error: 'Failed to update bundle' },
      { status: 500 }
    )
  }
}

// DELETE - Delete bundle
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Check if bundle exists
    const [existingBundle] = await db
      .select()
      .from(bundles)
      .where(eq(bundles.id, parseInt(id)))

    if (!existingBundle) {
      return NextResponse.json(
        { error: 'Bundle not found' },
        { status: 404 }
      )
    }

    // Delete bundle
    await db
      .delete(bundles)
      .where(eq(bundles.id, parseInt(id)))

    return NextResponse.json({
      message: 'Bundle deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting bundle:', error)
    return NextResponse.json(
      { error: 'Failed to delete bundle' },
      { status: 500 }
    )
  }
} 