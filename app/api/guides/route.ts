import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { tourGuides, users } from '@/drizzle/schema'
import { eq, and } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const available = searchParams.get('available')
    const verified = searchParams.get('verified')

    let whereConditions = []

    if (available === 'true') {
      whereConditions.push(eq(tourGuides.isAvailable, true))
    }

    if (verified === 'true') {
      whereConditions.push(eq(tourGuides.isVerified, true))
    }

    const guidesData = await db
      .select({
        id: tourGuides.id,
        userId: tourGuides.userId,
        bio: tourGuides.bio,
        experience: tourGuides.experience,
        languages: tourGuides.languages,
        specialties: tourGuides.specialties,
        baseLocation: tourGuides.baseLocation,
        serviceAreas: tourGuides.serviceAreas,
        isAvailable: tourGuides.isAvailable,
        isVerified: tourGuides.isVerified,
        hourlyRate: tourGuides.hourlyRate,
        dailyRate: tourGuides.dailyRate,
        currency: tourGuides.currency,
        profileImage: tourGuides.profileImage,
        certifications: tourGuides.certifications,
        createdAt: tourGuides.createdAt,
        updatedAt: tourGuides.updatedAt,
        user: {
          id: users.id,
          name: users.name,
          email: users.email,
          phone: users.phone,
        }
      })
      .from(tourGuides)
      .leftJoin(users, eq(tourGuides.userId, users.id))
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
      .orderBy(users.name)

    // Format the response to include guide name from user
    const formattedGuides = guidesData.map(guide => ({
      id: guide.id,
      name: guide.user?.name || 'Unknown Guide',
      email: guide.user?.email,
      phone: guide.user?.phone,
      bio: guide.bio,
      experience: guide.experience,
      specialties: guide.specialties,
      languages: guide.languages,
      baseLocation: guide.baseLocation,
      hourlyRate: guide.hourlyRate,
      dailyRate: guide.dailyRate,
      currency: guide.currency,
      isAvailable: guide.isAvailable,
      isVerified: guide.isVerified,
      profileImage: guide.profileImage
    }))

    return NextResponse.json({ guides: formattedGuides })
  } catch (error) {
    console.error('Error fetching guides:', error)
    return NextResponse.json(
      { error: 'Failed to fetch guides' },
      { status: 500 }
    )
  }
} 