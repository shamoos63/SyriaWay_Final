import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { db } from '@/lib/db'
import { blogReactions, blogs } from '@/drizzle/schema'
import { eq, and } from 'drizzle-orm'

// POST - Add or update reaction
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await request.json()
    const { reactionType } = body

    if (!reactionType) {
      return NextResponse.json(
        { error: 'Reaction type is required' },
        { status: 400 }
      )
    }

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

    // Check if user already has a reaction
    const [existingReaction] = await db
      .select()
      .from(blogReactions)
      .where(and(
        eq(blogReactions.blogId, parseInt(id)),
        eq(blogReactions.userId, parseInt(session.user.id))
      ))

    if (existingReaction) {
      // Update existing reaction
      const [updatedReaction] = await db
        .update(blogReactions)
        .set({
          reactionType,
          createdAt: new Date().toISOString(),
        })
        .where(eq(blogReactions.id, existingReaction.id))
        .returning()

      return NextResponse.json({
        message: 'Reaction updated successfully',
        reaction: updatedReaction,
      })
    } else {
      // Create new reaction
      const [newReaction] = await db
        .insert(blogReactions)
        .values({
          blogId: parseInt(id),
          userId: parseInt(session.user.id),
          reactionType,
        })
        .returning()

      return NextResponse.json({
        message: 'Reaction added successfully',
        reaction: newReaction,
      }, { status: 201 })
    }
  } catch (error) {
    console.error('Error handling blog reaction:', error)
    return NextResponse.json(
      { error: 'Failed to handle reaction' },
      { status: 500 }
    )
  }
}

// DELETE - Remove reaction
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params

    // Delete user's reaction to this blog
    await db
      .delete(blogReactions)
      .where(and(
        eq(blogReactions.blogId, parseInt(id)),
        eq(blogReactions.userId, parseInt(session.user.id))
      ))

    return NextResponse.json({
      message: 'Reaction removed successfully',
    })
  } catch (error) {
    console.error('Error removing blog reaction:', error)
    return NextResponse.json(
      { error: 'Failed to remove reaction' },
      { status: 500 }
    )
  }
} 