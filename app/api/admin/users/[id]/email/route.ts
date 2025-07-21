import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { db } from '@/lib/db'
import { users } from '@/drizzle/schema'
import { eq } from 'drizzle-orm'

// PUT - Update user email
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
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Check if user exists
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, parseInt(id)))

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if email is already taken
    const [existingEmail] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))

    if (existingEmail && existingEmail.id !== parseInt(id)) {
      return NextResponse.json(
        { error: 'Email is already taken' },
        { status: 400 }
      )
    }

    // Update user email
    const [updatedUser] = await db
      .update(users)
      .set({
        email,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(users.id, parseInt(id)))
      .returning()

    return NextResponse.json({
      user: updatedUser,
      message: 'User email updated successfully'
    })
  } catch (error) {
    console.error('Error updating user email:', error)
    return NextResponse.json(
      { error: 'Failed to update user email' },
      { status: 500 }
    )
  }
} 