import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Fetch single booking by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const booking = await prisma.booking.findUnique({
      where: { id },
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
      }
    })

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ booking })
  } catch (error) {
    console.error('Error fetching booking:', error)
    return NextResponse.json(
      { error: 'Failed to fetch booking' },
      { status: 500 }
    )
  }
}

// PUT - Update booking (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { id } = params
    const body = await request.json()
    const {
      status,
      paymentStatus,
      notes,
      specialRequests,
      contactName,
      contactPhone,
      contactEmail,
      startDate,
      endDate,
      guests,
      totalPrice
    } = body

    // Check if booking exists
    const existingBooking = await prisma.booking.findUnique({
      where: { id }
    })

    if (!existingBooking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    // Update booking
    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: {
        status: status || existingBooking.status,
        paymentStatus: paymentStatus || existingBooking.paymentStatus,
        notes: notes !== undefined ? notes : existingBooking.notes,
        specialRequests: specialRequests !== undefined ? specialRequests : existingBooking.specialRequests,
        contactName: contactName !== undefined ? contactName : existingBooking.contactName,
        contactPhone: contactPhone !== undefined ? contactPhone : existingBooking.contactPhone,
        contactEmail: contactEmail !== undefined ? contactEmail : existingBooking.contactEmail,
        startDate: startDate ? new Date(startDate) : existingBooking.startDate,
        endDate: endDate ? new Date(endDate) : existingBooking.endDate,
        guests: guests || existingBooking.guests,
        totalPrice: totalPrice || existingBooking.totalPrice,
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

// DELETE - Delete booking (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { id } = params

    // Check if booking exists
    const existingBooking = await prisma.booking.findUnique({
      where: { id }
    })

    if (!existingBooking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    // Delete booking
    await prisma.booking.delete({
      where: { id }
    })

    return NextResponse.json({
      message: 'Booking deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting booking:', error)
    return NextResponse.json(
      { error: 'Failed to delete booking' },
      { status: 500 }
    )
  }
} 