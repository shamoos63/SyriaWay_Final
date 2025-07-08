import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true, status: true, email: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if user is active
    if (user.status !== 'ACTIVE') {
      return NextResponse.json({ error: 'Your account is not active. Please contact support.' }, { status: 403 })
    }

    // Only allow customers to submit Umrah requests
    if (user.role !== 'CUSTOMER') {
      return NextResponse.json({ 
        error: 'Service providers and administrators cannot submit Umrah requests. Please use a customer account.' 
      }, { status: 403 })
    }

    const requests = await prisma.umrahRequest.findMany({
      where: {
        customerId: userId
      },
      include: {
        package: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      requests,
      total: requests.length
    })

  } catch (error) {
    console.error('Error fetching Umrah requests:', error)
    return NextResponse.json(
      { error: 'Failed to fetch Umrah requests' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
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

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true, status: true, email: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if user is active
    if (user.status !== 'ACTIVE') {
      return NextResponse.json({ error: 'Your account is not active. Please contact support.' }, { status: 403 })
    }

    // Only allow customers to submit Umrah requests
    if (user.role !== 'CUSTOMER') {
      return NextResponse.json({ 
        error: 'Service providers and administrators cannot submit Umrah requests. Please use a customer account.' 
      }, { status: 403 })
    }

    const body = await request.json()
    const {
      packageId,
      preferredDates,
      groupSize,
      specialRequirements,
      phoneNumber,
      alternativeEmail,
      message
    } = body

    // Validate required fields
    if (!packageId || !preferredDates || !groupSize) {
      return NextResponse.json(
        { error: 'Package ID, preferred dates, and group size are required' },
        { status: 400 }
      )
    }

    // Verify the package exists and is active
    const umrahPackage = await prisma.umrahPackage.findUnique({
      where: { id: packageId }
    })

    if (!umrahPackage || !umrahPackage.isActive) {
      return NextResponse.json(
        { error: 'Invalid or inactive Umrah package' },
        { status: 400 }
      )
    }

    const umrahRequest = await prisma.umrahRequest.create({
      data: {
        customerId: userId,
        packageId,
        preferredDates,
        groupSize: parseInt(groupSize),
        specialRequirements: specialRequirements || null,
        phoneNumber: phoneNumber || null,
        alternativeEmail: alternativeEmail || user.email || null,
        status: 'PENDING'
      },
      include: {
        package: true
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Umrah request submitted successfully',
      request: umrahRequest
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating Umrah request:', error)
    return NextResponse.json(
      { error: 'Failed to submit Umrah request' },
      { status: 500 }
    )
  }
} 