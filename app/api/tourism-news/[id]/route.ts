import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { tourismNews, tourismNewsTranslations } from '@/drizzle/schema'
import { eq } from 'drizzle-orm'

// Helper function to convert frontend language codes to database language codes
function getDatabaseLanguageCode(frontendLanguage: string): string {
  const languageMap: Record<string, string> = {
    'en': 'ENGLISH',
    'ar': 'ARABIC',
    'fr': 'FRENCH'
  }
  return languageMap[frontendLanguage] || 'ENGLISH'
}

// GET - Fetch single tourism news by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const language = searchParams.get('language') || 'ENGLISH'

    const [newsData] = await db
      .select()
      .from(tourismNews)
      .where(eq(tourismNews.id, parseInt(id)))

    if (!newsData) {
      return NextResponse.json(
        { error: 'Tourism news not found' },
        { status: 404 }
      )
    }

    // Get translations for the news item
    const translations = await db
      .select()
      .from(tourismNewsTranslations)
      .where(eq(tourismNewsTranslations.newsId, parseInt(id)))

    // Get the translation for the requested language
    const databaseLanguage = getDatabaseLanguageCode(language)
    const translation = translations.find(t => t.language === databaseLanguage)

    // Parse tags if they exist
    let parsedTags = []
    if (newsData.tags) {
      try {
        parsedTags = JSON.parse(newsData.tags)
      } catch {
        // If parsing fails, treat as comma-separated string
        parsedTags = newsData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
      }
    }

    const news = {
      ...newsData,
      // Override with translation if available
      title: translation?.title || newsData.title,
      excerpt: translation?.excerpt || newsData.excerpt,
      content: translation?.content || newsData.content,
      seoTitle: translation?.seoTitle || newsData.seoTitle,
      seoDescription: translation?.seoDescription || newsData.seoDescription,
      seoKeywords: translation?.seoKeywords || newsData.seoKeywords,
      tags: parsedTags,
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

// PUT - Update tourism news
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // Check if news exists
    const [existingNews] = await db
      .select()
      .from(tourismNews)
      .where(eq(tourismNews.id, parseInt(id)))

    if (!existingNews) {
      return NextResponse.json(
        { error: 'Tourism news not found' },
        { status: 404 }
      )
    }

    // Extract translation data from body
    const { title, excerpt, content, translations, ...newsData } = body

    // Update main news fields (use English content as main fields)
    const [updatedNews] = await db
      .update(tourismNews)
      .set({
        title: title?.en || newsData.title,
        excerpt: excerpt?.en || newsData.excerpt,
        content: content?.en || newsData.content,
        ...newsData,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(tourismNews.id, parseInt(id)))
      .returning()

    // Handle translations if provided
    if (translations && Array.isArray(translations)) {
      // Delete existing translations
      await db
        .delete(tourismNewsTranslations)
        .where(eq(tourismNewsTranslations.newsId, parseInt(id)))

      // Insert new translations
      if (translations.length > 0) {
        await db
          .insert(tourismNewsTranslations)
          .values(translations.map(t => ({
            ...t,
            newsId: parseInt(id)
          })))
      }
    }

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

// DELETE - Delete tourism news
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Check if news exists
    const [existingNews] = await db
      .select()
      .from(tourismNews)
      .where(eq(tourismNews.id, parseInt(id)))

    if (!existingNews) {
      return NextResponse.json(
        { error: 'Tourism news not found' },
        { status: 404 }
      )
    }

    // Delete translations first (due to foreign key constraint)
    await db
      .delete(tourismNewsTranslations)
      .where(eq(tourismNewsTranslations.newsId, parseInt(id)))

    // Delete news
    await db
      .delete(tourismNews)
      .where(eq(tourismNews.id, parseInt(id)))

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