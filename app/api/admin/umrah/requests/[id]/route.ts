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
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is admin (you might want to add role checking here)
    const { id } = await params

    const [request] = await db
      .select({
        id: umrahRequests.id,
        userId: umrahRequests.userId,
        packageId: umrahRequests.packageId,
        startDate: umrahRequests.startDate,
        endDate: umrahRequests.endDate,
        numberOfPeople: umrahRequests.numberOfPeople,
        specialRequests: umrahRequests.specialRequests,
        status: umrahRequests.status,
        createdAt: umrahRequests.createdAt,
        updatedAt: umrahRequests.updatedAt,
        user: {
          id: users.id,
          name: users.name,
          email: users.email,
          image: users.image,
        }
      })
      .from(umrahRequests)
      .leftJoin(users, eq(umrahRequests.userId, users.id))
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
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is admin (you might want to add role checking here)
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

    // Update request
    const [updatedRequest] = await db
      .update(umrahRequests)
      .set({
        ...body,
        updatedAt: new Date().toISOString(),
      })
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
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is admin (you might want to add role checking here)
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