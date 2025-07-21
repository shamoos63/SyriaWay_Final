import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { tourismNews } from '@/drizzle/schema'
import { eq, and, like, desc, asc } from 'drizzle-orm'
import { sql } from 'drizzle-orm'

// GET - Fetch tourism news
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const published = searchParams.get('published')
    const language = searchParams.get('language')
    const limit = parseInt(searchParams.get('limit') || '10')
    const page = parseInt(searchParams.get('page') || '1')

    let whereConditions = [eq(tourismNews.status, 'PUBLISHED')]

    // Handle published parameter
    if (published === 'true') {
      whereConditions.push(eq(tourismNews.status, 'PUBLISHED'))
    }

    if (search) {
      whereConditions.push(
        like(tourismNews.title, `%${search}%`)
      )
    }

    if (category) {
      whereConditions.push(eq(tourismNews.category, category))
    }

    if (featured === 'true') {
      whereConditions.push(eq(tourismNews.isFeatured, true))
    }

    const offset = (page - 1) * limit

    const newsData = await db
      .select({
        id: tourismNews.id,
        title: tourismNews.title,
        content: tourismNews.content,
        excerpt: tourismNews.excerpt,
        category: tourismNews.category,
        authorId: tourismNews.authorId,
        status: tourismNews.status,
        publishedAt: tourismNews.publishedAt,
        featuredImage: tourismNews.featuredImage,
        tags: tourismNews.tags,
        viewCount: tourismNews.viewCount,
        isFeatured: tourismNews.isFeatured,
        seoTitle: tourismNews.seoTitle,
        seoDescription: tourismNews.seoDescription,
        seoKeywords: tourismNews.seoKeywords,
        slug: tourismNews.slug,
        createdAt: tourismNews.createdAt,
        updatedAt: tourismNews.updatedAt,
      })
      .from(tourismNews)
      .where(and(...whereConditions))
      .orderBy(desc(tourismNews.publishedAt))
      .limit(limit)
      .offset(offset)

    // Ensure newsData is an array
    if (!newsData || !Array.isArray(newsData)) {
      return NextResponse.json({
        news: [],
        pagination: {
          currentPage: page,
          totalPages: 0,
          totalCount: 0,
          hasNextPage: false,
          hasPrevPage: false,
        }
      })
    }

    // Get total count for pagination
    const totalCount = await db
      .select({ count: sql`count(*)` })
      .from(tourismNews)
      .where(and(...whereConditions))

    const totalPages = Math.ceil(totalCount[0].count / limit)

    return NextResponse.json({
      news: newsData,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount: totalCount[0].count,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      }
    })
  } catch (error) {
    console.error('Error fetching tourism news:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch tourism news',
        news: [],
        pagination: {
          currentPage: 1,
          totalPages: 0,
          totalCount: 0,
          hasNextPage: false,
          hasPrevPage: false,
        }
      },
      { status: 500 }
    )
  }
}

// POST - Create new tourism news (admin only)
export async function POST(request: NextRequest) {
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
    const user = await db.select().from(tourismNews).where(eq(tourismNews.authorId, parseInt(userId)))

    if (!user || (user.length === 0)) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const body = await request.json()
    const {
      title,
      excerpt,
      content,
      category,
      tags,
      featuredImage,
      isPublished,
      isFeatured
    } = body

    // Validate required fields
    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      )
    }

    // Create tourism news
    const news = await db.insert(tourismNews).values({
      title,
      excerpt: excerpt || null,
      content,
      category: category || null,
      tags: tags ? JSON.stringify(tags) : null,
      featuredImage: featuredImage || null,
      isPublished: isPublished || false,
      isFeatured: isFeatured || false,
      status: isPublished ? 'PUBLISHED' : 'DRAFT',
      publishedAt: isPublished ? new Date().toISOString() : null,
      authorId: parseInt(userId),
    })

    return NextResponse.json({
      news,
      message: 'Tourism news created successfully'
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating tourism news:', error)
    return NextResponse.json(
      { error: 'Failed to create tourism news' },
      { status: 500 }
    )
  }
} 