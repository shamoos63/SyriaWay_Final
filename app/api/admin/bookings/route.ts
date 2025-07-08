import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Fetch all bookings for admin
export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const serviceType = searchParams.get('serviceType')
    const status = searchParams.get('status')
    const paymentStatus = searchParams.get('paymentStatus')
    const search = searchParams.get('search')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}

    if (serviceType) {
      where.serviceType = serviceType
    }

    if (status) {
      where.status = status
    }

    if (paymentStatus) {
      where.paymentStatus = paymentStatus
    }

    if (search) {
      where.OR = [
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
        { contactName: { contains: search, mode: 'insensitive' } },
        { contactEmail: { contains: search, mode: 'insensitive' } },
        { contactPhone: { contains: search, mode: 'insensitive' } },
        { specialRequests: { contains: search, mode: 'insensitive' } },
        { notes: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (startDate) {
      where.startDate = {
        gte: new Date(startDate)
      }
    }

    if (endDate) {
      where.endDate = {
        lte: new Date(endDate)
      }
    }

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
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
              category: true
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
        },
        orderBy: [
          { createdAt: 'desc' }
        ],
        skip,
        take: limit
      }),
      prisma.booking.count({ where })
    ])

    return NextResponse.json({
      bookings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
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