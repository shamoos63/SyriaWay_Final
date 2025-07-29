import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { tourismNews, users, tourismNewsTranslations } from '@/drizzle/schema'
import { eq, and, like, desc, asc, inArray } from 'drizzle-orm'
import { sql } from 'drizzle-orm'

// Helper function to convert frontend language codes to database language codes
function getDatabaseLanguageCode(frontendLanguage: string): string {
  const languageMap: Record<string, string> = {
    'en': 'ENGLISH',
    'ar': 'ARABIC',
    'fr': 'FRENCH'
  }
  return languageMap[frontendLanguage] || 'ENGLISH'
}

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

    // Get translations for all news items
    const newsIds = newsData.map(news => news.id)
    let allTranslations = []
    if (newsIds.length > 0) {
      allTranslations = await db
        .select()
        .from(tourismNewsTranslations)
        .where(inArray(tourismNewsTranslations.newsId, newsIds))
    }

    // Apply translations to news data
    const newsWithTranslations = newsData.map(news => {
      // Get translation for this news item in the requested language
      const databaseLanguage = getDatabaseLanguageCode(language || 'en')
      const translation = allTranslations.find(t => t.newsId === news.id && t.language === databaseLanguage)
      
      // Parse tags if they exist
      let parsedTags = []
      if (news.tags) {
        try {
          parsedTags = JSON.parse(news.tags)
        } catch {
          // If parsing fails, treat as comma-separated string
          parsedTags = news.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
        }
      }
      
      return {
        ...news,
        // Override with translation if available
        title: translation?.title || news.title,
        excerpt: translation?.excerpt || news.excerpt,
        content: translation?.content || news.content,
        seoTitle: translation?.seoTitle || news.seoTitle,
        seoDescription: translation?.seoDescription || news.seoDescription,
        seoKeywords: translation?.seoKeywords || news.seoKeywords,
        tags: parsedTags,
      }
    })

    // Get total count for pagination
    const totalCount = await db
      .select({ count: sql`count(*)` })
      .from(tourismNews)
      .where(and(...whereConditions))

    const totalPages = Math.ceil(Number(totalCount[0].count) / limit)

    return NextResponse.json({
      news: newsWithTranslations,
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

    // For demo purposes, allow demo-user-id
    if (userId === 'demo-user-id') {
      // Create or get demo user
      const demoUser = await db
        .select()
        .from(users)
        .where(eq(users.email, 'demo@syriaways.com'))
        .limit(1)

      if (demoUser.length === 0) {
        // Create demo user if it doesn't exist
        const [newDemoUser] = await db
          .insert(users)
          .values({
            email: 'demo@syriaways.com',
            name: 'Demo User',
            role: 'ADMIN',
            status: 'ACTIVE',
            preferredLang: 'ENGLISH'
          })
          .returning()
        userId = newDemoUser.id.toString()
      } else {
        userId = demoUser[0].id.toString()
      }
    }

    // Validate user ID
    const authorId = parseInt(userId)
    if (isNaN(authorId)) {
      return NextResponse.json(
        { error: 'Invalid user ID' },
        { status: 400 }
      )
    }

    // Check if user exists and has admin role
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, authorId))
      .limit(1)

    if (!user || user.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (user[0].role !== 'ADMIN' && user[0].role !== 'SUPER_ADMIN') {
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

    // Handle multilingual content
    const titleValue = typeof title === 'object' ? title.en : title
    const contentValue = typeof content === 'object' ? content.en : content
    const excerptValue = typeof excerpt === 'object' ? excerpt.en : excerpt

    // Create tourism news
    const [news] = await db.insert(tourismNews).values({
      title: titleValue,
      excerpt: excerptValue || null,
      content: contentValue,
      category: category || null,
      tags: tags ? (Array.isArray(tags) ? JSON.stringify(tags) : tags) : null,
      featuredImage: featuredImage || null,
      isFeatured: isFeatured || false,
      status: isPublished ? 'PUBLISHED' : 'DRAFT',
      publishedAt: isPublished ? new Date().toISOString() : null,
      authorId: authorId,
    }).returning()

    // Create translations for Arabic and French if provided
    const translations = []

    // Arabic translation
    if (title?.ar && content?.ar) {
      translations.push({
        newsId: news.id,
        language: 'ARABIC',
        title: title.ar,
        content: content.ar,
        excerpt: excerpt?.ar || null,
        seoTitle: null,
        seoDescription: null,
        seoKeywords: null,
      })
    }

    // French translation
    if (title?.fr && content?.fr) {
      translations.push({
        newsId: news.id,
        language: 'FRENCH',
        title: title.fr,
        content: content.fr,
        excerpt: excerpt?.fr || null,
        seoTitle: null,
        seoDescription: null,
        seoKeywords: null,
      })
    }

    // Insert translations if any exist
    if (translations.length > 0) {
      await db
        .insert(tourismNewsTranslations)
        .values(translations)
    }

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