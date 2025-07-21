import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { db } from '@/lib/db'
import { umrahPackages } from '@/drizzle/schema'
import { eq } from 'drizzle-orm'

// GET - Fetch single Umrah package by ID (admin only)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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
    const { id } = await params

    const [package] = await db
      .select()
      .from(umrahPackages)
      .where(eq(umrahPackages.id, parseInt(id)))

    if (!package) {
      return NextResponse.json(
        { error: 'Umrah package not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ package })
  } catch (error) {
    console.error('Error fetching admin Umrah package:', error)
    return NextResponse.json(
      { error: 'Failed to fetch Umrah package' },
      { status: 500 }
    )
  }
}

// PUT - Update Umrah package (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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
    const { id } = await params
    const body = await request.json()

    // Check if package exists
    const [existingPackage] = await db
      .select()
      .from(umrahPackages)
      .where(eq(umrahPackages.id, parseInt(id)))

    if (!existingPackage) {
      return NextResponse.json(
        { error: 'Umrah package not found' },
        { status: 404 }
      )
    }

    // Update package
    const [updatedPackage] = await db
      .update(umrahPackages)
      .set({
        ...body,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(umrahPackages.id, parseInt(id)))
      .returning()

    return NextResponse.json({
      package: updatedPackage,
      message: 'Umrah package updated successfully'
    })
  } catch (error) {
    console.error('Error updating admin Umrah package:', error)
    return NextResponse.json(
      { error: 'Failed to update Umrah package' },
      { status: 500 }
    )
  }
}

// DELETE - Delete Umrah package (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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
    const { id } = await params

    // Check if package exists
    const [existingPackage] = await db
      .select()
      .from(umrahPackages)
      .where(eq(umrahPackages.id, parseInt(id)))

    if (!existingPackage) {
      return NextResponse.json(
        { error: 'Umrah package not found' },
        { status: 404 }
      )
    }

    // Delete package
    await db
      .delete(umrahPackages)
      .where(eq(umrahPackages.id, parseInt(id)))

    return NextResponse.json({
      message: 'Umrah package deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting admin Umrah package:', error)
    return NextResponse.json(
      { error: 'Failed to delete Umrah package' },
      { status: 500 }
    )
  }
} 