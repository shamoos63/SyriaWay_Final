import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@/lib/generated/prisma'

const prisma = new PrismaClient()

export async function PUT(
  request: NextRequest,
  { params }: { params: { hotelId: string } }
) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const ownerId = authHeader.replace('Bearer ', '')
    const { hotelId } = params

    const body = await request.json()
    const { name, address, city, starRating, phone, email, website, description, amenities, images } = body

    // Validate required fields
    if (!name || !address || !city) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if hotel exists and belongs to this owner
    const existingHotel = await prisma.hotel.findFirst({
      where: {
        id: hotelId,
        ownerId: ownerId
      }
    })

    if (!existingHotel) {
      return NextResponse.json(
        { error: 'Hotel not found or access denied' },
        { status: 404 }
      )
    }

    // Update hotel
    const updatedHotel = await prisma.hotel.update({
      where: {
        id: hotelId
      },
      data: {
        name,
        description: description || null,
        address,
        city,
        phone: phone || null,
        email: email || null,
        website: website || null,
        starRating: starRating ? parseInt(starRating) : null,
        amenities: amenities || [],
        images: images || [],
      }
    })

    return NextResponse.json({
      hotel: updatedHotel,
      message: 'Hotel updated successfully'
    })

  } catch (error) {
    console.error('Error updating hotel:', error)
    return NextResponse.json(
      { error: 'Failed to update hotel' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { hotelId: string } }
) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const ownerId = authHeader.replace('Bearer ', '')
    const { hotelId } = params

    // Check if hotel exists and belongs to this owner
    const existingHotel = await prisma.hotel.findFirst({
      where: {
        id: hotelId,
        ownerId: ownerId
      }
    })

    if (!existingHotel) {
      return NextResponse.json(
        { error: 'Hotel not found or access denied' },
        { status: 404 }
      )
    }

    // Delete hotel (this will cascade delete rooms and bookings)
    await prisma.hotel.delete({
      where: {
        id: hotelId
      }
    })

    return NextResponse.json({
      message: 'Hotel deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting hotel:', error)
    return NextResponse.json(
      { error: 'Failed to delete hotel' },
      { status: 500 }
    )
  }
} 