import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { blogs, users, blogReactions, blogTranslations } from '@/drizzle/schema'
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

    // Get reactions for all blogs to calculate likes/dislikes
    const blogIds = blogsData.map(blog => blog.id)
    let allReactions = []
    if (blogIds.length > 0) {
      allReactions = await db
        .select()
        .from(blogReactions)
        .where(sql`${blogReactions.blogId} IN (${blogIds.join(',')})`)
    }

    // Get translations for all blogs
    let allTranslations = []
    if (blogIds.length > 0) {
      allTranslations = await db
        .select()
        .from(blogTranslations)
        .where(inArray(blogTranslations.blogId, blogIds))
    }

    // Calculate likes and dislikes for each blog and apply translations
    const blogsWithReactions = blogsData.map(blog => {
      const blogReactions = allReactions.filter(r => r.blogId === blog.id)
      const likes = blogReactions.filter(r => r.reactionType === 'LIKE').length
      const dislikes = blogReactions.filter(r => r.reactionType === 'DISLIKE').length
      
      // Get translation for this blog in the requested language
      const databaseLanguage = getDatabaseLanguageCode(language)
      const translation = allTranslations.find(t => t.blogId === blog.id && t.language === databaseLanguage)
      
      // Parse tags if they exist
      let parsedTags = []
      if (blog.tags) {
        try {
          parsedTags = JSON.parse(blog.tags)
        } catch {
          // If parsing fails, treat as comma-separated string
          parsedTags = blog.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
        }
      }
      
      return {
        ...blog,
        // Override with translation if available
        title: translation?.title || blog.title,
        excerpt: translation?.excerpt || blog.excerpt,
        content: translation?.content || blog.content,
        seoTitle: translation?.seoTitle || blog.seoTitle,
        seoDescription: translation?.seoDescription || blog.seoDescription,
        seoKeywords: translation?.seoKeywords || blog.seoKeywords,
        tags: parsedTags,
        likes,
        dislikes,
        views: blog.viewCount || 0
      }
    })

    // Get total count for pagination
    const totalCount = await db
      .select({ count: sql`count(*)` })
      .from(blogs)
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)

    const totalPages = Math.ceil(Number(totalCount[0].count) / limit)

    return NextResponse.json({
      blogs: blogsWithReactions,
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
            role: 'CUSTOMER',
            status: 'ACTIVE',
            preferredLang: 'ENGLISH'
          })
          .returning()
        userId = newDemoUser.id.toString()
      } else {
        userId = demoUser[0].id.toString()
      }
    }

    const body = await request.json()
    const {
      title,
      excerpt,
      content,
      category,
      tags,
      featuredImage
    } = body

    // Validate required fields (English is required)
    if (!title?.en || !content?.en) {
      return NextResponse.json(
        { error: 'Title and content in English are required' },
        { status: 400 }
      )
    }

    // Validate userId is a valid integer
    const authorId = parseInt(userId)
    if (isNaN(authorId)) {
      return NextResponse.json(
        { error: 'Invalid user ID' },
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
        title: title.en,
        slug,
        excerpt: excerpt?.en || null,
        content: content.en,
        authorId: authorId,
        category: category || null,
        tags: tags ? (Array.isArray(tags) ? JSON.stringify(tags) : tags) : null,
        featuredImage: featuredImage || null,
        seoTitle: null,
        seoDescription: null,
        seoKeywords: null,
        status: 'PENDING',
        publishedAt: null,
        isFeatured: false,
      })
      .returning()

    // Create translations for Arabic and French if provided
    const translations = []
    
    // Arabic translation
    if (title?.ar && content?.ar) {
      translations.push({
        blogId: blog[0].id,
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
        blogId: blog[0].id,
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
        .insert(blogTranslations)
        .values(translations)
    }

    return NextResponse.json({
      blog: blog[0],
      message: 'Blog submitted successfully! Your post will be reviewed by an admin before being published.'
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating blog:', error)
    return NextResponse.json(
      { error: 'Failed to create blog' },
      { status: 500 }
    )
  }
} 