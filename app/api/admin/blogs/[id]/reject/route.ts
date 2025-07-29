import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { db } from '@/lib/db'
import { blogs } from '@/drizzle/schema'
import { eq } from 'drizzle-orm'

// POST - Reject blog
export async function POST(
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

    // Check if user is admin (you might want to add role checking here)
    const { id } = await params
    const body = await request.json()
    const { rejectionReason } = body

    // Check if blog exists
    const [blog] = await db
      .select()
      .from(blogs)
      .where(eq(blogs.id, parseInt(id)))

    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      )
    }

    // Update blog status
    const [updatedBlog] = await db
      .update(blogs)
      .set({
        status: 'REJECTED',
        updatedAt: new Date().toISOString(),
      })
      .where(eq(blogs.id, parseInt(id)))
      .returning()

    return NextResponse.json({
      blog: updatedBlog,
      message: 'Blog rejected successfully'
    })
  } catch (error) {
    console.error('Error rejecting blog:', error)
    return NextResponse.json(
      { error: 'Failed to reject blog' },
      { status: 500 }
    )
  }
} 