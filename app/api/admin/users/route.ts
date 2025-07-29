import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { db } from '@/lib/db'
import { users } from '@/drizzle/schema'
import { eq, and, like, desc, asc, inArray } from 'drizzle-orm'
import { sql } from 'drizzle-orm'

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
    const [currentUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, session.user.email))

    if (!currentUser || !['SUPER_ADMIN', 'ADMIN'].includes(currentUser.role)) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const roles = searchParams.getAll('role') // Get all role parameters
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    let whereConditions = []

    if (roles && roles.length > 0) {
      // If multiple roles are provided, use 'in' condition
      if (roles.length === 1) {
        whereConditions.push(eq(users.role, roles[0]))
      } else {
        whereConditions.push(inArray(users.role, roles))
      }
    }

    if (status) {
      whereConditions.push(eq(users.status, status))
    }

    if (search) {
      whereConditions.push(
        like(users.name, `%${search}%`)
      )
    }

    const offset = (page - 1) * limit

    let usersData: any[] = []
    let totalCount: { count: number }[] = [{ count: 0 }]
    let userStats: any[] = []
    let statusStats: any[] = []

    try {
      usersData = await db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          role: users.role,
          status: users.status,
          phone: users.phone,
          preferredLang: users.preferredLang,
          image: users.image,
          lastLoginAt: users.lastLoginAt,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt,
        })
        .from(users)
        .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
        .orderBy(
          sortOrder === 'desc'
            ? desc((users as any)[sortBy] ?? users.createdAt)
            : asc((users as any)[sortBy] ?? users.createdAt)
        )
        .limit(limit)
        .offset(offset)

      const totalCountResult = await db
        .select({ count: sql`count(*)` })
        .from(users)
        .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
      totalCount = [{ count: Number(totalCountResult[0]?.count || 0) }]

      userStats = await db
        .select({ role: users.role, count: sql`count(*)` })
        .from(users)
        .groupBy(users.role)

      statusStats = await db
        .select({ status: users.status, count: sql`count(*)` })
        .from(users)
        .groupBy(users.status)
    } catch (e) {
      console.error('Error fetching users or stats:', e)
      usersData = []
      totalCount = [{ count: 0 }]
      userStats = []
      statusStats = []
    }

    const totalPages = Math.ceil(Number(totalCount[0]?.count || 0) / limit)

    const safeUserStats = Array.isArray(userStats)
      ? userStats.filter(item => item && typeof item === 'object' && 'role' in item && 'count' in item)
      : [];
    const safeStatusStats = Array.isArray(statusStats)
      ? statusStats.filter(item => item && typeof item === 'object' && 'status' in item && 'count' in item)
      : [];

    return NextResponse.json({
      users: Array.isArray(usersData) ? usersData : [],
      pagination: {
        currentPage: page,
        totalPages,
        totalCount: totalCount[0]?.count || 0,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
      stats: {
        byRole: safeUserStats.length
          ? safeUserStats.reduce((acc, item) => {
              acc[item.role] = item.count
              return acc
            }, {} as Record<string, number>)
          : {},
        byStatus: safeStatusStats.length
          ? safeStatusStats.reduce((acc, item) => {
              acc[item.status] = item.count
              return acc
            }, {} as Record<string, number>)
          : {},
      }
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users', users: [], pagination: { currentPage: 1, totalPages: 0, totalCount: 0, hasNextPage: false, hasPrevPage: false }, stats: { byRole: {}, byStatus: {} } },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is admin
    const [currentUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, session.user.email))

    if (!currentUser || !['SUPER_ADMIN', 'ADMIN'].includes(currentUser.role)) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { name, email, password, role, phone, hotel } = body

    // Validate required fields
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: 'Name, email, password, and role are required' },
        { status: 400 }
      )
    }

    // Check if email already exists
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const bcrypt = require('bcryptjs')
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const [newUser] = await db
      .insert(users)
      .values({
        name,
        email,
        password: hashedPassword,
        role,
        phone: phone || null,
        status: 'ACTIVE',
        preferredLang: 'en'
      })
      .returning()

    // If it's a hotel owner and hotel data is provided, create hotel
    if (role === 'HOTEL_OWNER' && hotel) {
      const { hotels } = await import('@/drizzle/schema')
      await db
        .insert(hotels)
        .values({
          name: hotel.name,
          description: hotel.description || null,
          address: hotel.address,
          city: hotel.city,
          phone: hotel.phone || null,
          email: hotel.email || null,
          website: hotel.website || null,
          starRating: hotel.starRating || 3,
          checkInTime: hotel.checkInTime || '14:00',
          checkOutTime: hotel.checkOutTime || '12:00',
          ownerId: newUser.id,
          isActive: true,
          isVerified: false
        })
    }

    // If it's a car owner, create a basic car entry
    if (role === 'CAR_OWNER') {
      const { cars } = await import('@/drizzle/schema')
      await db
        .insert(cars)
        .values({
          name: `${name}'s Car Service`,
          description: 'Car rental service',
          ownerId: newUser.id,
          isAvailable: true,
          isVerified: false,
          dailyRate: 50,
          location: 'Damascus'
        })
    }

    // If it's a tour guide, create a basic tour entry
    if (role === 'TOUR_GUIDE') {
      const { tours } = await import('@/drizzle/schema')
      await db
        .insert(tours)
        .values({
          name: `${name}'s Tour Service`,
          description: 'Professional tour guide service',
          ownerId: newUser.id,
          isActive: true,
          isVerified: false,
          duration: '1 day',
          price: 100,
          location: 'Damascus'
        })
    }

    return NextResponse.json({
      message: 'User created successfully',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        status: newUser.status
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
} 