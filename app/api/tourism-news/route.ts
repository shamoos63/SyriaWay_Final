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
        { content: { contains: search, mode: 'insensitive' } },
        { translations: { some: { title: { contains: search, mode: 'insensitive' } } } },
        { translations: { some: { excerpt: { contains: search, mode: 'insensitive' } } } },
        { translations: { some: { content: { contains: search, mode: 'insensitive' } } } }
      ]
    }

    if (featured) {
      where.isFeatured = true
    }

    const [news, total] = await Promise.all([
      prisma.tourismNews.findMany({
        where,
        include: {
          translations: true
        },
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
      news: news.map(newsItem => {
        // Find translation for the requested language
        const translation = newsItem.translations.find(t => t.language === language)
        return {
          ...newsItem,
          title: translation?.title || newsItem.title,
          excerpt: translation?.excerpt || newsItem.excerpt,
          content: translation?.content || newsItem.content,
          translations: newsItem.translations
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

    // Validate required fields (English is required)
    if (!title?.en || !content?.en) {
      return NextResponse.json(
        { error: 'Title and content in English are required' },
        { status: 400 }
      )
    }

    // Create tourism news (store English as main fields)
    const news = await prisma.tourismNews.create({
      data: {
        title: title.en,
        excerpt: excerpt?.en || null,
        content: content.en,
        category: category || null,
        tags: tags || null,
        featuredImage: featuredImage || null,
        images: images || null,
        isPublished: isPublished || false,
        isFeatured: isFeatured || false,
        publishedAt: isPublished ? new Date() : null,
        translations: {
          create: [
            {
              language: 'ENGLISH',
              title: title.en,
              content: content.en,
              excerpt: excerpt?.en || null
            },
            {
              language: 'ARABIC',
              title: title.ar || '',
              content: content.ar || '',
              excerpt: excerpt?.ar || null
            },
            {
              language: 'FRENCH',
              title: title.fr || '',
              content: content.fr || '',
              excerpt: excerpt?.fr || null
            }
          ]
        }
      },
      include: {
        translations: true
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