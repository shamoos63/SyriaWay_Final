import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { bundles, bundleTranslations } from '@/drizzle/schema'
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

// GET - Fetch single bundle by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const language = searchParams.get('language') || 'ENGLISH'

    const [bundle] = await db
      .select()
      .from(bundles)
      .where(eq(bundles.id, parseInt(id)))

    if (!bundle) {
      return NextResponse.json(
        { error: 'Bundle not found' },
        { status: 404 }
      )
    }

    // Get translations for the bundle
    const translations = await db
      .select()
      .from(bundleTranslations)
      .where(eq(bundleTranslations.bundleId, bundle.id))

    // Get the translation for the requested language
    const databaseLanguage = getDatabaseLanguageCode(language)
    const translation = translations.find(t => t.language === databaseLanguage)

    const bundleWithTranslations = {
      ...bundle,
      // Override with translation if available
      name: translation?.name || bundle.name,
      description: translation?.description || bundle.description,
      translations: translations || []
    }

    return NextResponse.json({ bundle: bundleWithTranslations })
  } catch (error) {
    console.error('Error fetching bundle:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bundle' },
      { status: 500 }
    )
  }
}

// PUT - Update bundle
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // Check if bundle exists
    const [existingBundle] = await db
      .select()
      .from(bundles)
      .where(eq(bundles.id, parseInt(id)))

    if (!existingBundle) {
      return NextResponse.json(
        { error: 'Bundle not found' },
        { status: 404 }
      )
    }

    // Extract translation data from body
    const { translations, ...bundleData } = body

    // Update bundle
    const [updatedBundle] = await db
      .update(bundles)
      .set({
        ...bundleData,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(bundles.id, parseInt(id)))
      .returning()

    // Handle translations if provided
    if (translations && Array.isArray(translations)) {
      // Delete existing translations
      await db
        .delete(bundleTranslations)
        .where(eq(bundleTranslations.bundleId, parseInt(id)))

      // Insert new translations
      if (translations.length > 0) {
        await db
          .insert(bundleTranslations)
          .values(translations.map(t => ({
            ...t,
            bundleId: parseInt(id)
          })))
      }
    }

    return NextResponse.json({
      bundle: updatedBundle,
      message: 'Bundle updated successfully'
    })
  } catch (error) {
    console.error('Error updating bundle:', error)
    return NextResponse.json(
      { error: 'Failed to update bundle' },
      { status: 500 }
    )
  }
}

// DELETE - Delete bundle
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Check if bundle exists
    const [existingBundle] = await db
      .select()
      .from(bundles)
      .where(eq(bundles.id, parseInt(id)))

    if (!existingBundle) {
      return NextResponse.json(
        { error: 'Bundle not found' },
        { status: 404 }
      )
    }

    // Delete bundle translations first
    await db
      .delete(bundleTranslations)
      .where(eq(bundleTranslations.bundleId, parseInt(id)))

    // Delete bundle
    await db
      .delete(bundles)
      .where(eq(bundles.id, parseInt(id)))

    return NextResponse.json({
      message: 'Bundle deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting bundle:', error)
    return NextResponse.json(
      { error: 'Failed to delete bundle' },
      { status: 500 }
    )
  }
} 