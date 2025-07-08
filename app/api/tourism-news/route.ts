import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Fetch tourism news
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const featured = searchParams.get('featured') === 'true'
    const published = searchParams.get('published') !== 'false' // Default to published only

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}

    // If published parameter is true or not specified, only fetch published news
    if (published) {
      where.isPublished = true
    }

    if (category) {
      where.category = category
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (featured) {
      where.isFeatured = true
    }

    const [news, total] = await Promise.all([
      prisma.tourismNews.findMany({
        where,
        orderBy: [
          { isFeatured: 'desc' },
          { publishedAt: 'desc' },
          { createdAt: 'desc' }
        ],
        skip,
        take: limit
      }),
      prisma.tourismNews.count({ where })
    ])

    return NextResponse.json({
      news,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching tourism news:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tourism news' },
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
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
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
      images,
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
    const news = await prisma.tourismNews.create({
      data: {
        title,
        excerpt: excerpt || null,
        content,
        category: category || null,
        tags: tags || null,
        featuredImage: featuredImage || null,
        images: images || null,
        isPublished: isPublished || false,
        isFeatured: isFeatured || false,
        publishedAt: isPublished ? new Date() : null
      }
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