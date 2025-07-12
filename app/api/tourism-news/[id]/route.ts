import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Fetch single tourism news by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const news = await prisma.tourismNews.findUnique({
      where: { id },
      include: {
        translations: true
      }
    })

    if (!news) {
      return NextResponse.json(
        { error: 'Tourism news not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ news })
  } catch (error) {
    console.error('Error fetching tourism news:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tourism news' },
      { status: 500 }
    )
  }
}

// PUT - Update tourism news (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    let userId = authHeader.replace('Bearer ', '')
    
    // For demo purposes, allow demo-user-id
    if (userId === 'demo-user-id') {
      userId = 'demo-user-id'
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const { id } = await params
    const body = await request.json()
    const {
      title,
      excerpt,
      content,
      category,
      tags,
      featuredImage,
      images,
      isPublished,
      isFeatured
    } = body

    // Check if news exists
    const existingNews = await prisma.tourismNews.findUnique({
      where: { id },
      include: { translations: true }
    })

    if (!existingNews) {
      return NextResponse.json(
        { error: 'Tourism news not found' },
        { status: 404 }
      )
    }

    // Update tourism news (store English as main fields)
    const updatedNews = await prisma.tourismNews.update({
      where: { id },
      data: {
        title: title?.en || existingNews.title,
        excerpt: excerpt?.en !== undefined ? excerpt.en : existingNews.excerpt,
        content: content?.en || existingNews.content,
        category: category !== undefined ? category : existingNews.category,
        tags: tags !== undefined ? tags : existingNews.tags,
        featuredImage: featuredImage !== undefined ? featuredImage : existingNews.featuredImage,
        images: images !== undefined ? images : existingNews.images,
        isPublished: isPublished !== undefined ? isPublished : existingNews.isPublished,
        isFeatured: isFeatured !== undefined ? isFeatured : existingNews.isFeatured,
        publishedAt: isPublished && !existingNews.isPublished ? new Date() : existingNews.publishedAt,
        updatedAt: new Date(),
        translations: {
          upsert: [
            {
              where: { newsId_language: { newsId: id, language: 'ENGLISH' } },
              update: {
                title: title?.en || existingNews.title,
                content: content?.en || existingNews.content,
                excerpt: excerpt?.en || null
              },
              create: {
                language: 'ENGLISH',
                title: title?.en || existingNews.title,
                content: content?.en || existingNews.content,
                excerpt: excerpt?.en || null
              }
            },
            {
              where: { newsId_language: { newsId: id, language: 'ARABIC' } },
              update: {
                title: title?.ar || '',
                content: content?.ar || '',
                excerpt: excerpt?.ar || null
              },
              create: {
                language: 'ARABIC',
                title: title?.ar || '',
                content: content?.ar || '',
                excerpt: excerpt?.ar || null
              }
            },
            {
              where: { newsId_language: { newsId: id, language: 'FRENCH' } },
              update: {
                title: title?.fr || '',
                content: content?.fr || '',
                excerpt: excerpt?.fr || null
              },
              create: {
                language: 'FRENCH',
                title: title?.fr || '',
                content: content?.fr || '',
                excerpt: excerpt?.fr || null
              }
            }
          ]
        }
      },
      include: {
        translations: true
      }
    })

    return NextResponse.json({
      news: updatedNews,
      message: 'Tourism news updated successfully'
    })
  } catch (error) {
    console.error('Error updating tourism news:', error)
    return NextResponse.json(
      { error: 'Failed to update tourism news' },
      { status: 500 }
    )
  }
}

// DELETE - Delete tourism news (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    let userId = authHeader.replace('Bearer ', '')
    
    // For demo purposes, allow demo-user-id
    if (userId === 'demo-user-id') {
      userId = 'demo-user-id'
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const { id } = params

    // Check if news exists
    const existingNews = await prisma.tourismNews.findUnique({
      where: { id }
    })

    if (!existingNews) {
      return NextResponse.json(
        { error: 'Tourism news not found' },
        { status: 404 }
      )
    }

    // Delete tourism news
    await prisma.tourismNews.delete({
      where: { id }
    })

    return NextResponse.json({
      message: 'Tourism news deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting tourism news:', error)
    return NextResponse.json(
      { error: 'Failed to delete tourism news' },
      { status: 500 }
    )
  }
} 