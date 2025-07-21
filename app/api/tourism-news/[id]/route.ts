import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { tourismNews } from '@/drizzle/schema'
import { eq } from 'drizzle-orm'

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

    return NextResponse.json({ news: newsData })
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

    // Update news
    const [updatedNews] = await db
      .update(tourismNews)
      .set({
        ...body,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(tourismNews.id, parseInt(id)))
      .returning()

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