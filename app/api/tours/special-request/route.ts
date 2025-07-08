import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Authentication required. Please sign in to submit a special tour request.' }, { status: 401 })
    }
    
    let userId = authHeader.replace('Bearer ', '')
    
    // For demo purposes, allow demo-user-id
    if (userId === 'demo-user-id') {
      userId = 'demo-user-id'
    }

    // Verify user exists and get their role
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true, status: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found. Please Check information again.' }, { status: 401 })
    }

    // Check if user is active
    if (user.status !== 'ACTIVE') {
      return NextResponse.json({ error: 'Your account is not active. Please contact support.' }, { status: 403 })
    }

    // Only allow customers to submit special tour requests
    if (user.role !== 'CUSTOMER') {
      return NextResponse.json({ 
        error: 'Service providers and administrators cannot submit special tour requests. Please use a customer account.' 
      }, { status: 403 })
    }

    const body = await request.json()
    const {
      guideId,
      customerName,
      customerEmail,
      customerPhone,
      tourType,
      preferredDates,
      groupSize,
      specialRequirements,
      budget,
      message
    } = body

    // Validate required fields (guideId is now optional)
    if (!customerName || !customerEmail || !tourType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // If no guide is selected, we'll need to handle this differently
    // For now, we'll create the request without a guideId and let admin assign later
    const requestData: any = {
      customerName,
      customerEmail,
      customerPhone: customerPhone || null,
      tourType,
      preferredDates: preferredDates || null,
      groupSize: groupSize || null,
      specialRequirements: specialRequirements || null,
      budget: budget || null,
      message: message || null,
      status: 'PENDING',
    }

    // Only add guideId if it's provided and not "admin-assign"
    if (guideId && guideId !== 'admin-assign') {
      requestData.guideId = guideId
    }

    // Create special tour request
    const specialRequest = await prisma.specialTourRequest.create({
      data: requestData
    })

    return NextResponse.json({ 
      success: true, 
      message: guideId === 'admin-assign' 
        ? 'Special tour request submitted successfully. Our team will assign the best guide for you.'
        : 'Special tour request submitted successfully',
      request: specialRequest 
    })
  } catch (error) {
    console.error('Error creating special tour request:', error)
    return NextResponse.json(
      { error: 'Failed to submit special tour request' },
      { status: 500 }
    )
  }
} 