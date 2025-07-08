import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@/lib/generated/prisma'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Authentication required. Please sign in to make a booking.' }, { status: 401 })
    }
    
    let userId = authHeader.replace('Bearer ', '')
    
    // For demo purposes, allow demo-user-id
    // In production, this should be a real user ID from authentication
    if (userId === 'demo-user-id') {
      // Use a default user ID for demo purposes
      // You should replace this with actual user authentication
      userId = 'demo-user-id'
    }

    // Verify user exists and get their role
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true, status: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found. Please sign in again.' }, { status: 401 })
    }

    // Check if user is active
    if (user.status !== 'ACTIVE') {
      return NextResponse.json({ error: 'Your account is not active. Please contact support.' }, { status: 403 })
    }

    // Only allow customers to make bookings
    if (user.role !== 'CUSTOMER') {
      return NextResponse.json({ 
        error: 'Service providers and administrators cannot make bookings. Please use a customer account.' 
      }, { status: 403 })
    }

    const body = await request.json()
    const { 
      hotelId, 
      roomId, 
      carId, 
      startDate, 
      endDate, 
      guests, 
      totalPrice, 
      serviceType,
      specialRequests,
      guideId,
      tourId,
      bundleId,
      umrahPackageId,
      healthServiceId,
      educationalProgramId
    } = body

    // Validate required fields
    if (!startDate || !endDate || !totalPrice || !serviceType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate service type
    if (!['HOTEL', 'CAR', 'TOUR', 'BUNDLE', 'UMRAH', 'HEALTH', 'EDUCATIONAL'].includes(serviceType)) {
      return NextResponse.json(
        { error: 'Invalid service type' },
        { status: 400 }
      )
    }

    // Validate hotel booking
    if (serviceType === 'HOTEL') {
      if (!hotelId || !roomId) {
        return NextResponse.json(
          { error: 'Hotel ID and Room ID are required for hotel bookings' },
          { status: 400 }
        )
      }

      // Check if room is available for the selected dates
      const conflictingBookings = await prisma.booking.findMany({
        where: {
          roomId,
          status: { in: ['PENDING', 'CONFIRMED'] },
          OR: [
            {
              startDate: { lte: new Date(endDate) },
              endDate: { gte: new Date(startDate) }
            }
          ]
        }
      })

      if (conflictingBookings.length > 0) {
        return NextResponse.json(
          { error: 'Room is not available for the selected dates' },
          { status: 400 }
        )
      }
    }

    // Validate car booking
    if (serviceType === 'CAR') {
      if (!carId) {
        return NextResponse.json(
          { error: 'Car ID is required for car bookings' },
          { status: 400 }
        )
      }

      // Check if car is available for the selected dates
      const conflictingBookings = await prisma.booking.findMany({
        where: {
          carId,
          status: { in: ['PENDING', 'CONFIRMED'] },
          OR: [
            {
              startDate: { lte: new Date(endDate) },
              endDate: { gte: new Date(startDate) }
            }
          ]
        }
      })

      if (conflictingBookings.length > 0) {
        return NextResponse.json(
          { error: 'Car is not available for the selected dates' },
          { status: 400 }
        )
      }
    }

    // Validate tour booking
    if (serviceType === 'TOUR') {
      if (!guideId || !tourId) {
        return NextResponse.json(
          { error: 'Guide ID and Tour ID are required for tour bookings' },
          { status: 400 }
        )
      }

      // Check if tour is available for the selected dates
      const conflictingBookings = await prisma.booking.findMany({
        where: {
          tourId,
          status: { in: ['PENDING', 'CONFIRMED'] },
          OR: [
            {
              startDate: { lte: new Date(endDate) },
              endDate: { gte: new Date(startDate) }
            }
          ]
        }
      })

      if (conflictingBookings.length > 0) {
        return NextResponse.json(
          { error: 'Tour is not available for the selected dates' },
          { status: 400 }
        )
      }
    }

    // Validate bundle booking
    if (serviceType === 'BUNDLE') {
      if (!bundleId) {
        return NextResponse.json(
          { error: 'Bundle ID is required for bundle bookings' },
          { status: 400 }
        )
      }
    }

    // Validate Umrah booking
    if (serviceType === 'UMRAH') {
      if (!umrahPackageId) {
        return NextResponse.json(
          { error: 'Umrah Package ID is required for Umrah bookings' },
          { status: 400 }
        )
      }
    }

    // Validate health service booking
    if (serviceType === 'HEALTH') {
      if (!healthServiceId) {
        return NextResponse.json(
          { error: 'Health Service ID is required for health service bookings' },
          { status: 400 }
        )
      }
    }

    // Validate educational program booking
    if (serviceType === 'EDUCATIONAL') {
      if (!educationalProgramId) {
        return NextResponse.json(
          { error: 'Educational Program ID is required for educational program bookings' },
          { status: 400 }
        )
      }
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        userId,
        hotelId: serviceType === 'HOTEL' ? hotelId : null,
        roomId: serviceType === 'HOTEL' ? roomId : null,
        carId: serviceType === 'CAR' ? carId : null,
        guideId: serviceType === 'TOUR' ? guideId : null,
        tourId: serviceType === 'TOUR' ? tourId : null,
        bundleId: serviceType === 'BUNDLE' ? bundleId : null,
        umrahPackageId: serviceType === 'UMRAH' ? umrahPackageId : null,
        healthServiceId: serviceType === 'HEALTH' ? healthServiceId : null,
        educationalProgramId: serviceType === 'EDUCATIONAL' ? educationalProgramId : null,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        guests: guests || 1,
        totalPrice,
        serviceType,
        status: 'PENDING',
        specialRequests: specialRequests || null
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        hotel: serviceType === 'HOTEL' ? {
          select: {
            id: true,
            name: true,
            city: true,
            ownerId: true
          }
        } : false,
        room: serviceType === 'HOTEL' ? {
          select: {
            id: true,
            name: true,
            roomNumber: true
          }
        } : false,
        car: serviceType === 'CAR' ? {
          select: {
            id: true,
            brand: true,
            model: true,
            year: true,
            ownerId: true
          }
        } : false,
        guide: serviceType === 'TOUR' ? {
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
        } : false,
        tour: serviceType === 'TOUR' ? {
          select: {
            id: true,
            name: true,
            description: true,
            price: true
          }
        } : false,
        bundle: serviceType === 'BUNDLE' ? {
          select: {
            id: true,
            name: true,
            description: true,
            price: true
          }
        } : false,
        umrahPackage: serviceType === 'UMRAH' ? {
          select: {
            id: true,
            name: true,
            duration: true,
            price: true
          }
        } : false,
        healthService: serviceType === 'HEALTH' ? {
          select: {
            id: true,
            name: true,
            category: true,
            price: true
          }
        } : false,
        educationalProgram: serviceType === 'EDUCATIONAL' ? {
          select: {
            id: true,
            name: true,
            category: true,
            duration: true
          }
        } : false
      }
    })

    // Create notifications for both service provider and customer
    try {
      let serviceProviderId: string | null = null
      let serviceName = ''
      let serviceTypeName = ''

      // Determine service provider and service details based on service type
      switch (serviceType) {
        case 'HOTEL':
          if (booking.hotel) {
            serviceProviderId = booking.hotel.ownerId
            serviceName = booking.hotel.name
            serviceTypeName = 'Hotel'
          }
          break
        case 'CAR':
          if (booking.car) {
            serviceProviderId = booking.car.ownerId
            serviceName = `${booking.car.brand} ${booking.car.model}`
            serviceTypeName = 'Car'
          }
          break
        case 'TOUR':
          if (booking.guide?.user) {
            serviceProviderId = booking.guide.user.id
            serviceName = booking.tour?.name || 'Tour'
            serviceTypeName = 'Tour'
          }
          break
        case 'BUNDLE':
          serviceName = booking.bundle?.name || 'Bundle'
          serviceTypeName = 'Bundle'
          break
        case 'UMRAH':
          serviceName = booking.umrahPackage?.name || 'Umrah Package'
          serviceTypeName = 'Umrah'
          break
        case 'HEALTH':
          serviceName = booking.healthService?.name || 'Health Service'
          serviceTypeName = 'Health'
          break
        case 'EDUCATIONAL':
          serviceName = booking.educationalProgram?.name || 'Educational Program'
          serviceTypeName = 'Educational'
          break
      }

      // Notification for service provider (if applicable)
      if (serviceProviderId) {
        await prisma.notification.create({
          data: {
            userId: serviceProviderId,
            title: `New ${serviceTypeName} Booking Request`,
            message: `You have a new booking request for ${serviceName} from ${booking.user.name}. Please review and respond.`,
            type: "BOOKING_UPDATED",
            category: "BOOKING",
            priority: "HIGH",
            isRead: false,
            relatedId: booking.id,
            relatedType: "BOOKING",
          },
        })
      }

      // Notification for customer
      await prisma.notification.create({
        data: {
          userId: userId,
          title: `${serviceTypeName} Booking Submitted`,
          message: `Your booking request for ${serviceName} has been submitted successfully. Waiting for approval.`,
          type: "BOOKING_UPDATED",
          category: "BOOKING",
          priority: "NORMAL",
          isRead: false,
          relatedId: booking.id,
          relatedType: "BOOKING",
        },
      })

      console.log("Notifications created successfully")
    } catch (notificationError) {
      console.error("Error creating notifications:", notificationError)
      // Don't fail the booking if notifications fail
    }

    return NextResponse.json({
      booking,
      message: 'Booking created successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const userId = authHeader.replace('Bearer ', '')

    const { searchParams } = new URL(request.url)
    const serviceType = searchParams.get('serviceType')
    const status = searchParams.get('status')

    const where: any = { userId }
    
    if (serviceType) {
      where.serviceType = serviceType
    }
    
    if (status) {
      where.status = status
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
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
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      bookings,
      total: bookings.length
    })
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
} 