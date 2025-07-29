import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { db } from '@/lib/db'
import { umrahRequests, users } from '@/drizzle/schema'
import { eq } from 'drizzle-orm'

// GET - Fetch single Umrah request by ID (admin only)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is admin
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, session.user.email))
      .limit(1)

    if (!user.length || (user[0].role !== 'ADMIN' && user[0].role !== 'SUPER_ADMIN')) {
      return NextResponse.json(
        { error: 'Access denied. Admin privileges required.' },
        { status: 403 }
      )
    }

    const { id } = await params

    const [request] = await db
      .select()
      .from(umrahRequests)
      .where(eq(umrahRequests.id, parseInt(id)))

    if (!request) {
      return NextResponse.json(
        { error: 'Umrah request not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ request })
  } catch (error) {
    console.error('Error fetching admin Umrah request:', error)
    return NextResponse.json(
      { error: 'Failed to fetch Umrah request' },
      { status: 500 }
    )
  }
}

// PUT - Update Umrah request (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is admin
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, session.user.email))
      .limit(1)

    if (!user.length || (user[0].role !== 'ADMIN' && user[0].role !== 'SUPER_ADMIN')) {
      return NextResponse.json(
        { error: 'Access denied. Admin privileges required.' },
        { status: 403 }
      )
    }

    const { id } = await params
    const body = await request.json()

    // Check if request exists
    const [existingRequest] = await db
      .select()
      .from(umrahRequests)
      .where(eq(umrahRequests.id, parseInt(id)))

    if (!existingRequest) {
      return NextResponse.json(
        { error: 'Umrah request not found' },
        { status: 404 }
      )
    }

    // Prepare update data - only allow updating status and specialRequirements (for admin notes)
    const updateData: any = {
      updatedAt: new Date().toISOString(),
    }

    if (body.status) {
      updateData.status = body.status
    }

    if (body.adminNotes) {
      // Store admin notes in specialRequirements field for now
      // In a future update, we should add a dedicated adminNotes field to the schema
      updateData.specialRequirements = body.adminNotes
    }

    // Update request
    const [updatedRequest] = await db
      .update(umrahRequests)
      .set(updateData)
      .where(eq(umrahRequests.id, parseInt(id)))
      .returning()

    return NextResponse.json({
      request: updatedRequest,
      message: 'Umrah request updated successfully'
    })
  } catch (error) {
    console.error('Error updating admin Umrah request:', error)
    return NextResponse.json(
      { error: 'Failed to update Umrah request' },
      { status: 500 }
    )
  }
}

// DELETE - Delete Umrah request (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is admin
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, session.user.email))
      .limit(1)

    if (!user.length || (user[0].role !== 'ADMIN' && user[0].role !== 'SUPER_ADMIN')) {
      return NextResponse.json(
        { error: 'Access denied. Admin privileges required.' },
        { status: 403 }
      )
    }

    const { id } = await params

    // Check if request exists
    const [existingRequest] = await db
      .select()
      .from(umrahRequests)
      .where(eq(umrahRequests.id, parseInt(id)))

    if (!existingRequest) {
      return NextResponse.json(
        { error: 'Umrah request not found' },
        { status: 404 }
      )
    }

    // Delete request
    await db
      .delete(umrahRequests)
      .where(eq(umrahRequests.id, parseInt(id)))

    return NextResponse.json({
      message: 'Umrah request deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting admin Umrah request:', error)
    return NextResponse.json(
      { error: 'Failed to delete Umrah request' },
      { status: 500 }
    )
  }
} 