import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Fetch published blogs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const featured = searchParams.get('featured') === 'true'
    const authorId = searchParams.get('authorId')
    const status = searchParams.get('status')
    const languageParam = searchParams.get('language') || 'en'
    
    // Convert language parameter to Prisma enum value
    const languageMap: { [key: string]: 'ENGLISH' | 'ARABIC' | 'FRENCH' } = {
      'en': 'ENGLISH',
      'ar': 'ARABIC', 
      'fr': 'FRENCH'
    }
    const language = languageMap[languageParam] || 'ENGLISH'

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}

    // If authorId is provided, fetch blogs by that author (for user dashboard)
    if (authorId) {
      if (authorId === 'all') {
        // For admin: fetch all blogs regardless of status
        // No additional where conditions needed
      } else {
        // For user dashboard: fetch all blogs by specific author
        where.authorId = authorId
      }
    } else {
      // For public blog page: only fetch published blogs
      where.status = 'PUBLISHED'
      where.isPublished = true
    }

    if (category) {
      where.category = category
    }

    if (status) {
      where.status = status
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { translations: { some: { title: { contains: search, mode: 'insensitive' } } } },
        { translations: { some: { excerpt: { contains: search, mode: 'insensitive' } } } },
        { translations: { some: { content: { contains: search, mode: 'insensitive' } } } }
      ]
    }

    if (featured && !authorId) {
      where.isFeatured = true
    }

    const [blogs, total] = await Promise.all([
      prisma.blog.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true
            }
          },
          translations: {
            where: { language }
          }
        },
        orderBy: [
          { isFeatured: 'desc' },
          { publishedAt: 'desc' },
          { createdAt: 'desc' }
        ],
        skip,
        take: limit
      }),
      prisma.blog.count({ where })
    ])

    return NextResponse.json({
      blogs: blogs.map(blog => {
        const translation = blog.translations[0]
        return {
          ...blog,
          title: translation?.title || blog.title,
          excerpt: translation?.excerpt || blog.excerpt,
          content: translation?.content || blog.content,
          translations: blog.translations,
          likes: blog.likes || 0,
          dislikes: blog.dislikes || 0
        }
      }),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching blogs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blogs' },
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
    const existingBlog = await prisma.blog.findUnique({
      where: { slug }
    })

    if (existingBlog) {
      return NextResponse.json(
        { error: 'A blog with this title already exists' },
        { status: 400 }
      )
    }

    // Create blog (store English as main fields)
    const blog = await prisma.blog.create({
      data: {
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
        status: 'DRAFT',
        isPublished: false,
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
      blog,
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