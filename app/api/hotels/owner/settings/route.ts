import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@/lib/generated/prisma'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const ownerId = authHeader.replace('Bearer ', '')

    // Get user profile
    const user = await prisma.user.findUnique({
      where: { id: ownerId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        image: true,
        role: true,
        status: true,
        preferredLang: true,
        createdAt: true,
        lastLoginAt: true
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get hotel settings
    const hotels = await prisma.hotel.findMany({
      where: { ownerId },
      select: {
        id: true,
        name: true,
        address: true,
        city: true,
        phone: true,
        email: true,
        website: true,
        description: true,
        starRating: true,
        amenities: true,
        images: true,
        isActive: true,
        isVerified: true,
        checkInTime: true,
        checkOutTime: true,
        googleMapLink: true
      }
    })

    // Get or create hotel settings
    let hotelSettings = await prisma.hotelSettings.findUnique({
      where: { ownerId }
    })

    if (!hotelSettings) {
      // Create default settings if they don't exist
      hotelSettings = await prisma.hotelSettings.create({
        data: {
          ownerId,
          autoApproveBookings: false,
          maintenanceMode: false,
          requirePasswordChange: false,
          sessionTimeout: 30
        }
      })
    }

    return NextResponse.json({
      profile: user,
      hotels: hotels,
      settings: {
        autoApproveBookings: hotelSettings.autoApproveBookings,
        maintenanceMode: hotelSettings.maintenanceMode,
        requirePasswordChange: hotelSettings.requirePasswordChange,
        sessionTimeout: hotelSettings.sessionTimeout
      }
    })
  } catch (error) {
    console.error('Error fetching hotel owner settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const ownerId = authHeader.replace('Bearer ', '')

    const body = await request.json()
    const { type, data } = body

    if (type === 'profile') {
      // Update user profile
      const updatedUser = await prisma.user.update({
        where: { id: ownerId },
        data: {
          name: data.name,
          phone: data.phone,
          preferredLang: data.preferredLang
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          image: true,
          role: true,
          status: true,
          preferredLang: true,
          createdAt: true,
          lastLoginAt: true
        }
      })

      return NextResponse.json({
        message: 'Profile updated successfully',
        profile: updatedUser
      })
    }

    if (type === 'hotel') {
      // Update hotel information
      const { hotelId, ...hotelData } = data
      
      const updatedHotel = await prisma.hotel.update({
        where: { 
          id: hotelId,
          ownerId: ownerId // Ensure the hotel belongs to this owner
        },
        data: {
          name: hotelData.name,
          address: hotelData.address,
          city: hotelData.city,
          phone: hotelData.phone,
          email: hotelData.email,
          website: hotelData.website,
          description: hotelData.description,
          starRating: hotelData.starRating ? parseInt(hotelData.starRating) : null,
          amenities: hotelData.amenities,
          images: hotelData.images,
          checkInTime: hotelData.checkInTime,
          checkOutTime: hotelData.checkOutTime,
          googleMapLink: hotelData.googleMapLink
        }
      })

      return NextResponse.json({
        message: 'Hotel updated successfully',
        hotel: updatedHotel
      })
    }

    if (type === 'settings') {
      // Update hotel settings
      const updatedSettings = await prisma.hotelSettings.upsert({
        where: { ownerId },
        update: {
          autoApproveBookings: data.autoApproveBookings,
          maintenanceMode: data.maintenanceMode,
          requirePasswordChange: data.requirePasswordChange,
          sessionTimeout: data.sessionTimeout
        },
        create: {
          ownerId,
          autoApproveBookings: data.autoApproveBookings,
          maintenanceMode: data.maintenanceMode,
          requirePasswordChange: data.requirePasswordChange,
          sessionTimeout: data.sessionTimeout
        }
      })

      return NextResponse.json({
        message: 'Settings updated successfully',
        settings: {
          autoApproveBookings: updatedSettings.autoApproveBookings,
          maintenanceMode: updatedSettings.maintenanceMode,
          requirePasswordChange: updatedSettings.requirePasswordChange,
          sessionTimeout: updatedSettings.sessionTimeout
        }
      })
    }

    return NextResponse.json({ error: 'Invalid update type' }, { status: 400 })

  } catch (error) {
    console.error('Error updating hotel owner settings:', error)
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    )
  }
} 