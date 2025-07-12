import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST - Add or update reaction
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }
    
    let userId = authHeader.replace('Bearer ', '')
    
    // For demo purposes, allow demo-user-id
    if (userId === 'demo-user-id') {
      userId = 'demo-user-id'
    }

    const { id } = await params
    const body = await request.json()
    const { reaction } = body // "LIKE" or "DISLIKE"

    if (!reaction || !['LIKE', 'DISLIKE'].includes(reaction)) {
      return NextResponse.json({ error: 'Invalid reaction type' }, { status: 400 })
    }

    // Check if blog exists
    const blog = await prisma.blog.findUnique({ where: { id } })
    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 })
    }

    // Check if user already reacted
    const existingReaction = await prisma.blogReaction.findUnique({
      where: { blogId_userId: { blogId: id, userId } }
    })

    if (existingReaction) {
      // Update existing reaction
      if (existingReaction.reaction === reaction) {
        // Remove reaction if clicking the same button
        await prisma.blogReaction.delete({
          where: { id: existingReaction.id }
        })
        
        // Update blog counts
        await prisma.blog.update({
          where: { id },
          data: {
            likes: reaction === 'LIKE' ? { decrement: 1 } : { decrement: 0 },
            dislikes: reaction === 'DISLIKE' ? { decrement: 1 } : { decrement: 0 }
          }
        })
      } else {
        // Change reaction
        await prisma.blogReaction.update({
          where: { id: existingReaction.id },
          data: { reaction }
        })
        
        // Update blog counts
        await prisma.blog.update({
          where: { id },
          data: {
            likes: reaction === 'LIKE' ? { increment: 1 } : { decrement: 1 },
            dislikes: reaction === 'DISLIKE' ? { increment: 1 } : { decrement: 1 }
          }
        })
      }
    } else {
      // Create new reaction
      await prisma.blogReaction.create({
        data: {
          blogId: id,
          userId,
          reaction
        }
      })
      
      // Update blog counts
      await prisma.blog.update({
        where: { id },
        data: {
          likes: reaction === 'LIKE' ? { increment: 1 } : { increment: 0 },
          dislikes: reaction === 'DISLIKE' ? { increment: 1 } : { increment: 0 }
        }
      })
    }

    // Get updated blog with counts
    const updatedBlog = await prisma.blog.findUnique({
      where: { id },
      select: {
        id: true,
        likes: true,
        dislikes: true
      }
    })

    return NextResponse.json({
      success: true,
      blog: updatedBlog,
      message: existingReaction && existingReaction.reaction === reaction 
        ? 'Reaction removed' 
        : 'Reaction updated'
    })
  } catch (error) {
    console.error('Error handling blog reaction:', error)
    return NextResponse.json({ error: 'Failed to process reaction' }, { status: 500 })
  }
}

// GET - Get user's reaction for a blog
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }
    
    let userId = authHeader.replace('Bearer ', '')
    
    // For demo purposes, allow demo-user-id
    if (userId === 'demo-user-id') {
      userId = 'demo-user-id'
    }

    const { id } = await params

    // Get user's reaction
    const reaction = await prisma.blogReaction.findUnique({
      where: { blogId_userId: { blogId: id, userId } }
    })

    return NextResponse.json({
      reaction: reaction?.reaction || null
    })
  } catch (error) {
    console.error('Error getting user reaction:', error)
    return NextResponse.json({ error: 'Failed to get reaction' }, { status: 500 })
  }
} 