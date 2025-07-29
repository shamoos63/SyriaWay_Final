import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { blogs, blogTranslations, users, blogReactions } from '@/drizzle/schema'
import { eq, and, or } from 'drizzle-orm'

// Helper function to convert frontend language codes to database language codes
function getDatabaseLanguageCode(frontendLanguage: string): string {
  const languageMap: Record<string, string> = {
    'en': 'ENGLISH',
    'ar': 'ARABIC',
    'fr': 'FRENCH'
  }
  return languageMap[frontendLanguage] || 'ENGLISH'
}

// GET - Fetch single blog by ID or slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const language = searchParams.get('language') || 'ENGLISH'

    // Check if id is a number (ID) or string (slug)
    const isNumeric = !isNaN(Number(id))
    
    let blogData
    if (isNumeric) {
      // Fetch by ID
      const result = await db
        .select({
          id: blogs.id,
          title: blogs.title,
          slug: blogs.slug,
          excerpt: blogs.excerpt,
          content: blogs.content,
          seoTitle: blogs.seoTitle,
          seoDescription: blogs.seoDescription,
          seoKeywords: blogs.seoKeywords,
          featuredImage: blogs.featuredImage,
          tags: blogs.tags,
          category: blogs.category,
          status: blogs.status,
          publishedAt: blogs.publishedAt,
          isFeatured: blogs.isFeatured,
          likeCount: blogs.likeCount,
          commentCount: blogs.commentCount,
          viewCount: blogs.viewCount,
          createdAt: blogs.createdAt,
          updatedAt: blogs.updatedAt,
          authorId: blogs.authorId,
          author: {
            id: users.id,
            name: users.name,
            email: users.email,
            image: users.image,
          }
        })
        .from(blogs)
        .leftJoin(users, eq(blogs.authorId, users.id))
        .where(eq(blogs.id, parseInt(id)))

      blogData = result[0]
    } else {
      // Fetch by slug
      const result = await db
        .select({
          id: blogs.id,
          title: blogs.title,
          slug: blogs.slug,
          excerpt: blogs.excerpt,
          content: blogs.content,
          seoTitle: blogs.seoTitle,
          seoDescription: blogs.seoDescription,
          seoKeywords: blogs.seoKeywords,
          featuredImage: blogs.featuredImage,
          tags: blogs.tags,
          category: blogs.category,
          status: blogs.status,
          publishedAt: blogs.publishedAt,
          isFeatured: blogs.isFeatured,
          likeCount: blogs.likeCount,
          commentCount: blogs.commentCount,
          viewCount: blogs.viewCount,
          createdAt: blogs.createdAt,
          updatedAt: blogs.updatedAt,
          authorId: blogs.authorId,
          author: {
            id: users.id,
            name: users.name,
            email: users.email,
            image: users.image,
          }
        })
        .from(blogs)
        .leftJoin(users, eq(blogs.authorId, users.id))
        .where(eq(blogs.slug, id))

      blogData = result[0]
    }

    if (!blogData) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      )
    }

    // Get translations for the blog
    const translations = await db
      .select()
      .from(blogTranslations)
      .where(eq(blogTranslations.blogId, blogData.id))

    // Increment view count
    const updatedViewCount = (blogData.viewCount || 0) + 1
    await db
      .update(blogs)
      .set({
        viewCount: updatedViewCount,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(blogs.id, blogData.id))

    // Get the translation for the requested language
    const databaseLanguage = getDatabaseLanguageCode(language)
    const translation = translations.find(t => t.language === databaseLanguage)

    // Get reactions for this blog
    const blogReactionsData = await db
      .select()
      .from(blogReactions)
      .where(eq(blogReactions.blogId, blogData.id))

    const likes = blogReactionsData.filter(r => r.reactionType === 'LIKE').length
    const dislikes = blogReactionsData.filter(r => r.reactionType === 'DISLIKE').length

    // Parse tags if they exist
    let parsedTags = []
    if (blogData.tags) {
      try {
        parsedTags = JSON.parse(blogData.tags)
      } catch {
        // If parsing fails, treat as comma-separated string
        parsedTags = blogData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
      }
    }

    const blog = {
      ...blogData,
      // Override with translation if available
      title: translation?.title || blogData.title,
      excerpt: translation?.excerpt || blogData.excerpt,
      content: translation?.content || blogData.content,
      seoTitle: translation?.seoTitle || blogData.seoTitle,
      seoDescription: translation?.seoDescription || blogData.seoDescription,
      seoKeywords: translation?.seoKeywords || blogData.seoKeywords,
      translations: translations || [],
      tags: parsedTags,
      likes,
      dislikes,
      views: updatedViewCount
    }

    return NextResponse.json({ blog })
  } catch (error) {
    console.error('Error fetching blog:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blog' },
      { status: 500 }
    )
  }
}

// PUT - Update blog
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // Check if blog exists
    const [existingBlog] = await db
      .select()
      .from(blogs)
      .where(eq(blogs.id, parseInt(id)))

    if (!existingBlog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      )
    }

    // Extract translation data from body
    const { title, excerpt, content, translations, ...blogData } = body

    // Update main blog fields (use English content as main fields)
    const [updatedBlog] = await db
      .update(blogs)
      .set({
        title: title?.en || blogData.title,
        excerpt: excerpt?.en || blogData.excerpt,
        content: content?.en || blogData.content,
        ...blogData,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(blogs.id, parseInt(id)))
      .returning()

    // Handle translations if provided
    if (translations && Array.isArray(translations)) {
      // Delete existing translations
      await db
        .delete(blogTranslations)
        .where(eq(blogTranslations.blogId, parseInt(id)))

      // Insert new translations
      if (translations.length > 0) {
        await db
          .insert(blogTranslations)
          .values(translations.map(t => ({
            ...t,
            blogId: parseInt(id)
          })))
      }
    }

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

// DELETE - Delete blog
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Check if blog exists
    const [existingBlog] = await db
      .select()
      .from(blogs)
      .where(eq(blogs.id, parseInt(id)))

    if (!existingBlog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      )
    }

    // Delete blog translations first
    await db
      .delete(blogTranslations)
      .where(eq(blogTranslations.blogId, parseInt(id)))

    // Delete blog
    await db
      .delete(blogs)
      .where(eq(blogs.id, parseInt(id)))

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