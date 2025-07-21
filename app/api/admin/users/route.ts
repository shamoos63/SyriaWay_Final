import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { db } from '@/lib/db'
import { users } from '@/drizzle/schema'
import { eq, and, like, desc, asc } from 'drizzle-orm'
import { sql } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is admin
    const [currentUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, parseInt(session.user.id)))

    if (!currentUser || !['SUPER_ADMIN', 'ADMIN'].includes(currentUser.role)) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role')
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    let whereConditions = []

    if (role) {
      whereConditions.push(eq(users.role, role))
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

    let usersData = []
    let totalCount = [{ count: 0 }]
    let userStats = []
    let statusStats = []

    try {
      usersData = await db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          role: users.role,
          status: users.status,
          phone: users.phone,
          address: users.address,
          dateOfBirth: users.dateOfBirth,
          gender: users.gender,
          nationality: users.nationality,
          preferredLang: users.preferredLang,
          image: users.image,
          isEmailVerified: users.isEmailVerified,
          lastLoginAt: users.lastLoginAt,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt,
        })
        .from(users)
        .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
        .orderBy(sortOrder === 'desc' ? desc(users[sortBy as keyof typeof users]) : asc(users[sortBy as keyof typeof users]))
        .limit(limit)
        .offset(offset)

      totalCount = await db
        .select({ count: sql`count(*)` })
        .from(users)
        .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)

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

    const totalPages = Math.ceil((totalCount[0]?.count || 0) / limit)

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