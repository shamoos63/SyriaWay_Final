import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { db } from '@/lib/db'
import { blogReactions, blogs, users } from '@/drizzle/schema'
import { eq, and } from 'drizzle-orm'

// GET - Fetch user reactions for a blog
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get userId from email
    let userId: number | null = null;
    if (session.user.email) {
      const userRes = await db.select({ id: users.id }).from(users).where(eq(users.email, session.user.email));
      userId = userRes[0]?.id || null;
    }
    if (!userId) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 401 }
      )
    }

    const { id } = await params

    // Get user's reaction to this blog
    const [userReaction] = await db
      .select()
      .from(blogReactions)
      .where(and(
        eq(blogReactions.blogId, parseInt(id)),
        eq(blogReactions.userId, userId)
      ))

    // Get all reactions for this blog to calculate counts
    const allReactions = await db
      .select()
      .from(blogReactions)
      .where(eq(blogReactions.blogId, parseInt(id)))

    const likes = allReactions.filter(r => r.reactionType === 'LIKE').length
    const dislikes = allReactions.filter(r => r.reactionType === 'DISLIKE').length

    return NextResponse.json({
      userReaction: userReaction?.reactionType || null,
      reactions: {
        [id]: userReaction?.reactionType || null
      },
      blog: {
        likes,
        dislikes
      }
    })
  } catch (error) {
    console.error('Error fetching blog reactions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reactions' },
      { status: 500 }
    )
  }
}

// POST - Add or update reaction
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    // Get userId from email
    let userId: number | null = null;
    if (session.user.email) {
      const userRes = await db.select({ id: users.id }).from(users).where(eq(users.email, session.user.email));
      userId = userRes[0]?.id || null;
    }
    if (!userId) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await request.json()
    const { reaction, reactionType } = body

    const finalReactionType = reaction || reactionType

    if (!finalReactionType) {
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
        eq(blogReactions.userId, userId)
      ))

    if (existingReaction) {
      // Update existing reaction
      const [updatedReaction] = await db
        .update(blogReactions)
        .set({
          reactionType: finalReactionType,
          createdAt: new Date().toISOString(),
        })
        .where(eq(blogReactions.id, existingReaction.id))
        .returning()

      // Get updated counts
      const allReactions = await db
        .select()
        .from(blogReactions)
        .where(eq(blogReactions.blogId, parseInt(id)))

      const likes = allReactions.filter(r => r.reactionType === 'LIKE').length
      const dislikes = allReactions.filter(r => r.reactionType === 'DISLIKE').length

      return NextResponse.json({
        message: 'Reaction updated successfully',
        reaction: updatedReaction,
        blog: {
          likes,
          dislikes
        }
      })
    } else {
      // Create new reaction
      const [newReaction] = await db
        .insert(blogReactions)
        .values({
          blogId: parseInt(id),
          userId: userId,
          reactionType: finalReactionType,
        })
        .returning()

      // Get updated counts
      const allReactions = await db
        .select()
        .from(blogReactions)
        .where(eq(blogReactions.blogId, parseInt(id)))

      const likes = allReactions.filter(r => r.reactionType === 'LIKE').length
      const dislikes = allReactions.filter(r => r.reactionType === 'DISLIKE').length

      return NextResponse.json({
        message: 'Reaction added successfully',
        reaction: newReaction,
        blog: {
          likes,
          dislikes
        }
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
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    // Get userId from email
    let userIdDel: number | null = null;
    if (session.user.email) {
      const userRes = await db.select({ id: users.id }).from(users).where(eq(users.email, session.user.email));
      userIdDel = userRes[0]?.id || null;
    }
    if (!userIdDel) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 401 }
      )
    }

    const { id } = await params

    // Delete user's reaction to this blog
    await db
      .delete(blogReactions)
      .where(and(
        eq(blogReactions.blogId, parseInt(id)),
        eq(blogReactions.userId, userIdDel)
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