import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Fetch single blog by ID or slug
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const { searchParams } = new URL(request.url)
    const language = searchParams.get('language') || 'en'

    // Try to find by ID first, then by slug
    const blog = await prisma.blog.findFirst({
      where: {
        OR: [
          { id },
          { slug: id }
        ],
        status: 'PUBLISHED',
        isPublished: true
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        },
        reactions: {
          select: {
            userId: true,
            reaction: true
          }
        },
        translations: {
          where: { language: language as 'en' | 'ar' | 'fr' }
        }
      }
    })

    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      )
    }

    // Increment view count
    await prisma.blog.update({
      where: { id: blog.id },
      data: { views: { increment: 1 } }
    })

    const translation = blog.translations[0]

    return NextResponse.json({
      blog: {
        ...blog,
        title: translation?.title || blog.title,
        excerpt: translation?.excerpt || blog.excerpt,
        content: translation?.content || blog.content,
        translations: blog.translations,
        likes: blog.likes || 0,
        dislikes: blog.dislikes || 0,
        views: (blog.views || 0) + 1
      }
    })
  } catch (error) {
    console.error('Error fetching blog:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blog' },
      { status: 500 }
    )
  }
}

// PUT - Update blog (requires authentication and ownership or admin role)
export async function PUT(
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

    const { id } = params
    const body = await request.json()
    const {
      title,
      excerpt,
      content,
      category,
      tags,
      featuredImage,
      images,
      metaTitle,
      metaDescription,
      keywords,
      status,
      isPublished,
      publishedAt
    } = body

    // Check if blog exists
    const existingBlog = await prisma.blog.findUnique({
      where: { id },
      include: { author: true }
    })

    if (!existingBlog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      )
    }

    // Get user to check role
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if user can edit this blog (owner or admin)
    const isOwner = existingBlog.authorId === userId
    const isAdmin = user.role === 'ADMIN' || user.role === 'SUPER_ADMIN'

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: 'You can only edit your own blogs or must be an admin' },
        { status: 403 }
      )
    }

    // Generate new slug if English title changed
    let slug = existingBlog.slug
    if (title?.en && title.en !== existingBlog.title) {
      slug = title.en
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
        .substring(0, 50)

      // Check if new slug already exists
      const slugExists = await prisma.blog.findFirst({
        where: {
          slug,
          id: { not: id }
        }
      })

      if (slugExists) {
        return NextResponse.json(
          { error: 'A blog with this title already exists' },
          { status: 400 }
        )
      }
    }

    // Update blog (store English as main fields)
    const updatedBlog = await prisma.blog.update({
      where: { id },
      data: {
        title: title?.en || existingBlog.title,
        slug,
        excerpt: excerpt?.en !== undefined ? excerpt.en : existingBlog.excerpt,
        content: content?.en || existingBlog.content,
        category: category !== undefined ? category : existingBlog.category,
        tags: tags !== undefined ? tags : existingBlog.tags,
        featuredImage: featuredImage !== undefined ? featuredImage : existingBlog.featuredImage,
        images: images !== undefined ? images : existingBlog.images,
        metaTitle: metaTitle !== undefined ? metaTitle : existingBlog.metaTitle,
        metaDescription: metaDescription !== undefined ? metaDescription : existingBlog.metaDescription,
        keywords: keywords !== undefined ? keywords : existingBlog.keywords,
        status: status !== undefined ? status : existingBlog.status,
        isPublished: isPublished !== undefined ? isPublished : existingBlog.isPublished,
        publishedAt: publishedAt !== undefined ? publishedAt : existingBlog.publishedAt,
        updatedAt: new Date(),
        translations: {
          upsert: [
            {
              where: { blogId_language: { blogId: id, language: 'en' } },
              update: {
                title: title?.en || existingBlog.title,
                slug,
                excerpt: excerpt?.en || null,
                content: content?.en || '',
                metaTitle: metaTitle || null,
                metaDescription: metaDescription || null
              },
              create: {
                language: 'en',
                title: title?.en || existingBlog.title,
                slug,
                excerpt: excerpt?.en || null,
                content: content?.en || '',
                metaTitle: metaTitle || null,
                metaDescription: metaDescription || null
              }
            },
            {
              where: { blogId_language: { blogId: id, language: 'ar' } },
              update: {
                title: title?.ar || '',
                slug: (title?.ar || title?.en || existingBlog.title).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50),
                excerpt: excerpt?.ar || null,
                content: content?.ar || '',
                metaTitle: metaTitle || null,
                metaDescription: metaDescription || null
              },
              create: {
                language: 'ar',
                title: title?.ar || '',
                slug: (title?.ar || title?.en || existingBlog.title).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50),
                excerpt: excerpt?.ar || null,
                content: content?.ar || '',
                metaTitle: metaTitle || null,
                metaDescription: metaDescription || null
              }
            },
            {
              where: { blogId_language: { blogId: id, language: 'fr' } },
              update: {
                title: title?.fr || '',
                slug: (title?.fr || title?.en || existingBlog.title).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50),
                excerpt: excerpt?.fr || null,
                content: content?.fr || '',
                metaTitle: metaTitle || null,
                metaDescription: metaDescription || null
              },
              create: {
                language: 'fr',
                title: title?.fr || '',
                slug: (title?.fr || title?.en || existingBlog.title).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50),
                excerpt: excerpt?.fr || null,
                content: content?.fr || '',
                metaTitle: metaTitle || null,
                metaDescription: metaDescription || null
              }
            }
          ]
        }
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        },
        translations: true
      }
    })

    return NextResponse.json({
      blog: updatedBlog,
      message: 'Blog updated successfully'
    })
  } catch (error) {
    console.error('Error updating blog:', error)
    return NextResponse.json(
      { error: 'Failed to update blog' },
      { status: 500 }
    )
  }
}

// DELETE - Delete blog (requires authentication and ownership or admin role)
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

    const { id } = params

    // Check if blog exists
    const existingBlog = await prisma.blog.findUnique({
      where: { id }
    })

    if (!existingBlog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      )
    }

    // Get user to check role
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if user can delete this blog (owner or admin)
    const isOwner = existingBlog.authorId === userId
    const isAdmin = user.role === 'ADMIN' || user.role === 'SUPER_ADMIN'

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: 'You can only delete your own blogs or must be an admin' },
        { status: 403 }
      )
    }

    // Delete blog
    await prisma.blog.delete({
      where: { id }
    })

    return NextResponse.json({
      message: 'Blog deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting blog:', error)
    return NextResponse.json(
      { error: 'Failed to delete blog' },
      { status: 500 }
    )
  }
} 