import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { db } from '@/lib/db'
import { contactForms } from '@/drizzle/schema'
import { eq } from 'drizzle-orm'

// GET - Fetch single contact form by ID (admin only)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is admin (you might want to add role checking here)
    const { id } = await params

    const [form] = await db
      .select()
      .from(contactForms)
      .where(eq(contactForms.id, parseInt(id)))

    if (!form) {
      return NextResponse.json(
        { error: 'Contact form not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ form })
  } catch (error) {
    console.error('Error fetching admin contact form:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contact form' },
      { status: 500 }
    )
  }
}

// PUT - Update contact form (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is admin (you might want to add role checking here)
    const { id } = await params
    const body = await request.json()

    // Check if form exists
    const [existingForm] = await db
      .select()
      .from(contactForms)
      .where(eq(contactForms.id, parseInt(id)))

    if (!existingForm) {
      return NextResponse.json(
        { error: 'Contact form not found' },
        { status: 404 }
      )
    }

    // Update form
    const [updatedForm] = await db
      .update(contactForms)
      .set({
        ...body,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(contactForms.id, parseInt(id)))
      .returning()

    return NextResponse.json({
      form: updatedForm,
      message: 'Contact form updated successfully'
    })
  } catch (error) {
    console.error('Error updating admin contact form:', error)
    return NextResponse.json(
      { error: 'Failed to update contact form' },
      { status: 500 }
    )
  }
}

// DELETE - Delete contact form (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is admin (you might want to add role checking here)
    const { id } = await params

    // Check if form exists
    const [existingForm] = await db
      .select()
      .from(contactForms)
      .where(eq(contactForms.id, parseInt(id)))

    if (!existingForm) {
      return NextResponse.json(
        { error: 'Contact form not found' },
        { status: 404 }
      )
    }

    // Delete form
    await db
      .delete(contactForms)
      .where(eq(contactForms.id, parseInt(id)))

    return NextResponse.json({
      message: 'Contact form deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting admin contact form:', error)
    return NextResponse.json(
      { error: 'Failed to delete contact form' },
      { status: 500 }
    )
  }
} 