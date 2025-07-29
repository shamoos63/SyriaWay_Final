import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { db } from '@/lib/db'
import { umrahRequests, users, umrahPackages } from '@/drizzle/schema'
import { eq, and, desc } from 'drizzle-orm'

// GET - Fetch all Umrah requests (admin only)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is admin
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, session.user.email))
      .limit(1)

    if (!user.length || (user[0].role !== 'ADMIN' && user[0].role !== 'SUPER_ADMIN')) {
      return NextResponse.json(
        { error: 'Access denied. Admin privileges required.' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '10')
    const page = parseInt(searchParams.get('page') || '1')

    let whereConditions = []

    if (status && status !== 'ALL') {
      whereConditions.push(eq(umrahRequests.status, status))
    }

    const offset = (page - 1) * limit

    // First, get the basic requests data
    const requestsData = await db
      .select({
        id: umrahRequests.id,
        userId: umrahRequests.userId,
        packageId: umrahRequests.packageId,
        preferredDates: umrahRequests.preferredDates,
        numberOfPilgrims: umrahRequests.numberOfPilgrims,
        specialRequirements: umrahRequests.specialRequirements,
        contactPhone: umrahRequests.contactPhone,
        contactEmail: umrahRequests.contactEmail,
        status: umrahRequests.status,
        totalPrice: umrahRequests.totalPrice,
        currency: umrahRequests.currency,
        createdAt: umrahRequests.createdAt,
        updatedAt: umrahRequests.updatedAt,
      })
      .from(umrahRequests)
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
      .orderBy(desc(umrahRequests.createdAt))
      .limit(limit)
      .offset(offset)

    // Get total count for pagination
    const totalCount = await db
      .select({ count: umrahRequests.id })
      .from(umrahRequests)
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)

    // Now fetch related data separately to avoid complex joins
    const userIds = [...new Set(requestsData.map(r => r.userId))]
    const packageIds = [...new Set(requestsData.map(r => r.packageId))]

    let usersData = []
    let packagesData = []

    if (userIds.length > 0) {
      usersData = await db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
        })
        .from(users)
        .where(userIds.length === 1 ? eq(users.id, userIds[0]) : undefined)
    }

    if (packageIds.length > 0) {
      packagesData = await db
        .select({
          id: umrahPackages.id,
          name: umrahPackages.name,
          price: umrahPackages.price,
          currency: umrahPackages.currency,
          duration: umrahPackages.duration,
          maxPilgrims: umrahPackages.maxPilgrims,
        })
        .from(umrahPackages)
        .where(packageIds.length === 1 ? eq(umrahPackages.id, packageIds[0]) : undefined)
    }

    // If we have multiple IDs, fetch them individually to avoid complex where clauses
    if (userIds.length > 1) {
      for (const userId of userIds) {
        const userData = await db
          .select({
            id: users.id,
            name: users.name,
            email: users.email,
          })
          .from(users)
          .where(eq(users.id, userId))
        usersData.push(...userData)
      }
    }

    if (packageIds.length > 1) {
      for (const packageId of packageIds) {
        const packageData = await db
          .select({
            id: umrahPackages.id,
            name: umrahPackages.name,
            price: umrahPackages.price,
            currency: umrahPackages.currency,
            duration: umrahPackages.duration,
            maxPilgrims: umrahPackages.maxPilgrims,
          })
          .from(umrahPackages)
          .where(eq(umrahPackages.id, packageId))
        packagesData.push(...packageData)
      }
    }

    // Create lookup maps
    const usersMap = new Map(usersData.map(u => [u.id, u]))
    const packagesMap = new Map(packagesData.map(p => [p.id, p]))

    // Combine the data
    const formattedRequests = requestsData.map(request => ({
      id: request.id.toString(),
      customerId: request.userId.toString(),
      packageId: request.packageId.toString(),
      preferredDates: request.preferredDates,
      groupSize: request.numberOfPilgrims,
      specialRequirements: request.specialRequirements,
      phoneNumber: request.contactPhone,
      alternativeEmail: request.contactEmail,
      message: request.specialRequirements, // Using specialRequirements as message
      status: request.status,
      adminNotes: request.specialRequirements, // Using specialRequirements as adminNotes for now
      createdAt: request.createdAt,
      updatedAt: request.updatedAt,
      customer: usersMap.get(request.userId) || { id: request.userId.toString(), name: 'Unknown', email: 'unknown@example.com' },
      package: packagesMap.get(request.packageId) || { 
        id: request.packageId.toString(), 
        name: 'Unknown Package', 
        price: 0, 
        currency: 'USD', 
        duration: 0, 
        groupSize: 'Unknown', 
        season: null 
      }
    }))

    const totalPages = Math.ceil(totalCount.length / limit)

    const response = {
      requests: formattedRequests,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount: totalCount.length,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching admin Umrah requests:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch Umrah requests',
        requests: [],
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