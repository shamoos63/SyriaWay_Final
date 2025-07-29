import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { db } from '@/lib/db'
import { hotels, users } from '@/drizzle/schema'
import { eq, and } from 'drizzle-orm'
import bcrypt from 'bcryptjs'

// Helper to extract user id from session
function getUserId(session: any): number {
  return parseInt(session?.user?.id || session?.user?.userId || '0');
}

// GET - Fetch hotel settings
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    const userId = getUserId(session);
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const hotelId = searchParams.get('hotelId')

    if (!hotelId) {
      return NextResponse.json(
        { error: 'Hotel ID is required' },
        { status: 400 }
      )
    }

    // Check if hotel belongs to user
    const [hotel] = await db
      .select()
      .from(hotels)
      .where(and(
        eq(hotels.id, parseInt(hotelId)),
        eq(hotels.ownerId, userId)
      ))

    if (!hotel) {
      return NextResponse.json(
        { error: 'Hotel not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ hotel })
  } catch (error) {
    console.error('Error fetching hotel settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch hotel settings' },
      { status: 500 }
    )
  }
}

// PUT - Update hotel settings
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const userId = getUserId(session);
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { type, hotelId, ...updateData } = body

    // Update profile (user info)
    if (type === 'profile') {
      const { name, phone, preferredLang } = updateData
      const [updatedUser] = await db
        .update(users)
        .set({
          ...(name && { name }),
          ...(phone && { phone }),
          ...(preferredLang && { preferredLang }),
          updatedAt: new Date().toISOString(),
        })
        .where(eq(users.id, userId))
        .returning()
      return NextResponse.json({
        profile: updatedUser,
        message: 'Profile updated successfully'
      })
    }

    // Update password
    if (type === 'password') {
      const { newPassword } = updateData
      if (!newPassword || newPassword.length < 6) {
        return NextResponse.json(
          { error: 'Password must be at least 6 characters' },
          { status: 400 }
        )
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10)
      const [updatedUser] = await db
        .update(users)
        .set({
          password: hashedPassword,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(users.id, userId))
        .returning()
      return NextResponse.json({
        profile: updatedUser,
        message: 'Password updated successfully'
      })
    }

    // Update hotel settings (default)
    if (!hotelId) {
      return NextResponse.json(
        { error: 'Hotel ID is required' },
        { status: 400 }
      )
    }

    // Check if hotel belongs to user
    const [existingHotel] = await db
      .select()
      .from(hotels)
      .where(and(
        eq(hotels.id, parseInt(hotelId)),
        eq(hotels.ownerId, userId)
      ))

    if (!existingHotel) {
      return NextResponse.json(
        { error: 'Hotel not found' },
        { status: 404 }
      )
    }

    // Update hotel settings
    const [updatedHotel] = await db
      .update(hotels)
      .set({
        ...updateData,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(hotels.id, parseInt(hotelId)))
      .returning()

    return NextResponse.json({
      hotel: updatedHotel,
      message: 'Hotel settings updated successfully'
    })
  } catch (error) {
    console.error('Error updating hotel settings:', error)
    return NextResponse.json(
      { error: 'Failed to update hotel settings' },
      { status: 500 }
    )
  }
} 