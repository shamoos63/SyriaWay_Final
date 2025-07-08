import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const available = searchParams.get('available')
    const verified = searchParams.get('verified')

    const where: any = {}

    if (available === 'true') {
      where.isAvailable = true
    }

    if (verified === 'true') {
      where.isVerified = true
    }

    const guides = await prisma.tourGuide.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        }
      },
      orderBy: {
        user: {
          name: 'asc'
        }
      }
    })

    // Format the response to include guide name from user
    const formattedGuides = guides.map(guide => ({
      id: guide.id,
      name: guide.user.name || 'Unknown Guide',
      email: guide.user.email,
      phone: guide.user.phone,
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