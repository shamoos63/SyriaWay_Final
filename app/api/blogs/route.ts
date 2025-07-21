import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { blogs, users } from '@/drizzle/schema'
import { eq, and, like, desc, asc } from 'drizzle-orm'
import { sql } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const category = searchParams.get('category')
    const status = searchParams.get('status') || 'PUBLISHED'
    const featured = searchParams.get('featured')
    const language = searchParams.get('language') || 'ENGLISH'
    const limit = parseInt(searchParams.get('limit') || '10')
    const page = parseInt(searchParams.get('page') || '1')

    let whereConditions = []

    // Only show published blogs for public access
    if (status === 'PUBLISHED') {
      whereConditions.push(eq(blogs.status, 'PUBLISHED'))
    } else if (status) {
      whereConditions.push(eq(blogs.status, status))
    }

    if (search) {
      whereConditions.push(
        like(blogs.title, `%${search}%`)
      )
    }

    if (category) {
      whereConditions.push(eq(blogs.category, category))
    }

    if (featured === 'true') {
      whereConditions.push(eq(blogs.isFeatured, true))
    }

    const offset = (page - 1) * limit

    const blogsData = await db
      .select({
        id: blogs.id,
        title: blogs.title,
        content: blogs.content,
        excerpt: blogs.excerpt,
        authorId: blogs.authorId,
        status: blogs.status,
        publishedAt: blogs.publishedAt,
        featuredImage: blogs.featuredImage,
        tags: blogs.tags,
        category: blogs.category,
        viewCount: blogs.viewCount,
        likeCount: blogs.likeCount,
        commentCount: blogs.commentCount,
        isFeatured: blogs.isFeatured,
        seoTitle: blogs.seoTitle,
        seoDescription: blogs.seoDescription,
        seoKeywords: blogs.seoKeywords,
        slug: blogs.slug,
        createdAt: blogs.createdAt,
        updatedAt: blogs.updatedAt,
        author: {
          id: users.id,
          name: users.name,
          email: users.email,
          image: users.image,
        }
      })
      .from(blogs)
      .leftJoin(users, eq(blogs.authorId, users.id))
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
      .orderBy(desc(blogs.publishedAt))
      .limit(limit)
      .offset(offset)

    // Ensure blogsData is an array
    if (!blogsData || !Array.isArray(blogsData)) {
      return NextResponse.json({
        blogs: [],
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
      .from(blogs)
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)

    const totalPages = Math.ceil(totalCount[0].count / limit)

    return NextResponse.json({
      blogs: blogsData,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount: totalCount[0].count,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      }
    })
  } catch (error) {
    console.error('Error fetching blogs:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch blogs',
        blogs: [],
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

// POST - Create new blog (requires authentication)
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
      keywords
    } = body

    // Validate required fields (English is required)
    if (!title?.en || !content?.en) {
      return NextResponse.json(
        { error: 'Title and content in English are required' },
        { status: 400 }
      )
    }

    // Generate slug from English title
    const slug = title.en
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .substring(0, 50)

    // Check if slug already exists
    const existingBlog = await db
      .select()
      .from(blogs)
      .where(eq(blogs.slug, slug))

    if (existingBlog.length > 0) {
      return NextResponse.json(
        { error: 'A blog with this title already exists' },
        { status: 400 }
      )
    }

    // Create blog (store English as main fields)
    const blog = await db
      .insert(blogs)
      .values({
        authorId: userId,
        title: title.en,
        slug,
        excerpt: excerpt?.en || null,
        content: content.en,
        category: category || null,
        tags: tags || null,
        featuredImage: featuredImage || null,
        images: images || null,
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        keywords: keywords || null,
        status: 'PUBLISHED',
        isPublished: true,
        publishedAt: new Date(),
        isFeatured: false,
        translations: {
          create: [
            {
              language: 'ENGLISH',
              title: title.en,
              slug,
              excerpt: excerpt?.en || null,
              content: content.en,
              metaTitle: metaTitle || null,
              metaDescription: metaDescription || null
            },
            {
              language: 'ARABIC',
              title: title.ar || '',
              slug: (title.ar || title.en).toLowerCase().replace(/[^\u0600-\u06FFa-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50),
              excerpt: excerpt?.ar || null,
              content: content.ar || '',
              metaTitle: metaTitle || null,
              metaDescription: metaDescription || null
            },
            {
              language: 'FRENCH',
              title: title.fr || '',
              slug: (title.fr || title.en).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50),
              excerpt: excerpt?.fr || null,
              content: content.fr || '',
              metaTitle: metaTitle || null,
              metaDescription: metaDescription || null
            }
          ]
        }
      })
      .returning()

    return NextResponse.json({
      blog: blog[0],
      message: 'Blog created successfully'
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating blog:', error)
    return NextResponse.json(
      { error: 'Failed to create blog' },
      { status: 500 }
    )
  }
} 