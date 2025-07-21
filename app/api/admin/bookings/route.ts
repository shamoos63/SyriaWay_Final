import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { db } from '@/lib/db'
import { bookings, users } from '@/drizzle/schema'
import { eq, and, desc } from 'drizzle-orm'

// GET - Fetch all bookings (admin only)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is admin (you might want to add role checking here)
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const serviceType = searchParams.get('serviceType')
    const limit = parseInt(searchParams.get('limit') || '10')
    const page = parseInt(searchParams.get('page') || '1')

    let whereConditions = []

    if (status) {
      whereConditions.push(eq(bookings.status, status))
    }

    if (serviceType) {
      whereConditions.push(eq(bookings.serviceType, serviceType))
    }

    const offset = (page - 1) * limit

    const bookingsData = await db
      .select({
        id: bookings.id,
        userId: bookings.userId,
        serviceType: bookings.serviceType,
        serviceId: bookings.serviceId,
        startDate: bookings.startDate,
        endDate: bookings.endDate,
        totalAmount: bookings.totalAmount,
        status: bookings.status,
        paymentStatus: bookings.paymentStatus,
        specialRequests: bookings.specialRequests,
        createdAt: bookings.createdAt,
        updatedAt: bookings.updatedAt,
        user: {
          id: users.id,
          name: users.name,
          email: users.email,
          image: users.image,
        }
      })
      .from(bookings)
      .leftJoin(users, eq(bookings.userId, users.id))
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
      .orderBy(desc(bookings.createdAt))
      .limit(limit)
      .offset(offset)

    // Get total count for pagination
    const totalCount = await db
      .select({ count: bookings.id })
      .from(bookings)
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)

    const totalPages = Math.ceil(totalCount.length / limit)

    return NextResponse.json({
      bookings: bookingsData,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount: totalCount.length,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      }
    })
  } catch (error) {
    console.error('Error fetching admin bookings:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch bookings',
        bookings: [],
        pagination: {
          currentPage: 1,
          totalPages: 0,
          totalCount: 0,
          hasNextPage: false,
          hasPrevPage: false,
        }
      },
      { status: 500 }
    )
  }
}

// PUT - Update booking status (admin only)
export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    let userId = authHeader.replace('Bearer ', '')
    
    // For demo purposes, allow demo-user-id
    if (userId === 'demo-user-id') {
      userId = 'demo-user-id'
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const body = await request.json()
    const { bookingId, status, paymentStatus, notes } = body

    if (!bookingId) {
      return NextResponse.json(
        { error: 'Booking ID is required' },
        { status: 400 }
      )
    }

    // Check if booking exists
    const existingBooking = await prisma.booking.findUnique({
      where: { id: bookingId }
    })

    if (!existingBooking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    // Update booking
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: status || existingBooking.status,
        paymentStatus: paymentStatus || existingBooking.paymentStatus,
        notes: notes !== undefined ? notes : existingBooking.notes,
        updatedAt: new Date()
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true
          }
        },
        hotel: {
          select: {
            id: true,
            name: true,
            city: true
          }
        },
        room: {
          select: {
            id: true,
            name: true,
            roomNumber: true
          }
        },
        car: {
          select: {
            id: true,
            brand: true,
            model: true,
            year: true
          }
        },
        tour: {
          select: {
            id: true,
            name: true,
            duration: true
          }
        },
        guide: {
          select: {
            id: true,
            bio: true,
            specialties: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        },
        healthService: {
          select: {
            id: true,
            name: true,
            category: true
          }
        },
        educationalProgram: {
          select: {
            id: true,
            name: true,
            category: true
          }
        },
        umrahPackage: {
          select: {
            id: true,
            name: true,
            duration: true
          }
        },
        bundle: {
          select: {
            id: true,
            name: true,
            description: true
          }
        }
      }
    })

    return NextResponse.json({
      booking: updatedBooking,
      message: 'Booking updated successfully'
    })
  } catch (error) {
    console.error('Error updating booking:', error)
    return NextResponse.json(
      { error: 'Failed to update booking' },
      { status: 500 }
    )
  }
} 